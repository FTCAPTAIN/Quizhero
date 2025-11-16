import { User } from '../types';

export const currentUser: User = {
    id: 'user1',
    name: 'Quiz Challenger',
    avatar: '🏆',
    joinDate: Date.now() - 1000 * 60 * 60 * 24 * 30, // 30 days ago
    status: 'Online',
    friends: ['user3', 'user5'],
    rating: 1450,
};

export const allUsers: User[] = [
    currentUser,
    {
        id: 'user2',
        name: 'Rohan Sharma',
        avatar: 'https://i.pravatar.cc/150?img=1',
        joinDate: Date.now() - 1000 * 60 * 60 * 24 * 10,
        status: 'Online',
        friends: ['user4'],
        rating: 1600,
    },
    {
        id: 'user3',
        name: 'Priya Singh',
        avatar: 'https://i.pravatar.cc/150?img=5',
        joinDate: Date.now() - 1000 * 60 * 60 * 24 * 50,
        status: 'Playing',
        friends: ['user1', 'user5'],
        rating: 1520,
    },
    {
        id: 'user4',
        name: 'Amit Kumar',
        avatar: 'https://i.pravatar.cc/150?img=7',
        joinDate: Date.now() - 1000 * 60 * 60 * 24 * 5,
        status: 'Idle',
        friends: ['user2'],
        rating: 1300,
    },
    {
        id: 'user5',
        name: 'Anjali Patel',
        avatar: 'https://i.pravatar.cc/150?img=8',
        joinDate: Date.now() - 1000 * 60 * 60 * 24 * 100,
        status: 'Offline',
        friends: ['user1', 'user3'],
        rating: 1750,
    },
     {
        id: 'user6',
        name: 'Sanjay Mehta',
        avatar: 'https://i.pravatar.cc/150?img=11',
        joinDate: Date.now() - 1000 * 60 * 60 * 24 * 2,
        status: 'Online',
        friends: [],
        rating: 1200,
    },
];
