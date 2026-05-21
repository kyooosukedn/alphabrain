export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  action?: string;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to AlphaBrain!',
    description: 'Your AI-powered learning companion. Track study sessions, visualize knowledge connections, and master any topic with spaced repetition.',
    icon: '🧠',
  },
  {
    id: 'schedule',
    title: 'Plan Your Learning',
    description: 'Create study sessions for different topics. Set duration, track progress, and maintain consistency with smart scheduling.',
    icon: '📅',
    action: 'Create your first session',
  },
  {
    id: 'topics',
    title: 'Explore Topics',
    description: 'Organize your learning into topics. Track mastery, connect related concepts, and visualize your knowledge graph.',
    icon: '🌐',
    action: 'Browse topics',
  },
  {
    id: 'reviews',
    title: 'Smart Reviews',
    description: 'Our spaced repetition system helps you retain information. Review at optimal times for maximum memory retention.',
    icon: '🔄',
    action: 'Start reviewing',
  },
  {
    id: 'quests',
    title: 'Daily Quests',
    description: 'Complete daily and weekly quests to earn XP and unlock achievements. Stay motivated with gamified learning goals.',
    icon: '⚔️',
    action: 'View quests',
  },
  {
    id: 'achievements',
    title: 'Track Achievements',
    description: 'Unlock badges as you learn. Build streaks, reach milestones, and celebrate your progress.',
    icon: '🏆',
    action: 'See achievements',
  },
  {
    id: 'notes',
    title: 'Take Notes',
    description: 'Capture key insights with markdown notes. Tag them by topic and never forget what you learned.',
    icon: '📝',
    action: 'Create a note',
  },
  {
    id: 'ready',
    title: 'You\'re All Set!',
    description: 'Your learning journey begins now. Remember: consistency beats intensity. Start small, stay consistent.',
    icon: '🚀',
    action: 'Start learning',
  },
];
