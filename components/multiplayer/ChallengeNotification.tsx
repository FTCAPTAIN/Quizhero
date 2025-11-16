import React, { useEffect, useState } from 'react';
import { GameInvite } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { SwordsIcon } from '../Icons';

interface ChallengeNotificationProps {
    invite: GameInvite;
    onAccept: (invite: GameInvite) => void;
    onDecline: (inviteId: string) => void;
}

const ChallengeNotification: React.FC<ChallengeNotificationProps> = ({ invite, onAccept, onDecline }) => {
    const { t } = useLanguage();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        const timer = setTimeout(() => {
            handleDecline();
        }, 15000); // Auto-decline after 15 seconds

        return () => clearTimeout(timer);
    }, [invite]);

    const handleDecline = () => {
        setIsVisible(false);
        setTimeout(() => onDecline(invite.id), 300); // Wait for animation
    };

    const handleAccept = () => {
        setIsVisible(false);
        setTimeout(() => onAccept(invite), 300); // Wait for animation
    };

    return (
        <div 
            className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm p-4 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl transition-all duration-300 ease-in-out ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
        >
            <div className="flex items-center">
                <div className="w-12 h-12 text-3xl rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 mr-4">
                    {invite.from.avatar}
                </div>
                <div className="flex-grow">
                    <p className="font-bold text-white flex items-center">
                        <SwordsIcon className="w-4 h-4 mr-2 text-cyan-400" />
                        {t('challenge_from', { name: invite.from.name })}
                    </p>
                    <p className="text-sm text-slate-400">Rating: {invite.from.rating}</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={handleAccept} className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-md text-sm transition-colors">{t('accept')}</button>
                    <button onClick={handleDecline} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-3 rounded-md text-sm transition-colors">{t('decline')}</button>
                </div>
            </div>
        </div>
    );
};

export default ChallengeNotification;