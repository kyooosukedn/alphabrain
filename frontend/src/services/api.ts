import { Topic, CreateTopicRequest } from '../types/topic';
import axiosInstance from '../config/axiosConfig';
import type { Session, CreateSessionRequest } from '../types/session';
import { QueryClient } from '@tanstack/react-query';
import type { Progress, LoginCredentials, RegisterCredentials } from '../types';

// Create and export the QueryClient instance
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Helper function to handle API errors
const handleApiError = (error: any, operation: string) => {
  console.error(`API Error during ${operation}:`, error);
  
  if (error.response) {
    console.error(`Status: ${error.response.status}, Data:`, error.response.data);
  } else if (error.request) {
    console.error('No response received from server:', error.request);
  } else {
    console.error('Error message:', error.message);
  }
  
  throw error;
};

export const topicsApi = {
  getTopics: () => axiosInstance.get<Topic[]>('/api/subjects'),
  getTopicById: (id: string) => axiosInstance.get<Topic>(`/api/subjects/${id}`),
  createTopic: (topic: CreateTopicRequest) => 
    axiosInstance.post<Topic>('/api/subjects', topic),
  updateTopic: (id: string, topic: Partial<CreateTopicRequest>) => 
    axiosInstance.put<Topic>(`/api/subjects/${id}`, topic),
  deleteTopic: (id: string) => 
    axiosInstance.delete(`/api/subjects/${id}`)
};

export const sessionsApi = {
  getSessions: async () => {
    try {
      return await axiosInstance.get<Session[]>('/api/sessions');
    } catch (error) {
      return handleApiError(error, 'getSessions');
    }
  },
  
  getSessionById: async (id: string) => {
    try {
      return await axiosInstance.get<Session>(`/api/sessions/${id}`);
    } catch (error) {
      return handleApiError(error, `getSessionById(${id})`);
    }
  },
  
  createSession: async (session: CreateSessionRequest) => {
    try {
      console.log('Creating session with data:', session);
      const response = await axiosInstance.post<Session>('/api/sessions', session);
      console.log('Session created successfully:', response.data);
      return response;
    } catch (error) {
      return handleApiError(error, 'createSession');
    }
  },
  
  updateSession: async (id: string, session: Partial<CreateSessionRequest>) => {
    try {
      console.log(`Updating session ${id} with data:`, session);
      const response = await axiosInstance.put<Session>(`/api/sessions/${id}`, session);
      console.log('Session updated successfully:', response.data);
      return response;
    } catch (error) {
      return handleApiError(error, `updateSession(${id})`);
    }
  },
  
  deleteSession: async (id: string) => {
    try {
      return await axiosInstance.delete(`/api/sessions/${id}`);
    } catch (error) {
      return handleApiError(error, `deleteSession(${id})`);
    }
  },
  
  updateSessionStatus: async (id: string, status: string) => {
    try {
      return await axiosInstance.patch<Session>(`/api/sessions/${id}/status`, { status });
    } catch (error) {
      return handleApiError(error, `updateSessionStatus(${id})`);
    }
  },
  
  updateSessionProgress: async (id: string, data: { 
    completionPercentage?: number, 
    actualDurationMinutes?: number, 
    notes?: string 
  }) => {
    try {
      return await axiosInstance.patch<Session>(`/api/sessions/${id}/progress`, data);
    } catch (error) {
      return handleApiError(error, `updateSessionProgress(${id})`);
    }
  },
  
  completeSession: async (id: string, data: { 
    actualDurationMinutes?: number, 
    notes?: string 
  }) => {
    try {
      return await axiosInstance.patch<Session>(`/api/sessions/${id}/complete`, data);
    } catch (error) {
      return handleApiError(error, `completeSession(${id})`);
    }
  },

  getSessionsByTopic: async (topicId: string) => {
    try {
      return await axiosInstance.get<Session[]>(`/api/sessions/by-topic/${topicId}`);
    } catch (error) {
      return handleApiError(error, `getSessionsByTopic(${topicId})`);
    }
  },
  
  getSessionAnalytics: async () => {
    try {
      return await axiosInstance.get('/api/sessions/analytics');
    } catch (error) {
      return handleApiError(error, 'getSessionAnalytics');
    }
  },
  
  getSessionAnalyticsByTopic: async () => {
    try {
      return await axiosInstance.get('/api/sessions/analytics/by-topic');
    } catch (error) {
      return handleApiError(error, 'getSessionAnalyticsByTopic');
    }
  }
};

// Auth API endpoints
export const authApi = {
  login: (credentials: LoginCredentials) => 
    axiosInstance.post('/api/auth/login', credentials),
  register: (userData: RegisterCredentials) => 
    axiosInstance.post('/api/auth/register', userData),
  logout: () => axiosInstance.post('/api/auth/logout'),
  refreshToken: () => axiosInstance.post('/api/auth/refresh-token'),
  getCurrentUser: () => axiosInstance.get('/api/auth/me')
};

// Progress API endpoints
export const progressApi = {
  getUserProgress: () => axiosInstance.get('/api/progress'),
  getProgress: () => axiosInstance.get('/api/progress'),
  updateProgress: (progressData: Partial<Progress>) =>
    axiosInstance.post('/api/progress', progressData),
  addProgress: (progressData: Omit<Progress, 'id'>) =>
    axiosInstance.post('/api/progress', progressData),
  getProgressStats: () => axiosInstance.get('/api/progress/stats')
};

// Streak API endpoints
export interface UserStreakResponse {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  totalLearningDays: number;
  lastLearningDate: string | null;
  totalStudyTimeMinutes: number;
  weeklyStudyMinutes: number[];
  totalNodesCompleted: number;
  totalRoadmapsCompleted: number;
  streakFreezeCount: number;
  formattedTotalStudyTime: string;
}

// Review card types
export interface ReviewCard {
  id: string;
  userId: string;
  nodeId: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: string;
  lastReviewedAt: string | null;
  totalReviews: number;
  successfulReviews: number;
  nodeTitle: string;
  nodeCategory: string;
  nodeDifficulty: number;
  createdAt: string;
}

export interface ReviewStats {
  totalCards: number;
  dueToday: number;
  totalReviews: number;
  successfulReviews: number;
  retentionRate: number;
}

export const reviewApi = {
  getDueCards: () => axiosInstance.get<ReviewCard[]>('/api/reviews/due'),
  getDueCount: () => axiosInstance.get<{ count: number }>('/api/reviews/due/count'),
  getAllCards: () => axiosInstance.get<ReviewCard[]>('/api/reviews/all'),
  getStats: () => axiosInstance.get<ReviewStats>('/api/reviews/stats'),
  enableAll: () => axiosInstance.post<{ created: number; message: string }>('/api/reviews/enable-all'),
  enableNode: (nodeId: string) => axiosInstance.post<ReviewCard>(`/api/reviews/enable/${nodeId}`),
  submitReview: (cardId: string, quality: number) =>
    axiosInstance.post<ReviewCard>(`/api/reviews/${cardId}/submit`, { quality }),
};

export const streakApi = {
  getMyStreak: () => axiosInstance.get<UserStreakResponse>('/api/streaks/my-streak'),
  recordActivity: (studyTimeMinutes: number, activityDate: string) =>
    axiosInstance.post<UserStreakResponse>('/api/streaks/record-activity', {
      studyTimeMinutes,
      activityDate,
    }),
};
