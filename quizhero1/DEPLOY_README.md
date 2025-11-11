Deployment Guide — Frontend (Vercel) + Backend (Firebase)
--------------------------------------------------------

Frontend (Vercel):
1. Push your repo to GitHub.
2. On Vercel, create a new project -> import from GitHub.
3. Set build command: npm run build
   Output directory: dist
4. Add environment variables if needed (none required for client-side Firebase).
5. Deploy.

Backend (Firebase Hosting + Functions):
1. Install Firebase CLI: npm install -g firebase-tools
2. Login: firebase login
3. Initialize hosting & functions (if not done): firebase init hosting functions
4. Ensure your functions are in the /functions folder and firebase.json points to them.
5. Configure LLM keys:
   firebase functions:config:set llm.provider="openai" llm.openai_key="YOUR_OPENAI_API_KEY"
6. Deploy:
   firebase deploy --only hosting,functions

Notes:
- The firebase.json is configured to rewrite /api/** to the functions API.
- For local testing, run `firebase emulators:start` (requires emulators installed).