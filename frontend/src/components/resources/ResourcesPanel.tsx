import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Link2, Trash2, Plus, ExternalLink, Check } from 'lucide-react';
import { Resource, resourceTypes } from '@/types/resource';
import {
  getTopicResources,
  createResource,
  toggleResourceComplete,
  deleteResource,
} from '@/services/resourcesApi';
import { useToast } from '@/hooks/use-toast';

interface ResourcesPanelProps {
  topicId: string;
}

export function ResourcesPanel({ topicId }: ResourcesPanelProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState<Resource['type']>('article');
  const [description, setDescription] = useState('');

  const { toast } = useToast();

  useEffect(() => {
    fetchResources();
  }, [topicId]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const data = await getTopicResources(topicId);
      setResources(data.data || []);
    } catch (error) {
      console.error('Failed to load resources:', error);
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddResource = async () => {
    if (!title.trim() || !url.trim()) {
      toast({
        title: 'Missing fields',
        description: 'Please enter a title and URL.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createResource({
        topicId,
        title: title.trim(),
        url: url.trim(),
        type,
        description: description.trim() || undefined,
      });
      setTitle('');
      setUrl('');
      setDescription('');
      setAdding(false);
      fetchResources();
      toast({
        title: 'Resource added',
        description: 'Your resource has been saved.',
      });
    } catch (error) {
      console.error('Failed to create resource:', error);
      toast({
        title: 'Failed to add resource',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleToggleComplete = async (resourceId: string) => {
    try {
      await toggleResourceComplete(resourceId);
      setResources(prev =>
        prev.map(r =>
          r.id === resourceId ? { ...r, completed: !r.completed } : r
        )
      );
    } catch (error) {
      console.error('Failed to toggle resource:', error);
    }
  };

  const handleDelete = async (resourceId: string) => {
    try {
      await deleteResource(resourceId);
      setResources(prev => prev.filter(r => r.id !== resourceId));
      setDeletingId(null);
      toast({
        title: 'Resource deleted',
        description: 'The resource has been removed.',
      });
    } catch (error) {
      console.error('Failed to delete resource:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-orange-500 mr-2" />
        <span className="text-muted-foreground">Loading resources...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link2 className="h-5 w-5 text-orange-500" />
          <h3 className="font-semibold">Resources</h3>
          <Badge variant="secondary">{resources.length}</Badge>
        </div>
        <Button size="sm" onClick={() => setAdding(!adding)}>
          {adding ? (
            <>Cancel</>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-1" />
              Add Resource
            </>
          )}
        </Button>
      </div>

      {/* Add Resource Form */}
      {adding && (
        <Card className="p-4 space-y-3">
          <Input
            placeholder="Resource title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            placeholder="https://..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Select value={type} onValueChange={(v) => setType(v as Resource['type'])}>
            <SelectTrigger>
              <SelectValue placeholder="Resource type" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(resourceTypes).map(([key, { label, icon }]) => (
                <SelectItem key={key} value={key}>
                  {icon} {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Textarea
            placeholder="Description (optional)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
          <Button onClick={handleAddResource} className="w-full bg-orange-500 hover:bg-orange-600">
            <Plus className="h-4 w-4 mr-1" />
            Add Resource
          </Button>
        </Card>
      )}

      {/* Resources List */}
      {resources.length === 0 ? (
        <div className="text-center py-8">
          <Link2 className="h-12 w-12 mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500">No resources yet</p>
          <p className="text-sm text-muted-foreground">
            Add articles, videos, and other resources to this topic
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {resources.map((resource) => {
            const typeInfo = resourceTypes[resource.type];
            return (
              <Card
                key={resource.id}
                className={`p-3 transition-all ${
                  resource.completed
                    ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/30'
                    : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{typeInfo.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`font-medium hover:underline flex items-center gap-1 ${
                          resource.completed ? 'text-green-700 dark:text-green-300 line-through' : ''
                        }`}
                      >
                        {resource.title}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      {resource.completed && (
                        <Check className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    {resource.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {resource.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {typeInfo.label}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleToggleComplete(resource.id)}
                      title={resource.completed ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      <Check className={`h-4 w-4 ${resource.completed ? 'text-green-600' : ''}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive"
                      onClick={() => setDeletingId(resource.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
