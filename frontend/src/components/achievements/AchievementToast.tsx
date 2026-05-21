import { useEffect, useState } from 'react';
import { X, Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AchievementToastProps {
  title: string;
  description: string;
  icon: string;
  xp?: number;
  duration?: number;
  onClose?: () => void;
}

export function AchievementToast({
  title,
  description,
  icon,
  xp = 0,
  duration = 5000,
  onClose
}: AchievementToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <Card className="mb-4 bg-gradient-to-r from-orange-100 to-amber-50 dark:from-orange-950/40 dark:to-amber-950/20 border-orange-300 dark:border-orange-900/50 shadow-lg animate-in slide-in-from-bottom">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="text-4xl animate-bounce">
            {icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-semibold text-orange-900 dark:text-orange-100 flex items-center gap-1">
                <Trophy className="h-4 w-4" />
                Achievement Unlocked!
              </h4>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-orange-600 hover:bg-orange-200 dark:text-orange-400 dark:hover:bg-orange-950"
                onClick={() => {
                  setVisible(false);
                  onClose?.();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="font-bold text-orange-800 dark:text-orange-200">{title}</p>
            <p className="text-sm text-orange-700 dark:text-orange-300">{description}</p>
            {xp > 0 && (
              <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 mt-1">
                +{xp} XP
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Hook to show achievement unlock toasts
export function useAchievementToast() {
  const [toast, setToast] = useState<AchievementToastProps | null>(null);

  const showAchievement = (props: Omit<AchievementToastProps, 'duration'>) => {
    setToast({ ...props, duration: 5000 });
  };

  const AchievementToastComponent = toast ? (
    <AchievementToast
      {...toast}
      onClose={() => setToast(null)}
    />
  ) : null;

  return { showAchievement, AchievementToastComponent };
};
