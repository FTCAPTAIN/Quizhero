import { Achievement, AchievementId, GameHistoryEntry, Category, Bot } from '../types';
import {
  UnlockedAchievementIcon,
  QuestionMarkCircleIcon,
  StarIcon,
  CategoryKingIcon,
  TrophyIcon,
  RobotIcon,
} from '../components/Icons';

export const ALL_ACHIEVEMENTS: readonly Achievement[] = [
  {
    id: 'firstQuiz',
    titleKey: 'achievement_firstQuiz_title',
    descriptionKey: 'achievement_firstQuiz_desc',
    icon: QuestionMarkCircleIcon,
  },
  {
    id: 'quizMaster',
    titleKey: 'achievement_quizMaster_title',
    descriptionKey: 'achievement_quizMaster_desc',
    icon: UnlockedAchievementIcon,
  },
  {
    id: 'perfectScore',
    titleKey: 'achievement_perfectScore_title',
    descriptionKey: 'achievement_perfectScore_desc',
    icon: StarIcon,
  },
  {
    id: 'categoryExplorer',
    titleKey: 'achievement_categoryExplorer_title',
    descriptionKey: 'achievement_categoryExplorer_desc',
    icon: CategoryKingIcon,
  },
  {
    id: 'quizBeatBeginnerBot',
    titleKey: 'achievement_quizBeatBeginnerBot_title',
    descriptionKey: 'achievement_quizBeatBeginnerBot_desc',
    icon: RobotIcon,
  },
  {
    id: 'quizBeatExpertBot',
    titleKey: 'achievement_quizBeatExpertBot_title',
    descriptionKey: 'achievement_quizBeatExpertBot_desc',
    icon: TrophyIcon,
  },
  {
    id: 'botSlayer',
    titleKey: 'achievement_botSlayer_title',
    descriptionKey: 'achievement_botSlayer_desc',
    icon: TrophyIcon,
  },
];

type UserStats = {
  totalQuizzes: number;
  highScore: number;
};

type CheckQuizAchievementsArgs = {
  type: 'quiz';
  stats: UserStats;
  history: GameHistoryEntry[];
};

type CheckBotQuizAchievementsArgs = {
  type: 'bot_quiz';
  didWin: boolean;
  opponent: Bot;
  // TODO: Add consecutive wins tracking
};

type CheckAchievementsArgs = CheckQuizAchievementsArgs | CheckBotQuizAchievementsArgs;

export const checkAndUnlockAchievements = (
  args: CheckAchievementsArgs,
  alreadyUnlocked: AchievementId[]
): AchievementId[] => {
  const newlyUnlocked: AchievementId[] = [];

  if (args.type === 'quiz') {
    const { stats, history } = args;
    const lastGame = history[0];

    // Achievement: First Quiz
    if (stats.totalQuizzes >= 1 && !alreadyUnlocked.includes('firstQuiz')) {
      newlyUnlocked.push('firstQuiz');
    }

    // Achievement: Quiz Master
    if (stats.totalQuizzes >= 20 && !alreadyUnlocked.includes('quizMaster')) {
      newlyUnlocked.push('quizMaster');
    }

    // Achievement: Perfect Score
    if (lastGame && lastGame.correctAnswers === lastGame.totalQuestions && lastGame.totalQuestions > 0 && !alreadyUnlocked.includes('perfectScore')) {
      newlyUnlocked.push('perfectScore');
    }

    // Achievement: Category Explorer
    if (!alreadyUnlocked.includes('categoryExplorer')) {
      const classicCategories: Category[] = ['GK', 'Sports', 'Bollywood', 'Science', 'Technology', 'History', 'Geography', 'CurrentAffairs'];
      const playedCategories = new Set(history.map(game => game.topic));
      const allCategoriesPlayed = classicCategories.every(cat => playedCategories.has(cat));
      if (allCategoriesPlayed) {
        newlyUnlocked.push('categoryExplorer');
      }
    }
  } else if (args.type === 'bot_quiz') {
    const { didWin, opponent } = args;
    if (didWin) {
        if(opponent.difficulty === 'Easy' && !alreadyUnlocked.includes('quizBeatBeginnerBot')) {
            newlyUnlocked.push('quizBeatBeginnerBot');
        }
        if(opponent.rating >= 2000 && !alreadyUnlocked.includes('quizBeatExpertBot')) {
            newlyUnlocked.push('quizBeatExpertBot');
        }
        // TODO: check for 'botSlayer' (5 consecutive wins)
    }
  }

  return newlyUnlocked;
};