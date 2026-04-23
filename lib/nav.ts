import {
  LayoutDashboard,
  Network,
  Building2,
  Users,
  Target,
  ListChecks,
  Wallet,
  FolderKanban,
  Landmark,
  Settings,
  FileBarChart,
  Bell,
  CheckSquare,
  History,
  Flag,
  TrendingUp,
  UserPlus,
  BookOpen,
  UserCircle,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";
import type { DICT } from "./i18n/dict";

export type NavItem = {
  href: string;
  labelKey: keyof typeof DICT;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", labelKey: "nav.dashboard", icon: LayoutDashboard },
  { href: "/org", labelKey: "nav.org", icon: Network },
  { href: "/departments", labelKey: "nav.departments", icon: Building2 },
  { href: "/people", labelKey: "nav.people", icon: Users },
  { href: "/kpi", labelKey: "nav.kpi", icon: Target },
  { href: "/operations", labelKey: "nav.operations", icon: ListChecks },
  { href: "/compensation", labelKey: "nav.compensation", icon: Wallet },
  { href: "/projects", labelKey: "nav.projects", icon: FolderKanban },
  { href: "/finance", labelKey: "nav.finance", icon: Landmark },
  { href: "/reports", labelKey: "nav.reports", icon: FileBarChart },
  { href: "/alerts", labelKey: "nav.alerts", icon: Bell },
  { href: "/approvals", labelKey: "nav.approvals", icon: CheckSquare },
  { href: "/audit", labelKey: "nav.audit", icon: History },
  { href: "/okr", labelKey: "nav.okr", icon: Flag },
  { href: "/forecast", labelKey: "nav.forecast", icon: TrendingUp },
  { href: "/recruiting", labelKey: "nav.recruiting", icon: UserPlus },
  { href: "/knowledge", labelKey: "nav.knowledge", icon: BookOpen },
  { href: "/profile", labelKey: "nav.profile", icon: UserCircle },
  { href: "/settings", labelKey: "nav.settings", icon: Settings },
  { href: "/guide", labelKey: "nav.guide", icon: HelpCircle },
];
