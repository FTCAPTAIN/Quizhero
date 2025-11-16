import React, { useState, useEffect, useMemo } from 'react';
import type { Category, Difficulty, AiQuizConfig } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { SparklesIcon, ChecklistIcon, PencilIcon, LeaderboardIcon, StarIcon, Cog8ToothIcon, ExitIcon, SearchIcon, GlobeAltIcon, BoltIcon } from './Icons';

interface HomeScreenProps {
  onStartQuiz: (category: Category | 'All', difficulty: Difficulty) => void;
  onStartAiQuizFlow: () => void;
  onStartAiQuizWithPrompt: (prompt: string) => void;
  onStartDailyChallenge: () => void;
  onStartLandmarkQuiz: () => void;
  onStartSurvivalMode: () => void;
  isAiEnabled: boolean;
  isDailyChallengeCompleted: boolean;
  aiQuizConfig: AiQuizConfig;
  onUpdateAiQuizConfig: (config: AiQuizConfig) => void;
}

const categoryKeys: (Category | 'All')[] = ['All', 'GK', 'Sports', 'Bollywood', 'Science', 'Technology', 'History', 'Geography', 'CurrentAffairs'];
const difficultyKeys: Difficulty[] = ['Easy', 'Medium', 'Hard'];

const AiSettingsModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    config: AiQuizConfig;
    onSave: (newConfig: AiQuizConfig) => void;
}> = ({ isOpen, onClose, config, onSave }) => {
    const { t } = useLanguage();
    const [localConfig, setLocalConfig] = useState(config);

    useEffect(() => {
        setLocalConfig(config);
    }, [config, isOpen]);

    const handleSave = () => {
        onSave(localConfig);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in-fast">
            <div className="relative w-full max-w-sm bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-6 flex flex-col animate-pop-in">
                <button onClick={onClose} className="absolute top-3 right-3 p-2 text-slate-400 hover:text-white"><ExitIcon className="w-6 h-6" /></button>
                <h2 className="text-2xl font-bold text-white mb-6 text-center">{t('ai_settings_title')}</h2>
                
                <div className="space-y-6">
                    <div>
                        <label htmlFor="numQuestions" className="block text-lg font-semibold text-slate-300 mb-3">{t('num_questions')} ({localConfig.numQuestions})</label>
                        <input
                            id="numQuestions"
                            type="range"
                            min="5"
                            max="20"
                            step="1"
                            value={localConfig.numQuestions}
                            onChange={(e) => setLocalConfig(prev => ({ ...prev, numQuestions: parseInt(e.target.value, 10) }))}
                            className="w-full"
                        />
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-slate-300 mb-3">{t('chooseDifficulty')}</h3>
                        <div className="grid grid-cols-3 gap-3">
                            {difficultyKeys.map((diff) => (
                                <button
                                    key={diff}
                                    onClick={() => setLocalConfig(prev => ({ ...prev, difficulty: diff }))}
                                    className={`py-3 px-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
                                        localConfig.difficulty === diff
                                            ? 'bg-[var(--accent-color)] text-[var(--accent-color-contrast)] shadow-lg'
                                            : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                                    }`}
                                >
                                    {t(`difficulty_${diff}`)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    className="w-full mt-8 bg-[var(--accent-color)] text-[var(--accent-color-contrast)] font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out text-lg hover:brightness-90"
                >
                    {t('save_settings')}
                </button>
            </div>
        </div>
    );
};

const HomeScreen: React.FC<HomeScreenProps> = ({ onStartQuiz, onStartAiQuizFlow, onStartAiQuizWithPrompt, onStartDailyChallenge, onStartLandmarkQuiz, onStartSurvivalMode, isAiEnabled, isDailyChallengeCompleted, aiQuizConfig, onUpdateAiQuizConfig }) => {
  const [selectedCategory, setSelectedCategory] = React.useState<Category | 'All'>('All');
  const [selectedDifficulty, setSelectedDifficulty] = React.useState<Difficulty>('Medium');
  const [isAiSettingsOpen, setIsAiSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useLanguage();

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
        return categoryKeys;
    }
    return categoryKeys.filter(category =>
        t(`category_${category}`).toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, t]);

  return (
    <>
      <AiSettingsModal 
          isOpen={isAiSettingsOpen}
          onClose={() => setIsAiSettingsOpen(false)}
          config={aiQuizConfig}
          onSave={onUpdateAiQuizConfig}
      />
      <div className="animate-fade-in p-4 md:p-8 overflow-y-auto">
        <div className="w-full max-w-2xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-semibold text-slate-800 dark:text-gray-200 tracking-tight">
              {t('title_Quiz')}<span className="font-bold">{t('title_Hero')}</span> <span className="font-bold text-orange-500">{t('title_India')}</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-gray-400 max-w-md mx-auto mt-4">
              {t('homeSubtitle')}
            </p>

            <div className="mt-8 space-y-8">
                <div className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('search_placeholder')}
                        className="w-full pl-12 pr-4 py-4 bg-slate-200/50 dark:bg-slate-800/50 border-2 border-transparent dark:border-slate-700/50 rounded-full text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-[var(--accent-color)] focus:ring-1 focus:ring-[var(--accent-color)] transition-all"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">
                        <SearchIcon className="w-6 h-6" />
                    </div>
                </div>
              
                {isAiEnabled && (
                  <button
                    onClick={onStartDailyChallenge}
                    disabled={isDailyChallengeCompleted}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold p-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out text-lg flex items-center justify-between disabled:from-slate-500 disabled:to-slate-600 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <div className="flex items-center space-x-3 text-left">
                      <StarIcon className="w-8 h-8 flex-shrink-0" />
                      <div>
                          <span className="block font-bold text-xl">{t('daily_challenge')}</span>
                          <span className="block text-sm opacity-90">{isDailyChallengeCompleted ? t('daily_challenge_completed') : t('daily_challenge_desc')}</span>
                      </div>
                    </div>
                    {isDailyChallengeCompleted && <ChecklistIcon className="w-7 h-7 flex-shrink-0" />}
                  </button>
                )}

                <div>
                  <h2 className="text-xl font-semibold text-slate-700 dark:text-gray-300 mb-4">{t('chooseCategory')}</h2>
                  <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
                    {filteredCategories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`py-3 px-2 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
                          selectedCategory === category
                            ? 'bg-[var(--accent-color)] text-[var(--accent-color-contrast)] shadow-lg'
                            : 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-gray-300'
                        }`}
                      >
                        {t(`category_${category}`)}
                      </button>
                    ))}
                  </div>
                  {isAiEnabled && searchQuery.trim() && filteredCategories.length === 0 && (
                      <div className="mt-4 animate-fade-in-fast">
                          <button
                              onClick={() => onStartAiQuizWithPrompt(searchQuery)}
                              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
                          >
                              <SparklesIcon className="w-5 h-5" />
                              <span className="truncate">{t('ai_search_button', { topic: searchQuery })}</span>
                          </button>
                      </div>
                  )}
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-slate-700 dark:text-gray-300 mb-4">{t('chooseDifficulty')}</h2>
                  <div className="grid grid-cols-3 gap-3">
                    {difficultyKeys.map((difficulty) => (
                      <button
                        key={difficulty}
                        onClick={() => setSelectedDifficulty(difficulty)}
                        className={`py-3 px-2 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
                          selectedDifficulty === difficulty
                            ? 'bg-[var(--accent-color)] text-[var(--accent-color-contrast)] shadow-lg'
                            : 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-gray-300'
                        }`}
                      >
                        {t(`difficulty_${difficulty}`)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col space-y-4 pt-6">
                    <button
                        onClick={() => onStartQuiz(selectedCategory, selectedDifficulty)}
                        className="w-full bg-[var(--accent-color)] text-[var(--accent-color-contrast)] font-bold py-4 px-6 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out text-xl hover:brightness-90"
                    >
                        {t('startClassicQuiz')}
                    </button>
                    {isAiEnabled && (
                        <div className="flex items-center gap-2">
                            <button
                            onClick={onStartAiQuizFlow}
                            className="flex-grow bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out text-lg flex items-center justify-center space-x-2"
                            title={t('aiQuizTitle')}
                            >
                            <SparklesIcon className="w-5 h-5" />
                            <span>{t('startAiQuiz')}</span>
                            </button>
                            <button
                                onClick={() => setIsAiSettingsOpen(true)}
                                className="flex-shrink-0 bg-slate-700/50 text-slate-300 hover:bg-slate-700 w-12 h-12 flex items-center justify-center rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300"
                                title={t('ai_settings_tooltip')}
                                aria-label={t('ai_settings_tooltip')}
                            >
                                <Cog8ToothIcon className="w-6 h-6" />
                            </button>
                        </div>
                    )}
                </div>

                 {/* New Modes Section */}
                <div className="w-full pt-8 grid md:grid-cols-2 gap-6">
                    {/* Survival Mode */}
                    <div className="relative rounded-2xl overflow-hidden p-8 bg-gradient-to-br from-red-900 via-slate-900 to-slate-900 border border-red-500/30 shadow-2xl flex flex-col items-center text-center transform hover:scale-[1.02] transition-transform duration-500 ease-in-out">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-500/20 rounded-full blur-3xl"></div>
                        <h2 className="text-3xl font-bold text-white relative z-10 flex items-center gap-3"><BoltIcon className="w-8 h-8"/> {t('survival_mode')}</h2>
                        <p className="mt-2 text-md text-red-200 relative z-10">{t('survival_mode_desc')}</p>
                        <button
                            onClick={onStartSurvivalMode}
                            className="mt-6 bg-red-500 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out text-lg hover:bg-red-600 relative z-10"
                        >
                            {t('play_now')}
                        </button>
                    </div>
                    {/* Landmark Quiz */}
                    <div className="relative rounded-2xl overflow-hidden p-8 bg-gradient-to-br from-[#042B38] to-[#0A485C] border border-cyan-500/30 shadow-2xl flex flex-col items-center text-center transform hover:scale-[1.02] transition-transform duration-500 ease-in-out">
                        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl"></div>
                        <h2 className="text-3xl font-bold text-white relative z-10 flex items-center gap-3"><GlobeAltIcon className="w-8 h-8"/> {t('landmark_challenge_title')}</h2>
                        <p className="mt-2 text-md text-cyan-200 relative z-10">{t('landmark_challenge_subtitle')}</p>
                        <button
                            onClick={onStartLandmarkQuiz}
                            className="mt-6 bg-cyan-400 text-slate-900 font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out text-lg hover:bg-cyan-300 relative z-10"
                        >
                            {t('play_now')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default HomeScreen;