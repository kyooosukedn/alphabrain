// Quest service API calls

import { API_URL } from '@/config/axiosConfig';

export interface UserQuest {
  questId: string;
  userId: string;
  progress: number;
  completed: boolean;
  completedAt?: string;
  startedAt: string;
  expiresAt: string;
}

export interface QuestProgress {
  sessionsCompleted: number;
  topicsStudied: string[];
  minutesPracticed: number;
  reviewsCompleted: number;
  notesCreated: number;
  streakDays: number;
}

// Get user's active quests
export const getUserQuests = async (): Promise<{ data: UserQuest[] }> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/quests/my-quests`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
};

// Get quest progress
export const getQuestProgress = async (): Promise<{ data: QuestProgress }> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/quests/progress`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
};

// Claim quest reward
export const claimQuestReward = async (questId: string): Promise<{ data: any }> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/quests/claim`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ questId }),
  });
  return response.json();
};

// Refresh daily quests (admin/debug)
export const refreshDailyQuests = async (): Promise<{ data: any }> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/quests/refresh`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
};
