// Achievement types for AlphaBrain gamification

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'first' | 'streak' | 'sessions' | 'topics' | 'special';
  requirement: AchievementRequirement;
  reward?: {
    xp?: number;
    badgeColor?: string;
  };
}

export interface AchievementRequirement {
  type: 'sessions_completed' | 'streak_days' | 'topics_covered' | 'first_session' | 'perfect_week' | 'power_learner';
  value: number;
}

export interface UserAchievement {
  achievementId: string;
  userId: string;
  unlockedAt: string;
  progress?: number; // For progress tracking
}

export interface AchievementUnlock {
  achievement: Achievement;
  unlockedAt: string;
}

// Achievement definitions
export const ACHIEVEMENTS: Omit<Achievement, 'id'>[] = [
  {
    title: 'First Steps',
    description: 'Complete your first study session',
    icon: '🎯',
    category: 'first',
    requirement: { type: 'first_session', value: 1 },
    reward: { xp: 10, badgeColor: '#10b981' },
  },
  {
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    category: 'streak',
    requirement: { type: 'streak_days', value: 7 },
    reward: { xp: 50, badgeColor: '#f97316' },
  },
  {
    title: 'Month Master',
    description: 'Maintain a 30-day streak',
    icon: '⚡',
    category: 'streak',
    requirement: { type: 'streak_days', value: 30 },
    reward: { xp: 200, badgeColor: '#ec4899' },
  },
  {
    title: '10 Sessions',
    description: 'Complete 10 study sessions',
    icon: '📚',
    category: 'sessions',
    requirement: { type: 'sessions_completed', value: 10 },
    reward: { xp: 25, badgeColor: '#3b82f6' },
  },
  {
    title: '50 Sessions',
    description: 'Complete 50 study sessions',
    icon: '📖',
    category: 'sessions',
    requirement: { type: 'sessions_completed', value: 50 },
    reward: { xp: 100, badgeColor: '#8b5cf6' },
  },
  {
    title: 'Century Scholar',
    description: 'Complete 100 study sessions',
    icon: '🏆',
    category: 'sessions',
    requirement: { type: 'sessions_completed', value: 100 },
    reward: { xp: 250, badgeColor: '#fbbf24' },
  },
  {
    title: 'Explorer',
    description: 'Learn 5 different topics',
    icon: '🧭',
    category: 'topics',
    requirement: { type: 'topics_covered', value: 5 },
    reward: { xp: 30, badgeColor: '#059669' },
  },
  {
    title: 'Polymath',
    description: 'Learn 10 different topics',
    icon: '🌟',
    category: 'topics',
    requirement: { type: 'topics_covered', value: 10 },
    reward: { xp: 75, badgeColor: '#d97706' },
  },
  {
    title: 'Perfect Week',
    description: '100% completion rate for a week',
    icon: '💯',
    category: 'special',
    requirement: { type: 'perfect_week', value: 1 },
    reward: { xp: 100, badgeColor: '#ef4444' },
  },
  {
    title: 'Power Learner',
    description: 'Study for 10 hours in a single day',
    icon: '⚡',
    category: 'special',
    requirement: { type: 'sessions_completed', value: 999 }, // Special handling
    reward: { xp: 150, badgeColor: '#f97316' },
  },
];
