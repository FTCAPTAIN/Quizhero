QuizHero backend (development)
-----------------------------

This is a simple Express backend included for local development and preview.
It uses in-memory stores and supports:

- Create/list quizzes: POST /api/quizzes, GET /api/quizzes
- Add question: POST /api/quizzes/:quizId/questions
- Get questions: GET /api/quizzes/:quizId/questions
- Submit attempt: POST /api/quizzes/:quizId/attempts
- Leaderboard: GET /api/quizzes/:quizId/leaderboard
- Upload image: POST /api/upload (form-data key 'file')

To run:
  # from project root
  cd server
  npm install
  npm start

Or install concurrently in root and run:
  npm install -g concurrently
  npm install
  npm run dev:all

NOTE: This is for local dev & preview only. Replace in-memory stores with a real DB for production.