export interface Note {
  id: string;
  topicId: string;
  title: string;
  content: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

export interface NoteSummary {
  id: string;
  title: string;
  preview: string;
  topicId: string;
  topicName?: string;
  updatedAt: string;
  tags?: string[];
}
