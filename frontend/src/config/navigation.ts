import {
  BookOpen,
  Map,
  Network,
  Brain,
  Sparkles,
  Route,
  Calendar,
  BarChart3,
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
  { icon: Brain, label: "Knowledge Graph", path: "/knowledge-graph" },
  { icon: Calendar, label: "Schedule", path: "/schedule" },
  { icon: BarChart3, label: "Progress", path: "/progress" },
  { icon: Sparkles, label: "AI Recommendations", path: "/ai-recommendations" },
  { icon: Map, label: "Roadmaps", path: "/roadmaps" },
];
