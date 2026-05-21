import { useState, useEffect } from 'react';
import { QuestCard } from './QuestCard';
import { DAILY_QUESTS, WEEKLY_QUESTS } from '@/types/quest';
import { getUserQuests, getQuestProgress, claimQuestReward } from '@/services/questsApi';
import { Loader2, Sword, Calendar, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type QuestWithProgress = typeof DAILY_QUESTS[number] & {
  id: string;
  progress?: number;
  completed?: boolean;
};

export function DailyQuestsPanel() {
  const [dailyQuests, setDailyQuests] = useState<QuestWithProgress[]>([]);
  const [weeklyQuests, setWeeklyQuests] = useState<QuestWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    const fetchQuests = async () => {
      setLoading(true);
      try {
        const [questsData, progressData] = await Promise.all([
          getUserQuests(),
          getQuestProgress().catch(() => ({ data: null })),
        ]);

        const progress = progressData.data;

        // Build daily quests with progress
        const dailyWithProgress: QuestWithProgress[] = DAILY_QUESTS.map((quest, index) => {
          const userQuest = questsData.data?.find((uq: any) => uq.questId === `daily_${index}`);
          const questProgress = getQuestProgressValue(quest.requirement.type, progress);

          return {
            ...quest,
            id: `daily_${index}`,
            progress: questProgress,
            completed: userQuest?.completed || questProgress >= quest.requirement.value,
          };
        });

        // Build weekly quests with progress
        const weeklyWithProgress: QuestWithProgress[] = WEEKLY_QUESTS.map((quest, index) => {
          const userQuest = questsData.data?.find((uq: any) => uq.questId === `weekly_${index}`);
          const questProgress = getQuestProgressValue(quest.requirement.type, progress);

          return {
            ...quest,
            id: `weekly_${index}`,
            progress: questProgress,
            completed: userQuest?.completed || questProgress >= quest.requirement.value,
          };
        });

        setDailyQuests(dailyWithProgress);
        setWeeklyQuests(weeklyWithProgress);
      } catch (error) {
        console.error('Failed to load quests:', error);
        // Use mock data for demo
        setDailyQuests(DAILY_QUESTS.map((q, i) => ({ ...q, id: `daily_${i}`, progress: 0 })));
        setWeeklyQuests(WEEKLY_QUESTS.map((q, i) => ({ ...q, id: `weekly_${i}`, progress: 0 })));
      } finally {
        setLoading(false);
      }
    };

    fetchQuests();
  }, []);

  const getQuestProgressValue = (type: string, progress: any): number => {
    if (!progress) return 0;
    switch (type) {
      case 'sessions_completed': return progress.sessionsCompleted || 0;
      case 'topics_studied': return (progress.topicsStudied || []).length;
      case 'minutes_practiced': return progress.minutesPracticed || 0;
      case 'reviews_completed': return progress.reviewsCompleted || 0;
      case 'notes_created': return progress.notesCreated || 0;
      case 'streak_days': return progress.streakDays || 0;
      default: return 0;
    }
  };

  const handleClaimReward = async (questId: string) => {
    setClaiming(questId);
    try {
      await claimQuestReward(questId);
      toast({
        title: 'Reward Claimed!',
        description: 'XP has been added to your profile.',
      });
      // Refresh quests
      setDailyQuests(prev => prev.map(q =>
        q.id === questId ? { ...q, completed: true } : q
      ));
      setWeeklyQuests(prev => prev.map(q =>
        q.id === questId ? { ...q, completed: true } : q
      ));
    } catch (error) {
      console.error('Failed to claim reward:', error);
      toast({
        title: 'Failed to Claim',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setClaiming(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-orange-500 mr-2" />
        <span className="text-muted-foreground">Loading quests...</span>
      </div>
    );
  }

  const dailyCompleted = dailyQuests.filter(q => q.completed).length;
  const weeklyCompleted = weeklyQuests.filter(q => q.completed).length;

  return (
    <div className="space-y-4">
      {/* Quest Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-900/30">
        <div className="flex items-center gap-3">
          <Sword className="h-6 w-6 text-blue-500" />
          <div>
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Daily Quests
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              {dailyCompleted} / {dailyQuests.length} completed
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-purple-500" />
          <div className="text-right">
            <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
              Weekly Quests
            </p>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              {weeklyCompleted} / {weeklyQuests.length} completed
            </p>
          </div>
        </div>
      </div>

      {/* Quest Tabs */}
      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="daily" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Daily
          </TabsTrigger>
          <TabsTrigger value="weekly" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Weekly
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="mt-4">
          {dailyQuests.length === 0 ? (
            <div className="text-center py-8">
              <Sword className="h-12 w-12 mx-auto text-slate-300 mb-4" />
              <p className="text-slate-600 dark:text-slate-400 font-medium">No daily quests available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dailyQuests.map((quest) => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  onClaim={() => handleClaimReward(quest.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="weekly" className="mt-4">
          {weeklyQuests.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-slate-300 mb-4" />
              <p className="text-slate-600 dark:text-slate-400 font-medium">No weekly quests available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {weeklyQuests.map((quest) => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  onClaim={() => handleClaimReward(quest.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
