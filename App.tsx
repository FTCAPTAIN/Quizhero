import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';

import HomeScreen from './components/HomeScreen';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultsScreen';
import OnboardingScreen from './components/OnboardingScreen';
import Sidebar from './components/Sidebar';
import LeaderboardScreen from './components/LeaderboardScreen';
import AiQuizPromptScreen from './components/AiQuizPromptScreen';
import ErrorScreen from './components/ErrorScreen';
import ProfileScreen from './components/ProfileScreen';
import FriendsScreen from './components/FriendsScreen';
import MultiplayerLobbyScreen from './components/MultiplayerLobbyScreen';
import BotMatchSetupScreen from './components/BotMatchSetupScreen';
import MultiplayerQuizScreen from './components/multiplayer/MultiplayerQuizScreen';
import ChallengeNotification from './components/multiplayer/ChallengeNotification';
import SettingsScreen from './components/SettingsScreen';
import WallpaperScreen from './components/WallpaperScreen';
import AiAnalysisScreen from './components/AiAnalysisScreen';
import LandmarkLevelSelectScreen from './components/LandmarkLevelSelectScreen';
import LandmarkInfoScreen from './components/LandmarkInfoScreen';
import LandmarkQuizScreen from './components/LandmarkQuizScreen';
import LandmarkResultsScreen from './components/LandmarkResultsScreen';
import SurvivalQuizScreen from './components/SurvivalQuizScreen';
import SurvivalResultsScreen from './components/SurvivalResultsScreen';
import Toast from './components/Toast';

import { staticQuestions } from './data/questions';
import { landmarkQuestions as allLandmarkQuestions } from './data/landmarks';
import { presetWallpapers } from './data/wallpapers';
import { presetThemeColors } from './data/themeColors';
import { allUsers as initialUsers, currentUser as initialCurrentUser } from './data/users';
import { bots } from './data/bots';
import { checkAndUnlockAchievements } from './lib/achievements';
import { fetchNewQuestions, createCustomAiQuiz } from './lib/backendService';
import { useLanguage } from './context/LanguageContext';
import { getSystemTheme, hexToRgb, getContrastYIQ, formatStaticQuestions } from './lib/utils';
import type { Question, Difficulty, Category, Answer, GameState, User, GameHistoryEntry, AchievementId, FriendRequest, GameInvite, Match, Bot, Wallpaper, Theme, PresetWallpaper, ThemeColor, ThemeColorSetting, AiQuizConfig, LevelProgress, LandmarkQuestion, LandmarkAnswer } from './types';
import { GameState as GameStateEnum } from './types';

const ONBOARDING_KEY = 'quizHeroOnboardingCompleted';
const THEME_KEY = 'quizHeroTheme';
const WALLPAPER_KEY = 'quizHeroWallpaper';
const THEME_COLOR_KEY = 'quizHeroThemeColor';
const DAILY_CHALLENGE_KEY_PREFIX = 'quizHeroDailyChallenge_';
const SOUND_ENABLED_KEY = 'quizHeroSoundEnabled';
const USER_DATA_KEY = 'quizHeroUserData';

interface SavedUserData {
    currentUser: User;
    gameHistory: GameHistoryEntry[];
    unlockedAchievements: AchievementId[];
    landmarkProgress: LevelProgress;
    usedStaticQuestions: string[];
}

const DEFAULT_THEME_COLOR: ThemeColor = { id: 'cyan', nameKey: 'color_cyan', hex: '#06b6d4' };

const loadUserData = (): SavedUserData => {
    try {
        const data = localStorage.getItem(USER_DATA_KEY);
        if (data) {
            const parsed = JSON.parse(data);
            // Basic validation
            if (parsed.currentUser && parsed.gameHistory) {
                 return {
                    ...parsed,
                    usedStaticQuestions: Array.isArray(parsed.usedStaticQuestions) ? parsed.usedStaticQuestions : [],
                 };
            }
        }
    } catch (e) {
        console.error("Failed to load user data:", e);
    }
    // Return default state if loading fails or no data exists
    return {
        currentUser: initialCurrentUser,
        gameHistory: [],
        unlockedAchievements: [],
        landmarkProgress: { 1: { unlocked: true, stars: 0, highScore: 0 } },
        usedStaticQuestions: [],
    };
};

const WallpaperBackground: React.FC<{ wallpaper: Wallpaper }> = ({ wallpaper }) => {
    const style = useMemo(() => {
        if (wallpaper.type === 'preset') {
            const preset = presetWallpapers.find(p => p.id === wallpaper.value);
            return preset ? preset.style : {};
        }
        if (wallpaper.type === 'custom') {
            return { backgroundImage: `url(${wallpaper.value})` };
        }
        // Default is a plain dark bg
        return { background: '#030712' };
    }, [wallpaper]);

    return (
        <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-500"
            style={style}
        />
    );
};

const App: React.FC = () => {
  const savedData = useMemo(() => loadUserData(), []);

  const [gameState, setGameState] = useState<GameState>(GameStateEnum.HOME);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [error, setError] = useState<{ title: string; message: string } | null>(null);
  const [isAiQuiz, setIsAiQuiz] = useState(false);
  const [isDailyChallenge, setIsDailyChallenge] = useState(false);
  
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem(THEME_KEY) as Theme) || 'auto');
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>(() => theme === 'auto' ? getSystemTheme() : theme);
  const [isSoundEnabled, setIsSoundEnabled] = useState(() => localStorage.getItem(SOUND_ENABLED_KEY) !== 'false');

  const [wallpaper, setWallpaper] = useState<Wallpaper>({ type: 'default', value: '' });
  const [themeColor, setThemeColor] = useState<ThemeColorSetting>({ type: 'preset', value: 'cyan' });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const [dailyChallengeCompleted, setDailyChallengeCompleted] = useState(false);
  const [aiQuizConfig, setAiQuizConfig] = useState<AiQuizConfig>({ numQuestions: 10, difficulty: 'Medium' });
  const [initialAiPrompt, setInitialAiPrompt] = useState('');
  const [usedStaticQuestions, setUsedStaticQuestions] = useState<Set<string>>(() => new Set(savedData.usedStaticQuestions));

  // User and social state
  const [currentUser, setCurrentUser] = useState<User>(savedData.currentUser);
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const otherUsers = initialUsers.filter(u => u.id !== savedData.currentUser.id);
    return [savedData.currentUser, ...otherUsers];
  });
  const [gameHistory, setGameHistory] = useState<GameHistoryEntry[]>(savedData.gameHistory);
  const [unlockedAchievements, setUnlockedAchievements] = useState<AchievementId[]>(savedData.unlockedAchievements);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([
      { id: 'req1', from: 'user2', to: 'user1', timestamp: Date.now() - 1000 * 60 * 60 * 24 }, // Rohan -> Current User
      { id: 'req2', from: 'user1', to: 'user4', timestamp: Date.now() - 1000 * 60 * 60 * 12 }, // Current User -> Amit
  ]);
  const [gameInvites, setGameInvites] = useState<GameInvite[]>([]);
  const [activeMatch, setActiveMatch] = useState<Match | null>(null);
  const [viewingProfile, setViewingProfile] = useState<User | null>(null);
  const [lastResult, setLastResult] = useState<{ score: number, answers: Answer[], questions: Question[], difficulty: Difficulty } | null>(null);

  // Landmark Quiz State
  const [landmarkProgress, setLandmarkProgress] = useState<LevelProgress>(savedData.landmarkProgress);
  const [currentLandmarkLevel, setCurrentLandmarkLevel] = useState<number>(1);
  const [currentLandmarkLevelInfo, setCurrentLandmarkLevelInfo] = useState<number | null>(null);
  const [landmarkQuestions, setLandmarkQuestions] = useState<LandmarkQuestion[]>([]);
  const [currentLandmarkQuestionIndex, setCurrentLandmarkQuestionIndex] = useState(0);
  const [landmarkScore, setLandmarkScore] = useState(0);
  const [landmarkAnswers, setLandmarkAnswers] = useState<LandmarkAnswer[]>([]);
  const [lastLandmarkResult, setLastLandmarkResult] = useState<{ score: number, answers: LandmarkAnswer[], questions: LandmarkQuestion[], level: number, stars: number } | null>(null);

  // Survival Mode State
  const [lives, setLives] = useState(3);
  const [wave, setWave] = useState(1);
  const [lastSurvivalResult, setLastSurvivalResult] = useState<{ score: number; wave: number; correctAnswers: number; totalAnswered: number} | null>(null);


  const { locale, t } = useLanguage();

  useEffect(() => {
    const dataToSave: SavedUserData = {
      currentUser,
      gameHistory,
      unlockedAchievements,
      landmarkProgress,
      usedStaticQuestions: Array.from(usedStaticQuestions),
    };
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(dataToSave));
  }, [currentUser, gameHistory, unlockedAchievements, landmarkProgress, usedStaticQuestions]);

  useEffect(() => {
    const initializeNativeApp = async () => {
      if (Capacitor.isNativePlatform()) {
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: '#020418' });
        await SplashScreen.hide();
      }
    };
    initializeNativeApp();
  }, []);

  useEffect(() => {
    const onboardingCompleted = localStorage.getItem(ONBOARDING_KEY);
    if (!onboardingCompleted) {
      setShowOnboarding(true);
    }
    const savedWallpaper = localStorage.getItem(WALLPAPER_KEY);
    if (savedWallpaper) {
      try {
        const parsed = JSON.parse(savedWallpaper);
        setWallpaper({ type: parsed.type, value: parsed.id_or_uri });
      } catch(e) { console.error("Failed to parse wallpaper", e); }
    }
    const savedThemeColor = localStorage.getItem(THEME_COLOR_KEY);
    if (savedThemeColor) {
        try {
            setThemeColor(JSON.parse(savedThemeColor));
        } catch(e) { console.error("Failed to parse theme color", e); }
    }
    const today = new Date().toISOString().split('T')[0];
    const dailyChallengeKey = `${DAILY_CHALLENGE_KEY_PREFIX}${today}`;
    if (localStorage.getItem(dailyChallengeKey)) {
        setDailyChallengeCompleted(true);
    }
  }, []);

  useEffect(() => {
    const newEffectiveTheme = theme === 'auto' ? getSystemTheme() : theme;
    setEffectiveTheme(newEffectiveTheme);

    if (newEffectiveTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
        if (theme === 'auto') {
            const newEffectiveTheme = getSystemTheme();
            setEffectiveTheme(newEffectiveTheme);
            if (newEffectiveTheme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  useEffect(() => {
    let effectiveColor: ThemeColor = DEFAULT_THEME_COLOR;

    if (themeColor.type === 'auto') {
        let accentHex: string | undefined;
        if (wallpaper.type === 'preset') {
            accentHex = presetWallpapers.find(p => p.id === wallpaper.value)?.accentColor;
        }
        effectiveColor = accentHex ? { id: 'auto', nameKey: 'auto_color', hex: accentHex } : DEFAULT_THEME_COLOR;
    } else if (themeColor.type === 'preset') {
        effectiveColor = presetThemeColors.find(c => c.id === themeColor.value) || DEFAULT_THEME_COLOR;
    } else if (themeColor.type === 'custom') {
        effectiveColor = { id: 'custom', nameKey: 'custom_color', hex: themeColor.value };
    }
    
    const contrast = getContrastYIQ(effectiveColor.hex);
    const rgb = hexToRgb(effectiveColor.hex);

    const rootStyle = document.documentElement.style;
    rootStyle.setProperty('--accent-color', effectiveColor.hex);
    rootStyle.setProperty('--accent-color-contrast', contrast);
    if (rgb) {
        rootStyle.setProperty('--accent-color-rgb', `${rgb[0]}, ${rgb[1]}, ${rgb[2]}`);
    }
  }, [themeColor, wallpaper]);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
  }, []);

  const handleSetTheme = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
    const toastKey = `toast_switched_to_${newTheme}`;
    showToast(t(toastKey));
  }, [t, showToast]);
  
  const handleToggleSound = useCallback((enabled: boolean) => {
    setIsSoundEnabled(enabled);
    localStorage.setItem(SOUND_ENABLED_KEY, String(enabled));
    showToast(t(enabled ? 'toast_sound_on' : 'toast_sound_off'));
  }, [t, showToast]);
  
  const handleSetWallpaper = useCallback((newWallpaper: Wallpaper) => {
    const wallpaperToSave = { 
      type: newWallpaper.type, 
      id_or_uri: newWallpaper.value,
      applied_at: Date.now() 
    };
    setWallpaper(newWallpaper);
    localStorage.setItem(WALLPAPER_KEY, JSON.stringify(wallpaperToSave));
    showToast(t(newWallpaper.type === 'default' ? 'toast_wallpaper_reset' : 'toast_wallpaper_updated'));
  }, [t, showToast]);

  const handleSetThemeColor = useCallback((newThemeColor: ThemeColorSetting) => {
    setThemeColor(newThemeColor);
    localStorage.setItem(THEME_COLOR_KEY, JSON.stringify(newThemeColor));
    showToast(t('toast_color_updated'));
  }, [t, showToast]);
  
  const handleUpdateAiQuizConfig = useCallback((config: AiQuizConfig) => {
    setAiQuizConfig(config);
    showToast(t('ai_settings_saved'));
  }, [t, showToast]);

  const handleFinishOnboarding = useCallback(() => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setShowOnboarding(false);
  }, []);

  const resetQuizState = useCallback(() => {
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswers([]);
    setIsAiQuiz(false);
    setIsDailyChallenge(false);
    setInitialAiPrompt('');
  }, []);

  const handleGoHome = useCallback(() => {
    resetQuizState();
    setGameState(GameStateEnum.HOME);
  }, [resetQuizState]);
  
  const handleStartQuiz = useCallback(async (category: Category | 'All', difficulty: Difficulty) => {
    resetQuizState();
    setDifficulty(difficulty);

    let filteredStatic = staticQuestions;
    if (category !== 'All') filteredStatic = staticQuestions.filter(q => q.category === category);
    if (difficulty) filteredStatic = filteredStatic.filter(q => q.difficulty === difficulty);
    
    const availableStatic = filteredStatic.filter(q => !usedStaticQuestions.has(q.question.en));
    let selectedStatic = availableStatic.length >= 10 
        ? availableStatic.sort(() => 0.5 - Math.random()).slice(0, 10)
        : [];

    if (selectedStatic.length < 10) {
        setGameState(GameStateEnum.FETCHING_QUESTIONS);
        try {
            const newQuestions = await fetchNewQuestions(category, difficulty, 10);
            if (!newQuestions || newQuestions.length === 0) throw new Error("Backend failed to provide questions.");
            setQuestions(newQuestions);
            setGameState(GameStateEnum.QUIZ);
            if (selectedStatic.length > 0) {
              const usedKeys = selectedStatic.map(q => q.question.en);
              setUsedStaticQuestions(prev => new Set([...prev, ...usedKeys]));
            }
            return;
        } catch (err) {
            console.error("Backend Quiz Fetch Error:", err);
            if (availableStatic.length > 0) {
                showToast("Couldn't fetch new questions, starting with what we have!");
                const fallbackQuestions = availableStatic.sort(() => 0.5 - Math.random()).slice(0, 10);
                const usedKeys = fallbackQuestions.map(q => q.question.en);
                setUsedStaticQuestions(prev => new Set([...prev, ...usedKeys]));
                setQuestions(formatStaticQuestions(fallbackQuestions, locale));
                setGameState(GameStateEnum.QUIZ);
                return;
            }
            setError({ title: "Failed to Fetch Questions", message: "We couldn't get any questions for your selection. Please try again later." });
            setGameState(GameStateEnum.ERROR);
            return;
        }
    }
    
    if (selectedStatic.length === 0) {
      setError({ title: "No Questions Found", message: "We couldn't find any questions for your selection. Please try a different category or difficulty." });
      setGameState(GameStateEnum.ERROR);
      return;
    }
    
    const usedKeys = selectedStatic.map(q => q.question.en);
    setUsedStaticQuestions(prev => new Set([...prev, ...usedKeys]));
    setQuestions(formatStaticQuestions(selectedStatic, locale));
    setGameState(GameStateEnum.QUIZ);
  }, [locale, usedStaticQuestions, resetQuizState, showToast]);

  const handleQuizFinish = useCallback(() => {
    const newHistoryEntry: GameHistoryEntry = {
      timestamp: Date.now(),
      score: score,
      correctAnswers: answers.filter(a => a.isCorrect).length,
      totalQuestions: questions.length,
      topic: isDailyChallenge ? "Daily Challenge" : (isAiQuiz ? "AI Generated" : (questions[0]?.category || "Mixed")),
      difficulty: difficulty,
      answers: answers
    };

    const updatedHistory = [newHistoryEntry, ...gameHistory];
    setGameHistory(updatedHistory);
    
    const unlocked = checkAndUnlockAchievements({ type: 'quiz', stats: { totalQuizzes: updatedHistory.length, highScore: Math.max(...updatedHistory.map(g => g.score), 0) }, history: updatedHistory }, unlockedAchievements);
    if (unlocked.length > 0) {
      setUnlockedAchievements(prev => [...prev, ...unlocked]);
    }

    setLastResult({ score, answers, questions, difficulty });
    setGameState(GameStateEnum.RESULTS);
    
    if (isDailyChallenge) {
        const today = new Date().toISOString().split('T')[0];
        const dailyChallengeKey = `${DAILY_CHALLENGE_KEY_PREFIX}${today}`;
        localStorage.setItem(dailyChallengeKey, 'true');
        setDailyChallengeCompleted(true);
    }
  }, [score, answers, questions, difficulty, isAiQuiz, isDailyChallenge, gameHistory, unlockedAchievements]);
  
  const handleAnswer = useCallback((isCorrect: boolean, timeLeft: number, selectedAnswer: string, hintUsed: boolean) => {
    const question = questions[currentQuestionIndex];
    const basePoints = isCorrect ? 50 + timeLeft * 5 : 0;
    const points = hintUsed ? Math.max(0, basePoints - 25) : basePoints;
    setScore(prev => prev + points);
    setAnswers(prev => [...prev, { question, selectedAnswer, isCorrect, points, correctAnswer: question.answer }]);
  }, [questions, currentQuestionIndex]);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleQuizFinish();
    }
  }, [currentQuestionIndex, questions.length, handleQuizFinish]);

  const handleStartAiQuizFlow = useCallback(() => {
    setInitialAiPrompt('');
    setGameState(GameStateEnum.AI_PROMPT);
  }, []);

  const handleStartAiQuizWithPrompt = useCallback((prompt: string) => {
    setInitialAiPrompt(prompt);
    setGameState(GameStateEnum.AI_PROMPT);
  }, []);
  
  const handleCreateAiQuiz = useCallback(async (prompt: string, numQuestions: number, difficulty: Difficulty) => {
    resetQuizState();
    setGameState(GameStateEnum.AI_QUIZ_GENERATING);
    setIsAiQuiz(true);
    setDifficulty(difficulty);

    try {
      const generatedQuestions: Question[] = await createCustomAiQuiz(prompt, numQuestions, difficulty);
      if (!generatedQuestions || generatedQuestions.length === 0) throw new Error("AI failed to generate questions.");
      
      const formattedQuestions: Question[] = generatedQuestions.map(q => ({
        ...q,
        difficulty: difficulty,
      }));

      setQuestions(formattedQuestions);
      setGameState(GameStateEnum.QUIZ);
    } catch (err) {
      console.error("AI Quiz Generation Error:", err);
      setError({ title: "AI Generation Failed", message: "The AI couldn't create a quiz on that topic. Please try a different topic or check your connection." });
      setGameState(GameStateEnum.ERROR);
    }
  }, [resetQuizState]);
  
  const handleStartDailyChallenge = useCallback(async () => {
    resetQuizState();
    setGameState(GameStateEnum.AI_QUIZ_GENERATING);
    setIsDailyChallenge(true);
    const difficulty = 'Medium';
    setDifficulty(difficulty);

    try {
        const prompt = `Today's unique and interesting facts about India`;
        const generatedQuestions: Question[] = await createCustomAiQuiz(prompt, 10, difficulty);

        if (!generatedQuestions || generatedQuestions.length === 0) throw new Error("AI failed to generate daily challenge.");
        
        setQuestions(generatedQuestions.map(q => ({ ...q, difficulty })));
        setGameState(GameStateEnum.QUIZ);

    } catch (err) {
        console.error("AI Daily Challenge Generation Error:", err);
        setError({ title: "Daily Challenge Failed", message: "We couldn't generate the Daily Challenge right now. Please try again later." });
        setGameState(GameStateEnum.ERROR);
    }
  }, [resetQuizState]);
  
  const fetchSurvivalQuestions = useCallback(async (currentWave: number) => {
    const getDifficultyForWave = (wave: number): Difficulty => {
      if (wave === 1) return 'Easy';
      if (wave <= 3) return 'Medium';
      return 'Hard';
    };

    setGameState(GameStateEnum.FETCHING_QUESTIONS);
    try {
      const difficulty = getDifficultyForWave(currentWave);
      const newQuestions = await fetchNewQuestions('All', difficulty, 5);
      if (!newQuestions || newQuestions.length === 0) throw new Error("Failed to fetch survival questions.");
      setQuestions(newQuestions);
      setCurrentQuestionIndex(0);
      setGameState(GameStateEnum.SURVIVAL);
    } catch (err) {
      console.error("Survival Mode Fetch Error:", err);
      setError({ title: "Failed to Load Wave", message: "We couldn't get the next set of questions. Please try again later." });
      setGameState(GameStateEnum.ERROR);
    }
  }, []);

  const handleStartSurvivalMode = useCallback(() => {
    resetQuizState();
    setLives(3);
    setWave(1);
    fetchSurvivalQuestions(1);
  }, [resetQuizState, fetchSurvivalQuestions]);

  const handleEndSurvival = useCallback(() => {
    setLastSurvivalResult({
      score,
      wave,
      correctAnswers: answers.filter(a => a.isCorrect).length,
      totalAnswered: answers.length,
    });
    setGameState(GameStateEnum.SURVIVAL_RESULTS);
  }, [score, wave, answers]);
  
  const handleSurvivalAnswer = useCallback((isCorrect: boolean, timeLeft: number) => {
    const question = questions[currentQuestionIndex];
    const points = isCorrect ? 50 + timeLeft * 5 : 0;
    
    setScore(prev => prev + points);
    setAnswers(prev => [...prev, { question, selectedAnswer: '', isCorrect, points, correctAnswer: question.answer }]);

    if (!isCorrect) {
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives <= 0) {
        setTimeout(handleEndSurvival, 2000);
        return;
      }
    }
    
    setTimeout(() => {
      if (lives <= 0) return; // Prevent state update if game has already ended
      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex >= questions.length) {
        const nextWave = wave + 1;
        setWave(nextWave);
        fetchSurvivalQuestions(nextWave);
      } else {
        setCurrentQuestionIndex(nextIndex);
      }
    }, 2000);

  }, [questions, currentQuestionIndex, lives, wave, handleEndSurvival, fetchSurvivalQuestions]);


  const handleShowAnalysis = useCallback(() => {
    setGameState(GameStateEnum.AI_ANALYSIS);
  }, []);

  const handleNavigate = useCallback((state: GameState, user?: User) => {
      if (state === GameStateEnum.PROFILE && user) {
          setViewingProfile(user);
      } else {
          setViewingProfile(null);
      }
      setGameState(state);
      setSidebarOpen(false);
  }, []);

  const handleStartBotMatch = useCallback((category: Category | 'All', difficulty: Difficulty) => {
    resetQuizState();
    const botOpponent = bots.find(b => b.difficulty === difficulty) || bots[1];
    
    let filteredQuestions = staticQuestions;
    if (category !== 'All') filteredQuestions = staticQuestions.filter(q => q.category === category);
    if (difficulty) filteredQuestions = filteredQuestions.filter(q => q.difficulty === difficulty);

    const selectedQuestions = filteredQuestions.sort(() => 0.5 - Math.random()).slice(0, 10);
    
    if (selectedQuestions.length === 0) {
      setError({ title: "No Questions Found", message: "We couldn't find any questions for your selection. Please try a different category or difficulty." });
      setGameState(GameStateEnum.ERROR);
      return;
    }

    const formattedQuestions = formatStaticQuestions(selectedQuestions, locale);

    const match: Match = {
        id: `match-${Date.now()}`,
        players: [currentUser, botOpponent],
        questions: formattedQuestions,
        scores: { [currentUser.id]: 0, [botOpponent.id]: 0 },
        currentQuestionIndex: 0,
        status: 'playing',
        isRated: true,
    };

    setActiveMatch(match);
    setGameState(GameStateEnum.MULTIPLAYER_QUIZ);
  }, [resetQuizState, locale, currentUser]);

  const handleMatchUpdate = useCallback((match: Match) => {
    setActiveMatch(match);
  }, []);

  const handleMatchEnd = useCallback((match: Match) => {
     setTimeout(() => {
        setActiveMatch(null);
        handleGoHome();
     }, 5000);
  }, [handleGoHome]);
  
  const handleUpdateProfile = useCallback((name: string, avatar: string) => {
      const updatedUser = { ...currentUser, name, avatar };
      setCurrentUser(updatedUser);
      setAllUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
      if (viewingProfile?.id === currentUser.id) {
          setViewingProfile(updatedUser);
      }
  }, [currentUser, viewingProfile?.id]);

  const handleSendFriendRequest = useCallback((receiverId: string) => {
    const receiver = allUsers.find(u => u.id === receiverId);
    if (!receiver || friendRequests.some(r => r.from === currentUser.id && r.to === receiverId)) return;
    
    const newRequest: FriendRequest = {
      id: `req-${Date.now()}`,
      from: currentUser.id,
      to: receiverId,
      timestamp: Date.now(),
    };
    setFriendRequests(prev => [...prev, newRequest]);
    showToast(t('toast_friend_request_sent', { name: receiver.name }));
  }, [allUsers, currentUser.id, friendRequests, showToast, t]);

  const handleCancelFriendRequest = useCallback((requestId: string) => {
    const request = friendRequests.find(r => r.id === requestId);
    if (!request) return;
    const receiver = allUsers.find(u => u.id === request.to);
    setFriendRequests(prev => prev.filter(r => r.id !== requestId));
    if (receiver) {
      showToast(t('toast_friend_request_cancelled', { name: receiver.name }));
    }
  }, [friendRequests, allUsers, showToast, t]);

  const handleAcceptFriendRequest = useCallback((requestId: string) => {
    const request = friendRequests.find(r => r.id === requestId);
    if (!request || request.to !== currentUser.id) return;

    const friendUser = allUsers.find(u => u.id === request.from);
    if (!friendUser) return;
    
    const updatedCurrentUser = { ...currentUser, friends: [...currentUser.friends, friendUser.id] };
    setCurrentUser(updatedCurrentUser);
    
    setAllUsers(prev => prev.map(u => {
        if (u.id === currentUser.id) return { ...u, friends: [...u.friends, friendUser.id] };
        if (u.id === friendUser.id) return { ...u, friends: [...u.friends, currentUser.id] };
        return u;
    }));

    setFriendRequests(prev => prev.filter(r => r.id !== requestId));
    showToast(t('toast_friend_request_accepted', { name: friendUser.name }));
  }, [friendRequests, currentUser, allUsers, showToast, t]);

  const handleDeclineFriendRequest = useCallback((requestId: string) => {
    const request = friendRequests.find(r => r.id === requestId);
    if (!request) return;
    const sender = allUsers.find(u => u.id === request.from);
    setFriendRequests(prev => prev.filter(r => r.id !== requestId));
    if(sender) {
        showToast(t('toast_friend_request_declined', { name: sender.name }));
    }
  }, [friendRequests, allUsers, showToast, t]);

  const handleRemoveFriend = useCallback((friendId: string) => {
    const friendUser = allUsers.find(u => u.id === friendId);
    if (!friendUser) return;

    const updatedCurrentUser = { ...currentUser, friends: currentUser.friends.filter(id => id !== friendId) };
    setCurrentUser(updatedCurrentUser);

    setAllUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) return { ...u, friends: u.friends.filter(id => id !== friendId) };
      if (u.id === friendId) return { ...u, friends: u.friends.filter(id => id !== currentUser.id) };
      return u;
    }));
    showToast(t('toast_friend_removed', { name: friendUser.name }));
  }, [currentUser, allUsers, showToast, t]);

  const handleStartLandmarkFlow = useCallback(() => {
    setGameState(GameStateEnum.LANDMARK_LEVEL_SELECT);
  }, []);

  const handleShowLandmarkInfo = useCallback((level: number) => {
    setCurrentLandmarkLevelInfo(level);
    setGameState(GameStateEnum.LANDMARK_INFO);
  }, []);

  const handleSelectLandmarkLevel = useCallback((level: number) => {
    const questionsForLevel = allLandmarkQuestions.filter(q => q.level === level);
    setLandmarkQuestions(questionsForLevel);
    setCurrentLandmarkLevel(level);
    setCurrentLandmarkQuestionIndex(0);
    setLandmarkScore(0);
    setLandmarkAnswers([]);
    setGameState(GameStateEnum.LANDMARK_QUIZ);
  }, []);
  
  const handleLandmarkAnswer = useCallback((isCorrect: boolean, timeLeft: number, selectedAnswer: string, hintUsed: boolean) => {
    const question = landmarkQuestions[currentLandmarkQuestionIndex];
    const basePoints = isCorrect ? 10 : 0;
    const points = hintUsed ? Math.max(0, basePoints - 5) : basePoints;
    setLandmarkScore(prev => prev + points);
    setLandmarkAnswers(prev => [...prev, { question, selectedAnswer, isCorrect, points, correctAnswer: question.answer }]);
  }, [landmarkQuestions, currentLandmarkQuestionIndex]);

  const handleLandmarkQuizEnd = useCallback(() => {
    const correctAnswersCount = landmarkAnswers.filter(a => a.isCorrect).length;
    const totalQuestions = landmarkQuestions.length;
    let stars = 0;
    if (correctAnswersCount === totalQuestions) stars = 3;
    else if (correctAnswersCount >= 7) stars = 2;
    else if (correctAnswersCount > 0) stars = 1;

    setLastLandmarkResult({
      score: landmarkScore,
      answers: landmarkAnswers,
      questions: landmarkQuestions,
      level: currentLandmarkLevel,
      stars,
    });
    
    const updatedProgress = { ...landmarkProgress };
    const currentLevelProgress = updatedProgress[currentLandmarkLevel] || { unlocked: true, stars: 0, highScore: 0 };
    updatedProgress[currentLandmarkLevel] = {
      ...currentLevelProgress,
      stars: Math.max(currentLevelProgress.stars, stars),
      highScore: Math.max(currentLevelProgress.highScore, landmarkScore),
    };

    if (correctAnswersCount >= 7) {
      const nextLevel = currentLandmarkLevel + 1;
      if (!updatedProgress[nextLevel]) {
        updatedProgress[nextLevel] = { unlocked: true, stars: 0, highScore: 0 };
      }
    }

    setLandmarkProgress(updatedProgress);
  
    setGameState(GameStateEnum.LANDMARK_RESULTS);
  }, [landmarkAnswers, landmarkQuestions, landmarkScore, currentLandmarkLevel, landmarkProgress]);

  const handleNextLandmarkQuestion = useCallback(() => {
    if (currentLandmarkQuestionIndex < landmarkQuestions.length - 1) {
      setCurrentLandmarkQuestionIndex(prev => prev + 1);
    } else {
      handleLandmarkQuizEnd();
    }
  }, [currentLandmarkQuestionIndex, landmarkQuestions.length, handleLandmarkQuizEnd]);

  const renderContent = () => {
    switch(gameState) {
      case GameStateEnum.QUIZ:
        return <QuizScreen 
          question={questions[currentQuestionIndex]}
          onAnswer={handleAnswer}
          onNext={handleNextQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          difficulty={difficulty}
          score={score}
          onExit={handleGoHome}
          isAiEnabled={!!process.env.API_KEY}
          isSoundEnabled={isSoundEnabled}
        />;
      case GameStateEnum.RESULTS:
        return lastResult && <ResultsScreen 
          score={lastResult.score}
          answers={lastResult.answers}
          questions={lastResult.questions}
          onPlayAgain={() => setGameState(GameStateEnum.HOME)}
          onGoHome={handleGoHome}
          onShowAnalysis={handleShowAnalysis}
          isAiEnabled={!!process.env.API_KEY}
        />;
      case GameStateEnum.LEADERBOARD:
        return <LeaderboardScreen allUsers={allUsers} />;
      case GameStateEnum.AI_PROMPT:
        return <AiQuizPromptScreen onCancel={handleGoHome} onCreateQuiz={handleCreateAiQuiz} initialConfig={aiQuizConfig} initialPrompt={initialAiPrompt} />;
      case GameStateEnum.AI_QUIZ_GENERATING:
        return <div className="flex items-center justify-center h-full text-xl animate-fade-in"><p>Generating your quiz with Gemini...</p></div>;
      case GameStateEnum.FETCHING_QUESTIONS:
        return <div className="flex items-center justify-center h-full text-xl animate-fade-in"><p>Fetching new questions...</p></div>;
      case GameStateEnum.AI_ANALYSIS:
        return lastResult && <AiAnalysisScreen results={lastResult} onBack={() => setGameState(GameStateEnum.RESULTS)} />;
      case GameStateEnum.ERROR:
        return error && <ErrorScreen errorTitle={error.title} errorMessage={error.message} onGoHome={handleGoHome} />;
      case GameStateEnum.PROFILE:
        return <ProfileScreen 
                  userProfile={viewingProfile || currentUser}
                  currentUser={currentUser}
                  onUpdateProfile={handleUpdateProfile}
                  highScore={gameHistory.length > 0 ? Math.max(...gameHistory.map(g => g.score)) : 0}
                  totalQuizzes={gameHistory.length}
                  accuracy={gameHistory.length > 0 ? Math.round(gameHistory.reduce((acc, g) => acc + (g.correctAnswers/g.totalQuestions), 0) / gameHistory.length * 100) : 0}
                  gameHistory={gameHistory}
                  unlockedAchievements={unlockedAchievements}
                  onNavigate={handleNavigate}
                  friendRequests={friendRequests}
                  onSendFriendRequest={handleSendFriendRequest} onCancelFriendRequest={handleCancelFriendRequest} onAcceptFriendRequest={handleAcceptFriendRequest} onDeclineFriendRequest={handleDeclineFriendRequest} onRemoveFriend={handleRemoveFriend} onSendGameInvite={()=>{}}
                  gameInvites={[]}
               />;
      case GameStateEnum.FRIENDS:
        return <FriendsScreen 
                  currentUser={currentUser}
                  allUsers={allUsers}
                  friendRequests={friendRequests}
                  onAccept={handleAcceptFriendRequest} onDecline={handleDeclineFriendRequest} onCancel={handleCancelFriendRequest} onAdd={handleSendFriendRequest}
                  onViewProfile={(user) => handleNavigate(GameStateEnum.PROFILE, user)}
                  onChallenge={()=>{}}
                />;
      case GameStateEnum.SETTINGS:
        return <SettingsScreen 
                  onNavigate={handleNavigate} 
                  theme={theme} 
                  setTheme={handleSetTheme} 
                  themeColor={themeColor}
                  setThemeColor={handleSetThemeColor}
                  isSoundEnabled={isSoundEnabled}
                  onToggleSound={handleToggleSound}
                />;
      case GameStateEnum.WALLPAPER_SETTINGS:
        return <WallpaperScreen 
                  onBack={() => setGameState(GameStateEnum.SETTINGS)} 
                  currentWallpaper={wallpaper}
                  onSetWallpaper={handleSetWallpaper}
                  onShowToast={showToast}
                />;
      case GameStateEnum.MULTIPLAYER_LOBBY:
        return <MultiplayerLobbyScreen onNavigate={handleNavigate} onFindRandomMatch={()=>{}} onSetupBotMatch={() => setGameState(GameStateEnum.BOT_MATCH_SETUP)} currentUser={currentUser} />;
      case GameStateEnum.BOT_MATCH_SETUP:
        return <BotMatchSetupScreen currentUser={currentUser} onStartMatch={handleStartBotMatch} onBack={() => setGameState(GameStateEnum.MULTIPLAYER_LOBBY)} />;
      case GameStateEnum.MULTIPLAYER_QUIZ:
        return activeMatch && <MultiplayerQuizScreen match={activeMatch} currentUser={currentUser} onMatchUpdate={handleMatchUpdate} onMatchEnd={handleMatchEnd} />;
      
      case GameStateEnum.LANDMARK_LEVEL_SELECT:
        return <LandmarkLevelSelectScreen progress={landmarkProgress} onSelectLevel={handleShowLandmarkInfo} onBack={handleGoHome} />;
      case GameStateEnum.LANDMARK_INFO: {
          const landmarkForInfo = allLandmarkQuestions.find(q => q.level === currentLandmarkLevelInfo);
          if (!landmarkForInfo || currentLandmarkLevelInfo === null) {
              return <ErrorScreen errorTitle="Error" errorMessage="Could not load landmark information." onGoHome={handleGoHome} />;
          }
          return <LandmarkInfoScreen 
                    landmark={landmarkForInfo}
                    onStartQuiz={() => handleSelectLandmarkLevel(currentLandmarkLevelInfo)}
                    onBack={() => setGameState(GameStateEnum.LANDMARK_LEVEL_SELECT)}
                 />
      }
      case GameStateEnum.LANDMARK_QUIZ:
        return <LandmarkQuizScreen 
                  level={currentLandmarkLevel}
                  question={landmarkQuestions[currentLandmarkQuestionIndex]}
                  onAnswer={handleLandmarkAnswer}
                  onNext={handleNextLandmarkQuestion}
                  questionNumber={currentLandmarkQuestionIndex + 1}
                  totalQuestions={landmarkQuestions.length}
                  score={landmarkScore}
                  onExit={() => setGameState(GameStateEnum.LANDMARK_LEVEL_SELECT)}
               />;
      case GameStateEnum.LANDMARK_RESULTS:
        return lastLandmarkResult && <LandmarkResultsScreen
                  results={lastLandmarkResult}
                  onNextLevel={() => handleSelectLandmarkLevel(lastLandmarkResult.level + 1)}
                  onReplay={() => handleSelectLandmarkLevel(lastLandmarkResult.level)}
                  onGoToLevels={() => setGameState(GameStateEnum.LANDMARK_LEVEL_SELECT)}
                  isNextLevelUnlocked={!!landmarkProgress[lastLandmarkResult.level + 1]?.unlocked}
               />;
      
      case GameStateEnum.SURVIVAL:
        return <SurvivalQuizScreen 
                  question={questions[currentQuestionIndex]}
                  onAnswer={handleSurvivalAnswer}
                  onExit={handleGoHome}
                  wave={wave}
                  lives={lives}
                  score={score}
                  isSoundEnabled={isSoundEnabled}
               />;
      case GameStateEnum.SURVIVAL_RESULTS:
        return lastSurvivalResult && <SurvivalResultsScreen 
                  {...lastSurvivalResult}
                  onPlayAgain={handleStartSurvivalMode}
                  onGoHome={handleGoHome}
               />;

      case GameStateEnum.HOME:
      default:
        return <HomeScreen 
          onStartQuiz={handleStartQuiz}
          onStartAiQuizFlow={handleStartAiQuizFlow}
          onStartAiQuizWithPrompt={handleStartAiQuizWithPrompt}
          onStartDailyChallenge={handleStartDailyChallenge}
          onStartLandmarkQuiz={handleStartLandmarkFlow}
          onStartSurvivalMode={handleStartSurvivalMode}
          isAiEnabled={!!process.env.API_KEY}
          isDailyChallengeCompleted={dailyChallengeCompleted}
          aiQuizConfig={aiQuizConfig}
          onUpdateAiQuizConfig={handleUpdateAiQuizConfig}
        />;
    }
  }

  return (
    <div className="h-screen w-screen text-slate-800 dark:text-white font-sans flex">
      {showOnboarding && <OnboardingScreen onFinish={handleFinishOnboarding} />}
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        activeState={gameState}
        onNavigate={handleNavigate}
        onShowHelp={() => {}}
      />

      {isSidebarOpen && <div onClick={() => setSidebarOpen(false)} className="md:hidden fixed inset-0 bg-black/50 z-30"></div>}
      
      <div className="relative flex-1 flex flex-col overflow-hidden">
        <WallpaperBackground wallpaper={wallpaper} />
        <div className={`absolute inset-0 transition-colors duration-500 ${effectiveTheme === 'dark' ? 'bg-black/40' : 'bg-white/20'}`}></div>

        <main className="relative h-full w-full overflow-y-auto">
            { (gameState !== GameStateEnum.QUIZ && gameState !== GameStateEnum.MULTIPLAYER_QUIZ && gameState !== GameStateEnum.LANDMARK_QUIZ && gameState !== GameStateEnum.SURVIVAL) && (
              <div className="h-16 md:hidden" />
            )}
            {renderContent()}
        </main>

        { (gameState !== GameStateEnum.QUIZ && gameState !== GameStateEnum.MULTIPLAYER_QUIZ && gameState !== GameStateEnum.LANDMARK_QUIZ && gameState !== GameStateEnum.SURVIVAL) && (
        <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between h-16 px-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-gray-800 md:hidden">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-500 dark:text-gray-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <h1 className="text-xl font-bold">Quiz<span className="text-orange-500">Hero</span></h1>
          <div className="w-8"></div>
        </header>
        )}
      </div>
      
      {gameInvites.map(invite => (
        <ChallengeNotification key={invite.id} invite={invite} onAccept={()=>{}} onDecline={()=>{}} />
      ))}
      
      {toastMessage && <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />}
    </div>
  );
};

export default App;
