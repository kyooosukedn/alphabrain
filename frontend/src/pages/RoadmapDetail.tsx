import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { RoadmapService } from '../services/RoadmapService';
import { UserProgressService } from '../services/UserProgressService';
import { Roadmap, RoadmapItem } from '../types/Roadmap';
import { UserProgress, ItemProgress } from '../types/UserProgress';

const RoadmapDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadRoadmapAndProgress();
    }
  }, [id]);

  const loadRoadmapAndProgress = async () => {
    try {
      const [roadmapData, progressData] = await Promise.all([
        RoadmapService.getRoadmap(id!),
        UserProgressService.getRoadmapProgress(id!),
      ]);
      setRoadmap(roadmapData);
      setProgress(progressData);
    } catch (error) {
      console.error('Error loading roadmap:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = async (item: RoadmapItem) => {
    if (!progress) {
      try {
        const newProgress = await UserProgressService.createProgress(id!);
        setProgress(newProgress);
      } catch (error) {
        console.error('Error creating progress:', error);
        return;
      }
    }

    const itemProgress = progress!.itemProgress.find((p) => p.itemId === item.id);
    const newPercentage = itemProgress?.progressPercentage === 100 ? 0 : 100;

    try {
      const updatedProgress = await UserProgressService.updateItemProgress(
        progress!.id,
        item.id,
        newPercentage
      );
      setProgress(updatedProgress);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const getItemProgress = (itemId: string): ItemProgress | undefined => {
    return progress?.itemProgress.find((p) => p.itemId === itemId);
  };

  const difficultyColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'intermediate':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'advanced':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <p className="text-slate-400">Roadmap not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold text-white">{roadmap.title}</h1>
      </div>

      {/* Description + Metadata */}
      <div className="mb-6">
        <p className="text-slate-300 mb-3">{roadmap.description}</p>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-violet-400 border-violet-500/30">
            {roadmap.category}
          </Badge>
          <Badge className={difficultyColor(roadmap.difficultyLevel)}>
            {roadmap.difficultyLevel}
          </Badge>
          <Badge variant="outline" className="text-slate-400 border-slate-700 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {roadmap.estimatedTimeToComplete} mins
          </Badge>
        </div>
      </div>

      {/* Progress Card */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-white">Progress</h2>
            <span className="text-sm text-violet-400 font-medium">
              {progress?.progressPercentage || 0}%
            </span>
          </div>
          <Progress
            value={progress?.progressPercentage || 0}
            className="h-2 mb-6"
          />

          {/* Items List */}
          <div className="divide-y divide-slate-800">
            {roadmap.items.map((item) => {
              const itemProg = getItemProgress(item.id);
              const isCompleted = itemProg?.progressPercentage === 100;

              return (
                <div
                  key={item.id}
                  className="flex items-start gap-3 py-3 group"
                >
                  {/* Checkbox button */}
                  <button
                    onClick={() => handleItemClick(item)}
                    className="mt-0.5 shrink-0"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-600 group-hover:text-slate-400 transition-colors" />
                    )}
                  </button>

                  {/* Title + Description */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-medium ${
                        isCompleted
                          ? 'text-slate-500 line-through'
                          : 'text-white'
                      }`}
                    >
                      {item.title}
                    </p>
                    {item.description && (
                      <p className="text-sm text-slate-400 mt-0.5">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Resource links */}
                  {item.resources.length > 0 && (
                    <div className="flex gap-1 shrink-0">
                      {item.resources.map((resource, i) => (
                        <a
                          key={i}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={`${resource.title} (${resource.estimatedTimeToComplete} mins)`}
                          className="p-1.5 rounded-md text-slate-500 hover:text-violet-400 hover:bg-violet-500/10 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoadmapDetail;
