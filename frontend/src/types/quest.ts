export interface Quest {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'daily' | 'weekly' | 'special';
  requirement: QuestRequirement;
  reward: QuestReward;
  progress?: number;
  completed?: boolean;
  expiresAt?: string;
}

export interface QuestRequirement {
  type: 'sessions_completed' | 'topics_studied' | 'streak_days' | 'minutes_practiced' | 'reviews_completed' | 'notes_created';
  value: number;
}

export interface QuestReward {
  xp: number;
  badgeColor?: string;
}

export interface UserQuest {
  questId: string;
  userId: string;
  progress: number;
  completed: boolean;
  completedAt?: string;
  startedAt: string;
  expiresAt: string;
}

// Daily quest definitions
export const DAILY_QUESTS: Omit<Quest, 'id'>[] = [
  {
    title: 'Study Session',
    description: 'Complete 1 study session today',
    icon: '📚',
    category: 'daily',
    requirement: { type: 'sessions_completed', value: 1 },
    reward: { xp: 10, badgeColor: '#10b981' },
  },
  {
    title: 'Deep Focus',
    description: 'Study for 30 minutes today',
    icon: '🎯',
    category: 'daily',
    requirement: { type: 'minutes_practiced', value: 30 },
    reward: { xp: 15, badgeColor: '#f97316' },
  },
  {
    title: 'Knowledge Explorer',
    description: 'Study 2 different topics today',
    icon: '🌟',
    category: 'daily',
    requirement: { type: 'topics_studied', value: 2 },
    reward: { xp: 20, badgeColor: '#8b5cf6' },
  },
  {
    title: 'Review Master',
    description: 'Complete 1 review session',
    icon: '🔄',
    category: 'daily',
    requirement: { type: 'reviews_completed', value: 1 },
    reward: { xp: 15, badgeColor: '#06b6d4' },
  },
  {
    title: 'Note Taker',
    description: 'Create 1 note for a topic',
    icon: '📝',
    category: 'daily',
    requirement: { type: 'notes_created', value: 1 },
    reward: { xp: 10, badgeColor: '#eab308' },
  },
  {
    title: 'Marathon Scholar',
    description: 'Study for 60 minutes today',
    icon: '🔥',
    category: 'daily',
    requirement: { type: 'minutes_practiced', value: 60 },
    reward: { xp: 30, badgeColor: '#ef4444' },
  },
];

// Weekly quests
export const WEEKLY_QUESTS: Omit<Quest, 'id'>[] = [
  {
    title: 'Dedicated Learner',
    description: 'Complete 5 sessions this week',
    icon: '📖',
    category: 'weekly',
    requirement: { type: 'sessions_completed', value: 5 },
    reward: { xp: 50, badgeColor: '#3b82f6' },
  },
  {
    title: 'Time Warrior',
    description: 'Study for 3 hours this week',
    icon: '⏰',
    category: 'weekly',
    requirement: { type: 'minutes_practiced', value: 180 },
    reward: { xp: 75, badgeColor: '#ec4899' },
  },
  {
    title: 'Streak Keeper',
    description: 'Maintain a 3-day streak',
    icon: '💪',
    category: 'weekly',
    requirement: { type: 'streak_days', value: 3 },
    reward: { xp: 40, badgeColor: '#f97316' },
  },
];
