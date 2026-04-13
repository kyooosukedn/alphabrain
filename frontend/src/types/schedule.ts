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
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  topicId?: string;  // Reference to the topic
}

export interface ScheduleStat {
  label: string;
  value: string;
  icon: ElementType;
  color: string;
}

export const eventTypeColors: Record<EventType, string> = {
  'Deep Work': '#F97316',      // Coral (primary)
  'Customer Interview': '#059669',  // Green (success)
  'Book Review': '#0284C7',    // Sky (info)
  'TD Monthly Newsletter': '#D97706',  // Amber (warning)
  'Record Video': '#7C3AED'    // Violet (creative - sparing use)
};

export interface SessionFormData {
  id?: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  type?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  topicId?: string | null;
  category?: string;
}
