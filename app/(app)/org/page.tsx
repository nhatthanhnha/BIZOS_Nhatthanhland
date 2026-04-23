import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/kpi/KpiCard";
import { OrgGraph } from "@/components/org/OrgGraph";
import { fetchDepartments, fetchEmployees, demo } from "@/lib/queries";
import { formatCompactVND } from "@/lib/utils";

export default async function OrgPage() {
  const [departments, employees] = await Promise.all([fetchDepartments(), fetchEmployees()]);

  const totalHeadcount = employees.length;
  const totalPayroll = employees.reduce((s, e) => s + e.base_salary, 0);
  const spanOfControl = (totalHeadcount / departments.length).toFixed(1);

  return (
    <div>
      <PageHeader
        title="Sơ đồ tổ chức"
        description="Company → Department → Team → Individual"
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <KpiCard label="Tổng nhân sự" value={String(totalHeadcount)} hint="active" accent="indigo" />
        <KpiCard label="Phòng ban" value={String(departments.length)} accent="violet" />
        <KpiCard label="Quỹ lương/tháng" value={formatCompactVND(totalPayroll)} accent="emerald" />
        <KpiCard label="Span of control" value={`1 : ${spanOfControl}`} accent="amber" />
        <KpiCard label="KPI công ty" value="91%" delta={2.3} accent="indigo" />
      </div>

      <Card className="mb-6">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Cây tổ chức</CardTitle>
          <Badge variant="info">{demo.demoCompany.name}</Badge>
        </CardHeader>
        <CardContent>
          <OrgGraph company={demo.demoCompany} departments={departments} employees={employees} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Phòng ban</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {departments.map((d) => {
              const count = employees.filter((e) => e.department_id === d.id).length;
              const head = employees.find((e) => e.id === d.head_employee_id);
              return (
                <div
                  key={d.id}
                  className="flex items-center justify-between rounded-lg border border-zinc-100 p-3"
                >
                  <div>
                    <div className="font-medium text-zinc-900">{d.name}</div>
                    <div className="text-xs text-zinc-500">
                      {head?.full_name ?? "Chưa có head"} · {count} người
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-zinc-900">
                      {formatCompactVND(d.budget_monthly)}
                    </div>
                    <div className="text-xs text-zinc-400">budget/tháng</div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ghi chú cấu trúc</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-zinc-600 space-y-3">
            <p>
              • Mỗi phòng ban là một <strong>cost center</strong> với budget monthly được theo dõi trong module Finance.
            </p>
            <p>
              • <strong>Span of control</strong> hiện tại {spanOfControl} người/head — tối ưu khi 1:5 đến 1:8.
            </p>
            <p>
              • Click node nhân sự trong graph để xem KPI cá nhân, payroll và impact path lên KPI công ty.
            </p>
            <p>
              • Chế độ xem KPI / Cost / Headcount / Project sẽ được bổ sung trong bước polish.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
