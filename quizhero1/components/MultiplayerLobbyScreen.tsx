import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { GameState, User } from '../types';
import { SwordsIcon, RobotIcon } from './Icons';

interface MultiplayerLobbyScreenProps {
    onNavigate: (state: GameState, user?: User) => void;
    onFindRandomMatch: () => void;
    onSetupBotMatch: () => void;
    currentUser: User;
}

const MultiplayerLobbyScreen: React.FC<MultiplayerLobbyScreenProps> = ({ onNavigate, onFindRandomMatch, onSetupBotMatch, currentUser }) => {
    const { t } = useLanguage();

    return (
        <div className="flex flex-col h-full w-full items-center justify-center p-4 animate-fade-in text-white">
            <div className="w-full max-w-md mx-auto flex flex-col items-center text-center">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">{t('play_online_title')}</h1>

                <div className="w-full space-y-4">
                    <button
                        onClick={onFindRandomMatch}
                        className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
                    >
                        <div>
                            <h2 className="text-2xl font-bold text-left">{t('multiplayer_quiz')}</h2>
                            <p className="text-sm text-cyan-100 text-left">{t('multiplayer_quiz_desc')}</p>
                        </div>
                        <SwordsIcon className="w-10 h-10 flex-shrink-0" />
                    </button>

                    <button
                        onClick={onSetupBotMatch}
                        className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-slate-700 to-slate-800 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
                    >
                        <div>
                            <h2 className="text-2xl font-bold text-left">{t('quiz_vs_bot')}</h2>
                            <p className="text-sm text-slate-300 text-left">{t('quiz_vs_bot_desc')}</p>
                        </div>
                        <RobotIcon className="w-10 h-10 flex-shrink-0" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MultiplayerLobbyScreen;