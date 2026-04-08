export interface Roadmap {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnailUrl?: string;
  items: RoadmapItem[];
  nodeIds: string[];
  structure?: RoadmapStructure;
  userId?: string;
  completionPercentage: number;
  isPublic: boolean;
  isTemplate: boolean;
  tags: string[];
  difficultyLevel: string;
  estimatedTimeToComplete: number;
  createdAt: string;
  updatedAt: string;
}

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  type: string;
  order: number;
  required: boolean;
  completed: boolean;
  progressPercentage: number;
  prerequisites: string[];
  resources: Resource[];
  completedAt?: string;
}

export interface RoadmapStructure {
  nodePositions: NodePosition[];
  connections: NodeConnection[];
}

export interface NodePosition {
  nodeId: string;
  x: number;
  y: number;
  group?: string;
}

export interface NodeConnection {
  sourceNodeId: string;
  targetNodeId: string;
  label?: string;
}

export interface Resource {
  title: string;
  url: string;
  type: string;
  estimatedTimeToComplete: number;
} 