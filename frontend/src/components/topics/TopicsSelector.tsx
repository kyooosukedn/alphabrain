// src/components/topics/TopicsSelector.tsx
import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTopics } from '@/hooks/useTopics';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

interface TopicSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function TopicSelector({ value, onChange }: TopicSelectorProps) {
  const { topics, handleCreateTopic, loading } = useTopics();
  const { toast } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#4f46e5',
    goalHours: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateNewTopic = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Topic name is required",
        variant: "destructive"
      });
      return;
    }

    try {
      // Get user ID from localStorage or use a default
      const userId = localStorage.getItem('userId') || "current-user";
      
      const newTopic = await handleCreateTopic({
        name: formData.name.trim(),
        description: formData.description.trim(),
        color: formData.color,
        goalHours: Number(formData.goalHours),
        userId
      });
      
      // Select the newly created topic
      onChange(newTopic.id);
      
      toast({
        title: "Success",
        description: "Topic created successfully",
      });
      
      // Close the modal and reset form
      setIsCreateModalOpen(false);
      setFormData({
        name: '',
        description: '',
        color: '#4f46e5',
        goalHours: 0
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create topic",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Topic</label>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsCreateModalOpen(true)}
          type="button"
        >
          <Plus className="h-4 w-4 mr-1" />
          New Topic
        </Button>
      </div>
      
      <Select
        value={value}
        onValueChange={onChange}
        disabled={loading}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a topic" />
        </SelectTrigger>
        <SelectContent>
          {topics.map((topic) => (
            <SelectItem key={topic.id} value={topic.id}>
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: topic.color || '#4f46e5' }}
                />
                {topic.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {/* Create Topic Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Topic</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="topicName" className="text-sm font-medium">
                Topic Name
              </label>
              <Input
                id="topicName"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter topic name"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="topicDescription" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="topicDescription"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter topic description"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="topicColor" className="text-sm font-medium">
                Color
              </label>
              <div className="flex items-center space-x-2">
                <Input
                  id="topicColor"
                  name="color"
                  type="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="w-12 h-10 p-1"
                />
                <div className="text-sm text-gray-500">
                  Choose a color for this topic
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="topicGoalHours" className="text-sm font-medium">
                Goal Hours
              </label>
              <Input
                id="topicGoalHours"
                name="goalHours"
                type="number"
                min="0"
                value={formData.goalHours}
                onChange={handleChange}
                placeholder="Enter target study hours"
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
                type="button"
              >
                Cancel
              </Button>
              <Button onClick={handleCreateNewTopic} type="button">
                Create Topic
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}