import {
  BookOpen,
  BarChart3,
  Calendar,
  Settings,
  Target,
} from "lucide-react";

export interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

export const mainNavItems: NavItem[] = [
  { icon: BookOpen, label: "Dashboard", path: "/" },
  { icon: BarChart3, label: "Progress", path: "/progress" },
  { icon: Calendar, label: "Schedule", path: "/schedule" },
  { icon: Target, label: "Goals", path: "/goals" },
  { icon: Settings, label: "Settings", path: "/settings" },
];
