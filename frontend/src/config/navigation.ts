import {
  BookOpen,
  Map,
  Network,
  Brain,
  Sparkles,
  Route,
  Calendar,
  BarChart3,
  RotateCcw,
  Trophy,
  Sword,
  FileText,
} from "lucide-react";

export interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

export const mainNavItems: NavItem[] = [
  { icon: BookOpen, label: "Dashboard", path: "/" },
  { icon: Route, label: "Learning Journey", path: "/learning-journey" },
  { icon: Network, label: "Topics", path: "/topics" },
  { icon: FileText, label: "Notes", path: "/notes" },
  { icon: Brain, label: "Knowledge Graph", path: "/knowledge-graph" },
  { icon: RotateCcw, label: "Review", path: "/reviews" },
  { icon: Calendar, label: "Schedule", path: "/schedule" },
  { icon: BarChart3, label: "Progress", path: "/progress" },
  { icon: Sword, label: "Quests", path: "/quests" },
  { icon: Trophy, label: "Achievements", path: "/achievements" },
  { icon: Sparkles, label: "AI Recommendations", path: "/ai-recommendations" },
  { icon: Map, label: "Roadmaps", path: "/roadmaps" },
];
