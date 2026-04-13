/**
 * Shared date utility functions for AlphaBrain
 * Provides safe date formatting and duration calculations
 */

/**
 * Safely format a date string to the specified format
 * @param dateStr - The date string to format
 * @param formatStr - The format string (compatible with date-fns)
 * @returns Formatted date string or "Invalid date"
 */
export const safeFormat = (dateStr: string | undefined | null, formatStr: string): string => {
  if (!dateStr) return 'Invalid date';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Invalid date';
    // Using native Intl.DateTimeFormat for better performance
    const options = getFormatOptions(formatStr);
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch {
    return 'Invalid date';
  }
};

/**
 * Get Intl.DateTimeFormat options based on format string
 */
const getFormatOptions = (formatStr: string): Intl.DateTimeFormatOptions => {
  // Simple format mapping (extend as needed)
  if (formatStr.includes('MMM d, yyyy')) {
    return { month: 'short', day: 'numeric', year: 'numeric' };
  }
  if (formatStr.includes('h:mm a')) {
    return { hour: 'numeric', minute: 'numeric', hour12: true };
  }
  if (formatStr.includes('HH:mm')) {
    return { hour: '2-digit', minute: '2-digit', hour12: false };
  }
  if (formatStr.includes('MMMM')) {
    return { month: 'long' };
  }
  if (formatStr.includes('yyyy')) {
    return { year: 'numeric' };
  }
  // Default
  return { dateStyle: 'short' };
};

/**
 * Calculate duration between two dates in minutes
 * @param startTime - Start time string
 * @param endTime - End time string
 * @returns Duration in minutes (e.g., "45 min") or "0 min"
 */
export const safeDuration = (startTime: string | undefined | null, endTime: string | undefined | null): string => {
  if (!startTime || !endTime) return '0 min';
  try {
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return '0 min';
    const minutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  } catch {
    return '0 min';
  }
};

/**
 * Format a date as a relative time string (e.g., "Today", "Tomorrow", "Monday")
 * @param dateStr - The date string to format
 * @returns Relative date string
 */
export const relativeDate = (dateStr: string | undefined | null): string => {
  if (!dateStr) return 'Invalid date';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Invalid date';

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const diffDays = Math.round((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays > 0 && diffDays <= 7) return targetDate.toLocaleDateString('en-US', { weekday: 'long' });
    if (diffDays < 0 && diffDays >= -7) return targetDate.toLocaleDateString('en-US', { weekday: 'long' });

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return 'Invalid date';
  }
};

/**
 * Check if a date is in the past
 * @param dateStr - The date string to check
 * @returns true if the date is in the past
 */
export const isPast = (dateStr: string | undefined | null): boolean => {
  if (!dateStr) return false;
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return false;
    return date < new Date();
  } catch {
    return false;
  }
};

/**
 * Check if a date is today
 * @param dateStr - The date string to check
 * @returns true if the date is today
 */
export const isToday = (dateStr: string | undefined | null): boolean => {
  if (!dateStr) return false;
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return false;
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  } catch {
    return false;
  }
};

/**
 * Format a time range (e.g., "9:00 AM - 10:30 AM")
 * @param startTime - Start time string
 * @param endTime - End time string
 * @returns Formatted time range
 */
export const timeRange = (startTime: string | undefined | null, endTime: string | undefined | null): string => {
  if (!startTime || !endTime) return '';
  try {
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return '';

    const format = (date: Date) => date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    return `${format(start)} - ${format(end)}`;
  } catch {
    return '';
  }
};
