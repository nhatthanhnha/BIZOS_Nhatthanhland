import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/kpi/KpiCard";
import { KpiStatusBadge } from "@/components/kpi/KpiStatusBadge";
import { DataTable, type Column } from "@/components/tables/DataTable";
import {
  fetchDepartments,
  fetchEmployees,
  fetchKpis,
  fetchKpiActuals,
  fetchKpiTargets,
  fetchTasks,
  fetchPayroll,
} from "@/lib/queries";
import { buildKpiRows } from "@/lib/kpi/cascade";
import { formatCompactVND, formatPercent } from "@/lib/utils";
import type { Employee } from "@/types/domain";

export default async function DepartmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [departments, employees, kpis, targets, actuals, tasks, payroll] = await Promise.all([
    fetchDepartments(),
    fetchEmployees(),
    fetchKpis(),
    fetchKpiTargets(),
    fetchKpiActuals(),
    fetchTasks(),
    fetchPayroll(),
  ]);

  const dept = departments.find((d) => d.id === id);
  if (!dept) notFound();

  const head = employees.find((e) => e.id === dept.head_employee_id);
  const deptEmployees = employees.filter((e) => e.department_id === dept.id);
  const deptKpis = buildKpiRows(
    kpis.filter((k) => k.owner_department_id === dept.id || deptEmployees.some((e) => e.id === k.owner_employee_id)),
    targets,
    actuals,
  );
  const deptTasks = tasks.filter((t) => t.department_id === dept.id);
  const deptPayrollCost = payroll
    .filter((p) => deptEmployees.some((e) => e.id === p.employee_id))
    .reduce((s, p) => s + p.company_cost, 0);

  const kpiColumns: Column<(typeof deptKpis)[number]>[] = [
    { key: "name", header: "KPI", render: (r) => <span className="font-medium">{r.name}</span> },
    { key: "code", header: "Mã", render: (r) => <span className="font-mono text-xs">{r.code}</span> },
    { key: "target", header: "Target", align: "right", render: (r) => (r.target != null ? r.target.toLocaleString("vi-VN") : "—") },
    { key: "actual", header: "Thực tế", align: "right", render: (r) => (r.actual != null ? r.actual.toLocaleString("vi-VN") : "—") },
    {
      key: "status",
      header: "Trạng thái",
      align: "right",
      render: (r) => <KpiStatusBadge status={r.status} completion={r.completion} />,
    },
  ];

  type EmpRow = Employee & { kpi_count: number };
  const empRows: EmpRow[] = deptEmployees.map((e) => ({
    ...e,
    kpi_count: kpis.filter((k) => k.owner_employee_id === e.id).length,
  }));

  const empColumns: Column<EmpRow>[] = [
    {
      key: "name",
      header: "Nhân sự",
      render: (e) => (
        <Link href={`/people/${e.id}`} className="font-medium hover:text-indigo-700">
          {e.full_name}
          <div className="text-xs text-zinc-500">{e.email}</div>
        </Link>
      ),
    },
    { key: "salary", header: "Lương cơ bản", align: "right", render: (e) => formatCompactVND(e.base_salary) },
    { key: "kpi", header: "KPI", align: "right", render: (e) => String(e.kpi_count) },
    {
      key: "status",
      header: "",
      align: "right",
      render: (e) => <Badge variant={e.status === "active" ? "success" : "outline"}>{e.status}</Badge>,
    },
  ];

  const taskColumns: Column<(typeof deptTasks)[number]>[] = [
    { key: "title", header: "Task", render: (t) => <span className="font-medium">{t.title}</span> },
    {
      key: "assignee",
      header: "Người nhận",
      render: (t) => employees.find((e) => e.id === t.assignee_id)?.full_name ?? "—",
    },
    { key: "due", header: "Hạn", render: (t) => t.due_date ?? "—" },
    {
      key: "status",
      header: "",
      align: "right",
      render: (t) => (
        <Badge variant={t.status === "done" ? "success" : t.status === "blocked" ? "danger" : "outline"}>
          {t.status}
        </Badge>
      ),
    },
  ];

  const deptKpiCompletion = deptKpis.filter((k) => k.level === "department").map((k) => k.completion ?? 0);
  const avgCompletion = deptKpiCompletion.length
    ? deptKpiCompletion.reduce((s, v) => s + v, 0) / deptKpiCompletion.length
    : 0;

  return (
    <div>
      <PageHeader
        title={dept.name}
        description={dept.scope ?? `Phòng ban · ${dept.code}`}
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <KpiCard label="Head" value={head?.full_name ?? "—"} accent="indigo" />
        <KpiCard label="Nhân sự" value={String(deptEmployees.length)} accent="violet" />
        <KpiCard label="Budget/tháng" value={formatCompactVND(dept.budget_monthly)} accent="amber" />
        <KpiCard label="Payroll cost" value={formatCompactVND(deptPayrollCost)} accent="red" />
        <KpiCard label="KPI trung bình" value={formatPercent(avgCompletion * 100, 0)} accent="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>KPI phòng ban</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable columns={kpiColumns} rows={deptKpis} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Phân bổ task theo loại</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {(["growth", "maintenance", "admin", "urgent"] as const).map((t) => {
              const count = deptTasks.filter((x) => x.task_type === t).length;
              const pct = deptTasks.length ? Math.round((count / deptTasks.length) * 100) : 0;
              return (
                <div key={t}>
                  <div className="flex justify-between mb-1">
                    <span className="capitalize text-zinc-600">{t}</span>
                    <span className="text-zinc-900 font-medium">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-zinc-100">
                    <div
                      className="h-1.5 rounded-full bg-indigo-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Nhân sự</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable columns={empColumns} rows={empRows} empty="Phòng ban chưa có nhân sự" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task hiện tại</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable columns={taskColumns} rows={deptTasks} empty="Không có task" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
