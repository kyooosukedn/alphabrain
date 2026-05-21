import { DailyQuestsPanel } from '../components/quests/DailyQuestsPanel';

export default function QuestsPage() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Quests</h1>
        <p className="text-muted-foreground">Complete daily and weekly quests to earn rewards</p>
      </div>
      <DailyQuestsPanel />
    </div>
  );
}
