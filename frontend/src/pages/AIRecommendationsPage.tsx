import AIRecommendations from '../components/AIRecommendations';
import { Sparkles } from 'lucide-react';

const AIRecommendationsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-violet-400" />
          AI Recommendations
        </h1>
        <p className="text-slate-400 mt-1">
          Personalized learning paths, roadmaps, and next steps powered by AI analysis of your progress.
        </p>
      </div>

      <AIRecommendations />
    </div>
  );
};

export default AIRecommendationsPage;
