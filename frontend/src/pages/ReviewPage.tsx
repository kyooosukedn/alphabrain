import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewApi, ReviewCard } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Brain,
  CheckCircle2,
  Clock,
  Loader2,
  RotateCcw,
  Sparkles,
  Trophy,
  Zap,
} from 'lucide-react';

// ─── Quality rating buttons ───

const qualityOptions = [
  { value: 0, label: 'Again', color: 'bg-red-600 hover:bg-red-700', desc: 'Total blackout' },
  { value: 2, label: 'Hard', color: 'bg-orange-600 hover:bg-orange-700', desc: 'Struggled a lot' },
  { value: 3, label: 'Good', color: 'bg-blue-600 hover:bg-blue-700', desc: 'Correct with effort' },
  { value: 5, label: 'Easy', color: 'bg-green-600 hover:bg-green-700', desc: 'No hesitation' },
];

// ─── Difficulty badge ───

function DifficultyBadge({ level }: { level: number }) {
  const labels = ['', 'Beginner', 'Easy', 'Medium', 'Hard', 'Expert'];
  const colors = ['', 'text-green-400', 'text-green-400', 'text-yellow-400', 'text-orange-400', 'text-red-400'];
  return (
    <span className={`text-xs ${colors[level] || 'text-slate-400'}`}>
      {labels[level] || `Level ${level}`}
    </span>
  );
}

export default function ReviewPage() {
  const queryClient = useQueryClient();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [reviewed, setReviewed] = useState(0);

  // Fetch due cards
  const { data: dueCards, isLoading, refetch } = useQuery({
    queryKey: ['reviewDue'],
    queryFn: async () => (await reviewApi.getDueCards()).data,
  });

  // Fetch stats
  const { data: stats } = useQuery({
    queryKey: ['reviewStats'],
    queryFn: async () => (await reviewApi.getStats()).data,
  });

  // Enable all nodes
  const enableMutation = useMutation({
    mutationFn: () => reviewApi.enableAll(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviewDue'] });
      queryClient.invalidateQueries({ queryKey: ['reviewStats'] });
    },
  });

  // Submit review
  const submitMutation = useMutation({
    mutationFn: ({ cardId, quality }: { cardId: string; quality: number }) =>
      reviewApi.submitReview(cardId, quality),
    onSuccess: () => {
      setReviewed((r) => r + 1);
      setShowAnswer(false);

      if (dueCards && currentIndex + 1 >= dueCards.length) {
        setSessionComplete(true);
      } else {
        setCurrentIndex((i) => i + 1);
      }

      queryClient.invalidateQueries({ queryKey: ['reviewStats'] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
        <p className="text-slate-400">Loading review cards...</p>
      </div>
    );
  }

  const totalDue = dueCards?.length ?? 0;

  // ─── Session Complete ───
  if (sessionComplete) {
    return (
      <div className="max-w-lg mx-auto p-8">
        <Card className="bg-slate-900 border-slate-800 text-center">
          <CardContent className="pt-8 pb-8 space-y-4">
            <Trophy className="h-16 w-16 text-yellow-400 mx-auto" />
            <h2 className="text-2xl font-bold text-white">Session Complete!</h2>
            <p className="text-slate-400">
              You reviewed {reviewed} card{reviewed !== 1 ? 's' : ''} this session.
            </p>
            {stats && (
              <p className="text-sm text-slate-500">
                Retention rate: {stats.retentionRate}% across {stats.totalReviews} total reviews
              </p>
            )}
            <div className="flex gap-3 justify-center pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setSessionComplete(false);
                  setCurrentIndex(0);
                  setReviewed(0);
                  refetch();
                }}
              >
                <RotateCcw className="h-4 w-4 mr-2" /> Review More
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── No cards due ───
  if (totalDue === 0) {
    return (
      <div className="max-w-lg mx-auto p-8">
        <Card className="bg-slate-900 border-slate-800 text-center">
          <CardContent className="pt-8 pb-8 space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-400 mx-auto" />
            <h2 className="text-2xl font-bold text-white">All caught up!</h2>
            <p className="text-slate-400">
              No cards due for review right now. Come back later or add more knowledge nodes.
            </p>
            {stats && stats.totalCards === 0 && (
              <div className="space-y-3 pt-2">
                <p className="text-sm text-slate-500">
                  You haven't enabled spaced repetition for any knowledge nodes yet.
                </p>
                <Button
                  onClick={() => enableMutation.mutate()}
                  disabled={enableMutation.isPending}
                >
                  {enableMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4 mr-2" />
                  )}
                  Enable for All Nodes
                </Button>
                {enableMutation.data && (
                  <p className="text-sm text-green-400">
                    {enableMutation.data.data.message}
                  </p>
                )}
              </div>
            )}
            {stats && (
              <div className="grid grid-cols-3 gap-4 pt-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-white">{stats.totalCards}</p>
                  <p className="text-xs text-slate-500">Total Cards</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.totalReviews}</p>
                  <p className="text-xs text-slate-500">Reviews Done</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.retentionRate}%</p>
                  <p className="text-xs text-slate-500">Retention</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── Review session in progress ───
  const card: ReviewCard = dueCards![currentIndex];
  const progressPct = totalDue > 0 ? Math.round((currentIndex / totalDue) * 100) : 0;

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Brain className="h-6 w-6 text-violet-400" />
            Review Session
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Card {currentIndex + 1} of {totalDue}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400">{reviewed} reviewed</p>
        </div>
      </div>

      {/* Progress bar */}
      <Progress value={progressPct} className="h-2" />

      {/* Card */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-white">{card.nodeTitle}</CardTitle>
            <DifficultyBadge level={card.nodeDifficulty} />
          </div>
          {card.nodeCategory && (
            <p className="text-sm text-slate-500">{card.nodeCategory}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Prompt */}
          <div className="bg-slate-800/50 rounded-lg p-6 text-center">
            <Sparkles className="h-8 w-8 text-violet-400 mx-auto mb-3" />
            <p className="text-lg text-slate-200">
              Can you recall what you know about <span className="font-semibold text-violet-300">{card.nodeTitle}</span>?
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Think about the key concepts, how it connects to other topics, and any important details.
            </p>
          </div>

          {/* Show answer / Rate */}
          {!showAnswer ? (
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={() => setShowAnswer(true)}
                className="bg-violet-600 hover:bg-violet-700"
              >
                Show Answer & Rate
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-slate-800/30 rounded-lg p-4">
                <p className="text-sm text-slate-300">
                  Rate how well you recalled this concept:
                </p>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {qualityOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => submitMutation.mutate({ cardId: card.id, quality: opt.value })}
                    disabled={submitMutation.isPending}
                    className={`${opt.color} text-white rounded-lg p-3 transition-colors disabled:opacity-50`}
                  >
                    <p className="font-semibold text-sm">{opt.label}</p>
                    <p className="text-[10px] opacity-75 mt-1">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Card meta */}
          <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-800">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Interval: {card.interval} day{card.interval !== 1 ? 's' : ''}
            </span>
            <span>Reviews: {card.totalReviews}</span>
            <span>Ease: {card.easeFactor.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
