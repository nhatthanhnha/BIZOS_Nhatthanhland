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
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/org", label: "Sơ đồ tổ chức", icon: Network },
  { href: "/departments", label: "Phòng ban", icon: Building2 },
  { href: "/people", label: "Nhân sự", icon: Users },
  { href: "/kpi", label: "KPI Tree", icon: Target },
  { href: "/operations", label: "Công việc", icon: ListChecks },
  { href: "/compensation", label: "Lương thưởng", icon: Wallet },
  { href: "/projects", label: "Dự án", icon: FolderKanban },
  { href: "/finance", label: "Tài chính", icon: Landmark },
  { href: "/reports", label: "Báo cáo", icon: FileBarChart },
  { href: "/alerts", label: "Cảnh báo", icon: Bell },
  { href: "/approvals", label: "Phê duyệt", icon: CheckSquare },
  { href: "/audit", label: "Audit log", icon: History },
  { href: "/okr", label: "Mục tiêu OKR", icon: Flag },
  { href: "/forecast", label: "Forecast", icon: TrendingUp },
  { href: "/recruiting", label: "Tuyển dụng", icon: UserPlus },
  { href: "/knowledge", label: "SOP / Playbook", icon: BookOpen },
  { href: "/profile", label: "Tài khoản", icon: UserCircle },
  { href: "/settings", label: "Cài đặt", icon: Settings },
];
