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
  Copy,
  ExternalLink,
  Loader2,
  Star,
  User,
} from 'lucide-react';
import { RoadmapService } from '../services/RoadmapService';
import { UserProgressService } from '../services/UserProgressService';
import { Roadmap, RoadmapItem, RoadmapRating } from '../types/Roadmap';
import { UserProgress, ItemProgress } from '../types/UserProgress';
import { useToast } from '@/hooks/use-toast';

function StarRating({ value, onChange, readonly = false }: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
}) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
        >
          <Star
            className={`h-5 w-5 ${star <= value ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`}
          />
        </button>
      ))}
    </div>
  );
}

const RoadmapDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState<RoadmapRating[]>([]);
  const [myRating, setMyRating] = useState<number>(0);
  const [myReview, setMyReview] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);
  const [cloning, setCloning] = useState(false);

  useEffect(() => {
    if (id) {
      loadRoadmapAndProgress();
      loadRatings();
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

  const loadRatings = async () => {
    try {
      const [ratingsData, myRatingData] = await Promise.all([
        RoadmapService.getRoadmapRatings(id!),
        RoadmapService.getMyRating(id!),
      ]);
      setRatings(ratingsData);
      if (myRatingData) {
        setMyRating(myRatingData.rating);
        setMyReview(myRatingData.review || '');
      }
    } catch {
      // ratings are optional
    }
  };

  const handleSubmitRating = async () => {
    if (myRating === 0) return;
    setSubmittingRating(true);
    try {
      await RoadmapService.rateRoadmap(id!, myRating, myReview || undefined);
      toast({ title: 'Rating submitted!' });
      loadRatings();
      // Refresh roadmap to get updated averageRating
      const updated = await RoadmapService.getRoadmap(id!);
      setRoadmap(updated);
    } catch (err: any) {
      toast({ title: 'Error', description: err?.response?.data?.error || 'Failed to submit rating', variant: 'destructive' });
    } finally {
      setSubmittingRating(false);
    }
  };

  const handleClone = async () => {
    setCloning(true);
    try {
      const cloned = await RoadmapService.cloneRoadmap(id!);
      toast({ title: 'Roadmap cloned!', description: `"${cloned.title}" added to your roadmaps.` });
      navigate(`/roadmap/${cloned.id}`);
    } catch (err: any) {
      toast({ title: 'Error', description: err?.response?.data?.error || 'Failed to clone', variant: 'destructive' });
    } finally {
      setCloning(false);
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
        <div className="flex flex-wrap gap-2 items-center">
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
          {roadmap.authorUsername && (
            <Badge
              variant="outline"
              className="text-slate-300 border-slate-700 flex items-center gap-1 cursor-pointer hover:border-violet-500/50"
              onClick={() => navigate(`/profile/${roadmap.authorUsername}`)}
            >
              <User className="w-3 h-3" />
              {roadmap.authorUsername}
            </Badge>
          )}
          {(roadmap.ratingCount ?? 0) > 0 && (
            <Badge variant="outline" className="text-yellow-400 border-yellow-500/30 flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400" />
              {roadmap.averageRating?.toFixed(1)} ({roadmap.ratingCount})
            </Badge>
          )}
          {(roadmap.cloneCount ?? 0) > 0 && (
            <Badge variant="outline" className="text-slate-400 border-slate-700 flex items-center gap-1">
              <Copy className="w-3 h-3" />
              {roadmap.cloneCount} clones
            </Badge>
          )}
        </div>

        {/* Clone button for public roadmaps */}
        {roadmap.isPublic && (
          <div className="mt-4">
            <Button
              onClick={handleClone}
              disabled={cloning}
              variant="outline"
              className="border-violet-500/30 text-violet-300 hover:bg-violet-500/20"
            >
              {cloning ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Copy className="h-4 w-4 mr-2" />
              )}
              Clone to My Roadmaps
            </Button>
          </div>
        )}
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
      {/* Ratings & Reviews */}
      {roadmap.isPublic && (
        <Card className="bg-slate-900 border-slate-800 mt-6">
          <CardContent className="p-6 space-y-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400" />
              Ratings & Reviews
            </h2>

            {/* Submit rating */}
            <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
              <p className="text-sm text-slate-300">Rate this roadmap</p>
              <StarRating value={myRating} onChange={setMyRating} />
              <textarea
                placeholder="Write a review (optional)..."
                value={myReview}
                onChange={(e) => setMyReview(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                rows={2}
              />
              <Button
                size="sm"
                onClick={handleSubmitRating}
                disabled={myRating === 0 || submittingRating}
                className="bg-violet-600 hover:bg-violet-700"
              >
                {submittingRating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                {myRating > 0 ? 'Submit Rating' : 'Select a rating'}
              </Button>
            </div>

            {/* Reviews list */}
            {ratings.length > 0 ? (
              <div className="space-y-3">
                {ratings.map((r) => (
                  <div key={r.id} className="border-t border-slate-800 pt-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-sm font-medium text-slate-300 cursor-pointer hover:text-violet-400"
                          onClick={() => navigate(`/profile/${r.username}`)}
                        >
                          {r.username}
                        </span>
                        <StarRating value={r.rating} readonly />
                      </div>
                      <span className="text-xs text-slate-500">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {r.review && (
                      <p className="text-sm text-slate-400 mt-1">{r.review}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No reviews yet. Be the first!</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RoadmapDetail;
