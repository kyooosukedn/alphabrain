export interface Resource {
  title: string;
  url: string;
  type: string;
  estimatedTimeToComplete?: number;
}

export interface KnowledgeNode {
  id?: string;
  userId?: string;
  title: string;
  description: string;
  nodeType: string;
  difficultyLevel: number;
  estimatedTimeToLearn: number;
  createdAt?: string;
  updatedAt?: string;
  progress?: number;
  masteryLevel?: number;
  completed?: boolean;
  prerequisites?: string[];
  leadsTo?: string[];
  resources?: Resource[];
  completedAt?: string;
}

// Graph Visualization Types
export interface GraphNode {
  id: string;
  title: string;
  type: string;
  progress: number;
  color?: string;
  x?: number;
  y?: number;
  description?: string;
}

export interface GraphLink {
  source: string;
  target: string;
  type: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface ConnectionSuggestion {
  sourceNodeId: string;
  sourceNodeTitle: string;
  targetNodeId: string;
  targetNodeTitle: string;
  relationshipType: 'prerequisite' | 'leadsTo';
  reasoning: string;
}

export interface NodePosition {
  nodeId: string;
  x: number;
  y: number;
}

export interface NodeConnection {
  sourceNodeId: string;
  targetNodeId: string;
}

export interface RoadmapStructure {
  nodePositions: NodePosition[];
  connections: NodeConnection[];
}

export interface Roadmap {
  id?: string;
  userId?: string;
  title: string;
  description: string;
  category: string;
  difficultyLevel: string | number;
  estimatedTimeToComplete: number;
  createdAt?: string;
  updatedAt?: string;
  completionPercentage?: number;
  isPublic?: boolean;
  nodeIds: string[];
  tags: string[];
  structure?: RoadmapStructure;
} 