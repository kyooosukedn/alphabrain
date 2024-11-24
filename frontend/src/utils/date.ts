import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';

export const formatDate = (date: Date | string, formatString = 'PPP'): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return isValid(parsedDate) ? format(parsedDate, formatString) : 'Invalid date';
};

export const formatTime = (date: Date | string): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return isValid(parsedDate) ? format(parsedDate, 'p') : 'Invalid time';
};

export const formatDateTime = (date: Date | string): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return isValid(parsedDate) ? format(parsedDate, 'PPp') : 'Invalid date/time';
};

export const formatRelativeTime = (date: Date | string): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return isValid(parsedDate)
    ? formatDistanceToNow(parsedDate, { addSuffix: true })
    : 'Invalid date';
};

export const getTimeSlots = (
  startTime: Date,
  endTime: Date,
  intervalMinutes = 30
): Date[] => {
  const slots: Date[] = [];
  let currentTime = new Date(startTime);

  while (currentTime < endTime) {
    slots.push(new Date(currentTime));
    currentTime = new Date(
      currentTime.getTime() + intervalMinutes * 60 * 1000
    );
  }

  return slots;
};

export const isOverlapping = (
  start1: Date,
  end1: Date,
  start2: Date,
  end2: Date
): boolean => {
  return start1 < end2 && start2 < end1;
};

export const getDurationInMinutes = (
  startTime: Date,
  endTime: Date
): number => {
  return Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
};

export const addMinutes = (date: Date, minutes: number): Date => {
  return new Date(date.getTime() + minutes * 60 * 1000);
};

export const subtractMinutes = (date: Date, minutes: number): Date => {
  return new Date(date.getTime() - minutes * 60 * 1000);
};

export const roundToNearestMinutes = (
  date: Date,
  nearestMinutes: number
): Date => {
  const minutes = date.getMinutes();
  const remainder = minutes % nearestMinutes;
  const roundedMinutes =
    remainder < nearestMinutes / 2
      ? minutes - remainder
      : minutes + (nearestMinutes - remainder);
  const newDate = new Date(date);
  newDate.setMinutes(roundedMinutes);
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);
  return newDate;
};
