import { AchievementsPanel } from '../components/achievements/AchievementsPanel';

export default function AchievementsPage() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Achievements</h1>
        <p className="text-muted-foreground">Track your learning milestones and earn rewards</p>
      </div>
      <AchievementsPanel />
    </div>
  );
}
