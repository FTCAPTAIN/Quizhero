import React, { useState, useMemo } from 'react';
import { LevelProgress, LandmarkQuestion } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { landmarkQuestions } from '../data/landmarks';
import { ArrowLeftIcon, LockClosedIcon, StarIcon, SearchIcon, CompassIcon, GlobeAltIcon } from './Icons';

interface LandmarkLevelSelectScreenProps {
  progress: LevelProgress;
  onSelectLevel: (level: number) => void;
  onBack: () => void;
}

const StarDisplay: React.FC<{ count: number }> = ({ count }) => (
  <div className="flex justify-center items-center gap-1">
    {[...Array(3)].map((_, i) => (
      <StarIcon
        key={i}
        className={`w-6 h-6 transition-colors duration-300 ${
          i < count ? 'text-yellow-400 drop-shadow-[0_0_4px_rgba(253,249,156,0.6)]' : 'text-slate-600'
        }`}
      />
    ))}
  </div>
);

const LandmarkLevelSelectScreen: React.FC<LandmarkLevelSelectScreenProps> = ({ progress, onSelectLevel, onBack }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'levels' | 'explore'>('levels');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const levels: number[] = useMemo(() => [...new Set(landmarkQuestions.map(q => q.level))].sort((a,b) => a - b), []);
  
  const filteredLandmarks = useMemo(() => {
    if (!searchQuery) return landmarkQuestions;
    const lowercasedQuery = searchQuery.toLowerCase();
    return landmarkQuestions.filter(q => 
        q.name.toLowerCase().includes(lowercasedQuery) || 
        q.hint.toLowerCase().includes(lowercasedQuery)
    );
  }, [searchQuery]);

  const getBorderStyleForStars = (stars: number): string => {
    if (stars === 3) {
      // Gold/Cyan for perfect
      return 'border-cyan-400 shadow-lg shadow-cyan-500/20';
    }
    if (stars === 2) {
      // Silver
      return 'border-slate-400';
    }
    if (stars === 1) {
      // Bronze
      return 'border-orange-600';
    }
    // Default
    return 'border-slate-700';
  };

  const renderLevelsTab = () => (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
        {levels.map((level, index) => {
            const levelProgress = progress[level] || { unlocked: false, stars: 0, highScore: 0 };
            const isUnlocked = levelProgress.unlocked;
            const borderStyle = getBorderStyleForStars(levelProgress.stars);

            return (
            <button
                key={level}
                disabled={!isUnlocked}
                onClick={() => onSelectLevel(level)}
                className={`aspect-square flex flex-col items-center justify-center p-2 rounded-2xl text-center transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed opacity-0 animate-fade-in ${
                isUnlocked
                    ? `bg-slate-800/50 border-2 hover:border-[var(--accent-color)] ${borderStyle}`
                    : 'bg-slate-800/20 border-2 border-slate-700/50'
                }`}
                style={{ animationDelay: `${index * 30}ms` }}
            >
                {isUnlocked ? (
                <>
                    <p className="text-sm text-slate-400">{t('level')}</p>
                    <p className="text-5xl font-bold my-1">{level}</p>
                    <StarDisplay count={levelProgress.stars} />
                </>
                ) : (
                <>
                    <LockClosedIcon className="w-10 h-10 text-slate-500" />
                    <p className="mt-2 text-slate-500 font-semibold">{t('locked')}</p>
                </>
                )}
            </button>
            );
        })}
    </div>
  );
  
  const renderExploreTab = () => (
      <div className="w-full max-w-2xl mx-auto animate-fade-in-fast">
        <p className="text-center text-slate-400 mb-6">{t('explore_subtitle')}</p>
        <div className="relative mb-6">
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search_landmarks_placeholder')}
                className="w-full pl-10 pr-4 py-3 bg-slate-900 border-2 border-slate-700/80 rounded-full text-white placeholder-slate-400 focus:outline-none focus:border-[var(--accent-color)] transition-all"
            />
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                <SearchIcon className="w-5 h-5" />
            </div>
        </div>
        
        <div className="space-y-3">
            {filteredLandmarks.map((landmark, index) => (
                <div key={landmark.id} className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden opacity-0 animate-fade-in" style={{ animationDelay: `${index * 20}ms` }}>
                    <div className="flex items-start justify-between p-3">
                        <div className="flex-grow pr-4">
                            <h3 className="font-semibold text-lg text-white">{landmark.name}</h3>
                            <p className="text-sm text-slate-400">{landmark.hint}</p>
                        </div>
                        <img 
                            src={landmark.imageUrl} 
                            alt={landmark.name} 
                            className="w-28 h-20 object-cover rounded-md flex-shrink-0" 
                        />
                    </div>
                     <div className="px-3 pb-3">
                        <div className={`transition-[max-height] duration-500 ease-in-out overflow-hidden ${expandedId === landmark.id ? 'max-h-96' : 'max-h-0'}`}>
                            <p className="text-sm text-slate-300 mb-2">{landmark.description}</p>
                        </div>
                        {expandedId === landmark.id ? (
                             <button onClick={() => setExpandedId(null)} className="text-xs font-semibold text-cyan-400 hover:text-cyan-300">{t('show_less')}</button>
                        ) : (
                             <button onClick={() => setExpandedId(landmark.id)} className="text-xs font-semibold text-cyan-400 hover:text-cyan-300">{t('learn_more')}</button>
                        )}
                    </div>
                </div>
            ))}
        </div>
      </div>
  );

  return (
    <div className="flex flex-col h-full w-full text-white pt-16 md:pt-4 p-4 bg-gray-950">
        <header className="w-full max-w-4xl mx-auto mb-4 flex items-center">
            <button onClick={onBack} className="p-2 -ml-2 mr-2 text-slate-300 hover:text-white" aria-label="Go back">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-3xl md:text-4xl font-bold">
                {activeTab === 'explore' ? t('explore_title') : t('landmark_challenge_title')}
            </h1>
        </header>

        <div className="w-full max-w-4xl mx-auto flex justify-center mb-6">
            <div className="flex items-center bg-slate-800/50 rounded-full p-1 space-x-1 border border-slate-700">
                <button
                    onClick={() => setActiveTab('levels')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-semibold transition-colors ${activeTab === 'levels' ? 'bg-[var(--accent-color)] text-[var(--accent-color-contrast)]' : 'text-slate-300 hover:bg-slate-700/50'}`}
                >
                    <GlobeAltIcon className="w-5 h-5"/>
                    {t('tab_levels')}
                </button>
                <button
                    onClick={() => setActiveTab('explore')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-semibold transition-colors ${activeTab === 'explore' ? 'bg-[var(--accent-color)] text-[var(--accent-color-contrast)]' : 'text-slate-300 hover:bg-slate-700/50'}`}
                >
                    <CompassIcon className="w-5 h-5"/>
                    {t('tab_explore')}
                </button>
            </div>
        </div>

        <div className="w-full max-w-4xl mx-auto flex-grow overflow-y-auto pr-2 pb-4">
            {activeTab === 'levels' && renderLevelsTab()}
            {activeTab === 'explore' && renderExploreTab()}
        </div>
    </div>
  );
};

export default LandmarkLevelSelectScreen;