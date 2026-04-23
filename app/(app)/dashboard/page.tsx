import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/kpi/KpiCard";
import { AreaTrend } from "@/components/charts/AreaTrend";
import { DonutStat } from "@/components/charts/DonutStat";
import { BarCompare } from "@/components/charts/BarCompare";
import {
  fetchKpis,
  fetchKpiTargets,
  fetchKpiActuals,
  fetchEmployees,
  fetchPayroll,
  fetchTasks,
  fetchAlerts,
  fetchAccounting,
  fetchDepartments,
  demo,
} from "@/lib/queries";
import { buildKpiRows } from "@/lib/kpi/cascade";
import { formatCompactVND, formatPercent } from "@/lib/utils";

export default async function DashboardPage() {
  const [kpis, targets, actuals, employees, payroll, tasks, alerts, entries, departments] = await Promise.all([
    fetchKpis(),
    fetchKpiTargets(),
    fetchKpiActuals(),
    fetchEmployees(),
    fetchPayroll(),
    fetchTasks(),
    fetchAlerts(),
    fetchAccounting(),
    fetchDepartments(),
  ]);

  const rows = buildKpiRows(kpis, targets, actuals);
  const revenueRow = rows.find((r) => r.code === "REV");
  const gpRow = rows.find((r) => r.code === "GP");
  const npRow = rows.find((r) => r.code === "NP");

  const revenue = entries.filter((e) => e.account_code === "511").reduce((s, e) => s + e.credit, 0);
  const payrollCost = payroll.reduce((s, p) => s + p.company_cost, 0);
  const companyKpiAvg =
    rows.filter((r) => r.level === "company").reduce((s, r) => s + (r.completion ?? 0), 0) /
    Math.max(1, rows.filter((r) => r.level === "company").length);

  const openTasks = tasks.filter((t) => t.status !== "done" && t.status !== "cancelled").length;
  const overdueTasks = tasks.filter(
    (t) => t.status !== "done" && t.status !== "cancelled" && t.due_date && new Date(t.due_date) < new Date("2026-04-23"),
  ).length;
  const taskWithKpi = tasks.filter((t) => t.linked_kpi_id).length;
  const kpiLinkPct = tasks.length ? Math.round((taskWithKpi / tasks.length) * 100) : 0;

  const deptRank = departments
    .map((d) => {
      const deptKpis = rows.filter((r) => r.owner_department_id === d.id);
      const avg =
        deptKpis.reduce((s, k) => s + (k.completion ?? 0), 0) / Math.max(1, deptKpis.length);
      return { label: d.name, target: 100, actual: Math.round(avg * 100) };
    })
    .sort((a, b) => b.actual - a.actual);

  const kpiDistro = [
    { name: "Xanh", value: rows.filter((r) => r.status === "green").length, color: "#10b981" },
    { name: "Vàng", value: rows.filter((r) => r.status === "yellow").length, color: "#f59e0b" },
    { name: "Đỏ", value: rows.filter((r) => r.status === "red").length, color: "#ef4444" },
    { name: "Chưa có", value: rows.filter((r) => r.status === "na").length, color: "#d4d4d8" },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard tổng quan"
        description="Business Operating System · Tháng 04/2026"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
        <KpiCard label="Doanh thu tháng" value={formatCompactVND(revenue)} delta={8.4} accent="indigo" />
        <KpiCard label="Gross Profit" value={formatCompactVND(gpRow?.actual ?? 0)} delta={6.1} accent="emerald" />
        <KpiCard label="Net Profit" value={formatCompactVND(npRow?.actual ?? 0)} delta={4.2} accent="violet" />
        <KpiCard label="KPI company" value={formatPercent(companyKpiAvg * 100, 0)} delta={2.3} accent="indigo" />
        <KpiCard label="Headcount" value={String(employees.length)} hint={`${departments.length} phòng ban`} accent="amber" />
        <KpiCard label="Payroll cost" value={formatCompactVND(payrollCost)} accent="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Xu hướng doanh thu 12 tháng</CardTitle>
            <Badge variant="info">{formatCompactVND(revenueRow?.actual ?? 0)}</Badge>
          </CardHeader>
          <CardContent>
            <AreaTrend data={demo.demoRevenueTrend} height={260} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Phân bố KPI</CardTitle>
          </CardHeader>
          <CardContent>
            <DonutStat
              data={kpiDistro}
              centerLabel="Completion"
              centerValue={formatPercent(companyKpiAvg * 100, 0)}
            />
            <div className="mt-4 space-y-1.5">
              {kpiDistro.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                    <span className="text-zinc-600">{d.name}</span>
                  </div>
                  <span className="font-medium text-zinc-900">{d.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Xếp hạng phòng ban theo KPI</CardTitle>
          </CardHeader>
          <CardContent>
            <BarCompare
              data={deptRank}
              bars={[
                { key: "target", name: "Target", color: "#e4e4e7" },
                { key: "actual", name: "Thực tế", color: "#6366f1" },
              ]}
              height={260}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Cảnh báo đang mở</CardTitle>
            <Link href="/alerts" className="text-xs text-indigo-600">
              Xem tất cả →
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {alerts.slice(0, 5).map((a) => (
              <div key={a.id} className="flex items-start gap-2 text-sm">
                <Badge
                  variant={
                    a.severity === "critical" || a.severity === "danger"
                      ? "danger"
                      : a.severity === "warning"
                        ? "warning"
                        : "info"
                  }
                >
                  {a.severity}
                </Badge>
                <span className="text-zinc-700 flex-1">{a.title}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Execution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row k="Task đang mở" v={String(openTasks)} />
            <Row k="Task overdue" v={<span className="text-red-600 font-medium">{overdueTasks}</span>} />
            <Row k="% task gắn KPI" v={`${kpiLinkPct}%`} />
            <Row k="On-time rate" v="91%" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Incentive snapshot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row k="Tổng quỹ lương (gross)" v={formatCompactVND(payroll.reduce((s, p) => s + p.gross_pay, 0))} />
            <Row k="Bonus pool" v={formatCompactVND(payroll.reduce((s, p) => s + p.bonus_total, 0))} />
            <Row
              k="Payroll / Revenue"
              v={formatPercent((payrollCost / Math.max(1, revenue)) * 100, 1)}
            />
            <Row k="Cost to company" v={formatCompactVND(payrollCost)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Finance snapshot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row k="Cash balance" v={formatCompactVND(18_400_000_000)} />
            <Row k="AR" v={formatCompactVND(3_200_000_000)} />
            <Row k="AP" v={formatCompactVND(1_100_000_000)} />
            <Row k="Runway" v="11.5 tháng" />
          </CardContent>
        </Card>
      </div>
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
