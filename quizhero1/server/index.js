// Simple Express backend for QuizHero (development/demo use)
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Serve uploaded files
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
app.use('/uploads', express.static(UPLOAD_DIR));

// multer for file uploads
const upload = multer({ dest: UPLOAD_DIR });

// In-memory stores (replace with DB in production)
const quizzes = {};        // { id: { id, title, description, created_at } }
const questions = {};      // { id: { id, quiz_id, text, options:[], correct_index, image_url } }
const attempts = [];       // [{ id, user_id, quiz_id, score, total, duration_seconds, created_at }]

// Health
app.get('/', (req, res) => res.json({ ok: true, backend: "quizhero-backend" }));

// Create quiz
app.post('/api/quizzes', (req, res) => {
  const id = uuidv4();
  const now = new Date().toISOString();
  const q = { id, title: req.body.title || 'Untitled', description: req.body.description || '', created_at: now };
  quizzes[id] = q;
  res.status(201).json(q);
});

// List quizzes
app.get('/api/quizzes', (req, res) => {
  res.json(Object.values(quizzes));
});

// Add question to quiz
app.post('/api/quizzes/:quizId/questions', (req, res) => {
  const qid = uuidv4();
  const quizId = req.params.quizId;
  const body = req.body || {};
  const q = {
    id: qid,
    quiz_id: quizId,
    text: body.text || '',
    options: body.options || [],
    correct_index: body.correct_index || 1,
    image_url: body.image_url || null,
    points: body.points || 1,
    created_at: new Date().toISOString()
  };
  questions[qid] = q;
  res.status(201).json(q);
});

// Get questions for quiz
app.get('/api/quizzes/:quizId/questions', (req, res) => {
  const quizId = req.params.quizId;
  const list = Object.values(questions).filter(q => q.quiz_id === quizId);
  res.json(list);
});

// Submit attempt
app.post('/api/quizzes/:quizId/attempts', (req, res) => {
  const attempt = {
    id: uuidv4(),
    quiz_id: req.params.quizId,
    user_id: req.body.user_id || 'anonymous',
    score: req.body.score || 0,
    total: req.body.total || 0,
    duration_seconds: req.body.duration_seconds || null,
    created_at: new Date().toISOString()
  };
  attempts.push(attempt);
  res.status(201).json(attempt);
});

// Leaderboard - top scores per user for the quiz
app.get('/api/quizzes/:quizId/leaderboard', (req, res) => {
  const quizId = req.params.quizId;
  const filtered = attempts.filter(a => a.quiz_id === quizId);
  // Compute top per user
  const best = {};
  for (const a of filtered) {
    const key = a.user_id;
    if (!best[key] || a.score > best[key].score) best[key] = a;
  }
  const list = Object.values(best).sort((a,b) => b.score - a.score).slice(0,50);
  res.json(list);
});

// Upload question image
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  // Return accessible URL
  const filename = path.basename(req.file.path);
  res.json({ url: `/uploads/${filename}`, originalname: req.file.originalname });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log('QuizHero backend listening on', port));