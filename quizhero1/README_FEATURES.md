QuizHero — Full Features (Firebase + Frontend)
=============================================

Added features in this build:
- Email/password authentication (Firebase Auth)
- Create quizzes and add questions (Firestore)
- Upload question images (Firebase Storage)
- Play quizzes with scoring and submit attempts
- Leaderboard per quiz (Firestore queries)
- Firestore security rules (firestore.rules)
- Components: QuestionForm, QuizPlayer, Leaderboard
- Improved App navigation and UI flows

Files added/updated:
- components/QuestionForm.tsx
- components/QuizPlayer.tsx
- components/Leaderboard.tsx
- lib/api.ts (existing - used by components)
- App.tsx (updated)
- firestore.rules

How to run:
1. Create Firebase project, enable Email/Password auth, Firestore (in test or locked mode), and Storage.
2. Replace `lib/firebaseConfig.ts` with your Firebase web config.
3. Install dependencies:
   npm install firebase
4. Start the frontend:
   npm run frontend
5. Visit http://localhost:5173, sign up, and use the app.

Security:
- Review and publish `firestore.rules` in Firebase Console -> Firestore -> Rules before going to production.
- For production, tighten rules around fields validation (e.g., correct_index range, options length).