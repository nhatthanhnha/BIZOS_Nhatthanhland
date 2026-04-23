import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/kpi/KpiCard";
import { fetchTasks, fetchEmployees, fetchKpis } from "@/lib/queries";
import type { Task } from "@/types/domain";
import Link from "next/link";

const COLUMNS: Array<{ key: Task["status"]; label: string; tone: string }> = [
  { key: "todo", label: "To do", tone: "bg-zinc-100 text-zinc-700" },
  { key: "in_progress", label: "Đang làm", tone: "bg-indigo-100 text-indigo-700" },
  { key: "review", label: "Review", tone: "bg-violet-100 text-violet-700" },
  { key: "blocked", label: "Blocked", tone: "bg-red-100 text-red-700" },
  { key: "done", label: "Hoàn thành", tone: "bg-emerald-100 text-emerald-700" },
];

export default async function OperationsPage() {
  const [tasks, employees, kpis] = await Promise.all([fetchTasks(), fetchEmployees(), fetchKpis()]);

  const open = tasks.filter((t) => t.status !== "done" && t.status !== "cancelled");
  const overdue = open.filter((t) => t.due_date && new Date(t.due_date) < new Date("2026-04-23"));
  const withKpi = tasks.filter((t) => t.linked_kpi_id).length;
  const kpiLinkPct = tasks.length ? Math.round((withKpi / tasks.length) * 100) : 0;
  const adminCount = tasks.filter((t) => t.task_type === "admin").length;
  const growthCount = tasks.filter((t) => t.task_type === "growth").length;

  return (
    <div>
      <PageHeader
        title="Công việc hằng ngày"
        description="Task board · SLA · Task-to-KPI mapping"
        actions={<Button>+ Task mới</Button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
        <KpiCard label="Tổng task" value={String(tasks.length)} accent="indigo" />
        <KpiCard label="Đang mở" value={String(open.length)} accent="violet" />
        <KpiCard label="Overdue" value={String(overdue.length)} accent="red" />
        <KpiCard label="% gắn KPI" value={`${kpiLinkPct}%`} accent="emerald" />
        <KpiCard label="Growth tasks" value={String(growthCount)} accent="indigo" />
        <KpiCard label="Admin tasks" value={String(adminCount)} accent="amber" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.key);
          return (
            <div key={col.key} className="rounded-xl bg-zinc-50 border border-zinc-200 p-3 min-h-[500px]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${col.tone}`}>
                    {col.label}
                  </span>
                </div>
                <span className="text-xs text-zinc-500">{colTasks.length}</span>
              </div>
              <div className="space-y-2">
                {colTasks.map((t) => {
                  const assignee = employees.find((e) => e.id === t.assignee_id);
                  const kpi = kpis.find((k) => k.id === t.linked_kpi_id);
                  return (
                    <Card key={t.id} className="p-3 shadow-sm">
                      <div className="text-sm font-medium text-zinc-900 mb-1">{t.title}</div>
                      <div className="flex items-center gap-1.5 flex-wrap mb-2">
                        {t.priority !== "normal" && (
                          <Badge variant={t.priority === "urgent" ? "danger" : t.priority === "high" ? "warning" : "outline"}>
                            {t.priority}
                          </Badge>
                        )}
                        <Badge variant="outline">{t.task_type}</Badge>
                        {kpi && <Badge variant="info">{kpi.code}</Badge>}
                      </div>
                      <div className="flex items-center justify-between text-xs text-zinc-500">
                        <div className="flex items-center gap-1">
                          {assignee && (
                            <>
                              <span className="h-5 w-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-semibold">
                                {assignee.full_name.slice(0, 1)}
                              </span>
                              <span>{assignee.full_name}</span>
                            </>
                          )}
                        </div>
                        <span>{t.due_date?.slice(5) ?? "—"}</span>
                      </div>
                    </Card>
                  );
                })}
                {colTasks.length === 0 && (
                  <div className="text-xs text-zinc-400 text-center py-4">Không có task</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Low-value work detector</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-zinc-700 space-y-2">
          <p>
            Có <strong>{tasks.length - withKpi}</strong> task chưa gắn KPI —{" "}
            <Link href="/settings" className="text-indigo-600">
              review lại ở Settings
            </Link>
            .
          </p>
          <p>
            Tỷ lệ growth/admin: <Badge variant="info">{growthCount}</Badge> growth vs{" "}
            <Badge variant="outline">{adminCount}</Badge> admin. Giữ growth work &gt; 40% để tránh
            "bận rộn nhưng không tạo value".
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
