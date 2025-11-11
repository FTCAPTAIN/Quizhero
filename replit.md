# QuizHero India - Offline-First Quiz App

**Last Updated:** November 11, 2025

## Overview

QuizHero India is a Progressive Web App (PWA) that allows users to test their knowledge about India through interactive quizzes. The app works entirely offline except for optional Gemini AI features.

## Architecture

### Tech Stack
- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **AI:** Google Gemini API (optional, for hints and analysis)
- **Storage:** localStorage for player progress
- **PWA:** Service Worker for offline support

### Project Structure
- `quizhero1/` - Main application directory
  - `components/` - React components (HomeScreen, QuizScreen, ResultsScreen, etc.)
  - `context/` - React contexts (LanguageContext for i18n)
  - `data/` - Static question data with multi-language support
  - `lib/` - Utility functions (progressStore, geminiApi, translations)
  - `server/` - Express backend with Gemini API proxy
  - `public/` - PWA assets (manifest, service worker, icons)

### Features
- ✅ Multi-language support (English, Hindi, Telugu)
- ✅ Dark/light theme toggle with color picker
- ✅ Offline-first functionality
- ✅ Player progress tracking (coins, XP, level, streak)
- ✅ PWA support for mobile installation
- ✅ Gemini AI integration for hints and analysis
- ✅ Secure API key management (server-side only)

## Development Setup

### Prerequisites
- Node.js 18+ installed
- GEMINI_API_KEY in Replit Secrets (optional, for AI features)

### Commands
```bash
cd quizhero1
npm install          # Install dependencies
npm run dev          # Start Vite dev server (port 5000)
npm run backend      # Start Express backend (port 4000)
npm run dev:all      # Start both frontend and backend
npm run build        # Build for production
npm start            # Build and start production server
```

### Environment Variables
- `GEMINI_API_KEY` - Google Gemini API key (stored in Replit Secrets)
- `PORT` - Server port (default: 4000)

## Deployment

### Replit Deployment
1. Set `GEMINI_API_KEY` in Replit Secrets panel
2. Click "Deploy" button
3. Deployment uses autoscale mode
4. Build command: `cd quizhero1 && npm install`
5. Run command: `cd quizhero1 && npm run start`

### PWA to APK Conversion
1. Build the app: `npm run build`
2. Deploy to Replit or any hosting service
3. Visit [PWABuilder.com](https://www.pwabuilder.com/)
4. Enter your deployed app URL
5. Generate Android APK

## API Endpoints

### Backend (port 4000)
- `GET /health` - Health check endpoint
- `POST /api/generate` - Gemini AI generation (requires GEMINI_API_KEY)
  - Body: `{ "prompt": string, "model"?: string }`
  - Returns: `{ "text": string, "success": boolean }`

### Vite Dev Server (port 5000)
- Proxies `/api/*` requests to backend during development

## User Preferences

All user preferences are stored in localStorage:
- `quizHeroLanguage` - Selected language (en/hi/te)
- `quizHeroProgress` - Player progress (coins, XP, level, streak, achievements)
- `hasSeenOnboarding` - Onboarding completion flag

## Recent Changes
- **Nov 11, 2025:** Complete rebuild as offline-first PWA
  - Added Express backend with Gemini API integration
  - Implemented localStorage for player progress
  - Created PWA manifest and service worker
  - Removed CDN dependencies for offline support
  - Added deployment configuration for Replit

## Known Issues
- PWA icons need to be generated from actual image assets (currently placeholders)
- Service worker registration needs testing in production

## Future Enhancements
- Online leaderboards (currently showing "Coming soon")
- Multiplayer quiz functionality
- More quiz categories
- Achievement system
- Social features (friends, challenges)
