import React from 'react';
import { GameState } from '../types';
import { HomeIcon, LeaderboardIcon, QuestionMarkCircleIcon, ExitIcon, ProfileIcon, UsersIcon, CogIcon, SwordsIcon } from './Icons';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeState: GameState;
  onNavigate: (state: GameState) => void;
  onShowHelp: () => void;
}


const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activeState, onNavigate, onShowHelp }) => {
  const { t } = useLanguage();

  const navItems = [
    { state: GameState.HOME, label: t('soloQuiz'), icon: HomeIcon, action: () => onNavigate(GameState.HOME) },
    { state: GameState.MULTIPLAYER_LOBBY, label: t('play'), icon: SwordsIcon, action: () => onNavigate(GameState.MULTIPLAYER_LOBBY) },
    { state: GameState.PROFILE, label: t('profile'), icon: ProfileIcon, action: () => onNavigate(GameState.PROFILE) },
    { state: GameState.FRIENDS, label: t('friends'), icon: UsersIcon, action: () => onNavigate(GameState.FRIENDS) },
    { state: GameState.LEADERBOARD, label: t('leaderboard'), icon: LeaderboardIcon, action: () => onNavigate(GameState.LEADERBOARD) },
  ];
  
  const bottomNavItems = [
    { state: GameState.SETTINGS, label: t('settings_nav'), icon: CogIcon, action: () => onNavigate(GameState.SETTINGS) },
    { label: t('howToPlay'), icon: QuestionMarkCircleIcon, action: () => { onShowHelp(); onClose(); } }
  ];

  const soloQuizStates = [
      GameState.HOME, GameState.QUIZ, GameState.RESULTS, 
      GameState.AI_PROMPT, GameState.AI_QUIZ_GENERATING, GameState.FETCHING_QUESTIONS,
      GameState.AI_ANALYSIS, GameState.LANDMARK_LEVEL_SELECT, GameState.LANDMARK_INFO,
      GameState.LANDMARK_QUIZ, GameState.LANDMARK_RESULTS, GameState.SURVIVAL,
      GameState.SURVIVAL_RESULTS
  ];

  return (
    <aside className={`fixed md:relative inset-y-0 left-0 z-40 w-64 h-full flex flex-col transition-transform duration-300 ease-in-out bg-slate-100 dark:bg-[#111827] border-r border-slate-200 dark:border-gray-700/50 flex-shrink-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
      <div className={`flex items-center justify-between h-20 px-4 border-b border-slate-200 dark:border-gray-800`}>
        <div className="flex items-center gap-3">
          <img src="/icon.png" alt="QuizHero Logo" className="w-10 h-10" />
          <h1 className="text-xl font-bold text-white">QuizHero</h1>
        </div>
        <button 
          onClick={onClose} 
          className="p-2 rounded-full text-slate-500 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-gray-700/50 hover:text-slate-800 dark:hover:text-white md:hidden"
          aria-label="Close sidebar"
        >
            <ExitIcon className="w-6 h-6" />
        </button>
      </div>
      
      <nav className="flex-grow p-4 space-y-1">
        {navItems.map((item) => {
          let isActive = activeState === item.state;
          if (item.state === GameState.HOME && soloQuizStates.includes(activeState)) {
              isActive = true;
          }
          return (
            <button
              key={item.label}
              onClick={item.action}
              className={`w-full flex items-center py-2.5 px-3 rounded-md transition-colors duration-200 text-left ${
                isActive ? 'bg-sky-500/10 text-sky-400' : 'text-slate-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-gray-700/50 hover:text-slate-900 dark:hover:text-white'
              }`}
              aria-label={item.label}
            >
              <item.icon className="w-6 h-6 flex-shrink-0" />
              <span className="ml-4 font-semibold whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto">
        <div className="px-4 my-2">
            <hr className="border-slate-700/50" />
        </div>

        <div className="p-4 space-y-1">
            {bottomNavItems.map((item) => {
               const isActive = 'state' in item && activeState === item.state;
               return (
                <button
                    key={item.label}
                    onClick={item.action}
                    className={`w-full flex items-center py-2.5 px-3 rounded-md transition-colors duration-200 text-left ${
                    isActive ? 'bg-sky-500/10 text-sky-400' : 'text-slate-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-gray-700/50 hover:text-slate-900 dark:hover:text-white'
                    }`}
                    aria-label={item.label}
                >
                    <item.icon className={`w-6 h-6 flex-shrink-0`} />
                    <span className="ml-4 font-semibold whitespace-nowrap">
                    {item.label}
                    </span>
                </button>
               );
             })}
        </div>

        <LanguageSwitcher />
      </div>
    </aside>
  );
};

export default Sidebar;