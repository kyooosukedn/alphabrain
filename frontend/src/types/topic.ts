// src/types/topic.ts
export interface Topic {
  id: string;
  name: string;
  description?: string;
  color?: string;
  goalHours?: number;  // Target study hours for this topic
  completedHours?: number;  // Actual hours spent studying
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTopicRequest {
  name: string;
  description?: string;
  color?: string;
  goalHours?: number;
  userId: string;
}