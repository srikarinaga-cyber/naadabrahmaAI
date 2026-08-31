import {
  BookOpen,
  Bot,
  GitBranch,
  GraduationCap,
  Layers,
  Music,
  Music2,
  NotebookPen,
  Shield,
  Sparkles,
  Timer,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  "notebook-pen": NotebookPen,
  "book-open": BookOpen,
  sparkles: Sparkles,
  music: Music,
  "graduation-cap": GraduationCap,
  users: Users,
  shield: Shield,
  layers: Layers,
  "git-branch": GitBranch,
  timer: Timer,
  user: User,
  "music-2": Music2,
  bot: Bot,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? Sparkles;
}
