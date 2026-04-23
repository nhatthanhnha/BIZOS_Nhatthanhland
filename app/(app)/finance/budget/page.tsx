import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { Badge } from "@/components/ui/badge";
import { fetchDepartments } from "@/lib/queries";
import { formatCompactVND, formatPercent } from "@/lib/utils";

export default async function BudgetPage() {
  const departments = await fetchDepartments();

  type Row = {
    id: string;
    name: string;
    planned: number;
    actual: number;
    variance: number;
    variance_pct: number;
  };

  // Mock actuals ~ 85-110% of planned.
  const rows: Row[] = departments.map((d) => {
    const factor = 0.85 + (d.id.charCodeAt(d.id.length - 1) % 25) / 100;
    const actual = Math.round(d.budget_monthly * factor);
    const variance = actual - d.budget_monthly;
    const variance_pct = (variance / d.budget_monthly) * 100;
    return { id: d.id, name: d.name, planned: d.budget_monthly, actual, variance, variance_pct };
  });

  const totalPlanned = rows.reduce((s, r) => s + r.planned, 0);
  const totalActual = rows.reduce((s, r) => s + r.actual, 0);
  const totalVar = totalActual - totalPlanned;

  const columns: Column<Row>[] = [
    { key: "name", header: "Phòng ban", render: (r) => <span className="font-medium">{r.name}</span> },
    { key: "planned", header: "Kế hoạch", align: "right", render: (r) => formatCompactVND(r.planned) },
    { key: "actual", header: "Thực tế", align: "right", render: (r) => formatCompactVND(r.actual) },
    {
      key: "variance",
      header: "Chênh lệch",
      align: "right",
      render: (r) => (
        <span className={r.variance > 0 ? "text-red-700" : "text-emerald-700"}>
          {r.variance > 0 ? "+" : ""}
          {formatCompactVND(r.variance)}
        </span>
      ),
    },
    {
      key: "pct",
      header: "",
      align: "right",
      render: (r) => (
        <Badge variant={r.variance_pct > 5 ? "danger" : r.variance_pct < -5 ? "success" : "warning"}>
          {formatPercent(r.variance_pct, 1)}
        </Badge>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Budget vs Actual" description="Đối chiếu ngân sách phòng ban tháng 4/2026" />

      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card className="p-4">
          <div className="text-xs text-zinc-500">Tổng planned</div>
          <div className="text-2xl font-bold">{formatCompactVND(totalPlanned)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-zinc-500">Tổng actual</div>
          <div className="text-2xl font-bold">{formatCompactVND(totalActual)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-zinc-500">Chênh lệch</div>
          <div className={`text-2xl font-bold ${totalVar > 0 ? "text-red-600" : "text-emerald-600"}`}>
            {formatCompactVND(totalVar)}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chi tiết theo phòng ban</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} rows={rows} />
        </CardContent>
      </Card>
    </div>
  );
}
