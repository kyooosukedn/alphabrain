import { useState, useEffect } from 'react';
import { AchievementBadge } from './AchievementBadge';
import { ACHIEVEMENTS } from '@/types/achievement';
import { getUserAchievements, getAchievementStats } from '@/services/achievementsApi';
import { Loader2, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function AchievementsPanel() {
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState<{ unlockedCount: number; totalXP: number; currentStreak: number } | null>(null);
  const [loading, setLoading] = useState(true);

  const { toast } = useToast();

  useEffect(() => {
    const fetchAchievements = async () => {
      setLoading(true);
      try {
        const [achievementsData, statsData] = await Promise.all([
          getUserAchievements(),
          getAchievementStats(),
        ]);

        // Get unlocked achievement IDs
        const unlocked = new Set(
          achievementsData.data?.map((ua: any) => ua.achievementId) || []
        );
        setUnlockedIds(unlocked);
        setStats(statsData.data);
      } catch (error) {
        console.error('Failed to load achievements:', error);
        // Use mock data for demo
        setUnlockedIds(new Set());
        setStats({ unlockedCount: 0, totalXP: 0, currentStreak: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-orange-500 mr-2" />
        <span className="text-muted-foreground">Loading achievements...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats Header */}
      {stats && (
        <div className="flex items-center justify-between bg-gradient-to-r from-orange-50 to-transparent dark:from-orange-950/20 p-4 rounded-lg border border-orange-200 dark:border-orange-900/30">
          <div className="flex items-center gap-3">
            <Trophy className="h-6 w-6 text-orange-500" />
            <div>
              <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                {stats.unlockedCount} / {ACHIEVEMENTS.length} Unlocked
              </p>
              <p className="text-xs text-orange-600 dark:text-orange-400">
                {stats.totalXP} XP Earned
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Achievement Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {ACHIEVEMENTS.map((achievement, index) => {
          const unlocked = unlockedIds.has(`achievement_${index}`) || unlockedIds.has(achievement.title.replace(/\s+/g, '_').toLowerCase());

          return (
            <AchievementBadge
              key={index}
              icon={achievement.icon}
              title={achievement.title}
              description={achievement.description}
              unlocked={unlocked}
              badgeColor={achievement.reward?.badgeColor}
              showProgress={true}
            />
          );
        })}
      </div>

      {stats && stats.unlockedCount === 0 && (
        <div className="text-center py-8">
          <Trophy className="h-12 w-12 mx-auto text-orange-300 mb-4" />
          <p className="text-orange-700 dark:text-orange-300 font-medium mb-2">
            No achievements yet
          </p>
          <p className="text-sm text-muted-foreground">
            Complete sessions and maintain streaks to unlock achievements!
          </p>
        </div>
      )}
    </div>
  );
}
