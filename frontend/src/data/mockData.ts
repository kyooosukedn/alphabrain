import { 
  BookOpen, 
  Brain, 
  Clock, 
  Target, 
  Trophy,
  Star,
  Activity
} from "lucide-react";
import type { StudyMetric, StudySession } from '@/types/dashboard';

export const STUDY_METRICS: StudyMetric[] = [
  {
    label: "Study Streak",
    value: "7 days",
    change: "2 days increase",
    icon: Trophy,
    trend: "up",
    description: "Keep going! You're on a roll!"
  },
  {
    label: "Focus Time",
    value: "4.5 hrs",
    change: "30 min increase",
    icon: Clock,
    trend: "up",
    description: "Today's total study time"
  },
  {
    label: "Topics Covered",
    value: 12,
    change: "3 new topics",
    icon: Brain,
    trend: "up",
    description: "Topics mastered this week"
  },
  {
    label: "Goals Achieved",
    value: "85%",
    change: "5% increase",
    icon: Target,
    trend: "up",
    description: "Weekly goals completion rate"
  }
];

export const STUDY_SESSIONS: StudySession[] = [
  {
    id: "1",
    subject: "Mathematics",
    progress: 75,
    timeLeft: "2h 30m",
    dueDate: "Today",
    difficulty: "medium",
    topics: ["Calculus", "Linear Algebra"],
    color: "bg-blue-500",
    streakDays: 5,
    completedTopics: 8,
    totalTopics: 12
  },
  {
    id: "2",
    subject: "Physics",
    progress: 60,
    timeLeft: "1h 45m",
    dueDate: "Tomorrow",
    difficulty: "hard",
    topics: ["Mechanics", "Thermodynamics"],
    color: "bg-red-500",
    streakDays: 3,
    completedTopics: 6,
    totalTopics: 10
  }
];

export const MOCK_SESSIONS: StudySession[] = [
  {
    id: "1",
    subject: "Mathematics",
    progress: 75,
    timeLeft: "45 min",
    dueDate: "Today",
    difficulty: "medium",
    topics: ["Calculus", "Integration"],
    color: "bg-violet-500",
    streakDays: 5,
    completedTopics: 8,
    totalTopics: 12
  },
  {
    id: "2",
    subject: "Physics",
    progress: 60,
    timeLeft: "1.5 hrs",
    dueDate: "Tomorrow",
    difficulty: "hard",
    topics: ["Quantum Mechanics", "Wave Functions"],
    color: "bg-blue-500",
    streakDays: 3,
    completedTopics: 6,
    totalTopics: 10
  },
  {
    id: "3",
    subject: "Chemistry",
    progress: 90,
    timeLeft: "30 min",
    dueDate: "Today",
    difficulty: "easy",
    topics: ["Organic Chemistry", "Reactions"],
    color: "bg-emerald-500",
    streakDays: 7,
    completedTopics: 9,
    totalTopics: 10
  },
  {
    id: "4",
    subject: "Biology",
    progress: 40,
    timeLeft: "2 hrs",
    dueDate: "Tomorrow",
    difficulty: "medium",
    topics: ["Cell Biology", "Genetics"],
    color: "bg-orange-500",
    streakDays: 4,
    completedTopics: 4,
    totalTopics: 10
  }
];
