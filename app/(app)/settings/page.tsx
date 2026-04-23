import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchDepartments, demo } from "@/lib/queries";
import {
  Building2,
  Users,
  Target,
  Wallet,
  Shield,
  Plug,
  Database,
} from "lucide-react";

export default async function SettingsPage() {
  const departments = await fetchDepartments();

  return (
    <div>
      <PageHeader
        title="Cài đặt"
        description="Company structure · KPI formulas · Compensation · Permissions · Integrations"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-indigo-600" />
              <CardTitle>Thông tin công ty</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="space-y-1.5">
              <Label>Tên công ty</Label>
              <Input defaultValue={demo.demoCompany.name} />
            </div>
            <div className="space-y-1.5">
              <Label>Mã công ty</Label>
              <Input defaultValue={demo.demoCompany.code ?? ""} />
            </div>
            <div className="space-y-1.5">
              <Label>Đơn vị tiền tệ</Label>
              <Input defaultValue={demo.demoCompany.currency} />
            </div>
            <div className="space-y-1.5">
              <Label>Timezone</Label>
              <Input defaultValue={demo.demoCompany.timezone} />
            </div>
            <Button className="w-full">Lưu</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-violet-600" />
              <CardTitle>Cơ cấu tổ chức</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {departments.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between rounded-lg border border-zinc-100 p-2.5"
              >
                <div>
                  <div className="font-medium text-zinc-900">{d.name}</div>
                  <div className="text-xs text-zinc-500">{d.code}</div>
                </div>
                <Button size="sm" variant="outline">
                  Sửa
                </Button>
              </div>
            ))}
            <Button variant="secondary" className="w-full">
              + Thêm phòng ban
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-600" />
              <CardTitle>Phân quyền</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {[
              { role: "CEO / Founder", count: 1, tone: "danger" as const },
              { role: "CFO", count: 1, tone: "warning" as const },
              { role: "HR Admin", count: 1, tone: "info" as const },
              { role: "Department Head", count: 6, tone: "info" as const },
              { role: "Team Lead", count: 4, tone: "outline" as const },
              { role: "Employee", count: 14, tone: "outline" as const },
              { role: "Auditor", count: 0, tone: "outline" as const },
            ].map((r) => (
              <div
                key={r.role}
                className="flex items-center justify-between rounded-lg border border-zinc-100 p-2.5"
              >
                <span className="text-zinc-700">{r.role}</span>
                <Badge variant={r.tone}>{r.count} người</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-indigo-600" />
              <CardTitle>KPI Formula Engine</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-zinc-700">
            <p>Công thức hỗ trợ: sum, sub, mul, avg, weighted_avg, ratio, milestone, ref.</p>
            <p>
              Lưu dạng JSONB AST trong <code className="text-xs">kpi_formulas.definition</code>.
            </p>
            <p>
              Ví dụ: <code className="text-xs">{"{op:'mul',args:[{ref:'mql'},{ref:'close'}]}"}</code>
            </p>
            <Button variant="outline" className="w-full mt-2">
              Mở formula editor
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-amber-600" />
              <CardTitle>Compensation Policies</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-zinc-700">
            <p>Salary templates, bonus rules, commission rules, company multiplier.</p>
            <p>
              Rule ngưỡng: 0% → &lt;80% KPI, 50% → 80-89%, 75% → 90-99%, 100% → 100-119%, 150% → ≥120%.
            </p>
            <Button variant="outline" className="w-full mt-2">
              Mở rule designer
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Plug className="h-5 w-5 text-violet-600" />
              <CardTitle>Integrations</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {[
              { name: "Google Sheets", active: true },
              { name: "Accounting (MISA)", active: false },
              { name: "CRM (HubSpot)", active: false },
              { name: "Chấm công", active: true },
              { name: "POS / ERP", active: false },
            ].map((i) => (
              <div
                key={i.name}
                className="flex items-center justify-between rounded-lg border border-zinc-100 p-2.5"
              >
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-zinc-500" />
                  <span className="text-zinc-700">{i.name}</span>
                </div>
                <Badge variant={i.active ? "success" : "outline"}>
                  {i.active ? "Đang kết nối" : "Chưa kết nối"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
