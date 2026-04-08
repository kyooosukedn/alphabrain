import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Slider } from './ui/slider';
import { GraphNode } from '../types/knowledge';
import { saveKnowledgeNode } from '../services/knowledgeGraphService';

interface AddKnowledgeNodeFormProps {
  onNodeAdded: (node: GraphNode) => void;
  onCancel: () => void;
}

const NODE_COLORS: Record<string, string> = {
  SKILL: '#4CAF50',
  CONCEPT: '#3F51B5',
  TOOL: '#FFC107',
  RESOURCE: '#FF9800',
};

const typeOptions = [
  { value: 'SKILL', label: 'Skill' },
  { value: 'CONCEPT', label: 'Concept' },
  { value: 'TOOL', label: 'Tool' },
  { value: 'RESOURCE', label: 'Resource' },
];

const AddKnowledgeNodeForm: React.FC<AddKnowledgeNodeFormProps> = ({ onNodeAdded, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [nodeType, setNodeType] = useState('SKILL');
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Send a KnowledgeNode shape to the backend
      const savedNode = await saveKnowledgeNode({
        title: title.trim(),
        description: description.trim(),
        nodeType,
        difficultyLevel: 1,
        estimatedTimeToLearn: 0,
        progress,
        masteryLevel: 0,
        completed: false,
      });

      // Convert the saved node to GraphNode for the visualization
      const graphNode: GraphNode = {
        id: savedNode.id!,
        title: savedNode.title,
        type: savedNode.nodeType,
        progress: savedNode.progress ?? 0,
        color: NODE_COLORS[savedNode.nodeType] || '#999',
        description: savedNode.description,
      };

      onNodeAdded(graphNode);
    } catch (err) {
      console.error('Error adding knowledge node:', err);
      setError('Failed to add node. Check that the backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-lg bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white">Add Knowledge Node</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-slate-300">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., JavaScript, Machine Learning, Docker"
              className="bg-slate-800 border-slate-700 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-300">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this topic..."
              className="bg-slate-800 border-slate-700 text-white"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Node Type</Label>
            <RadioGroup value={nodeType} onValueChange={setNodeType} className="flex gap-4 py-2">
              {typeOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="text-slate-300">{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="progress" className="text-slate-300">
              Current Progress: {progress}%
            </Label>
            <Slider
              id="progress"
              value={[progress]}
              onValueChange={(values) => setProgress(values[0])}
              max={100}
              step={5}
              className="py-4"
            />
          </div>

          {error && (
            <div className="text-sm font-medium text-red-400">{error}</div>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Node'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AddKnowledgeNodeForm;
