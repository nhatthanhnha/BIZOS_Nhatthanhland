import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/kpi/KpiCard";
import { KpiStatusBadge } from "@/components/kpi/KpiStatusBadge";
import { KpiTreeGraph } from "@/components/kpi/KpiTreeGraph";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { fetchKpis, fetchKpiTargets, fetchKpiActuals } from "@/lib/queries";
import { buildKpiRows } from "@/lib/kpi/cascade";

export default async function KpiPage() {
  const [kpis, targets, actuals] = await Promise.all([
    fetchKpis(),
    fetchKpiTargets(),
    fetchKpiActuals(),
  ]);
  const rows = buildKpiRows(kpis, targets, actuals);

  const companyRows = rows.filter((r) => r.level === "company");
  const redCount = rows.filter((r) => r.status === "red").length;
  const yellowCount = rows.filter((r) => r.status === "yellow").length;
  const greenCount = rows.filter((r) => r.status === "green").length;

  const columns: Column<(typeof rows)[number]>[] = [
    {
      key: "name",
      header: "KPI",
      render: (r) => (
        <Link href={`/kpi/${r.id}`} className="font-medium hover:text-indigo-700">
          {r.name}
          <div className="text-xs text-zinc-500 font-mono">{r.code}</div>
        </Link>
      ),
    },
    { key: "level", header: "Cấp", render: (r) => <Badge variant="outline">{r.level}</Badge> },
    { key: "unit", header: "Đơn vị", render: (r) => r.unit },
    {
      key: "target",
      header: "Target",
      align: "right",
      render: (r) => r.target?.toLocaleString("vi-VN") ?? "—",
    },
    {
      key: "actual",
      header: "Thực tế",
      align: "right",
      render: (r) => r.actual?.toLocaleString("vi-VN") ?? "—",
    },
    {
      key: "status",
      header: "",
      align: "right",
      render: (r) => <KpiStatusBadge status={r.status} completion={r.completion} />,
    },
  ];

  return (
    <div>
      <PageHeader
        title="KPI Tree"
        description="Cascade: Company → Department → Team → Employee"
        actions={<Badge variant="info">Tháng 04/2026</Badge>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {companyRows.slice(0, 4).map((r) => (
          <KpiCard
            key={r.id}
            label={r.name}
            value={r.completion != null ? `${Math.round(r.completion * 100)}%` : "—"}
            accent={r.status === "green" ? "emerald" : r.status === "yellow" ? "amber" : r.status === "red" ? "red" : "indigo"}
            hint={r.code ?? undefined}
          />
        ))}
      </div>

      <Card className="mb-6">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Cây KPI</CardTitle>
          <div className="flex items-center gap-2 text-xs">
            <Badge variant="success">{greenCount} green</Badge>
            <Badge variant="warning">{yellowCount} yellow</Badge>
            <Badge variant="danger">{redCount} red</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <KpiTreeGraph rows={rows} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách KPI</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} rows={rows} />
        </CardContent>
      </Card>
    </div>
  );
}
