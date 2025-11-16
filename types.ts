import React, { CSSProperties } from 'react';

export type Locale = 'en' | 'hi' | 'te';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type Category = 'GK' | 'Sports' | 'Bollywood' | 'Science' | 'Technology' | 'History' | 'Geography' | 'CurrentAffairs';
export type Theme = 'light' | 'dark' | 'auto';

export interface ThemeColor {
  id: string;
  nameKey: string;
  hex: string;
}

export interface ThemeColorSetting {
  type: 'auto' | 'preset' | 'custom';
  value: string; // 'auto', preset id, or hex code
}

export interface Question {
  question: string;
  options: string[];
  answer: string;
  category: Category | string;
  difficulty: Difficulty;
}

export interface StaticQuestion {
  question: { [key in Locale]: string };
  options: { [key in Locale]: string[] };
  answer: string;
  category: Category;
  difficulty: Difficulty;
}

export interface Answer {
  question: Question;
  selectedAnswer: string;
  isCorrect: boolean;
  points: number;
  correctAnswer: string;
}

export enum GameState {
  HOME,
  QUIZ,
  RESULTS,
  LEADERBOARD,
  AI_PROMPT,
  AI_QUIZ_GENERATING,
  FETCHING_QUESTIONS,
  AI_ANALYSIS,
  ONBOARDING,
  PROFILE,
  FRIENDS,
  SETTINGS,
  MULTIPLAYER_LOBBY,
  BOT_MATCH_SETUP,
  MULTIPLAYER_QUIZ,
  MULTIPLAYER_FINDING_MATCH,
  MULTIPLAYER_RESULTS,
  WALLPAPER_SETTINGS,
  ERROR,
  LANDMARK_LEVEL_SELECT,
  LANDMARK_INFO,
  LANDMARK_QUIZ,
  LANDMARK_RESULTS,
  SURVIVAL,
  SURVIVAL_RESULTS,
}

export type UserStatus = 'Online' | 'Offline' | 'Playing' | 'Idle';

export interface User {
  id: string;
  name: string;
  avatar: string;
  joinDate: number;
  status: UserStatus;
  friends: string[];
  rating: number;
}

export interface GameHistoryEntry {
  timestamp: number;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  topic: string;
  difficulty: Difficulty;
  answers: Answer[];
}

export type AchievementId =
  | 'firstQuiz'
  | 'quizMaster'
  | 'perfectScore'
  | 'categoryExplorer'
  | 'quizBeatBeginnerBot'
  | 'quizBeatExpertBot'
  | 'botSlayer';

export interface Achievement {
  id: AchievementId;
  titleKey: string;
  descriptionKey: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface FriendRequest {
  id: string;
  from: string;
  to: string;
  timestamp: number;
}

export interface GameInvite {
  id: string;
  from: User;
  to: string;
  timestamp: number;
}

export interface Bot extends User {
    difficulty: Difficulty;
    accuracy: number;
}

export interface Match {
    id: string;
    players: (User | Bot)[];
    questions: Question[];
    scores: Record<string, number>;
    currentQuestionIndex: number;
    status: 'playing' | 'finished';
    isRated: boolean;
}

export interface Wallpaper {
  type: 'preset' | 'custom' | 'default';
  value: string; // preset ID or base64 data URI
}

export interface PresetWallpaper {
    id: string;
    nameKey: string;
    descriptionKey: string;
    style: CSSProperties;
    accentColor?: string;
}

export interface AiQuizConfig {
  numQuestions: number;
  difficulty: Difficulty;
}

// Landmark Quiz Types
export interface LandmarkQuestion {
  id: string;
  level: number;
  name: string;
  imageUrl: string;
  image_prompt: string;
  question: string;
  options: string[];
  answer: string;
  hint: string; // Country
  description: string; // For learn mode
  details?: {
    label: string;
    value: string;
  }[];
}

export interface LandmarkAnswer {
  question: LandmarkQuestion;
  selectedAnswer: string;
  isCorrect: boolean;
  points: number;
  correctAnswer: string;
}

export interface LevelProgress {
  [level: number]: {
    unlocked: boolean;
    stars: number;
    highScore: number;
  };
}