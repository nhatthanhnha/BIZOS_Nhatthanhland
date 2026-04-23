import { createClientOrNull } from "@/lib/supabase/server";
import { tServer } from "@/lib/i18n/server";
import { logout } from "@/app/(auth)/actions";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { KpiCard } from "@/components/kpi/KpiCard";
import { KpiHeroDonut } from "@/components/kpi/KpiHeroDonut";
import { ProgressList } from "@/components/widgets/ProgressList";
import { ActivityFeed } from "@/components/widgets/ActivityFeed";
import { StatChip } from "@/components/widgets/StatChip";
import {
  Shield,
  Bell,
  Monitor,
  Smartphone,
  Settings,
  Target,
  CheckCircle2,
  KeyRound,
  LogOut,
} from "lucide-react";

export default async function ProfilePage() {
  const { t } = await tServer();
  const supabase = await createClientOrNull();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  const email = user?.email ?? "demo@bizos.local";
  const fullName = (user?.user_metadata?.full_name as string) ?? "Người dùng demo";
  const initials = fullName.slice(0, 1).toUpperCase();

  return (
    <div>
      <PageHeader title={t("profile.title")} description={t("profile.subtitle")} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <KpiCard
          label="KPI cá nhân"
          value="92%"
          delta={4.1}
          accent="indigo"
          icon={<Target className="h-3.5 w-3.5" />}
          spark={[82, 85, 86, 88, 90, 92]}
        />
        <KpiCard
          label="Cảnh báo mới"
          value="4"
          accent="amber"
          icon={<Bell className="h-3.5 w-3.5" />}
          hint="1 tuần qua"
        />
        <KpiCard
          label="Mức bảo mật"
          value="Mạnh"
          accent="emerald"
          icon={<Shield className="h-3.5 w-3.5" />}
          hint="85/100 điểm"
        />
        <KpiCard
          label="Thiết bị đăng nhập"
          value="3"
          accent="violet"
          icon={<Monitor className="h-3.5 w-3.5" />}
          hint="Đã kích hoạt"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
        <Card className="lg:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Thông tin cá nhân</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-zinc-900 truncate">{fullName}</div>
                <div className="text-xs text-zinc-500 truncate">{email}</div>
                <Badge variant="success" className="mt-1.5">
                  <CheckCircle2 className="h-3 w-3" /> Đã kích hoạt
                </Badge>
              </div>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <div className="space-y-1.5">
                <Label>Họ và tên</Label>
                <Input defaultValue={fullName} />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input defaultValue={email} disabled />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Số điện thoại</Label>
                  <Input placeholder="+84..." />
                </div>
                <div className="space-y-1.5">
                  <Label>Phòng ban</Label>
                  <Input defaultValue="Chưa gán" disabled />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Vị trí</Label>
                  <Input defaultValue="CEO" disabled />
                </div>
                <div className="space-y-1.5">
                  <Label>Timezone</Label>
                  <Input defaultValue="Asia/Ho_Chi_Minh" />
                </div>
              </div>
              <Button className="w-full">Lưu thay đổi</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Bảo mật tài khoản</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-2">
              <KpiHeroDonut value={85} label="Điểm bảo mật" height={180} accent="#10b981" />
            </div>
            <Separator className="my-3" />
            <div className="space-y-3 text-sm">
              <SecurityRow
                icon={<KeyRound className="h-4 w-4 text-indigo-600" />}
                label="Mật khẩu"
                hint="Cập nhật lần cuối: 7 ngày trước"
                action="Đổi"
                status="ok"
              />
              <SecurityRow
                icon={<Shield className="h-4 w-4 text-amber-600" />}
                label="Xác thực 2 lớp (2FA)"
                hint="Chưa bật — khuyến nghị bật"
                action="Thiết lập"
                status="warn"
              />
              <SecurityRow
                icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                label="Email đã xác minh"
                hint={email}
                action=""
                status="ok"
              />
              <SecurityRow
                icon={<Monitor className="h-4 w-4 text-indigo-600" />}
                label="Phiên trình duyệt"
                hint="3 thiết bị đang hoạt động"
                action="Xem"
                status="ok"
              />
            </div>
            <form action={logout} className="mt-4">
              <Button variant="destructive" className="w-full">
                <LogOut className="h-4 w-4" /> Đăng xuất
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Tùy chọn thông báo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "KPI vượt / trượt threshold", on: true, tone: "info" as const },
              { label: "Task overdue / SLA", on: true, tone: "warning" as const },
              { label: "Payroll / Bonus được duyệt", on: true, tone: "success" as const },
              { label: "Cảnh báo cash flow", on: false, tone: "danger" as const },
              { label: "Mention trong comment", on: true, tone: "violet" as const },
              { label: "Báo cáo tuần / tháng", on: false, tone: "default" as const },
            ].map((n) => (
              <div
                key={n.label}
                className="flex items-center justify-between rounded-lg border border-zinc-100 p-2.5 text-sm"
              >
                <span className="text-zinc-700 truncate pr-2">{n.label}</span>
                <Toggle on={n.on} />
              </div>
            ))}

            <Separator className="my-3" />

            <div className="text-xs font-medium text-zinc-500">Tùy chọn hệ thống</div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="space-y-1">
                <Label className="text-xs">Ngôn ngữ</Label>
                <Input defaultValue="Tiếng Việt" disabled />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Giao diện</Label>
                <Input defaultValue="Sáng" disabled />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
        <Card className="lg:col-span-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Thiết bị đăng nhập</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <DeviceRow
              icon={<Monitor className="h-4 w-4" />}
              title="Chrome trên macOS"
              hint="IP 192.168.1.12 · Hà Nội, VN"
              active
            />
            <DeviceRow
              icon={<Smartphone className="h-4 w-4" />}
              title="iPhone 15 Pro"
              hint="Lần cuối: 3 giờ trước"
            />
            <DeviceRow
              icon={<Monitor className="h-4 w-4" />}
              title="Chrome trên Windows"
              hint="Lần cuối: 2 ngày trước"
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Ứng dụng kết nối</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            {[
              { name: "Google Workspace", on: true, tone: "success" as const },
              { name: "Slack", on: true, tone: "success" as const },
              { name: "GitHub", on: false, tone: "default" as const },
              { name: "Jira", on: false, tone: "default" as const },
              { name: "Zalo OA", on: true, tone: "success" as const },
              { name: "Hubspot CRM", on: false, tone: "default" as const },
            ].map((a) => (
              <StatChip key={a.name} label={a.name} value={a.on ? "ON" : "OFF"} tone={a.tone} />
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <Card className="lg:col-span-7">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Settings className="h-4 w-4 text-indigo-600" />
              Hoạt động gần đây
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityFeed
              items={[
                { id: "1", actor: "Bạn", action: "đăng nhập từ Chrome trên macOS", time: "vừa xong", avatarColor: "bg-indigo-600" },
                { id: "2", actor: "Bạn", action: "cập nhật avatar", time: "1 giờ trước", avatarColor: "bg-violet-600" },
                { id: "3", actor: "Bạn", action: "duyệt bonus tháng 4 cho Nguyễn Hải H", time: "hôm qua", avatarColor: "bg-emerald-600" },
                { id: "4", actor: "Bạn", action: "thay đổi target KPI MKT.LEADS", time: "3 ngày trước", avatarColor: "bg-amber-500" },
                { id: "5", actor: "Bạn", action: "bật 2FA — đã huỷ trong 5 phút", time: "1 tuần trước", avatarColor: "bg-rose-600" },
              ]}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Quyền truy cập dữ liệu</CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressList
              rows={[
                { label: "KPI công ty", value: 100, max: 100, right: "Full", color: "#10b981" },
                { label: "Payroll toàn bộ", value: 100, max: 100, right: "Full", color: "#10b981" },
                { label: "Finance (P&L/BS/CF)", value: 100, max: 100, right: "Full", color: "#10b981" },
                { label: "Audit log", value: 100, max: 100, right: "Full", color: "#10b981" },
                { label: "Phê duyệt", value: 100, max: 100, right: "CEO", color: "#6366f1" },
              ]}
            />
            <div className="mt-3 text-xs text-zinc-500">
              Role hiện tại: <Badge variant="info">CEO</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SecurityRow({
  icon,
  label,
  hint,
  action,
  status,
}: {
  icon: React.ReactNode;
  label: string;
  hint: string;
  action: string;
  status: "ok" | "warn" | "bad";
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-start gap-2 min-w-0">
        <span className="mt-0.5 shrink-0">{icon}</span>
        <div className="min-w-0">
          <div className="font-medium text-zinc-900 truncate">{label}</div>
          <div className="text-xs text-zinc-500 truncate">{hint}</div>
        </div>
      </div>
      {action ? (
        <Button size="sm" variant={status === "warn" ? "default" : "outline"}>
          {action}
        </Button>
      ) : (
        <Badge variant="success">OK</Badge>
      )}
    </div>
  );
}

function DeviceRow({
  icon,
  title,
  hint,
  active,
}: {
  icon: React.ReactNode;
  title: string;
  hint: string;
  active?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-zinc-100 p-3">
      <div className="flex items-start gap-3 min-w-0">
        <span className="shrink-0 h-8 w-8 rounded-lg bg-zinc-50 text-zinc-600 flex items-center justify-center">
          {icon}
        </span>
        <div className="min-w-0">
          <div className="font-medium text-zinc-900 text-sm truncate">{title}</div>
          <div className="text-xs text-zinc-500 truncate">{hint}</div>
        </div>
      </div>
      {active ? (
        <Badge variant="success" className="shrink-0">
          Đang hoạt động
        </Badge>
      ) : (
        <Button size="sm" variant="outline">
          Đăng xuất
        </Button>
      )}
    </div>
  );
}

function Toggle({ on }: { on: boolean }) {
  return (
    <span
      className={`inline-flex h-5 w-9 rounded-full transition-colors ${
        on ? "bg-indigo-600" : "bg-zinc-200"
      }`}
    >
      <span
        className={`h-4 w-4 rounded-full bg-white shadow transform transition-transform mt-0.5 ${
          on ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
    </span>
  );
}
