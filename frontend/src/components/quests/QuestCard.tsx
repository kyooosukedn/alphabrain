import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Lock, CheckCircle2, Crown } from 'lucide-react';
import { Quest } from '@/types/quest';

interface QuestCardProps {
  quest: Quest;
  onClaim?: () => void;
}

export function QuestCard({ quest, onClaim }: QuestCardProps) {
  const progress = quest.progress || 0;
  const required = quest.requirement.value;
  const percent = Math.min(100, (progress / required) * 100);
  const isCompleted = quest.completed || progress >= required;

  return (
    <Card className={`transition-all duration-300 ${
      isCompleted
        ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/10 border-green-200 dark:border-green-900/30'
        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`text-3xl flex-shrink-0 ${isCompleted ? '' : 'opacity-70'}`}>
            {isCompleted ? '✨' : quest.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className={`font-semibold text-sm ${isCompleted ? 'text-green-900 dark:text-green-100' : 'text-slate-900 dark:text-slate-100'}`}>
                {quest.title}
              </h4>
              {quest.category === 'daily' && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                  Daily
                </span>
              )}
              {quest.category === 'weekly' && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                  Weekly
                </span>
              )}
            </div>

            <p className={`text-xs mb-3 ${isCompleted ? 'text-green-700 dark:text-green-300' : 'text-slate-500'}`}>
              {quest.description}
            </p>

            {/* Progress Bar */}
            {!isCompleted && (
              <div className="space-y-1">
                <Progress value={percent} className="h-2" />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{progress} / {required}</span>
                  <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                    <Crown className="h-3 w-3" />
                    +{quest.reward.xp} XP
                  </span>
                </div>
              </div>
            )}

            {/* Completed state */}
            {isCompleted && !quest.completed && (
              <Button
                onClick={onClaim}
                size="sm"
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Claim Reward (+{quest.reward.xp} XP)
              </Button>
            )}

            {isCompleted && quest.completed && (
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-medium">
                <CheckCircle2 className="h-4 w-4" />
                Completed!
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
