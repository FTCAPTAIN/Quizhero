import React, { useState, useMemo } from 'react';
import { User } from '../types';
import { CrownIcon } from './Icons';
import { useLanguage } from '../context/LanguageContext';

interface LeaderboardScreenProps {
  allUsers: User[];
}

const medalConfig: { [key: number]: { barColor: string; textColor: string; text: string; rankColor: string; borderColor: string; } } = {
    1: { barColor: 'bg-yellow-500', textColor: 'text-yellow-900', text: 'GOLD', rankColor: 'bg-yellow-500 text-yellow-900', borderColor: 'border-yellow-500/50' },
    2: { barColor: 'bg-slate-400', textColor: 'text-slate-800', text: 'SILVER', rankColor: 'bg-slate-400 text-slate-900', borderColor: 'border-slate-400/50' },
    3: { barColor: 'bg-orange-600', textColor: 'text-orange-100', text: 'BRONZE', rankColor: 'bg-orange-600 text-orange-100', borderColor: 'border-orange-600/50' },
};

const USERS_PER_PAGE = 15;

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ allUsers }) => {
  const { t } = useLanguage();
  const [visibleCount, setVisibleCount] = useState(USERS_PER_PAGE);

  const sortedUsers = useMemo(() => {
    return [...allUsers].sort((a, b) => b.rating - a.rating);
  }, [allUsers]);

  const renderContent = () => {
    if (sortedUsers.length === 0) {
      return (
        <div className="text-center py-16 px-4 animate-fade-in">
          <p className="text-xl text-gray-400">{t('noScores')}</p>
          <p className="text-gray-500">{t('noScoresSubtitle')}</p>
        </div>
      );
    }
    
    return sortedUsers.slice(0, visibleCount).map((user, index) => {
       const rank = index + 1;
       const config = medalConfig[rank];
       const rowStyle = config ? `${config.borderColor} bg-gray-800/40` : 'border-transparent bg-gray-800/40';
       const circleStyle = config ? config.rankColor : 'bg-gray-600 text-white';

       return (
         <div 
            key={user.id} 
            className={`flex items-center px-4 py-3 rounded-xl border ${rowStyle} transition-all duration-300 hover:bg-gray-700/50 hover:scale-[1.02] opacity-0 animate-fade-in`}
            style={{ animationDelay: `${(index % USERS_PER_PAGE) * 50}ms` }}
         >
            <div className="w-1/4 flex items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-md flex-shrink-0 ${circleStyle}`}>
                    #{rank}
                </div>
            </div>
            
            <div className="w-1/2 flex items-center">
                <div className="w-11 h-11 rounded-full bg-gray-700 flex-shrink-0 flex items-center justify-center text-2xl">
                   {user.avatar.includes('pravatar') ? (
                       <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full" />
                   ) : (
                        <span>{user.avatar}</span>
                   )}
                </div>
                <div className="ml-3">
                    <p className="font-semibold text-base">{user.name}</p>
                    {config && (
                        <div className={`relative mt-1 w-[70px] h-4 rounded-sm ${config.barColor}`}>
                           <span className={`absolute inset-0 flex items-center justify-center text-[10px] font-extrabold tracking-wider ${config.textColor}`}>
                               {config.text}
                           </span>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="w-1/4 text-right">
                <div className="font-bold text-lg text-[var(--accent-color)]">
                    {user.rating}
                </div>
            </div>
         </div>
       )
      });
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#1A1A1A] text-white pt-16 md:pt-0">
      <header className="relative flex items-center justify-center py-4 px-4">
        <CrownIcon className="absolute left-4 w-6 h-6 text-yellow-400" />
        <h1 className="text-2xl font-bold">{t('leaderboard')}</h1>
      </header>
      
      {sortedUsers.length > 0 && (
         <div className="mx-4 my-2 px-4 py-3 border border-gray-700 rounded-lg flex items-center text-sm text-gray-400 font-semibold">
          <div className="w-1/4 text-left text-orange-400">{t('rank')}</div>
          <div className="w-1/2 text-left">{t('player')}</div>
          <div className="w-1/4 text-right">{t('rating')}</div>
        </div>
      )}

      <div className="flex-grow overflow-y-auto px-4 py-2 space-y-3">
        {renderContent()}
        {visibleCount < sortedUsers.length && (
            <div className="pt-4 pb-2 text-center">
                <button
                    onClick={() => setVisibleCount(prev => prev + USERS_PER_PAGE)}
                    className="bg-[var(--accent-color)] text-[var(--accent-color-contrast)] font-bold py-2 px-8 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out hover:brightness-90 text-sm"
                >
                    {t('load_more')}
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardScreen;