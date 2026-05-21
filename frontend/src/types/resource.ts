export interface Resource {
  id: string;
  topicId: string;
  title: string;
  url: string;
  type: 'article' | 'video' | 'book' | 'course' | 'documentation' | 'tool' | 'other';
  description?: string;
  completed?: boolean;
  userId: string;
  createdAt: string;
}

export const resourceTypes: Record<Resource['type'], { label: string; icon: string; color: string }> = {
  article: { label: 'Article', icon: '📄', color: '#3b82f6' },
  video: { label: 'Video', icon: '🎥', color: '#ef4444' },
  book: { label: 'Book', icon: '📚', color: '#8b5cf6' },
  course: { label: 'Course', icon: '🎓', color: '#f97316' },
  documentation: { label: 'Docs', icon: '📖', color: '#06b6d4' },
  tool: { label: 'Tool', icon: '🛠️', color: '#10b981' },
  other: { label: 'Other', icon: '🔗', color: '#6b7280' },
};
