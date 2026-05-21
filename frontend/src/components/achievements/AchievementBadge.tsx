import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock } from 'lucide-react';

interface AchievementBadgeProps {
  icon: string;
  title: string;
  description: string;
  unlocked?: boolean;
  badgeColor?: string;
  progress?: number;
  required?: number;
  showProgress?: boolean;
}

export function AchievementBadge({
  icon,
  title,
  description,
  unlocked = false,
  badgeColor = '#6b7280',
  progress = 0,
  required = 1,
  showProgress = false
}: AchievementBadgeProps) {
  return (
    <Card className={`transition-all duration-300 ${
      unlocked
        ? 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/10 border-orange-200 dark:border-orange-900/30'
        : 'bg-slate-50 dark:bg-slate-900 opacity-60'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={`text-3xl flex-shrink-0 ${
              unlocked ? 'grayscale-0' : 'grayscale opacity-50'
            }`}
          >
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className={`font-semibold text-sm ${unlocked ? 'text-orange-900 dark:text-orange-100' : 'text-slate-700 dark:text-slate-300'}`}>
                {title}
              </h4>
              {!unlocked && (
                <Lock className="h-3 w-3 text-slate-400 flex-shrink-0" />
              )}
            </div>
            <p className={`text-xs mt-1 ${unlocked ? 'text-orange-700 dark:text-orange-300' : 'text-slate-500'}`}>
              {description}
            </p>
            {showProgress && !unlocked && (
              <div className="mt-2">
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full bg-orange-500 transition-all"
                    style={{ width: `${Math.min(100, (progress / required) * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {progress} / {required}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
