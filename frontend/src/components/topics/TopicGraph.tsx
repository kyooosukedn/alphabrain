import React, { useEffect, useRef, useState } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import { useTopics } from '@/hooks/useTopics';
import { Topic } from '@/types/topic';
import { Session } from '@/types/session';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { sessionsApi } from '@/services/api';
import { Plus, ZoomIn, ZoomOut, Maximize } from 'lucide-react';

interface GraphNode {
  id: string;
  name: string;
  type: 'topic' | 'session';
  color: string;
  val: number; // Size of node
  sessions?: number;
  progress?: number;
  topicId?: string;
}

interface GraphLink {
  source: string;
  target: string;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export function TopicGraph() {
  const { topics } = useTopics();
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const graphRef = useRef<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch sessions data
  const { data: sessionsData } = useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      try {
        const response = await sessionsApi.getSessions();
        return response.data;
      } catch (error) {
        console.error('Failed to load sessions:', error);
        return [];
      }
    }
  });

  // Transform topics and sessions into graph data
  useEffect(() => {
    if (!topics || !sessionsData) return;

    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];
    
    // Add topic nodes
    topics.forEach(topic => {
      // Count sessions for this topic
      const topicSessions = sessionsData.filter(
        (session: Session) => session.topicId === topic.id
      );
      
      // Calculate progress for this topic
      const completedSessions = topicSessions.filter(
        (session: Session) => session.status === 'COMPLETED'
      );
      const progress = topicSessions.length > 0 
        ? (completedSessions.length / topicSessions.length) * 100 
        : 0;
      
      nodes.push({
        id: topic.id,
        name: topic.name,
        type: 'topic',
        color: topic.color || '#4f46e5',
        val: 15, // Larger nodes for topics
        sessions: topicSessions.length,
        progress
      });
      
      // Add session nodes and links to their topics
      topicSessions.forEach((session: Session) => {
        // Determine color based on status
        let color = '#9ca3af'; // Default gray
        if (session.status === 'IN_PROGRESS') color = '#3b82f6'; // Blue
        if (session.status === 'COMPLETED') color = '#10b981'; // Green
        
        nodes.push({
          id: session.id,
          name: session.title,
          type: 'session',
          color,
          val: 8, // Smaller nodes for sessions
          progress: session.completionPercentage || 0,
          topicId: topic.id
        });
        
        links.push({
          source: topic.id,
          target: session.id
        });
      });
    });
    
    setGraphData({ nodes, links });
  }, [topics, sessionsData]);

  const handleNodeClick = (node: GraphNode) => {
    setSelectedNode(node);
    
    // Focus on the node
    if (graphRef.current) {
      graphRef.current.centerAt(node.x, node.y, 1000);
      graphRef.current.zoom(2, 1000);
    }
  };

  const handleAddTopic = () => {
    navigate('/topics');
  };

  const handleAddSession = () => {
    navigate('/schedule');
  };

  const handleNodeAction = () => {
    if (!selectedNode) return;
    
    if (selectedNode.type === 'topic') {
      // Navigate to topic detail or filter sessions by topic
      navigate(`/topics?selected=${selectedNode.id}`);
    } else {
      // Navigate to session detail
      navigate(`/progress?session=${selectedNode.id}`);
    }
  };

  const zoomToFit = () => {
    if (graphRef.current) {
      graphRef.current.zoomToFit(1000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Knowledge Map</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={zoomToFit}>
            <Maximize className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => graphRef.current?.zoom(1.2)}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => graphRef.current?.zoom(0.8)}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button onClick={handleAddTopic}>
            <Plus className="h-4 w-4 mr-2" />
            Add Topic
          </Button>
          <Button onClick={handleAddSession}>
            <Plus className="h-4 w-4 mr-2" />
            Add Session
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-3 h-[600px]">
          <CardContent className="p-0 h-full">
            {graphData.nodes.length > 0 ? (
              <ForceGraph2D
                ref={graphRef}
                graphData={graphData}
                nodeLabel={(node: any) => `${node.name} (${node.type})`}
                nodeColor={(node: any) => node.color}
                nodeRelSize={6}
                linkWidth={1}
                linkColor={() => '#ddd'}
                onNodeClick={handleNodeClick}
                cooldownTicks={100}
                nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
                  const label = node.name;
                  const fontSize = 12/globalScale;
                  ctx.font = `${fontSize}px Sans-Serif`;
                  const textWidth = ctx.measureText(label).width;
                  const bgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

                  ctx.fillStyle = node.color;
                  ctx.beginPath();
                  ctx.arc(node.x, node.y, node.type === 'topic' ? 8 : 5, 0, 2 * Math.PI, false);
                  ctx.fill();

                  // Progress indicator (arc around the node)
                  if (node.progress !== undefined) {
                    const progress = node.progress / 100;
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, node.type === 'topic' ? 10 : 7, 0, 2 * Math.PI * progress, false);
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = '#4CAF50';
                    ctx.stroke();
                  }

                  // Only render text labels if zoomed in enough
                  if (globalScale >= 1.2) {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                    ctx.fillRect(
                      node.x - textWidth / 2 - fontSize * 0.1,
                      node.y + 8,
                      bgDimensions[0],
                      bgDimensions[1]
                    );

                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = '#000';
                    ctx.fillText(label, node.x, node.y + 8 + fontSize / 2);
                  }
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">No topics or sessions found</p>
                  <Button onClick={handleAddTopic}>Create Your First Topic</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            {selectedNode ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold">{selectedNode.name}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{selectedNode.type}</p>
                </div>
                
                {selectedNode.type === 'topic' && (
                  <div className="space-y-2">
                    <p>Sessions: {selectedNode.sessions || 0}</p>
                    <p>Progress: {Math.round(selectedNode.progress || 0)}%</p>
                  </div>
                )}
                
                {selectedNode.type === 'session' && (
                  <div className="space-y-2">
                    <p>Progress: {Math.round(selectedNode.progress || 0)}%</p>
                  </div>
                )}
                
                <Button onClick={handleNodeAction} className="w-full">
                  {selectedNode.type === 'topic' ? 'View Topic Details' : 'Continue Session'}
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Select a node to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default TopicGraph;
