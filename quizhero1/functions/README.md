Firebase Cloud Functions for QuizHero — LLM & Validation
-------------------------------------------------------

This folder contains a small Express app deployed as Firebase Cloud Functions (HTTP).
It includes two endpoints:
- POST /generate-questions  -> generates questions using an LLM (OpenAI or other)
- POST /validate-attempt   -> server-side attempt validation & storage

Setup & deploy:
1. Install Firebase CLI if you don't have it:
   npm install -g firebase-tools

2. Login and initialize (from project root, once):
   firebase login
   firebase init functions

   When asked, you can choose JavaScript and do not install dependencies (we'll install below).

3. Configure environment variables (do NOT hardcode API keys).
   For OpenAI:
     firebase functions:config:set llm.provider="openai" llm.openai_key="YOUR_OPENAI_API_KEY"
   Or set environment variables on the host.

4. Install dependencies and deploy:
   cd functions
   npm install
   cd ..
   firebase deploy --only functions:api

5. After deploy, your function URL will be shown. Use it in the frontend to call:
   POST https://<REGION>-<PROJECT>.cloudfunctions.net/api/generate-questions
   POST https://<REGION>-<PROJECT>.cloudfunctions.net/api/validate-attempt

Security notes:
- Keep your LLM API keys secret — use functions config or secret manager.
- Validate inputs server-side to prevent abuse and injection.