import { useState, useEffect } from 'react';
import KnowledgeGraph from '../components/KnowledgeGraph';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getUserNodes } from '../services/knowledgeGraphService';
import { KnowledgeNode } from '../types/knowledge';
import { Brain, Network, Loader2 } from 'lucide-react';

const KnowledgeGraphPage: React.FC = () => {
  const [nodes, setNodes] = useState<KnowledgeNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const data = await getUserNodes();
        setNodes(data);
      } catch {
        // KnowledgeGraph component handles its own error/mock fallback
      } finally {
        setLoading(false);
      }
    };
    fetchNodes();
  }, []);

  // Derive stats from real data
  const totalNodes = nodes.length;
  const avgProgress = totalNodes > 0
    ? Math.round(nodes.reduce((sum, n) => sum + (n.progress ?? 0), 0) / totalNodes)
    : 0;
  const completedCount = nodes.filter((n) => n.completed).length;
  const recentNodes = [...nodes]
    .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
    .slice(0, 5);

  // Group by nodeType
  const typeCounts: Record<string, number> = {};
  for (const n of nodes) {
    typeCounts[n.nodeType] = (typeCounts[n.nodeType] || 0) + 1;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Knowledge Graph</h1>
        <p className="text-slate-400 mt-1">
          Visualize how your learning topics connect to each other.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4 flex items-center gap-3">
            <Network className="w-8 h-8 text-violet-400" />
            <div>
              <p className="text-2xl font-bold text-white">{totalNodes}</p>
              <p className="text-xs text-slate-400">Total Nodes</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4 flex items-center gap-3">
            <Brain className="w-8 h-8 text-green-400" />
            <div>
              <p className="text-2xl font-bold text-white">{completedCount}</p>
              <p className="text-xs text-slate-400">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-white">{avgProgress}%</p>
            <p className="text-xs text-slate-400">Avg Progress</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-1">
              {Object.entries(typeCounts).map(([type, count]) => (
                <Badge key={type} variant="outline" className="text-slate-300 border-slate-700 text-xs">
                  {type}: {count}
                </Badge>
              ))}
              {totalNodes === 0 && (
                <span className="text-xs text-slate-500">No nodes yet</span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">By Type</p>
          </CardContent>
        </Card>
      </div>

      {/* Graph */}
      <KnowledgeGraph />

      {/* Recently Added */}
      {recentNodes.length > 0 && (
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <h3 className="font-semibold text-white mb-3">Recently Added</h3>
            <div className="flex flex-wrap gap-2">
              {recentNodes.map((node) => (
                <Badge
                  key={node.id}
                  variant="outline"
                  className="text-slate-300 border-slate-700"
                >
                  {node.title}
                  <span className="ml-1 text-slate-500">({node.progress ?? 0}%)</span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default KnowledgeGraphPage;
