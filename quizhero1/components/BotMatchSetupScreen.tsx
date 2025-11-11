import React, { useState } from 'react';
import { User, Category, Difficulty } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeftIcon, RobotIcon } from './Icons';

interface BotMatchSetupScreenProps {
    currentUser: User;
    onStartMatch: (category: Category | 'All', difficulty: Difficulty) => void;
    onBack: () => void;
}

const categories: (Category | 'All')[] = ['All', 'GK', 'Sports', 'Bollywood', 'Science', 'Technology', 'History', 'Geography', 'CurrentAffairs'];
const difficulties: Difficulty[] = ['Easy', 'Medium', 'Hard'];

const BotMatchSetupScreen: React.FC<BotMatchSetupScreenProps> = ({ currentUser, onStartMatch, onBack }) => {
    const { t } = useLanguage();
    const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
    const [difficultyIndex, setDifficultyIndex] = useState(1); // 0: Easy, 1: Medium, 2: Hard

    const handleStart = () => {
        const difficulty = difficulties[difficultyIndex];
        // Ensure 'All' is passed for Random, not a translated string
        const category = selectedCategory;
        onStartMatch(category, difficulty);
    };

    return (
        <div className="relative flex flex-col h-full w-full p-4 md:p-6 bg-slate-900 bg-sparks animate-fade-in text-white overflow-y-auto">
            <button onClick={onBack} className="absolute top-4 left-4 p-2 text-slate-300 hover:text-white z-10" aria-label="Go back">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>

            <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center flex-grow py-8">
                <h1 className="text-3xl font-bold mb-8">{t('bot_vs_me_title')}</h1>

                {/* Player vs Bot Display */}
                <div className="flex justify-around items-center w-full mb-10">
                    {/* Player */}
                    <div className="flex flex-col items-center text-center w-32">
                        <div className="relative w-24 h-24 mb-2">
                            <div className="absolute inset-0 bg-[var(--accent-color)] rounded-full animate-comet-pulse blur-lg opacity-70"></div>
                            <div 
                                className="relative text-5xl w-full h-full rounded-full border-4 border-[var(--accent-color)] bg-slate-800 flex items-center justify-center"
                                style={{ boxShadow: '0 0 15px 4px rgba(var(--accent-color-rgb), 0.6), 0 0 5px 2px rgba(var(--accent-color-rgb), 0.8)' }}
                            >
                                {currentUser.avatar}
                            </div>
                        </div>
                        <p className="font-semibold truncate w-full">{currentUser.name}</p>
                        <p className="text-sm text-slate-400">{t('your_profile')}</p>
                    </div>

                    <span className="text-2xl font-bold text-slate-500">vs.</span>

                    {/* Bot */}
                    <div className="flex flex-col items-center text-center w-32">
                        <div className="relative w-24 h-24 mb-2">
                             <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full animate-comet-pulse blur-lg opacity-70"></div>
                            <div className="relative w-full h-full rounded-full border-4 border-cyan-400 bg-slate-800 flex items-center justify-center glow-blue">
                                <RobotIcon className="w-12 h-12 text-cyan-300" />
                            </div>
                        </div>
                        <p className="font-semibold">Gemini AI</p>
                        <p className="text-sm text-slate-400">{t('ai_opponent')}</p>
                    </div>
                </div>

                {/* Category Chooser */}
                <div className="w-full mb-8">
                    <h2 className="font-semibold text-lg mb-3 text-slate-300">{t('chooseCategory')}</h2>
                    <div className="grid grid-cols-3 gap-3">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`py-3 px-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
                                    selectedCategory === cat ? 'bg-[var(--accent-color)] text-[var(--accent-color-contrast)] shadow-lg' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                }`}
                            >
                                {cat === 'All' ? t('random') : t(`category_${cat}`)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Difficulty Slider */}
                <div className="w-full mb-12">
                     <h2 className="font-semibold text-lg mb-3 text-slate-300">{t('chooseDifficulty')}</h2>
                     <input
                        type="range"
                        min="0"
                        max="2"
                        step="1"
                        value={difficultyIndex}
                        onChange={(e) => setDifficultyIndex(parseInt(e.target.value, 10))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                     />
                     <div className="flex justify-between text-sm text-slate-400 mt-2 px-1">
                        <span>{t('difficulty_Easy')}</span>
                        <span>{t('difficulty_Medium')}</span>
                        <span>{t('difficulty_Hard')}</span>
                     </div>
                </div>

                {/* Start Button */}
                <button
                    onClick={handleStart}
                    className="w-full bg-[var(--accent-color)] text-[var(--accent-color-contrast)] font-bold py-4 px-6 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out text-xl hover:brightness-90"
                >
                    {t('start_match')}
                </button>
            </div>
        </div>
    );
};

export default BotMatchSetupScreen;