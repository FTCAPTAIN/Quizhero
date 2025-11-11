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


  return (
    <aside className={`fixed top-0 left-0 z-40 w-64 h-screen flex flex-col transition-transform duration-300 ease-in-out bg-slate-100 dark:bg-gray-900/80 backdrop-blur-sm border-r border-slate-200 dark:border-gray-700/50 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className={`flex items-center justify-between h-20 px-4 border-b border-slate-200 dark:border-gray-700/50`}>
        <div className="flex items-center">
            <SwordsIcon className="w-8 h-8 text-[var(--accent-color)] flex-shrink-0" />
            <h1 className={`text-2xl font-bold ml-2`}>
            Quiz<span className="text-orange-500">Hero</span>
            </h1>
        </div>
        <button 
          onClick={onClose} 
          className="p-2 rounded-full text-slate-500 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-gray-700/50 hover:text-slate-800 dark:hover:text-white"
          aria-label="Close sidebar"
        >
            <ExitIcon className="w-6 h-6" />
        </button>
      </div>
      
      <nav className="flex-grow mt-4">
        <ul>
          {navItems.map((item) => {
            const isActive = activeState === item.state;
            return (
              <li key={item.label} className="px-4 py-1">
                <button
                  onClick={item.action}
                  className={`w-full flex items-center py-3 px-3 rounded-lg transition-colors duration-200 ${
                    isActive ? 'bg-[var(--accent-color)]/20 text-[var(--accent-color)]' : 'text-slate-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-gray-700/50 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  aria-label={item.label}
                >
                  <item.icon className={`w-6 h-6 flex-shrink-0 ${isActive ? 'text-[var(--accent-color)]' : ''}`} />
                  <span className={`ml-4 font-semibold whitespace-nowrap`}>
                    {item.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto pb-4">
         <ul className="border-t border-slate-200 dark:border-gray-700/50 pt-2">
            {bottomNavItems.map((item) => {
               const isActive = 'state' in item && activeState === item.state;
               return (
                 <li key={item.label} className="px-4 py-1">
                   <button
                     onClick={item.action}
                     className={`w-full flex items-center py-3 px-3 rounded-lg transition-colors duration-200 ${
                       isActive ? 'bg-[var(--accent-color)]/20 text-[var(--accent-color)]' : 'text-slate-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-gray-700/50 hover:text-slate-900 dark:hover:text-white'
                     }`}
                     aria-label={item.label}
                   >
                     <item.icon className={`w-6 h-6 flex-shrink-0 ${isActive ? 'text-[var(--accent-color)]' : ''}`} />
                     <span className="ml-4 font-semibold whitespace-nowrap">
                       {item.label}
                     </span>
                   </button>
                 </li>
               );
             })}
         </ul>
        <LanguageSwitcher />
      </div>
    </aside>
  );
};

export default Sidebar;