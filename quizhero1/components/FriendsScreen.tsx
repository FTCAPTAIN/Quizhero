import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { User, UserStatus, FriendRequest } from '../types';
import { SearchIcon, UserPlusIcon, SwordsIcon } from './Icons';

interface FriendsScreenProps {
    currentUser: User;
    allUsers: User[];
    friendRequests: FriendRequest[];
    onAccept: (requestId: string) => void;
    onDecline: (requestId: string) => void;
    onCancel: (requestId: string) => void;
    onAdd: (userId: string) => void;
    onViewProfile: (user: User) => void;
    onChallenge: (userId: string) => void;
}

const getStatusIndicator = (status: UserStatus) => {
    switch (status) {
        case 'Online': return 'bg-green-500';
        case 'Playing': return 'bg-cyan-500';
        case 'Idle': return 'bg-yellow-500';
        case 'Offline': return 'bg-slate-500';
        default: return 'bg-slate-500';
    }
};

const FriendsScreen: React.FC<FriendsScreenProps> = ({ currentUser, allUsers, friendRequests, onAccept, onDecline, onCancel, onAdd, onViewProfile, onChallenge }) => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'find'>('friends');
    const [searchQuery, setSearchQuery] = useState('');

    const friends = useMemo(() => {
        return allUsers.filter(u => currentUser.friends.includes(u.id));
    }, [allUsers, currentUser]);

    const incomingRequests = useMemo(() => {
        return friendRequests.filter(r => r.to === currentUser.id);
    }, [friendRequests, currentUser]);

    const outgoingRequests = useMemo(() => {
        return friendRequests.filter(r => r.from === currentUser.id);
    }, [friendRequests, currentUser]);

    const findablePlayers = useMemo(() => {
        const friendIds = new Set(currentUser.friends);
        const outgoingRequestIds = new Set(outgoingRequests.map(r => r.to));
        const incomingRequestIds = new Set(incomingRequests.map(r => r.from));
        return allUsers.filter(u => 
            u.id !== currentUser.id &&
            !friendIds.has(u.id) &&
            !outgoingRequestIds.has(u.id) &&
            !incomingRequestIds.has(u.id)
        );
    }, [allUsers, currentUser, incomingRequests, outgoingRequests]);

    const filteredFriends = useMemo(() => {
        return friends.filter(friend => friend.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [friends, searchQuery]);
    
    const filteredFindable = useMemo(() => {
        return findablePlayers.filter(player => player.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [findablePlayers, searchQuery]);


    const renderFriendsList = () => (
        <div className="space-y-3">
            {filteredFriends.length > 0 ? (
                filteredFriends.map(friend => (
                    <div key={friend.id} className="flex items-center bg-slate-800/50 p-3 rounded-lg">
                        <div className="relative cursor-pointer" onClick={() => onViewProfile(friend)}>
                            <img src={friend.avatar} alt={friend.name} className="w-12 h-12 rounded-full" />
                            <span className={`absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full border-2 border-slate-800 ${getStatusIndicator(friend.status)}`} />
                        </div>
                        <div className="ml-4 flex-grow cursor-pointer" onClick={() => onViewProfile(friend)}>
                            <p className="font-semibold text-slate-200">{friend.name}</p>
                            <p className={`text-sm ${friend.status === 'Offline' ? 'text-slate-500' : 'text-slate-400'}`}>
                                {t(`status_${friend.status.toLowerCase()}`)}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => onViewProfile(friend)} className="bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-2 px-4 rounded-md transition-colors text-sm">
                                {t('profile')}
                            </button>
                             <button 
                                onClick={() => onChallenge(friend.id)} 
                                disabled={friend.status === 'Offline'}
                                className="bg-[var(--accent-color)] hover:brightness-90 text-[var(--accent-color-contrast)] font-semibold p-2 rounded-md transition-colors text-sm disabled:bg-slate-700 disabled:cursor-not-allowed"
                                title={friend.status !== 'Offline' ? t('challenge') : t('status_offline')}
                            >
                                <SwordsIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-10 px-4 bg-slate-800/50 rounded-lg">
                    <p className="text-slate-400">{searchQuery ? 'No friends found.' : t('friends_no_friends')}</p>
                    <p className="text-sm text-slate-500">{!searchQuery && t('friends_find_friends')}</p>
                </div>
            )}
        </div>
    );
    
    const renderRequestsList = () => (
        <div>
            <h3 className="font-semibold text-slate-400 mb-2">{t('incomingRequests')} ({incomingRequests.length})</h3>
            {incomingRequests.length > 0 ? (
                 <div className="space-y-3 mb-6">
                    {incomingRequests.map(req => {
                        const sender = allUsers.find(u => u.id === req.from);
                        if (!sender) return null;
                        return (
                            <div key={req.id} className="flex items-center bg-slate-800/50 p-3 rounded-lg">
                                <img src={sender.avatar} alt={sender.name} className="w-12 h-12 rounded-full" />
                                <div className="ml-4 flex-grow">
                                    <p className="font-semibold text-slate-200">{sender.name}</p>
                                    <p className="text-sm text-slate-400">Rating: {sender.rating}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => onAccept(req.id)} className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-md text-sm">{t('accept')}</button>
                                    <button onClick={() => onDecline(req.id)} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-md text-sm">{t('decline')}</button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : <p className="text-slate-500 text-center py-4 mb-4">{t('no_incoming_requests')}</p>}

            <h3 className="font-semibold text-slate-400 mb-2">{t('outgoingRequests')} ({outgoingRequests.length})</h3>
            {outgoingRequests.length > 0 ? (
                <div className="space-y-3">
                    {outgoingRequests.map(req => {
                        const receiver = allUsers.find(u => u.id === req.to);
                        if (!receiver) return null;
                        return (
                             <div key={req.id} className="flex items-center bg-slate-800/50 p-3 rounded-lg">
                                <img src={receiver.avatar} alt={receiver.name} className="w-12 h-12 rounded-full" />
                                <div className="ml-4 flex-grow">
                                    <p className="font-semibold text-slate-200">{receiver.name}</p>
                                    <p className="text-sm text-slate-400">Rating: {receiver.rating}</p>
                                </div>
                                <button onClick={() => onCancel(req.id)} className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-md text-sm">{t('cancelRequest')}</button>
                            </div>
                        )
                    })}
                </div>
             ) : <p className="text-slate-500 text-center py-4">{t('no_outgoing_requests')}</p>}
        </div>
    );
    
    const renderFindList = () => (
         <div className="space-y-3">
            {filteredFindable.map(player => (
                <div key={player.id} className="flex items-center bg-slate-800/50 p-3 rounded-lg">
                    <img src={player.avatar} alt={player.name} className="w-12 h-12 rounded-full" />
                    <div className="ml-4 flex-grow">
                        <p className="font-semibold text-slate-200">{player.name}</p>
                        <p className="text-sm text-slate-400">Rating: {player.rating}</p>
                    </div>
                    <button onClick={() => onAdd(player.id)} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-md text-sm flex items-center gap-2">
                        <UserPlusIcon className="w-4 h-4"/> {t('addFriend')}
                    </button>
                </div>
            ))}
        </div>
    );


    return (
        <div className="flex flex-col h-full w-full text-white p-4 overflow-y-auto animate-fade-in">
            <div className="w-full max-w-2xl mx-auto pt-16 md:pt-4">
                <h1 className="text-4xl font-bold mb-6">{t('friends_title')}</h1>

                {/* Tab Navigation */}
                <div className="w-full mb-4 border-b border-slate-700">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('friends')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                                activeTab === 'friends'
                                    ? 'border-[var(--accent-color)] text-[var(--accent-color)]'
                                    : 'border-transparent text-slate-400 hover:text-white hover:border-slate-500'
                            }`}
                        >
                            {t('friends_tab_friends', { count: friends.length })}
                        </button>
                        <button
                            onClick={() => setActiveTab('requests')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                                activeTab === 'requests'
                                    ? 'border-[var(--accent-color)] text-[var(--accent-color)]'
                                    : 'border-transparent text-slate-400 hover:text-white hover:border-slate-500'
                            }`}
                        >
                             {t('friends_tab_requests', { count: incomingRequests.length })}
                        </button>
                        <button
                            onClick={() => setActiveTab('find')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                                activeTab === 'find'
                                    ? 'border-[var(--accent-color)] text-[var(--accent-color)]'
                                    : 'border-transparent text-slate-400 hover:text-white hover:border-slate-500'
                            }`}
                        >
                           {t('friends_tab_find')}
                        </button>
                    </nav>
                </div>
                
                {(activeTab === 'friends' || activeTab === 'find') && (
                     <div className="relative mb-4">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('friends_search_placeholder')}
                            className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-full text-white placeholder-slate-500 focus:outline-none focus:border-[var(--accent-color)] transition-colors"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                            <SearchIcon className="w-5 h-5" />
                        </div>
                    </div>
                )}


                {/* Tab Content */}
                <div className="w-full mt-6">
                    {activeTab === 'friends' && renderFriendsList()}
                    {activeTab === 'requests' && renderRequestsList()}
                    {activeTab === 'find' && renderFindList()}
                </div>
            </div>
        </div>
    );
};

export default FriendsScreen;