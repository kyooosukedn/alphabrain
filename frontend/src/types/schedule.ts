import { ElementType } from 'react';

export type EventType = 'Deep Work' | 'Customer Interview' | 'Book Review' | 'TD Monthly Newsletter' | 'Record Video';

export interface StudyEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type?: EventType;
  description?: string;
  backgroundColor?: string;
  borderColor?: string;
}

export interface ScheduleStat {
  label: string;
  value: string;
  icon: ElementType;
  color: string;
}

export const eventTypeColors: Record<EventType, string> = {
  'Deep Work': '#8b5cf6',
  'Customer Interview': '#3b82f6',
  'Book Review': '#10b981',
  'TD Monthly Newsletter': '#f59e0b',
  'Record Video': '#ec4899'
};
