import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/kpi/KpiCard";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { IncentiveSimulator } from "@/components/compensation/IncentiveSimulator";
import { fetchEmployees, fetchPayroll, fetchDepartments } from "@/lib/queries";
import { formatVND, formatCompactVND } from "@/lib/utils";
import type { PayrollEntry } from "@/types/domain";

export default async function CompensationPage() {
  const [employees, payroll, departments] = await Promise.all([
    fetchEmployees(),
    fetchPayroll(),
    fetchDepartments(),
  ]);

  type Row = PayrollEntry & { name: string; dept: string };
  const rows: Row[] = payroll.map((p) => {
    const emp = employees.find((e) => e.id === p.employee_id);
    const dept = departments.find((d) => d.id === emp?.department_id);
    return { ...p, name: emp?.full_name ?? "—", dept: dept?.name ?? "—" };
  });

  const totalGross = payroll.reduce((s, p) => s + p.gross_pay, 0);
  const totalNet = payroll.reduce((s, p) => s + p.net_pay, 0);
  const totalCost = payroll.reduce((s, p) => s + p.company_cost, 0);
  const totalBonus = payroll.reduce((s, p) => s + p.bonus_total, 0);

  const columns: Column<Row>[] = [
    { key: "name", header: "Nhân sự", render: (r) => <span className="font-medium">{r.name}</span> },
    { key: "dept", header: "Phòng ban", render: (r) => r.dept },
    { key: "base", header: "Cơ bản", align: "right", render: (r) => formatCompactVND(r.base_salary) },
    { key: "commission", header: "Hoa hồng", align: "right", render: (r) => formatCompactVND(r.commission_total) },
    { key: "bonus", header: "Bonus", align: "right", render: (r) => formatCompactVND(r.bonus_total) },
    { key: "gross", header: "Gross", align: "right", render: (r) => formatVND(r.gross_pay) },
    { key: "net", header: "Net", align: "right", render: (r) => formatVND(r.net_pay) },
    { key: "cost", header: "Cost to company", align: "right", render: (r) => formatVND(r.company_cost) },
  ];

  return (
    <div>
      <PageHeader
        title="Lương thưởng"
        description="Payroll snapshot · Incentive simulator · Kỳ 2026-04"
        actions={<Badge variant="info">Draft</Badge>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <KpiCard label="Tổng gross" value={formatCompactVND(totalGross)} accent="indigo" />
        <KpiCard label="Tổng net" value={formatCompactVND(totalNet)} accent="emerald" />
        <KpiCard label="Cost to company" value={formatCompactVND(totalCost)} accent="amber" />
        <KpiCard label="Bonus pool" value={formatCompactVND(totalBonus)} accent="violet" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Payroll chi tiết</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} rows={rows} />
          </CardContent>
        </Card>

        <IncentiveSimulator />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rule ngưỡng thưởng hiện tại</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {[
              { min: "< 80%", mul: "0.0x", tone: "bg-red-50 text-red-700" },
              { min: "≥ 80%", mul: "0.5x", tone: "bg-orange-50 text-orange-700" },
              { min: "≥ 90%", mul: "0.75x", tone: "bg-amber-50 text-amber-700" },
              { min: "≥ 100%", mul: "1.0x", tone: "bg-emerald-50 text-emerald-700" },
              { min: "≥ 120%", mul: "1.5x", tone: "bg-indigo-50 text-indigo-700" },
            ].map((t) => (
              <div key={t.min} className={`rounded-lg p-3 ${t.tone}`}>
                <div className="text-xs opacity-75">Hoàn thành KPI</div>
                <div className="font-semibold">{t.min}</div>
                <div className="text-xl font-bold mt-1">{t.mul}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
