QuizHero — Final Pro (Tailwind + Firebase)
=========================================

What this package includes:
- Tailwind CSS setup (tailwind.config.js, postcss.config.cjs, src/index.css)
- Firebase integration (Auth, Firestore, Storage) via lib/firebaseConfig.ts + lib/api.ts
- Modern UI (Tailwind) with components: Navbar, Profile, AI stub, QuestionForm, QuizPlayer, Leaderboard
- Firestore & Storage security rules: firestore.rules, storage.rules
- Full UX: signup, create quiz, add questions (with image), play, leaderboard, profile/avatar
- AI stub for generating questions (placeholder; connect to LLM later)

One-time setup (you only need to do this):
1. Unzip the project.
2. Open `lib/firebaseConfig.ts` and paste your Firebase Web SDK config.
3. Install dependencies:
   npm install
   npm install firebase
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   # (You can skip npx step because files are included; installing dev deps enough)
4. Start dev server:
   npm run frontend
5. Visit http://localhost:5173

Notes:
- For production, publish the firestore.rules and storage.rules in Firebase Console.
- If you want server-side validation / anti-cheat, consider adding Firebase Cloud Functions to validate attempts.
- AI question generation is a client-side stub — to enable real LLM generation, add server-side key handling and call an LLM API.