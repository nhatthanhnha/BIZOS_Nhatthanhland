import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { tServer } from "@/lib/i18n/server";
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
  FileBarChart,
  Bell,
  CheckSquare,
  History,
  Flag,
  TrendingUp,
  UserPlus,
  BookOpen,
  UserCircle,
  Settings as SettingsIcon,
  type LucideIcon,
  Rocket,
  Zap,
  MousePointerClick,
  GitBranch,
} from "lucide-react";

type Loc = "vi" | "en";

type GuideItem = {
  href: string;
  label: { vi: string; en: string };
  icon: LucideIcon;
  summary: { vi: string; en: string };
  howto: { vi: string[]; en: string[] };
};

const PAGES: GuideItem[] = [
  {
    href: "/dashboard",
    label: { vi: "01 · Dashboard", en: "01 · Dashboard" },
    icon: LayoutDashboard,
    summary: {
      vi: "Trang đầu tiên CEO mở mỗi sáng — tổng quan công ty trong 30 giây.",
      en: "The first page a CEO opens every morning — 30-second company snapshot.",
    },
    howto: {
      vi: [
        "6 KPI card ở đầu: doanh thu, gross profit, net profit, KPI completion, headcount, payroll cost. Sparkline dưới mỗi số = xu hướng 6-12 tháng.",
        "Hero donut giữa: % KPI công ty tổng. Xanh ≥100%, Vàng 85-99%, Đỏ <85%.",
        "Bên trái: danh sách KPI đang ở mức đỏ/vàng cần xử lý ngay.",
        "Bên phải: xu hướng doanh thu 12 tháng.",
        "3 Insight cards cuối: gợi ý AI dạng 'Sales hụt 20% → impact'.",
      ],
      en: [
        "6 KPI cards: revenue, gross profit, net profit, KPI completion, headcount, payroll cost. Sparklines show 6–12 month trends.",
        "Center hero donut: overall company KPI %. Green ≥100%, Amber 85–99%, Red <85%.",
        "Left panel: KPIs in red/yellow that need attention.",
        "Right panel: 12-month revenue trend.",
        "Bottom 3 insight cards: AI-style hints like 'Sales drops 20% → impact'.",
      ],
    },
  },
  {
    href: "/org",
    label: { vi: "02 · Sơ đồ tổ chức", en: "02 · Org chart" },
    icon: Network,
    summary: {
      vi: "Nhìn toàn bộ cơ cấu công ty và KPI theo phòng ban.",
      en: "See the whole company structure and KPI per department.",
    },
    howto: {
      vi: [
        "Cây tổ chức dạng node-edge (reactflow): zoom, pan, click để xem chi tiết.",
        "Donut bên phải: % KPI hoàn thành toàn tổ chức.",
        "Danh sách phòng ban: budget + headcount.",
        "Biểu đồ phân bổ nhân sự theo phòng ban.",
        "'Span of control' tối ưu 1:5 đến 1:8 người/head.",
      ],
      en: [
        "Org tree (reactflow node-edge): zoom, pan, click for details.",
        "Right donut: organization KPI completion %.",
        "Department list with budget + headcount.",
        "Headcount-by-department bar chart.",
        "'Span of control' optimal 1:5–1:8 per manager.",
      ],
    },
  },
  {
    href: "/departments",
    label: { vi: "03 · Phòng ban", en: "03 · Departments" },
    icon: Building2,
    summary: {
      vi: "Mỗi phòng ban là cost center + KPI center.",
      en: "Each department is a cost center + KPI center.",
    },
    howto: {
      vi: [
        "List phòng ban: KPI completion + budget/actual.",
        "Click vào một phòng → trang detail với KPI table + employee table + task table.",
        "Phân bổ task theo loại (growth/maintenance/admin/urgent) giúp phát hiện phòng 'bận rộn mà không tạo value'.",
      ],
      en: [
        "Department list: KPI completion + budget/actual.",
        "Click a department → detail page with KPI/employees/tasks tables.",
        "Task-type distribution (growth/maintenance/admin/urgent) spots 'busy but no value' departments.",
      ],
    },
  },
  {
    href: "/people",
    label: { vi: "04 · Nhân sự", en: "04 · People" },
    icon: Users,
    summary: {
      vi: "Directory + hồ sơ từng người với impact path.",
      en: "Directory + per-employee profile with impact path.",
    },
    howto: {
      vi: [
        "Directory list với filter phòng ban, search.",
        "Click vào 1 người → profile hero + compensation breakdown + KPI cá nhân + skill bars + 6-month performance line.",
        "'Impact path' cuối trang: KPI cá nhân → KPI phòng → KPI công ty → Revenue/Profit.",
      ],
      en: [
        "Searchable directory with department filter.",
        "Click a person → profile hero + compensation breakdown + personal KPIs + skill bars + 6-month performance.",
        "Bottom 'Impact path': personal KPI → dept KPI → company KPI → Revenue/Profit.",
      ],
    },
  },
  {
    href: "/kpi",
    label: { vi: "05 · KPI Tree", en: "05 · KPI Tree" },
    icon: Target,
    summary: {
      vi: "Cascade KPI từ company → department → team → employee.",
      en: "Cascade KPIs from company → department → team → employee.",
    },
    howto: {
      vi: [
        "Top 4 KPI công ty (REV/GP/NP/RET) với completion %.",
        "Cây KPI reactflow: mỗi node có màu theo status (xanh/vàng/đỏ).",
        "Lead card: theo dõi KPI funnel quan trọng nhất (ví dụ MKT.LEADS).",
        "Top KPI ảnh hưởng lớn: sắp xếp theo weight × completion.",
        "KPI thiếu dữ liệu: nhắc cập nhật actual.",
      ],
      en: [
        "Top 4 company KPIs (REV/GP/NP/RET) with completion %.",
        "KPI tree (reactflow): each node colored by status (green/yellow/red).",
        "Lead card: track the most important funnel KPI (e.g. MKT.LEADS).",
        "Top-impact KPIs sorted by weight × completion.",
        "KPIs missing actuals flagged for update.",
      ],
    },
  },
  {
    href: "/operations",
    label: { vi: "06 · Công việc", en: "06 · Operations" },
    icon: ListChecks,
    summary: {
      vi: "Task board 5 cột + lịch + workload.",
      en: "5-column task board + calendar + workload.",
    },
    howto: {
      vi: [
        "Kanban: To do / Đang làm / Review / Blocked / Hoàn thành.",
        "Mỗi task hiển thị: priority, type (growth/maintenance), KPI gắn (ví dụ E10.CONTENT), assignee, due date.",
        "Mini Calendar bên phải: ngày có deadline được highlight.",
        "Workload theo người: phát hiện nhân viên > 5 task = quá tải.",
        "Low-value work detector: task không gắn KPI + admin/maintenance ratio.",
      ],
      en: [
        "Kanban: To do / In progress / Review / Blocked / Done.",
        "Each card shows: priority, type, linked KPI (e.g. E10.CONTENT), assignee, due date.",
        "Right-side mini calendar highlights deadline days.",
        "Per-person workload: people with >5 tasks = overloaded.",
        "Low-value work detector: tasks not linked to KPIs + admin/maintenance ratio.",
      ],
    },
  },
  {
    href: "/compensation",
    label: { vi: "07 · Lương thưởng", en: "07 · Compensation" },
    icon: Wallet,
    summary: {
      vi: "Payroll + Incentive Simulator chạy rule engine.",
      en: "Payroll + Incentive Simulator running the rule engine.",
    },
    howto: {
      vi: [
        "Top: tổng gross/net/cost/bonus pool.",
        "Cơ cấu chi phí lương: donut breakdown 5 loại (base/phụ cấp/hoa hồng/bonus/BHXH DN).",
        "Incentive Simulator: kéo slider KPI cá nhân/team/công ty → xem bonus thay đổi real-time.",
        "Rule 5-tier: <80% KPI = 0x, ≥80% = 0.5x, ≥90% = 0.75x, ≥100% = 1.0x, ≥120% = 1.5x.",
      ],
      en: [
        "Top: total gross/net/cost/bonus pool.",
        "Cost breakdown donut: 5 buckets (base/allowance/commission/bonus/employer contributions).",
        "Incentive Simulator: drag KPI sliders (personal/team/company) to see bonus change live.",
        "5-tier rule: <80% = 0x, ≥80% = 0.5x, ≥90% = 0.75x, ≥100% = 1.0x, ≥120% = 1.5x.",
      ],
    },
  },
  {
    href: "/projects",
    label: { vi: "08 · Dự án", en: "08 · Projects" },
    icon: FolderKanban,
    summary: {
      vi: "Initiative / project cross-functional với ROI tracking.",
      en: "Cross-functional initiatives with ROI tracking.",
    },
    howto: {
      vi: [
        "List dự án: owner, budget, status (active/paused/draft/done), thời gian.",
        "Donut phân bổ theo status + progress bar từng dự án.",
        "Click vào 1 dự án → detail với business case + milestones + ROI.",
      ],
      en: [
        "Project list: owner, budget, status, timeline.",
        "Status donut + per-project progress bar.",
        "Click a project → detail with business case + milestones + ROI.",
      ],
    },
  },
  {
    href: "/finance",
    label: { vi: "09 · Tài chính", en: "09 · Finance" },
    icon: Landmark,
    summary: {
      vi: "P&L · Balance Sheet · Cash Flow · Budget.",
      en: "P&L · Balance Sheet · Cash Flow · Budget.",
    },
    howto: {
      vi: [
        "6 KPI tài chính top với sparkline.",
        "Bar chart 6 tháng Revenue/Cost/Profit.",
        "Donut cơ cấu chi phí theo phòng ban.",
        "4 sub-tabs: /pnl, /balance-sheet, /cashflow, /budget — mỗi trang có chi tiết khoản mục.",
      ],
      en: [
        "6 financial KPIs up top with sparklines.",
        "6-month Revenue/Cost/Profit bar chart.",
        "Cost-structure donut by department.",
        "4 sub-tabs: /pnl, /balance-sheet, /cashflow, /budget — each with line items.",
      ],
    },
  },
  {
    href: "/reports",
    label: { vi: "11 · Báo cáo", en: "11 · Reports" },
    icon: FileBarChart,
    summary: {
      vi: "Snapshot báo cáo + lịch gửi tự động.",
      en: "Report snapshots + auto email schedules.",
    },
    howto: {
      vi: [
        "Danh sách báo cáo PDF/XLSX đã tạo với lượt tải.",
        "Lịch gửi tự động (cron): KPI tuần / payroll tháng / cash flow hàng ngày.",
      ],
      en: [
        "List of generated PDF/XLSX reports with download counts.",
        "Auto-email cron: weekly KPI / monthly payroll / daily cash flow.",
      ],
    },
  },
  {
    href: "/alerts",
    label: { vi: "12 · Cảnh báo", en: "12 · Alerts" },
    icon: Bell,
    summary: {
      vi: "Nơi tập trung mọi cảnh báo theo mức độ.",
      en: "Central hub for all alerts by severity.",
    },
    howto: {
      vi: [
        "Critical / Danger / Warning / Info — donut phân bổ.",
        "Rule đang hoạt động: KPI < 85%, task > 2 ngày, chi phí > 5% budget, nhân sự > 10 task.",
      ],
      en: [
        "Critical / Danger / Warning / Info — severity donut.",
        "Active rules: KPI < 85%, task > 2 days, cost > 5% over budget, person > 10 tasks.",
      ],
    },
  },
  {
    href: "/approvals",
    label: { vi: "13 · Phê duyệt", en: "13 · Approvals" },
    icon: CheckSquare,
    summary: {
      vi: "Duyệt KPI · thưởng · ngân sách · tuyển dụng.",
      en: "Approve KPIs · bonuses · budgets · hiring.",
    },
    howto: {
      vi: [
        "Pending / Approved / Rejected / Cancelled.",
        "Theo loại: payroll adjustment, job requisition, KPI change, project budget.",
        "SLA: 72% duyệt trong 24h là tốt.",
      ],
      en: [
        "Pending / Approved / Rejected / Cancelled.",
        "By kind: payroll adjustment, job requisition, KPI change, project budget.",
        "SLA: 72% approved within 24h is healthy.",
      ],
    },
  },
  {
    href: "/audit",
    label: { vi: "14 · Audit Log", en: "14 · Audit Log" },
    icon: History,
    summary: {
      vi: "Ai · sửa gì · khi nào — tracebility 12 tháng.",
      en: "Who · changed what · when — 12-month traceability.",
    },
    howto: {
      vi: [
        "Bảng log với before/after JSON.",
        "Filter theo actor, action, entity, time range.",
        "Chỉ CEO + Auditor xem được.",
      ],
      en: [
        "Log table with before/after JSON.",
        "Filter by actor, action, entity, time range.",
        "Only CEO + Auditor can view.",
      ],
    },
  },
  {
    href: "/okr",
    label: { vi: "15 · OKR", en: "15 · OKRs" },
    icon: Flag,
    summary: {
      vi: "Objective + Key Results cascade theo quý/năm.",
      en: "Objective + Key Results cascade by quarter/year.",
    },
    howto: {
      vi: [
        "Card từng Objective với progress bar + KR bên trong.",
        "Alignment: mỗi OKR liên kết với KPI nào trong KPI Tree.",
      ],
      en: [
        "Objective cards with progress bar + inner KRs.",
        "Alignment: each OKR links to KPIs in the KPI Tree.",
      ],
    },
  },
  {
    href: "/forecast",
    label: { vi: "16 · Forecast", en: "16 · Forecast" },
    icon: TrendingUp,
    summary: {
      vi: "What-if simulator: kéo slider KPI lá → xem impact.",
      en: "What-if simulator: drag leaf-KPI sliders → see impact.",
    },
    howto: {
      vi: [
        "Danh sách KPI lá (cá nhân + phòng ban) với slider -30% → +30%.",
        "Bên phải: KPI công ty (REV/GP/NP/RET) cập nhật real-time khi kéo slider.",
      ],
      en: [
        "Leaf-KPI list (personal + department) with -30% → +30% sliders.",
        "Right panel: company KPIs (REV/GP/NP/RET) update in real time.",
      ],
    },
  },
  {
    href: "/recruiting",
    label: { vi: "17 · Tuyển dụng", en: "17 · Recruiting" },
    icon: UserPlus,
    summary: {
      vi: "Job requisitions + pipeline candidate + skill gap.",
      en: "Job requisitions + candidate pipeline + skill gap.",
    },
    howto: {
      vi: [
        "Danh sách vị trí đang mở + headcount cần tuyển.",
        "Donut pipeline: Mới → Screening → Interview → Offer.",
        "Skill gap: current vs target theo từng phòng.",
      ],
      en: [
        "List of open roles + headcount needed.",
        "Pipeline donut: New → Screening → Interview → Offer.",
        "Skill gap: current vs target per department.",
      ],
    },
  },
  {
    href: "/knowledge",
    label: { vi: "18 · SOP / Playbook", en: "18 · SOP / Playbook" },
    icon: BookOpen,
    summary: {
      vi: "Quy trình chuẩn + playbook + checklist.",
      en: "Standard operating procedures + playbooks + checklists.",
    },
    howto: {
      vi: [
        "SOP gom theo phòng ban, có version + trạng thái published/draft.",
        "Quick checklist: onboarding, qualify lead, close B2B, xử lý khiếu nại, payroll.",
      ],
      en: [
        "SOPs grouped by department with version + published/draft status.",
        "Quick checklists: onboarding, lead qualification, B2B close, complaint handling, payroll.",
      ],
    },
  },
  {
    href: "/profile",
    label: { vi: "19 · Tài khoản", en: "19 · Account" },
    icon: UserCircle,
    summary: {
      vi: "Thông tin + bảo mật + thiết bị + thông báo + tích hợp.",
      en: "Info + security + devices + notifications + integrations.",
    },
    howto: {
      vi: [
        "Donut điểm bảo mật 85/100.",
        "Đổi mật khẩu, bật 2FA, xem phiên đăng nhập.",
        "Notification toggles + ứng dụng kết nối.",
      ],
      en: [
        "Security score donut 85/100.",
        "Change password, enable 2FA, view login sessions.",
        "Notification toggles + connected apps.",
      ],
    },
  },
  {
    href: "/settings",
    label: { vi: "10 · Cài đặt", en: "10 · Settings" },
    icon: SettingsIcon,
    summary: {
      vi: "Company · Structure · Permissions · KPI formula · Comp · Integrations.",
      en: "Company · Structure · Permissions · KPI formula · Comp · Integrations.",
    },
    howto: {
      vi: [
        "Thông tin công ty: tên, mã, currency, timezone.",
        "Cơ cấu, phân quyền 7 role.",
        "KPI Formula JSONB editor · Compensation rules · Integrations.",
      ],
      en: [
        "Company info: name, code, currency, timezone.",
        "Structure + 7-role permissions.",
        "KPI Formula JSONB editor · Compensation rules · Integrations.",
      ],
    },
  },
];

const WORKFLOWS: { title: { vi: string; en: string }; icon: LucideIcon; steps: { vi: string[]; en: string[] } }[] = [
  {
    title: {
      vi: "Task → KPI → Tài chính (end-to-end)",
      en: "Task → KPI → Finance (end-to-end)",
    },
    icon: GitBranch,
    steps: {
      vi: [
        "CEO tạo KPI công ty ở /kpi (ví dụ REV = 5 tỷ/tháng).",
        "Dept Head tạo KPI phòng ban với parent = REV (ví dụ SAL.CLOSE).",
        "Team Lead giao task ở /operations và gắn linked_kpi_id.",
        "Nhân viên complete task → output đẩy lên KPI actual.",
        "KPI actual cập nhật → cascade lên KPI cha tự động.",
        "/compensation tính bonus dựa trên completion rate.",
        "/finance phản ánh revenue/cost vào P&L.",
        "/forecast cho phép what-if: 'Nếu KPI giảm 20%...' → xem impact.",
      ],
      en: [
        "CEO creates company KPI at /kpi (e.g. REV = 5B VND/month).",
        "Dept head creates dept KPI with parent = REV (e.g. SAL.CLOSE).",
        "Team lead assigns tasks at /operations with linked_kpi_id.",
        "Employees complete tasks → outputs roll up to KPI actual.",
        "KPI actuals update → cascade to parents automatically.",
        "/compensation computes bonuses based on completion rate.",
        "/finance reflects revenue/cost into the P&L.",
        "/forecast allows what-if: 'If KPI drops 20%...' → see impact.",
      ],
    },
  },
  {
    title: { vi: "Payroll cuối tháng", en: "Month-end payroll" },
    icon: Wallet,
    steps: {
      vi: [
        "Đầu tháng: chốt KPI kỳ trước ở /kpi.",
        "/compensation mở: hệ thống tính sẵn bonus theo rule.",
        "Rà soát bảng Payroll chi tiết, điều chỉnh nếu cần (tạo Approval).",
        "Duyệt adjustment ở /approvals.",
        "Chạy payroll → status 'closed' → audit log ghi nhận.",
        "/finance ghi nhận payroll cost vào cost center phòng ban.",
      ],
      en: [
        "Early month: finalize last period's KPIs at /kpi.",
        "Open /compensation: system pre-computes bonuses per rule.",
        "Review Payroll table, adjust if needed (creates an Approval).",
        "Approve adjustments at /approvals.",
        "Run payroll → status 'closed' → logged in audit.",
        "/finance books payroll cost into department cost centers.",
      ],
    },
  },
  {
    title: { vi: "Setup công ty lần đầu", en: "First-time company setup" },
    icon: Rocket,
    steps: {
      vi: [
        "Đăng ký tài khoản ở /signup.",
        "/settings: điền tên công ty, currency, timezone.",
        "Tạo cơ cấu: business_unit → department → team → position.",
        "Thêm nhân sự ở /people (hoặc import CSV ở Settings → Import).",
        "Gán role cho từng user qua user_roles.",
        "Tạo KPI công ty ở /kpi + cascade xuống phòng ban/cá nhân.",
        "Tạo compensation rules ở Settings.",
        "Chạy một kỳ payroll thử ở /compensation.",
        "Mở /dashboard theo dõi hằng ngày.",
      ],
      en: [
        "Sign up at /signup.",
        "/settings: fill in company name, currency, timezone.",
        "Build the structure: business_unit → department → team → position.",
        "Add employees at /people (or import CSV at Settings → Import).",
        "Assign roles to users via user_roles.",
        "Create company KPIs at /kpi + cascade down to departments/individuals.",
        "Configure compensation rules at Settings.",
        "Run a test payroll at /compensation.",
        "Open /dashboard for daily monitoring.",
      ],
    },
  },
];

export default async function GuidePage() {
  const { t, locale } = await tServer();
  const loc: Loc = locale;
  const vn = loc === "vi";

  const philosophy = vn
    ? {
        heading: "Triết lý BIZOS",
        p1: (
          <>
            Không phải HRM, không phải BI dashboard đơn thuần. BIZOS là{" "}
            <strong>Business Operating System</strong> — nơi mọi task hằng ngày, KPI, lương thưởng và
            tài chính đều được nối vào một chuỗi logic thống nhất:
          </>
        ),
        p2: (
          <>
            Mục tiêu: <em>nếu KPI cấp cá nhân được thiết kế đúng và đạt ngưỡng, thì KPI cấp team,
            phòng, và công ty cũng phải đạt.</em> Mọi thứ truy vết được.
          </>
        ),
        chain: [
          "Task hằng ngày",
          "KPI cá nhân",
          "KPI phòng ban",
          "KPI công ty",
          "Doanh thu · Lợi nhuận · Dòng tiền",
        ],
      }
    : {
        heading: "BIZOS philosophy",
        p1: (
          <>
            It&apos;s not an HRM, not a BI dashboard. BIZOS is a{" "}
            <strong>Business Operating System</strong> — every daily task, KPI, compensation item and
            financial line is wired into one unified logic:
          </>
        ),
        p2: (
          <>
            The goal: <em>if individual KPIs are designed right and hit target, team, department and
            company KPIs also hit.</em> Everything traceable.
          </>
        ),
        chain: [
          "Daily tasks",
          "Personal KPI",
          "Department KPI",
          "Company KPI",
          "Revenue · Profit · Cash",
        ],
      };

  const steps = vn
    ? [
        { title: "BƯỚC 1 · SETUP", href: "/settings", hrefLabel: "/settings", desc: "Điền thông tin công ty, tạo phòng ban, gán permissions." },
        { title: "BƯỚC 2 · DESIGN KPI", href: "/kpi", hrefLabel: "/kpi", desc: "Tạo KPI công ty → cascade xuống phòng ban → cá nhân. Gắn công thức JSONB." },
        { title: "BƯỚC 3 · VẬN HÀNH", href: "/operations", hrefLabel: "/operations", desc: "Giao task, gắn linked_kpi_id. Mở /dashboard theo dõi mỗi ngày." },
      ]
    : [
        { title: "STEP 1 · SETUP", href: "/settings", hrefLabel: "/settings", desc: "Fill company info, create departments, assign permissions." },
        { title: "STEP 2 · DESIGN KPIS", href: "/kpi", hrefLabel: "/kpi", desc: "Create company KPIs → cascade to departments → individuals. Attach JSONB formulas." },
        { title: "STEP 3 · OPERATE", href: "/operations", hrefLabel: "/operations", desc: "Assign tasks with linked_kpi_id. Open /dashboard daily." },
      ];

  const tips = vn
    ? [
        { h: "Demo mode", p: "Chưa điền Supabase env? App tự chạy với 14 employee, 14 KPI, payroll, finance mẫu. Mọi trang render đầy đủ — nút CRUD sẽ no-op." },
        { h: "RLS multi-tenant", p: "Mỗi bảng có company_id. User chỉ đọc được data của công ty mình nhờ helper SQL current_company_id()." },
        { h: "KPI formula", p: 'Lưu dạng JSONB AST: {op:"mul",args:[{ref:"mql"},{ref:"close"}]}. Hỗ trợ sum/sub/mul/avg/weighted_avg/ratio/milestone/ref/const/manual.' },
        { h: "Compensation tiers", p: "5 bậc: <80% = 0x, ≥80% = 0.5x, ≥90% = 0.75x, ≥100% = 1.0x, ≥120% = 1.5x. Tuỳ biến ở Settings → Bonus rules." },
      ]
    : [
        { h: "Demo mode", p: "No Supabase env yet? The app runs with 14 sample employees, 14 KPIs, payroll, finance. Every page renders — CRUD buttons are no-ops." },
        { h: "RLS multi-tenant", p: "Every table has company_id. Users only read their own company data via SQL helper current_company_id()." },
        { h: "KPI formula", p: 'Stored as JSONB AST: {op:"mul",args:[{ref:"mql"},{ref:"close"}]}. Supports sum/sub/mul/avg/weighted_avg/ratio/milestone/ref/const/manual.' },
        { h: "Compensation tiers", p: "5 tiers: <80% = 0x, ≥80% = 0.5x, ≥90% = 0.75x, ≥100% = 1.0x, ≥120% = 1.5x. Customize at Settings → Bonus rules." },
      ];

  return (
    <div>
      <PageHeader
        title={t("guide.title")}
        description={t("guide.subtitle")}
        actions={<Badge variant="info">{t("guide.version")}</Badge>}
      />

      <Card className="mb-4">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold text-zinc-900 mb-1">{philosophy.heading}</div>
              <p className="text-sm text-zinc-600 leading-relaxed">{philosophy.p1}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px]">
                {philosophy.chain.map((c, i) => (
                  <span key={c} className="inline-flex items-center gap-2">
                    <Badge variant={i === philosophy.chain.length - 1 ? "success" : "info"}>
                      {c}
                    </Badge>
                    {i < philosophy.chain.length - 1 && <span className="text-zinc-400">→</span>}
                  </span>
                ))}
              </div>
              <p className="text-sm text-zinc-600 leading-relaxed mt-3">{philosophy.p2}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[14px]">
            <MousePointerClick className="h-4 w-4 text-indigo-600" />
            {vn ? "Bắt đầu từ đâu?" : "Where to start?"}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          {steps.map((s, i) => {
            const tone = i === 0 ? "indigo" : i === 1 ? "violet" : "emerald";
            const colorMap = {
              indigo: { bg: "bg-indigo-50/50", border: "border-indigo-100", text: "text-indigo-700", hover: "hover:text-indigo-700" },
              violet: { bg: "bg-violet-50/50", border: "border-violet-100", text: "text-violet-700", hover: "hover:text-violet-700" },
              emerald: { bg: "bg-emerald-50/50", border: "border-emerald-100", text: "text-emerald-700", hover: "hover:text-emerald-700" },
            } as const;
            const c = colorMap[tone];
            return (
              <div key={s.title} className={`rounded-lg border ${c.border} ${c.bg} p-3`}>
                <div className={`text-[11px] font-semibold ${c.text} uppercase mb-1`}>{s.title}</div>
                <Link href={s.href} className={`font-medium text-zinc-900 ${c.hover}`}>
                  {s.hrefLabel}
                </Link>
                <p className="text-xs text-zinc-600 mt-1">{s.desc}</p>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="mb-4">
        <h2 className="text-sm font-semibold text-zinc-900 mb-2">
          {vn ? "Quy trình tiêu biểu" : "Key workflows"}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {WORKFLOWS.map((w) => {
            const Icon = w.icon;
            return (
              <Card key={w.title[loc]}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[14px]">
                    <Icon className="h-4 w-4 text-indigo-600" />
                    {w.title[loc]}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-1.5 text-[13px] text-zinc-700">
                    {w.steps[loc].map((s, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="h-4 w-4 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-semibold flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <h2 className="text-sm font-semibold text-zinc-900 mb-2">
        {vn ? "19 màn hình — chi tiết" : "19 screens — detail"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {PAGES.map((p) => {
          const Icon = p.icon;
          return (
            <Card key={p.href}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <span className="h-9 w-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <CardTitle className="text-[14px]">{p.label[loc]}</CardTitle>
                      <p className="text-[12px] text-zinc-500 mt-0.5">{p.summary[loc]}</p>
                    </div>
                  </div>
                  <Link
                    href={p.href}
                    className="text-[11px] text-indigo-600 font-medium hover:underline shrink-0"
                  >
                    {vn ? "Mở →" : "Open →"}
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-[12.5px] text-zinc-700">
                  {p.howto[loc].map((h, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-indigo-400 shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-[14px]">{vn ? "Tips nhanh" : "Quick tips"}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[13px] text-zinc-700">
          {tips.map((tip) => (
            <div key={tip.h} className="rounded-lg bg-zinc-50 p-3">
              <div className="font-semibold text-zinc-900 mb-1">{tip.h}</div>
              <p>{tip.p}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Rocket className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold text-zinc-900 mb-1">
                {vn ? "Cần tuỳ biến cho công ty?" : "Need a custom deployment?"}
              </div>
              <p className="text-sm text-zinc-600">
                {vn ? "Email" : "Email"}{" "}
                <a
                  href="mailto:alexle@titanlabs.vn"
                  className="text-indigo-600 font-medium hover:underline"
                >
                  alexle@titanlabs.vn
                </a>{" "}
                (VN/EN). {vn ? "Ủng hộ PayPal" : "Donate PayPal"}:{" "}
                <a
                  href="https://www.paypal.com/paypalme/sai211dn"
                  className="text-rose-600 font-medium hover:underline"
                >
                  sai211dn@gmail.com
                </a>
                .
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
