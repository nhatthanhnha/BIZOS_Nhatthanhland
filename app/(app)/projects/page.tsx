import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/kpi/KpiCard";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { fetchProjects, fetchEmployees } from "@/lib/queries";
import { formatCompactVND } from "@/lib/utils";
import type { Project } from "@/types/domain";

const statusTone: Record<Project["status"], "success" | "info" | "warning" | "outline" | "danger"> = {
  draft: "outline",
  active: "info",
  paused: "warning",
  done: "success",
  cancelled: "danger",
};

export default async function ProjectsPage() {
  const [projects, employees] = await Promise.all([fetchProjects(), fetchEmployees()]);

  type Row = Project & { owner_name: string };
  const rows: Row[] = projects.map((p) => ({
    ...p,
    owner_name: employees.find((e) => e.id === p.owner_id)?.full_name ?? "—",
  }));

  const active = projects.filter((p) => p.status === "active").length;
  const totalBudget = projects.reduce((s, p) => s + p.budget, 0);

  const columns: Column<Row>[] = [
    {
      key: "name",
      header: "Dự án",
      render: (p) => (
        <Link href={`/projects/${p.id}`} className="font-medium hover:text-indigo-700">
          {p.name}
          <div className="text-xs text-zinc-500 font-mono">{p.code}</div>
        </Link>
      ),
    },
    { key: "owner", header: "Owner", render: (p) => p.owner_name },
    { key: "budget", header: "Budget", align: "right", render: (p) => formatCompactVND(p.budget) },
    { key: "start", header: "Bắt đầu", render: (p) => p.starts_at ?? "—" },
    { key: "end", header: "Kết thúc", render: (p) => p.ends_at ?? "—" },
    {
      key: "status",
      header: "",
      align: "right",
      render: (p) => <Badge variant={statusTone[p.status]}>{p.status}</Badge>,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Dự án"
        description="Initiative / Project tracking với ROI và cross-team dependencies"
        actions={<Button>+ Dự án mới</Button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <KpiCard label="Tổng dự án" value={String(projects.length)} accent="indigo" />
        <KpiCard label="Đang chạy" value={String(active)} accent="emerald" />
        <KpiCard label="Tổng budget" value={formatCompactVND(totalBudget)} accent="amber" />
        <KpiCard label="Sắp deadline" value="2" accent="red" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách dự án</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} rows={rows} />
        </CardContent>
      </Card>
    </div>
  );
}
