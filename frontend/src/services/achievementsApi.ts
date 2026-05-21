// Achievement service API calls

import { API_URL } from '@/config/axiosConfig';

export interface UserAchievement {
  achievementId: string;
  userId: string;
  unlockedAt: string;
  progress?: number;
}

export interface AchievementStats {
  unlockedCount: number;
  totalXP: number;
  currentStreak: number;
  nextAchievement?: {
    title: string;
    progress: number;
    required: number;
  };
}

// Get user's achievements
export const getUserAchievements = async (): Promise<{ data: any }> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/achievements/my-achievements`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
};

// Get achievement stats
export const getAchievementStats = async (): Promise<{ data: AchievementStats }> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/achievements/stats`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
};

// Unlock achievement (called by backend when conditions met)
export const checkAndUnlockAchievement = async (
  achievementType: string,
  value: number
): Promise<{ data: any }> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/achievements/check`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type: achievementType, value }),
  });
  return response.json();
};
