Firebase Integration for QuizHero
--------------------------------
This project now uses Firebase (Auth + Firestore + Storage) as the backend.

Steps to set up:

1. Create a Firebase project at https://console.firebase.google.com/
2. In Project Settings -> SDK (Web) add a new web app and copy the config.
3. Enable Authentication -> Email/Password provider.
4. Enable Firestore database (start in test mode for development).
5. Enable Storage (for question images).
6. Replace the placeholders in `lib/firebaseConfig.ts` with your project's config.
7. Install firebase client SDK:
   npm install firebase
8. Start the frontend:
   npm run frontend
9. The app handles auth and reads/writes to Firestore directly.

Notes:
- For production, update Firestore security rules to enforce that only authenticated users can write, and validate data formats.
- This approach uses client-side SDK directly — no server required for core operations.