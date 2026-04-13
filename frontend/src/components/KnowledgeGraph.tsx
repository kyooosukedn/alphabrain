// This component interacts with a third-party library (react-force-graph) that has complex typing
import React, { useEffect, useState, useRef, Suspense } from 'react';
// Lazy load ForceGraph2D to avoid issues with optional 3D dependencies
const ForceGraph2D = React.lazy(() => import('react-force-graph').then(m => ({ default: m.ForceGraph2D })));
import { useAppSelector } from '../store';
import NodeDetailsView from './NodeDetailsView';
import { Dialog, DialogContent } from './ui/dialog';
import { GraphNode, GraphData } from '../types/knowledge';
import { getUserKnowledgeGraph, getMockGraphData } from '../services/knowledgeGraphService';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import AddKnowledgeNodeForm from './AddKnowledgeNodeForm';

const KnowledgeGraph: React.FC = () => {
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  const [isAddNodeOpen, setIsAddNodeOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAppSelector((state) => state.auth);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const graphRef = useRef<any>(null);
  
  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const data = await getUserKnowledgeGraph();
        setGraphData(data);
      } catch (error) {
        console.error('Failed to fetch graph data:', error);
        // For demo/testing, use mock data
        setGraphData(getMockGraphData());
        setError('Failed to fetch data from server, using mock data instead');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGraphData();
  }, [user?.id]);
  
  const handleNodeClick = (node: GraphNode) => {
    setSelectedNode(node);
    // Focus on the node
    if (graphRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      graphRef.current.centerAt(node.x, node.y, 1000);
      graphRef.current.zoom(2.5, 1000);
    }
  };

  const handleBackgroundClick = () => {
    setSelectedNode(null);
    // Reset zoom
    if (graphRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      graphRef.current.zoomToFit(1000);
    }
  };

  const openDetailView = () => {
    setIsDetailViewOpen(true);
  };

  const closeDetailView = () => {
    setIsDetailViewOpen(false);
  };
  
  const openAddNodeForm = () => {
    setIsAddNodeOpen(true);
  };
  
  const closeAddNodeForm = () => {
    setIsAddNodeOpen(false);
  };
  
  const handleNodeAdded = (newNode: GraphNode) => {
    if (graphData) {
      // Add the new node to the graph data
      const updatedGraphData = {
        ...graphData,
        nodes: [...graphData.nodes, newNode]
      };
      setGraphData(updatedGraphData);
      
      // Close the form
      closeAddNodeForm();
      
      // Select the new node
      setSelectedNode(newNode);
      
      // Focus on the new node after a short delay to allow the graph to update
      setTimeout(() => {
        if (graphRef.current) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          graphRef.current.centerAt(newNode.x || 0, newNode.y || 0, 1000);
          graphRef.current.zoom(2.5, 1000);
        }
      }, 500);
    }
  };
  
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[400px]">Loading knowledge graph...</div>;
  }
  
  if (!graphData) {
    return <div className="flex justify-center items-center min-h-[400px]">No data available</div>;
  }
  
  return (
    <div className="knowledge-graph-container">
      <div className="flex justify-between items-center mb-4">
        <div>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Note</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
        <Button onClick={openAddNodeForm}>Add Node</Button>
      </div>
      
      <div className="h-[600px] border border-slate-800 rounded-md relative bg-slate-950">
        <Suspense fallback={
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-500 border-r-transparent mb-4"></div>
              <p className="text-slate-400">Loading knowledge graph...</p>
            </div>
          </div>
        }>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <ForceGraph2D
            ref={graphRef}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            graphData={graphData as any}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            nodeLabel={(node: any) => `${node.title} (${node.type})`}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            nodeColor={(node: any) => node.color || '#F97316'}
            nodeRelSize={6}
            linkDirectionalArrowLength={6}
            linkDirectionalArrowRelPos={1}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onNodeClick={handleNodeClick as any}
            onBackgroundClick={handleBackgroundClick}
            cooldownTicks={100}
            linkWidth={1}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
              const label = node.title;
              const fontSize = 12/globalScale;
              ctx.font = `${fontSize}px Sans-Serif`;
              const textWidth = ctx.measureText(label).width;
              const bgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

              ctx.fillStyle = node.color || '#F97316';
              ctx.beginPath();
              ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false);
              ctx.fill();

              // Progress indicator (arc around the node)
              if (node.progress !== undefined) {
                const progress = node.progress / 100;
                ctx.beginPath();
                ctx.arc(node.x, node.y, 7, 0, 2 * Math.PI * progress, false);
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#059669';
                ctx.stroke();
              }

              // Only render text labels if zoomed in enough
              if (globalScale >= 1.2) {
                ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
                ctx.fillRect(
                  node.x - textWidth / 2 - fontSize * 0.1,
                  node.y + 8,
                  bgDimensions[0],
                  bgDimensions[1]
                );

                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#e2e8f0';
                ctx.fillText(label, node.x, node.y + 8 + fontSize / 2);
              }
            }}
          />
        </Suspense>
        
        {/* Controls overlay */}
        <div className="absolute bottom-4 right-4 bg-slate-800 p-2 rounded-md shadow-md border border-slate-700">
          <button
            className="text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded mr-1"
            onClick={() => graphRef.current?.zoomToFit(1000)}
          >
            Fit View
          </button>
          <button
            className="text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded"
            onClick={() => setGraphData(getMockGraphData())}
          >
            Reset
          </button>
        </div>
      </div>
      
      {selectedNode && (
        <div className="mt-4 p-4 border border-slate-800 rounded-md bg-slate-900">
          <h3 className="text-lg font-semibold text-white">{selectedNode.title}</h3>
          <div className="mt-2">
            <span className="text-sm bg-slate-800 text-slate-300 px-2 py-1 rounded-full">{selectedNode.type}</span>
            <div className="mt-2">
              <div className="text-sm text-slate-400">Progress</div>
              <div className="w-full bg-slate-800 rounded-full h-2 mt-1">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${selectedNode.progress}%` }}
                ></div>
              </div>
            </div>
            <div className="mt-4">
              <button
                className="text-sm px-3 py-1 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                onClick={openDetailView}
              >
                Explore Topic
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail View Modal Dialog */}
      <Dialog open={isDetailViewOpen} onOpenChange={setIsDetailViewOpen}>
        <DialogContent className="sm:max-w-[925px] p-0">
          {selectedNode && (
            <NodeDetailsView 
              nodeId={selectedNode.id}
              title={selectedNode.title}
              description={`Detailed information about ${selectedNode.title}. This is a sample description for this knowledge node.`}
              type={selectedNode.type}
              progress={selectedNode.progress}
              difficulty={3}
              onClose={closeDetailView}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Add Node Modal Dialog */}
      <Dialog open={isAddNodeOpen} onOpenChange={setIsAddNodeOpen}>
        <DialogContent className="sm:max-w-[500px] p-4">
          <AddKnowledgeNodeForm 
            onNodeAdded={handleNodeAdded}
            onCancel={closeAddNodeForm}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KnowledgeGraph;