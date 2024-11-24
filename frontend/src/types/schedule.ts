import { ElementType } from 'react';

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface StudyEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  subject: string;
  difficulty: Difficulty;
  color?: string;
  topic?: string;
}

export interface ScheduleStat {
  label: string;
  value: string;
  icon: ElementType;
  color: string;
}

export interface SessionFormData {
  subject: string;
  topic: string;
  date: string;
  duration: string;
  difficulty: Difficulty;
}

export const subjectColors: Record<string, string> = {
  Mathematics: '#8b5cf6',
  Physics: '#3b82f6',
  Chemistry: '#10b981',
  Biology: '#f59e0b',
  Literature: '#ec4899'
};
