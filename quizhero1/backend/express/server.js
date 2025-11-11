require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

// Simple in-memory data (replace with DB later)
const quizzes = {};
const questions = {};
const attempts = [];

// Health
app.get('/', (_, res) => res.json({ ok: true, name: 'QuizHero Express Backend' }));

// Create quiz
app.post('/api/quizzes', (req, res) => {
  const id = uuidv4();
  quizzes[id] = { id, title: req.body.title || 'Untitled Quiz', description: req.body.description || '', created_at: new Date().toISOString() };
  res.status(201).json(quizzes[id]);
});

// Add question
app.post('/api/quizzes/:quizId/questions', (req, res) => {
  const qid = uuidv4();
  const quiz_id = req.params.quizId;
  const q = {
    id: qid,
    quiz_id,
    text: req.body.text,
    image_url: req.body.image_url || null,
    option1: req.body.option1,
    option2: req.body.option2,
    option3: req.body.option3,
    option4: req.body.option4,
    correct_index: req.body.correct_index || 1,
    points: req.body.points || 1,
    created_at: new Date().toISOString()
  };
  questions[qid] = q;
  res.status(201).json(q);
});

// Get questions for a quiz
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
    score: req.body.score ?? 0,
    total: req.body.total ?? 0,
    duration_seconds: req.body.duration_seconds ?? null,
    created_at: new Date().toISOString()
  };
  attempts.push(attempt);
  res.status(201).json(attempt);
});

// Leaderboard (top scores desc)
app.get('/api/quizzes/:quizId/leaderboard', (req, res) => {
  const quizId = req.params.quizId;
  const top = attempts
    .filter(a => a.quiz_id === quizId)
    .sort((a,b) => b.score - a.score)
    .slice(0, 50);
  res.json(top);
});

// Upload image (local placeholder)
app.post('/api/upload', upload.single('file'), (req, res) => {
  res.json({ path: `/uploads/${req.file.filename}`, originalname: req.file.originalname });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`QuizHero backend listening on ${PORT}`));
