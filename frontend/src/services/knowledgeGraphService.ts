import axiosInstance from '../config/axiosConfig';
import { KnowledgeNode, GraphNode, GraphLink, GraphData, ConnectionSuggestion } from '../types/knowledge';

const BASE_URL = '/api/nodes';

// Color mapping for node types
const NODE_COLORS: Record<string, string> = {
  SKILL: '#4CAF50',
  CONCEPT: '#3F51B5',
  TOOL: '#FFC107',
  RESOURCE: '#FF9800',
  PROJECT: '#9C27B0',
};

// Transform backend KnowledgeNode[] into graph visualization format
function toGraphData(nodes: KnowledgeNode[]): GraphData {
  const graphNodes: GraphNode[] = nodes.map((node) => ({
    id: node.id!,
    title: node.title,
    type: node.nodeType,
    progress: node.progress ?? 0,
    color: NODE_COLORS[node.nodeType] || '#999',
    description: node.description,
  }));

  // Build links from prerequisites and leadsTo relationships
  const links: GraphLink[] = [];
  for (const node of nodes) {
    if (node.prerequisites) {
      for (const preReqId of node.prerequisites) {
        links.push({ source: preReqId, target: node.id!, type: 'PREREQUISITE_OF' });
      }
    }
    if (node.leadsTo) {
      for (const nextId of node.leadsTo) {
        links.push({ source: node.id!, target: nextId, type: 'LEADS_TO' });
      }
    }
  }

  return { nodes: graphNodes, links };
}

// Get the user's knowledge graph (all nodes, transformed for visualization)
export const getUserKnowledgeGraph = async (): Promise<GraphData> => {
  const response = await axiosInstance.get<KnowledgeNode[]>(BASE_URL);
  return toGraphData(response.data);
};

// Get raw nodes (for lists, stats, etc.)
export const getUserNodes = async (): Promise<KnowledgeNode[]> => {
  const response = await axiosInstance.get<KnowledgeNode[]>(BASE_URL);
  return response.data;
};

// Create a knowledge node
export const saveKnowledgeNode = async (node: Partial<KnowledgeNode>): Promise<KnowledgeNode> => {
  const response = await axiosInstance.post<KnowledgeNode>(BASE_URL, node);
  return response.data;
};

// Update a knowledge node
export const updateKnowledgeNode = async (id: string, node: Partial<KnowledgeNode>): Promise<KnowledgeNode> => {
  const response = await axiosInstance.put<KnowledgeNode>(`${BASE_URL}/${id}`, node);
  return response.data;
};

// Update node progress
export const updateNodeProgress = async (
  id: string,
  progress: number,
  masteryLevel: number,
  completed: boolean
): Promise<KnowledgeNode> => {
  const response = await axiosInstance.put<KnowledgeNode>(`${BASE_URL}/${id}/progress`, {
    progress,
    masteryLevel,
    completed,
  });
  return response.data;
};

// Delete a knowledge node
export const deleteKnowledgeNode = async (nodeId: string): Promise<void> => {
  await axiosInstance.delete(`${BASE_URL}/${nodeId}`);
};

// Search nodes by title
export const searchNodes = async (title: string): Promise<KnowledgeNode[]> => {
  const response = await axiosInstance.get<KnowledgeNode[]>(`${BASE_URL}/search/${title}`);
  return response.data;
};

// Get AI-suggested connections for a node
export const suggestConnections = async (nodeId: string): Promise<ConnectionSuggestion[]> => {
  const response = await axiosInstance.get<ConnectionSuggestion[]>(`${BASE_URL}/${nodeId}/suggest-connections`);
  return response.data;
};

// Accept a suggested connection
export const acceptConnection = async (nodeId: string, suggestion: ConnectionSuggestion): Promise<void> => {
  await axiosInstance.post(`${BASE_URL}/${nodeId}/accept-connection`, suggestion);
};

// Mock data for testing when backend is not available
export const getMockGraphData = (): GraphData => {
  return {
    nodes: [
      { id: '1', title: 'JavaScript', type: 'SKILL', progress: 80, color: '#4CAF50' },
      { id: '2', title: 'React', type: 'SKILL', progress: 60, color: '#FFC107' },
      { id: '3', title: 'TypeScript', type: 'SKILL', progress: 40, color: '#FF9800' },
      { id: '4', title: 'Redux', type: 'SKILL', progress: 30, color: '#F44336' },
      { id: '5', title: 'CSS', type: 'SKILL', progress: 70, color: '#2196F3' },
      { id: '6', title: 'HTML', type: 'SKILL', progress: 90, color: '#673AB7' },
      { id: '7', title: 'Web Development', type: 'CONCEPT', progress: 65, color: '#3F51B5' },
    ],
    links: [
      { source: '1', target: '2', type: 'PREREQUISITE_OF' },
      { source: '1', target: '3', type: 'PREREQUISITE_OF' },
      { source: '2', target: '4', type: 'RELATED_TO' },
      { source: '6', target: '5', type: 'RELATED_TO' },
      { source: '5', target: '1', type: 'RELATED_TO' },
      { source: '7', target: '1', type: 'CONTAINS' },
      { source: '7', target: '5', type: 'CONTAINS' },
      { source: '7', target: '6', type: 'CONTAINS' },
    ],
  };
};
