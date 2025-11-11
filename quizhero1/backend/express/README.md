# QuizHero Express Backend

## Quick start
```
cd backend/express
npm install
npm run start
```
Server runs at http://localhost:3001

## Endpoints
- GET `/` → health
- POST `/api/quizzes` `{ title, description }`
- POST `/api/quizzes/:quizId/questions` `{ text, image_url, option1..4, correct_index, points }`
- GET `/api/quizzes/:quizId/questions`
- POST `/api/quizzes/:quizId/attempts` `{ user_id, score, total, duration_seconds }`
- GET `/api/quizzes/:quizId/leaderboard`
- POST `/api/upload` `multipart/form-data` with `file`

Add a real DB (Mongo/Postgres) before production.
