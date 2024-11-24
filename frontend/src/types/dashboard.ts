import { ComponentType } from 'react';

export interface StudyMetric {
  label: string;
  value: string | number;
  change?: string;
  icon: ComponentType<{ className?: string }>;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
  description?: string;
}

export interface StudySession {
  id: string;
  subject: string;
  progress: number;
  timeLeft: string;
  dueDate: string;
  lastStudied?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topics: string[];
  color: string;
  streakDays: number;
  completedTopics: number;
  totalTopics: number;
}
