import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/kpi/KpiCard";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { fetchRequisitions, fetchDepartments } from "@/lib/queries";
import type { JobRequisition } from "@/types/domain";

export default async function RecruitingPage() {
  const [requisitions, departments] = await Promise.all([
    fetchRequisitions(),
    fetchDepartments(),
  ]);

  type Row = JobRequisition & { dept_name: string };
  const rows: Row[] = requisitions.map((r) => ({
    ...r,
    dept_name: departments.find((d) => d.id === r.department_id)?.name ?? "—",
  }));

  const open = requisitions.filter((r) => r.status === "open").length;
  const totalHeadcount = requisitions.reduce((s, r) => s + r.headcount, 0);

  const columns: Column<Row>[] = [
    { key: "title", header: "Vị trí", render: (r) => <span className="font-medium">{r.title}</span> },
    { key: "dept", header: "Phòng ban", render: (r) => r.dept_name },
    { key: "headcount", header: "Số lượng", align: "center", render: (r) => String(r.headcount) },
    { key: "opened", header: "Mở", render: (r) => r.opened_at ?? "—" },
    {
      key: "status",
      header: "",
      align: "right",
      render: (r) => (
        <Badge
          variant={r.status === "open" ? "info" : r.status === "pipeline" ? "warning" : "outline"}
        >
          {r.status}
        </Badge>
      ),
    },
  ];

  const skillGaps = [
    { skill: "Performance Marketing", current: 2, target: 4, dept: "Marketing" },
    { skill: "Enterprise Sales", current: 3, target: 5, dept: "Sales" },
    { skill: "Data Analytics", current: 1, target: 3, dept: "Operations" },
    { skill: "Customer Success Ops", current: 2, target: 3, dept: "CS" },
  ];

  return (
    <div>
      <PageHeader
        title="Tuyển dụng & Năng lực"
        description="Job requisition · Skill matrix · Succession planning"
        actions={<Button>+ Yêu cầu tuyển dụng</Button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <KpiCard label="Vị trí đang mở" value={String(open)} accent="indigo" />
        <KpiCard label="Headcount cần tuyển" value={String(totalHeadcount)} accent="violet" />
        <KpiCard label="Skill gap" value={String(skillGaps.length)} accent="amber" />
        <KpiCard label="Time-to-hire TB" value="38 ngày" accent="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Job requisitions</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} rows={rows} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skill gap</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {skillGaps.map((g) => {
              const pct = Math.round((g.current / g.target) * 100);
              return (
                <div key={g.skill}>
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <div className="text-sm font-medium text-zinc-900">{g.skill}</div>
                      <div className="text-xs text-zinc-500">{g.dept}</div>
                    </div>
                    <span className="text-xs text-zinc-500">
                      {g.current}/{g.target}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-zinc-100">
                    <div
                      className={`h-1.5 rounded-full ${
                        pct >= 80 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-red-500"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
