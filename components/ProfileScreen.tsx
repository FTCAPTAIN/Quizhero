import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { GameHistoryEntry, User, AchievementId, GameState, FriendRequest, GameInvite } from '../types';
import { ALL_ACHIEVEMENTS } from '../lib/achievements';
import ScoreHistoryGraph from './ScoreHistoryGraph';
import GameHistoryDetail from './GameHistoryDetail';
import { 
    UserPlusIcon,
    UserMinusIcon,
    ClockIcon,
    SwordsIcon,
    TrophyIcon,
    AccuracyIcon,
    StarIcon,
    EditIcon,
    LockedAchievementIcon,
    UnlockedAchievementIcon,
} from './Icons';

interface ProfileScreenProps {
  userProfile: User;
  currentUser: User;
  onUpdateProfile: (name: string, avatar: string) => void;
  highScore: number;
  totalQuizzes: number;
  accuracy: number;
  gameHistory: GameHistoryEntry[];
  unlockedAchievements: AchievementId[];
  onNavigate: (state: GameState) => void;
  friendRequests: FriendRequest[];
  onSendFriendRequest: (receiverId: string) => void;
  onCancelFriendRequest: (requestId: string) => void;
  onAcceptFriendRequest: (requestId: string) => void;
  onDeclineFriendRequest: (requestId: string) => void;
  onRemoveFriend: (friendId: string) => void;
  onSendGameInvite: (receiverId: string) => void;
  gameInvites: GameInvite[];
}

const avatars = ['🏆', '🚀', '🧠', '💡', '🎯', '🌟', '🧐', '🔥'];

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({ icon, label, value }) => (
    <div className="flex-1 bg-slate-800/50 p-4 rounded-xl flex flex-col items-center justify-center text-center">
        <p className="text-sm text-slate-400">{label}</p>
        <p className="text-2xl font-bold text-white my-1">{value}</p>
        <div className="text-[var(--accent-color)]">{icon}</div>
    </div>
);

const getRankForAccuracy = (accuracy: number) => {
    if (accuracy === 100) return "Platinum";
    if (accuracy >= 80) return "Gold";
    if (accuracy >= 50) return "Silver";
    return "Bronze";
};

const getRankColor = (rank: string) => {
    switch (rank) {
        case 'Platinum': return 'text-cyan-300';
        case 'Gold': return 'text-yellow-400';
        case 'Silver': return 'text-slate-400';
        case 'Bronze': return 'text-orange-500';
        default: return 'text-gray-400';
    }
};

const ProfileScreen: React.FC<ProfileScreenProps> = (props) => {
    const { 
        userProfile, 
        currentUser, 
        onUpdateProfile, 
        highScore, 
        totalQuizzes, 
        accuracy, 
        gameHistory, 
        unlockedAchievements, 
        onNavigate,
        friendRequests,
        onSendFriendRequest,
        onCancelFriendRequest,
        onAcceptFriendRequest,
        onDeclineFriendRequest,
        onRemoveFriend,
        onSendGameInvite,
        gameInvites
    } = props;

    const { t } = useLanguage();
    const [isEditing, setIsEditing] = useState(false);
    const [editingName, setEditingName] = useState(userProfile.name);
    const [editingAvatar, setEditingAvatar] = useState(userProfile.avatar);
    const [selectedGame, setSelectedGame] = useState<GameHistoryEntry | null>(null);

    const isOwnProfile = userProfile.id === currentUser.id;

    const handleSaveProfile = () => {
        onUpdateProfile(editingName, editingAvatar);
        setIsEditing(false);
    };

    const memberSince = useMemo(() => {
        return new Date(userProfile.joinDate).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }, [userProfile.joinDate]);
    
    const formatRelativeTime = (timestamp: number) => {
        const now = new Date();
        const past = new Date(timestamp);
        const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
        const diffInDays = Math.floor(diffInSeconds / 86400);

        if (diffInDays === 0) return t('time_today');
        if (diffInDays === 1) return t('time_yesterday');
        if (diffInDays < 7) return t('time_days_ago', { days: diffInDays });
        const diffInWeeks = Math.floor(diffInDays / 7);
        return t(diffInWeeks === 1 ? 'time_weeks_ago' : 'time_weeks_ago_plural', { weeks: diffInWeeks });
    };

    const renderActionButtons = () => {
        if (isOwnProfile) return null;

        const areFriends = currentUser.friends.includes(userProfile.id);
        const sentRequest = friendRequests.find(r => r.from === currentUser.id && r.to === userProfile.id);
        const receivedRequest = friendRequests.find(r => r.from === userProfile.id && r.to === currentUser.id);
        const sentChallenge = gameInvites.find(inv => inv.from.id === currentUser.id && inv.to === userProfile.id);

        if (areFriends) {
            return (
                <div className="w-full max-w-sm grid grid-cols-2 gap-4 mt-6">
                    <button 
                        onClick={() => onSendGameInvite(userProfile.id)}
                        disabled={!!sentChallenge}
                        className="flex items-center justify-center bg-[var(--accent-color)] text-[var(--accent-color-contrast)] font-bold py-3 px-4 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-90"
                    >
                        <SwordsIcon className="w-5 h-5 mr-2" /> 
                        {sentChallenge ? t('challengeSent') : t('challenge')}
                    </button>
                    <button onClick={() => onRemoveFriend(userProfile.id)} className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out">
                        <UserMinusIcon className="w-5 h-5 mr-2" /> {t('removeFriend')}
                    </button>
                </div>
            );
        }

        if (sentRequest) {
            return (
                <div className="w-full max-w-sm flex gap-4 mt-6">
                    <button onClick={() => onCancelFriendRequest(sentRequest.id)} className="flex-1 flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out">
                        <ClockIcon className="w-5 h-5 mr-2" /> {t('requestSent')}
                    </button>
                </div>
            );
        }
        
        if (receivedRequest) {
             return (
                <div className="w-full max-w-sm grid grid-cols-2 gap-4 mt-6">
                    <button onClick={() => onAcceptFriendRequest(receivedRequest.id)} className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out">
                        {t('accept')}
                    </button>
                    <button onClick={() => onDeclineFriendRequest(receivedRequest.id)} className="flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out">
                        {t('decline')}
                    </button>
                </div>
            );
        }

        return (
            <div className="w-full max-w-sm flex gap-4 mt-6">
                <button onClick={() => onSendFriendRequest(userProfile.id)} className="flex-1 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out">
                    <UserPlusIcon className="w-5 h-5 mr-2" /> {t('addFriend')}
                </button>
            </div>
        );
    };

    return (
        <>
            <div className="flex flex-col h-full w-full text-white pt-16 md:pt-4 p-4 overflow-y-auto">
                <div className="flex flex-col items-center w-full max-w-2xl mx-auto animate-fade-in">
                    
                    {/* Profile Header */}
                    <div className="relative">
                        <div className="w-28 h-28 text-6xl rounded-full border-4 border-[var(--accent-color)] bg-slate-800 flex items-center justify-center">
                          {isEditing ? editingAvatar : userProfile.avatar}
                        </div>
                    </div>

                    {!isEditing ? (
                        <>
                            <h1 className="text-4xl font-bold mt-4">{userProfile.name}</h1>
                            <p className="text-slate-400 mt-1">{t('memberSince')} {memberSince}</p>
                            {isOwnProfile && (
                                <button onClick={() => setIsEditing(true)} className="mt-4 flex items-center gap-2 text-sm bg-slate-700/50 hover:bg-slate-700 text-slate-300 font-semibold py-2 px-4 rounded-full transition-colors">
                                    <EditIcon className="w-4 h-4" /> {t('editProfile')}
                                </button>
                            )}
                        </>
                    ) : (
                        <div className="w-full max-w-sm mt-4 p-4 bg-slate-800/50 rounded-lg">
                            <label className="text-sm font-semibold text-slate-400">{t('edit_your_name')}</label>
                            <input type="text" value={editingName} onChange={(e) => setEditingName(e.target.value)} className="w-full mt-1 mb-3 px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500" />
                            
                            <label className="text-sm font-semibold text-slate-400">{t('edit_choose_avatar')}</label>
                            <div className="grid grid-cols-4 gap-2 mt-1 mb-4">
                                {avatars.map(avatar => (
                                    <button key={avatar} onClick={() => setEditingAvatar(avatar)} className={`w-full aspect-square text-3xl rounded-md flex items-center justify-center transition-all ${editingAvatar === avatar ? 'bg-[var(--accent-color)] ring-2 ring-white' : 'bg-slate-700 hover:bg-slate-600'}`}>
                                        {avatar}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setIsEditing(false)} className="flex-1 py-2 px-4 rounded-md bg-slate-600 hover:bg-slate-500 font-semibold">{t('cancel')}</button>
                                <button onClick={handleSaveProfile} className="flex-1 py-2 px-4 rounded-md bg-[var(--accent-color)] hover:brightness-90 text-[var(--accent-color-contrast)] font-semibold">{t('save')}</button>
                            </div>
                        </div>
                    )}

                    {renderActionButtons()}

                    <div className="w-full mt-8">
                        {/* Stats Section */}
                        <div className="w-full">
                            <h2 className="text-xl font-semibold text-slate-300 mb-3">{t('yourStats')}</h2>
                            <div className="grid grid-cols-3 gap-3">
                                <StatCard label={t('rating')} value={userProfile.rating} icon={<StarIcon className="w-5 h-5"/>} />
                                <StatCard label={t('totalQuizzes')} value={totalQuizzes} icon={<TrophyIcon className="w-5 h-5"/>} />
                                <StatCard label={t('accuracy')} value={`${accuracy}%`} icon={<AccuracyIcon className="w-5 h-5"/>} />
                            </div>
                        </div>

                         {isOwnProfile && (
                            <>
                                {/* Score History Graph */}
                                {gameHistory.length > 1 && (
                                <div className="w-full mt-8">
                                    <h2 className="text-xl font-semibold text-slate-300 mb-3">{t('scoreHistory')}</h2>
                                    <div className="bg-slate-800/50 p-4 rounded-xl">
                                        <ScoreHistoryGraph gameHistory={gameHistory} />
                                        <p className="text-center text-xs text-slate-500 mt-2">{t('last20games')}</p>
                                    </div>
                                </div>
                                )}

                                {/* Achievements Section */}
                                <div className="w-full mt-8">
                                    <h2 className="text-xl font-semibold text-slate-300 mb-3">{t('achievements')}</h2>
                                    <div className="space-y-3">
                                    {ALL_ACHIEVEMENTS.map(ach => (
                                         <div key={ach.id} className={`flex items-center bg-slate-800/50 p-3 rounded-lg transition-opacity ${unlockedAchievements.includes(ach.id) ? 'opacity-100' : 'opacity-50'}`}>
                                            <div className={`w-10 h-10 flex items-center justify-center rounded-lg mr-4 ${unlockedAchievements.includes(ach.id) ? 'bg-[var(--accent-color)]/20 text-[var(--accent-color)]' : 'bg-slate-700/50 text-slate-400'}`}>
                                                <ach.icon className="w-6 h-6" />
                                            </div>
                                            <div className="flex-grow">
                                            <p className={`font-semibold ${unlockedAchievements.includes(ach.id) ? 'text-slate-200' : 'text-slate-400'}`}>{t(ach.titleKey)}</p>
                                            <p className="text-xs text-slate-500">{t(ach.descriptionKey)}</p>
                                            </div>
                                            <div className="text-slate-500">
                                                {unlockedAchievements.includes(ach.id)
                                                    ? <UnlockedAchievementIcon className="w-6 h-6 stroke-[var(--accent-color)]" />
                                                    : <LockedAchievementIcon className="w-6 h-6" />
                                                }
                                            </div>
                                        </div>
                                    ))}
                                    </div>
                                </div>

                                {/* Game History Section */}
                                <div className="w-full mt-8">
                                    <h2 className="text-xl font-semibold text-slate-300 mb-3">{t('gameHistory')} ({gameHistory.length})</h2>
                                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                                        {gameHistory.length > 0 ? gameHistory.map((game) => {
                                            const gameAccuracy = game.totalQuestions > 0 ? Math.round((game.correctAnswers / game.totalQuestions) * 100) : 0;
                                            const rank = getRankForAccuracy(gameAccuracy);
                                            const topicKey = `category_${game.topic}`;
                                            const topicDisplay = t(topicKey) === topicKey ? game.topic : t(topicKey);

                                            return (
                                                <button key={game.timestamp} onClick={() => setSelectedGame(game)} className="w-full flex items-center bg-slate-800/50 p-3 rounded-lg transition-colors hover:bg-slate-700/50 text-left">
                                                    <div className="w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                                                        <TrophyIcon className={`w-6 h-6 ${getRankColor(rank)}`} />
                                                    </div>
                                                    <div className="flex-grow">
                                                        <p className="font-semibold text-slate-200 truncate pr-2">{topicDisplay}</p>
                                                        <p className={`text-sm font-bold ${getRankColor(rank)}`}>{t(`rank_${rank}`)} - {game.score} {t('points')}</p>
                                                    </div>
                                                    <div className="text-right text-sm text-slate-400 flex-shrink-0">
                                                        {formatRelativeTime(game.timestamp)}
                                                        <p className="text-xs text-slate-500">{gameAccuracy}%</p>
                                                    </div>
                                                </button>
                                            );
                                        }) : <div className="text-center py-6 text-slate-500 bg-slate-800/50 rounded-lg"><p>{t('noGameHistory')}</p></div>}
                                    </div>
                                </div>
                            </>
                         )}
                    </div>
                </div>
            </div>
            {selectedGame && (
                <GameHistoryDetail game={selectedGame} onClose={() => setSelectedGame(null)} />
            )}
        </>
    );
};

export default ProfileScreen;