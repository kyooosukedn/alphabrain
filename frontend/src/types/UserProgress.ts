export interface UserProgress {
  id: string;
  userId: string;
  roadmapId: string;
  progressPercentage: number;
  completedItemIds: string[];
  itemProgress: ItemProgress[];
  totalTimeSpent: number;
  lastActivityAt?: string;
  startedAt: string;
  completedAt?: string;
}

export interface ItemProgress {
  itemId: string;
  progressPercentage: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  timeSpentMinutes: number;
  completedResourceIds: string[];
  startedAt?: string;
  completedAt?: string;
  notes?: string;
} 