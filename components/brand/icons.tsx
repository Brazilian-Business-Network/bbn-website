import {
  Activity,
  Ban,
  Brain,
  Briefcase,
  CalendarDays,
  Cross,
  Globe2,
  GraduationCap,
  Handshake,
  HeartHandshake,
  Languages,
  Lightbulb,
  Lock,
  MapPin,
  MessagesSquare,
  Mic,
  Rocket,
  Sparkles,
  Target,
  TrendingUp,
  UserPlus,
  Users,
  type LucideIcon,
} from "lucide-react";

/**
 * Maps the icon names stored in data/content.ts to components. Keeping the data
 * files free of JSX means they stay importable from anywhere, including the
 * sitemap and metadata generators.
 */
const registry = {
  Activity,
  Ban,
  Brain,
  Briefcase,
  CalendarDays,
  Cross,
  Globe2,
  GraduationCap,
  Handshake,
  HeartHandshake,
  Languages,
  Lightbulb,
  Lock,
  MapPin,
  MessagesSquare,
  Mic,
  Rocket,
  Sparkles,
  Target,
  TrendingUp,
  UserPlus,
  Users,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof registry;

export function BrandIcon({
  name,
  className = "size-6",
}: {
  name: IconName;
  className?: string;
}) {
  const Icon = registry[name];
  return <Icon aria-hidden="true" className={className} />;
}
