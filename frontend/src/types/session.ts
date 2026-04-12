// src/types/session.ts - Update the existing interfaces

// Define SessionStatus enum type to match backend
export type SessionStatus = 'PLANNED' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'MISSED';

export interface Session {
  id: string;
  title: string;
  description?: string;
  startTime: string; // ISO date string
  endTime: string;   // ISO date string
  status: SessionStatus;
  priority: string;  // e.g., "LOW", "MEDIUM", "HIGH"
  category: string;  // event type
  userId: string;
  topicId?: string;   // Reference to the topic this session belongs to
  completionPercentage?: number; // 0-100 percentage of completion
  actualDurationMinutes?: number; // Actual time spent in minutes
  notes?: string; // Notes taken during the session
  completedAt?: string; 
}

export interface CreateSessionRequest {
  title: string;
  description?: string;
  startTime: string; // Must be a valid ISO date string
  endTime: string;   // Must be a valid ISO date string
  status: SessionStatus;
  priority: string;
  category: string;
  topicId?: string;
}

// Validate a date string is a proper ISO format
export const isValidISODateString = (dateStr: string): boolean => {
  if (!dateStr) return false;
  
  try {
    const date = new Date(dateStr);
    return !isNaN(date.getTime()) && dateStr === date.toISOString();
  } catch {
    // Ignore the error details, just return false for invalid date
    return false;
  }
};

// Helper to convert a Date to an ISO string safely
export const toSafeISOString = (date: Date): string => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error('Invalid date object provided');
  }
  return date.toISOString();
};