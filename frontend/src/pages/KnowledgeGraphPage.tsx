import { useState, useEffect } from 'react';
import KnowledgeGraph from '../components/KnowledgeGraph';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getUserNodes, suggestConnections, acceptConnection } from '../services/knowledgeGraphService';
import { KnowledgeNode, ConnectionSuggestion } from '../types/knowledge';
import { Brain, Network, Loader2, Sparkles, Check, X, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const KnowledgeGraphPage: React.FC = () => {
  const [nodes, setNodes] = useState<KnowledgeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<ConnectionSuggestion[]>([]);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [acceptedIds, setAcceptedIds] = useState<Set<number>>(new Set());
  const [dismissedIds, setDismissedIds] = useState<Set<number>>(new Set());
  const { toast } = useToast();

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

  useEffect(() => {
    fetchNodes();
  }, []);

  const handleSuggestConnections = async () => {
    if (!selectedNodeId) return;
    setSuggestLoading(true);
    setSuggestions([]);
    setAcceptedIds(new Set());
    setDismissedIds(new Set());
    try {
      const result = await suggestConnections(selectedNodeId);
      setSuggestions(result);
      if (result.length === 0) {
        toast({ title: 'No suggestions', description: 'AI found no new connections to suggest for this node.' });
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to get AI suggestions. Check your Gemini API key.', variant: 'destructive' });
    } finally {
      setSuggestLoading(false);
    }
  };

  const handleAccept = async (suggestion: ConnectionSuggestion, index: number) => {
    try {
      await acceptConnection(selectedNodeId!, suggestion);
      setAcceptedIds((prev) => new Set(prev).add(index));
      toast({ title: 'Connection added', description: `${suggestion.sourceNodeTitle} → ${suggestion.targetNodeTitle}` });
      fetchNodes(); // refresh graph
    } catch {
      toast({ title: 'Error', description: 'Failed to add connection.', variant: 'destructive' });
    }
  };

  const handleDismiss = (index: number) => {
    setDismissedIds((prev) => new Set(prev).add(index));
  };

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

      {/* Suggest Connections Panel */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-400" />
              <h3 className="font-semibold text-white">AI Connection Suggestions</h3>
            </div>
          </div>

          <p className="text-sm text-slate-400">
            Select a node and let AI suggest how it connects to your other knowledge.
          </p>

          <div className="flex items-center gap-3">
            <select
              className="flex-1 bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              value={selectedNodeId ?? ''}
              onChange={(e) => {
                setSelectedNodeId(e.target.value || null);
                setSuggestions([]);
                setAcceptedIds(new Set());
                setDismissedIds(new Set());
              }}
            >
              <option value="">Choose a node...</option>
              {nodes.map((node) => (
                <option key={node.id} value={node.id}>
                  {node.title} ({node.nodeType})
                </option>
              ))}
            </select>
            <Button
              onClick={handleSuggestConnections}
              disabled={!selectedNodeId || suggestLoading || nodes.length < 2}
              className="bg-violet-600 hover:bg-violet-700"
            >
              {suggestLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              Suggest
            </Button>
          </div>

          {nodes.length < 2 && nodes.length > 0 && (
            <p className="text-xs text-slate-500">Add at least 2 nodes to get suggestions.</p>
          )}

          {/* Suggestions list */}
          {suggestions.length > 0 && (
            <div className="space-y-3 pt-2">
              {suggestions.map((suggestion, i) => {
                const accepted = acceptedIds.has(i);
                const dismissed = dismissedIds.has(i);
                if (dismissed) return null;

                return (
                  <div
                    key={i}
                    className={`flex items-start justify-between gap-3 rounded-lg p-3 border ${
                      accepted
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-slate-800/50 border-slate-700'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-white truncate">
                          {suggestion.sourceNodeTitle}
                        </span>
                        <ArrowRight className="h-3 w-3 text-slate-500 flex-shrink-0" />
                        <span className="font-medium text-white truncate">
                          {suggestion.targetNodeTitle}
                        </span>
                        <Badge variant="outline" className="text-xs border-violet-500/40 text-violet-300 flex-shrink-0">
                          {suggestion.relationshipType}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{suggestion.reasoning}</p>
                    </div>

                    {!accepted && (
                      <div className="flex gap-1 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-green-400 hover:bg-green-500/20"
                          onClick={() => handleAccept(suggestion, i)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-slate-500 hover:bg-slate-700"
                          onClick={() => handleDismiss(i)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    {accepted && (
                      <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

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
