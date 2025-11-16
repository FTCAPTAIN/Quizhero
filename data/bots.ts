import { Bot } from '../types';

export const bots: Bot[] = [
    {
        id: 'bot1',
        name: 'Beginner Bot',
        avatar: '🤖',
        rating: 800,
        difficulty: 'Easy',
        accuracy: 0.5, // 50% chance to answer correctly
        joinDate: Date.now(),
        status: 'Online',
        friends: [],
    },
    {
        id: 'bot2',
        name: 'Intermediate Bot',
        avatar: '👾',
        rating: 1200,
        difficulty: 'Medium',
        accuracy: 0.7, // 70% chance to answer correctly
        joinDate: Date.now(),
        status: 'Online',
        friends: [],
    },
    {
        id: 'bot3',
        name: 'Advanced Bot',
        avatar: '🧠',
        rating: 1600,
        difficulty: 'Hard',
        accuracy: 0.85, // 85% chance to answer correctly
        joinDate: Date.now(),
        status: 'Online',
        friends: [],
    },
    {
        id: 'bot4',
        name: 'Expert Bot',
        avatar: '👑',
        rating: 2000,
        difficulty: 'Hard',
        accuracy: 0.95, // 95% chance to answer correctly
        joinDate: Date.now(),
        status: 'Online',
        friends: [],
    },
];