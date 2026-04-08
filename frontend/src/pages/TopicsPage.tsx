import { TopicManager } from '@/components/topics/TopicManager';

export default function TopicsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Topics</h1>
        <p className="text-slate-400 mt-1">Manage your learning subjects and track your progress.</p>
      </div>
      <TopicManager />
    </div>
  );
}
