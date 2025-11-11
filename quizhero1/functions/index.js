const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

// Initialize admin
admin.initializeApp();

const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Health
app.get('/', (req, res) => res.json({ ok: true, name: 'quizhero-functions' }));

/**
 * Generate questions using an LLM (server-side).
 * Expects JSON: { topic: string, count?: number }
 * Requires environment variable LLM_PROVIDER ("openai" or "google") and API key in functions config.
 */
app.post('/generate-questions', async (req, res) => {
  try {
    const { topic, count = 5 } = req.body || {};
    if (!topic) return res.status(400).json({ error: 'topic required' });

    const provider = process.env.LLM_PROVIDER || functions.config().llm?.provider || 'openai';

    let generated = [];
    if (provider === 'openai') {
      const key = process.env.OPENAI_API_KEY || functions.config().llm?.openai_key;
      if (!key) return res.status(500).json({ error: 'OpenAI API key not configured' });

      const prompt = `Create ${count} multiple-choice quiz questions about "${topic}". For each question provide the question text, 4 short options, and the index (0-3) of the correct option. Output JSON array like [{ "text":"", "options":["a","b","c","d"], "correct_index":0 }]`;

      const body = {
        model: "gpt-4o-mini", // change to available model in your account
        messages: [{ role: "user", content: prompt }],
        max_tokens: 800,
        temperature: 0.7
      };

      const r = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
        body: JSON.stringify(body)
      });
      const json = await r.json();
      const txt = json?.choices?.[0]?.message?.content || json?.choices?.[0]?.text || '';
      // Try to extract JSON from model response
      try {
        const start = txt.indexOf('[');
        const jtxt = start >= 0 ? txt.slice(start) : txt;
        generated = JSON.parse(jtxt);
      } catch (e) {
        // Fallback: return a simple templated set
        for (let i=0;i<count;i++) {
          generated.push({ text: `Sample ${topic} question #${i+1}`, options: ['A','B','C','D'], correct_index: 0 });
        }
      }
    } else if (provider === 'google') {
      // Placeholder for Google Gemini REST call if available; provider-specific code required.
      for (let i=0;i<count;i++) {
        generated.push({ text: `Sample ${topic} question #${i+1}`, options: ['A','B','C','D'], correct_index: 0 });
      }
    }

    return res.json({ generated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: String(err) });
  }
});

/**
 * Validate attempt server-side to prevent cheating.
 * Expects:
 * { quizId: string, userId: string, answers: [{ questionId, selectedIndex }], duration_seconds?: number }
 *
 * The function recalculates the score based on stored correct answers and stores the attempt if valid.
 */
app.post('/validate-attempt', async (req, res) => {
  try {
    const body = req.body || {};
    const { quizId, userId, answers = [], duration_seconds = null } = body;
    if (!quizId || !userId || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'quizId, userId, answers required' });
    }

    // Fetch questions for the quiz
    const qSnap = await db.collection('quizzes').doc(quizId).collection('questions').get();
    const map = {};
    qSnap.forEach(d => {
      map[d.id] = d.data();
    });

    // Recalculate score
    let score = 0;
    let total = 0;
    for (const a of answers) {
      const q = map[a.questionId];
      if (!q) continue;
      total += 1;
      const correct = typeof q.correct_index === 'number' ? q.correct_index : (q.correct_index || 0);
      if (a.selectedIndex === correct) score += (q.points || 1);
    }

    // Optionally add anti-cheat checks (e.g., time thresholds)
    // Persist attempt
    const attemptRef = await db.collection('quizzes').doc(quizId).collection('attempts').add({
      user_id: userId,
      score,
      total,
      duration_seconds: duration_seconds || null,
      validated: true,
      created_at: admin.firestore.FieldValue.serverTimestamp()
    });

    return res.json({ id: attemptRef.id, score, total });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: String(err) });
  }
});

exports.api = functions.https.onRequest(app);


// --- nextQuestion handler (added by assistant) ---
/**
 * POST /nextQuestion
 * Body: { quizId: string }
 * Requires Firebase ID token in Authorization header (Bearer <token>).
 * Returns: { question, remaining }
 */
app.post('/nextQuestion', async (req, res) => {
  try {
    // If using Firebase Auth middleware, you can get uid from req.user.uid.
    // Here we accept Authorization Bearer token and verify it.
    const authHeader = req.get('Authorization') || '';
    let uid = null;
    if (authHeader.startsWith('Bearer ')) {
      const idToken = authHeader.split('Bearer ')[1];
      const decoded = await admin.auth().verifyIdToken(idToken);
      uid = decoded.uid;
    } else if (req.body.userId) {
      uid = req.body.userId; // fallback (not secure) if using emulator or testing
    }
    const quizId = req.body.quizId;
    if (!uid || !quizId) return res.status(400).json({ error: 'quizId and authenticated user required' });

    const userRef = db.collection('users').doc(uid);
    const quizQuestionsRef = db.collection('quizzes').doc(quizId).collection('questions');

    // Load all question ids for the quiz (only ids)
    const qSnap = await quizQuestionsRef.get();
    if (qSnap.empty) return res.status(404).json({ error: 'no questions in quiz' });
    const allIds = qSnap.docs.map(d => d.id);

    const result = await db.runTransaction(async (t) => {
      const uDoc = await t.get(userRef);
      let usedObj = {};
      if (uDoc.exists && uDoc.data() && uDoc.data().usedQuestions) {
        usedObj = uDoc.data().usedQuestions;
      }
      const quizUsed = Array.isArray(usedObj[quizId]?.used) ? usedObj[quizId].used : [];

      // Determine unseen ids
      let unseen = allIds.filter(id => !quizUsed.includes(id));

      // If none unseen, reset used list and unseen becomes allIds
      let didReset = false;
      if (unseen.length === 0) {
        didReset = true;
        // clear quizUsed
        // Note: we will reset quizUsed below by overwriting used array
        unseen = [...allIds];
      }

      // pick a random id from unseen
      const pickId = unseen[Math.floor(Math.random() * unseen.length)];

      // Append pickId to used list
      const newUsed = Array.from(new Set([...(quizUsed || []), pickId]));

      // Prepare update object (use dot notation)
      const updates = {};
      updates[`usedQuestions.${quizId}.used`] = newUsed;
      if (didReset) {
        updates[`usedQuestions.${quizId}.lastReset`] = admin.firestore.FieldValue.serverTimestamp();
      }

      t.set(userRef, updates, { merge: true });

      // Read the question doc to return (pickId)
      const qDoc = await quizQuestionsRef.doc(pickId).get();
      const qData = qDoc.exists ? Object.assign({ id: qDoc.id }, qDoc.data()) : null;

      return { question: qData, remaining: allIds.length - newUsed.length };
    });

    return res.json(result);

  } catch (err) {
    console.error('nextQuestion ERROR', err);
    return res.status(500).json({ error: String(err) });
  }
});
// --- end nextQuestion handler ---
