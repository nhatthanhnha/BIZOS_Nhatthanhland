import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/kpi/KpiCard";
import { KpiStatusBadge } from "@/components/kpi/KpiStatusBadge";
import { DataTable, type Column } from "@/components/tables/DataTable";
import {
  fetchEmployees,
  fetchDepartments,
  fetchKpis,
  fetchKpiTargets,
  fetchKpiActuals,
  fetchTasks,
  fetchPayroll,
} from "@/lib/queries";
import { buildKpiRows } from "@/lib/kpi/cascade";
import { computePayroll } from "@/lib/compensation/ruleEngine";
import { formatVND, formatCompactVND, formatPercent } from "@/lib/utils";

export default async function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [employees, departments, kpis, targets, actuals, tasks, payroll] = await Promise.all([
    fetchEmployees(),
    fetchDepartments(),
    fetchKpis(),
    fetchKpiTargets(),
    fetchKpiActuals(),
    fetchTasks(),
    fetchPayroll(),
  ]);

  const emp = employees.find((e) => e.id === id);
  if (!emp) notFound();

  const dept = departments.find((d) => d.id === emp.department_id);
  const manager = employees.find((m) => m.id === emp.manager_id);

  const empKpiRows = buildKpiRows(
    kpis.filter((k) => k.owner_employee_id === emp.id),
    targets,
    actuals,
  );
  const empTasks = tasks.filter((t) => t.assignee_id === emp.id);

  const payrollEntry = payroll.find((p) => p.employee_id === emp.id);
  const avgCompletion = empKpiRows.length
    ? empKpiRows.reduce((s, r) => s + (r.completion ?? 0), 0) / empKpiRows.length
    : 1;
  const simulated = computePayroll({
    base_salary: emp.base_salary,
    allowance: Math.round(emp.base_salary * 0.05),
    kpi_completion: avgCompletion,
    team_completion: 0.95,
    company_completion: 0.91,
  });

  const kpiColumns: Column<(typeof empKpiRows)[number]>[] = [
    { key: "name", header: "KPI", render: (r) => <span className="font-medium">{r.name}</span> },
    { key: "target", header: "Target", align: "right", render: (r) => r.target?.toLocaleString("vi-VN") ?? "—" },
    { key: "actual", header: "Thực tế", align: "right", render: (r) => r.actual?.toLocaleString("vi-VN") ?? "—" },
    { key: "status", header: "", align: "right", render: (r) => <KpiStatusBadge status={r.status} completion={r.completion} /> },
  ];

  const taskColumns: Column<(typeof empTasks)[number]>[] = [
    { key: "title", header: "Task", render: (t) => t.title },
    { key: "priority", header: "Priority", render: (t) => <Badge variant={t.priority === "urgent" ? "danger" : "outline"}>{t.priority}</Badge> },
    { key: "due", header: "Hạn", render: (t) => t.due_date ?? "—" },
    { key: "status", header: "", align: "right", render: (t) => <Badge variant={t.status === "done" ? "success" : "outline"}>{t.status}</Badge> },
  ];

  return (
    <div>
      <PageHeader
        title={emp.full_name}
        description={`${dept?.name ?? "—"} · ${emp.code ?? ""}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-1">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
              {emp.full_name.slice(0, 1)}
            </div>
            <div className="mt-3 font-semibold text-lg text-zinc-900">{emp.full_name}</div>
            <div className="text-sm text-zinc-500">{emp.email}</div>
            <Badge variant={emp.status === "active" ? "success" : "outline"} className="mt-2">
              {emp.status}
            </Badge>
            <div className="mt-4 w-full text-sm space-y-2 text-left">
              <Row k="Phòng ban" v={dept ? <Link href={`/departments/${dept.id}`} className="text-indigo-600">{dept.name}</Link> : "—"} />
              <Row k="Manager" v={manager?.full_name ?? "—"} />
              <Row k="Ngày vào" v={emp.join_date ?? "—"} />
              <Row k="Loại hợp đồng" v={emp.employment_type} />
              <Row k="Lương cơ bản" v={formatVND(emp.base_salary)} />
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KpiCard label="KPI TB" value={formatPercent(avgCompletion * 100, 0)} accent="indigo" />
            <KpiCard label="Task đang mở" value={String(empTasks.filter((t) => t.status !== "done" && t.status !== "cancelled").length)} accent="violet" />
            <KpiCard label="Gross pay (mô phỏng)" value={formatCompactVND(simulated.gross_pay)} accent="emerald" />
            <KpiCard label="Cost to company" value={formatCompactVND(simulated.company_cost)} accent="amber" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Compensation breakdown (mô phỏng)</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1.5">
              <Row k="Lương cơ bản" v={formatVND(simulated.base_salary)} />
              <Row k="Phụ cấp" v={formatVND(simulated.allowance)} />
              <Row k="Hoa hồng" v={formatVND(simulated.commission)} />
              <Row k="KPI bonus" v={formatVND(simulated.kpi_bonus)} />
              <Row k="Team bonus" v={formatVND(simulated.team_bonus)} />
              <Row k="Company bonus" v={formatVND(simulated.company_bonus)} />
              <Row k={<strong>Gross pay</strong>} v={<strong>{formatVND(simulated.gross_pay)}</strong>} />
              <Row k={<strong>Net pay</strong>} v={<strong>{formatVND(simulated.net_pay)}</strong>} />
              <Row k="Multiplier áp dụng" v={`x${simulated.multiplier_applied}`} />
              {payrollEntry && (
                <div className="mt-3 rounded-lg border border-dashed border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-500">
                  Payroll entry thực tế tháng này: gross {formatVND(payrollEntry.gross_pay)}, net {formatVND(payrollEntry.net_pay)}.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>KPI cá nhân</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable columns={kpiColumns} rows={empKpiRows} empty="Chưa gán KPI" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task hiện tại</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable columns={taskColumns} rows={empTasks} empty="Không có task" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Impact path</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-zinc-700">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="info">{emp.full_name}</Badge>
            <span className="text-zinc-400">→</span>
            {empKpiRows.slice(0, 2).map((k) => (
              <Badge key={k.id} variant="outline">
                {k.name}
              </Badge>
            ))}
            <span className="text-zinc-400">→</span>
            <Badge variant="outline">{dept?.name ?? "Dept"}</Badge>
            <span className="text-zinc-400">→</span>
            <Badge variant="success">KPI công ty</Badge>
            <span className="text-zinc-400">→</span>
            <Badge variant="info">Revenue / Profit</Badge>
          </div>
          <p className="mt-3 text-xs text-zinc-500">
            Nếu KPI cá nhân đạt đúng ngưỡng, KPI phòng ban và KPI công ty sẽ đạt theo công thức cascade.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ k, v }: { k: React.ReactNode; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-zinc-500">{k}</span>
      <span className="text-zinc-900">{v}</span>
    </div>
  );
}
