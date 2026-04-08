import React, { useState } from 'react';
import { useTopics } from '@/hooks/useTopics';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash, BookOpen } from 'lucide-react';
import { Topic } from '@/types/topic';

export function TopicManager() {
  const { topics, handleCreateTopic, handleUpdateTopic, handleDeleteTopic, loading } = useTopics();
  const { toast } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#4f46e5',
    goalHours: 0
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      color: '#4f46e5',
      goalHours: 0
    });
    setSelectedTopic(null);
  };

  const handleOpenEditModal = (topic: Topic) => {
    setSelectedTopic(topic);
    setFormData({
      name: topic.name,
      description: topic.description || '',
      color: topic.color || '#4f46e5',
      goalHours: topic.goalHours || 0
    });
    setIsEditModalOpen(true);
  };

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
      
      await handleCreateTopic({
        name: formData.name.trim(),
        description: formData.description.trim(),
        color: formData.color,
        goalHours: Number(formData.goalHours),
        userId
      });
      
      toast({
        title: "Success",
        description: "Topic created successfully",
      });
      
      // Close the modal and reset form
      setIsCreateModalOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create topic",
        variant: "destructive"
      });
    }
  };

  const handleUpdateExistingTopic = async () => {
    if (!selectedTopic || !formData.name.trim()) {
      toast({
        title: "Error",
        description: "Topic name is required",
        variant: "destructive"
      });
      return;
    }

    try {
      await handleUpdateTopic(selectedTopic.id, {
        name: formData.name.trim(),
        description: formData.description.trim(),
        color: formData.color,
        goalHours: Number(formData.goalHours)
      });
      
      toast({
        title: "Success",
        description: "Topic updated successfully",
      });
      
      // Close the modal and reset form
      setIsEditModalOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update topic",
        variant: "destructive"
      });
    }
  };

  const handleDeleteExistingTopic = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this topic? All associated sessions will be orphaned.")) {
      try {
        await handleDeleteTopic(id);
        
        toast({
          title: "Success",
          description: "Topic deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete topic",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Topics</h2>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Topic
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : topics.length === 0 ? (
        <div className="text-center p-8 border rounded-lg bg-gray-50">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium">No topics yet</h3>
          <p className="mt-1 text-gray-500">Get started by creating a new topic.</p>
          <div className="mt-6">
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Topic
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((topic) => (
            <Card key={topic.id}>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: topic.color || '#4f46e5' }}
                  />
                  <CardTitle>{topic.name}</CardTitle>
                </div>
                <CardDescription>
                  {topic.completedHours || 0} / {topic.goalHours || 0} hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 line-clamp-3">
                  {topic.description || 'No description'}
                </p>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleOpenEditModal(topic)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDeleteExistingTopic(topic.id)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {/* Create Topic Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Topic</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Topic Name
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter topic name"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter topic description"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="color" className="text-sm font-medium">
                Color
              </label>
              <div className="flex items-center space-x-2">
                <Input
                  id="color"
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
              <label htmlFor="goalHours" className="text-sm font-medium">
                Goal Hours
              </label>
              <Input
                id="goalHours"
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
                onClick={() => {
                  setIsCreateModalOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateNewTopic}>
                Create Topic
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Edit Topic Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Topic</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="edit-name" className="text-sm font-medium">
                Topic Name
              </label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter topic name"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit-description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter topic description"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit-color" className="text-sm font-medium">
                Color
              </label>
              <div className="flex items-center space-x-2">
                <Input
                  id="edit-color"
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
              <label htmlFor="edit-goalHours" className="text-sm font-medium">
                Goal Hours
              </label>
              <Input
                id="edit-goalHours"
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
                onClick={() => {
                  setIsEditModalOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateExistingTopic}>
                Update Topic
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}