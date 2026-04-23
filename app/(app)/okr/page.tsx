import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/kpi/KpiCard";
import { fetchObjectives, fetchKeyResults, fetchEmployees, fetchDepartments } from "@/lib/queries";

export default async function OkrPage() {
  const [objs, krs, employees, departments] = await Promise.all([
    fetchObjectives(),
    fetchKeyResults(),
    fetchEmployees(),
    fetchDepartments(),
  ]);

  const onTrack = objs.filter((o) => (o.status ?? "").includes("on_track")).length;
  const atRisk = objs.filter((o) => (o.status ?? "").includes("at_risk")).length;
  const avgProgress = objs.length
    ? objs.reduce((s, o) => s + o.progress_pct, 0) / objs.length
    : 0;

  return (
    <div>
      <PageHeader
        title="Mục tiêu chiến lược (OKR)"
        description="Định hướng chiến lược, liên kết với KPI Tree"
        actions={<Button>+ Thêm Objective</Button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <KpiCard label="Objectives" value={String(objs.length)} accent="indigo" />
        <KpiCard label="On-track" value={String(onTrack)} accent="emerald" />
        <KpiCard label="At-risk" value={String(atRisk)} accent="amber" />
        <KpiCard label="Progress TB" value={`${Math.round(avgProgress)}%`} accent="violet" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {objs.map((o) => {
          const owner = employees.find((e) => e.id === o.owner_employee_id);
          const dept = departments.find((d) => d.id === o.owner_department_id);
          const objKrs = krs.filter((k) => k.objective_id === o.id);
          return (
            <Card key={o.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">{o.level}</Badge>
                      <Badge variant="info">{o.period}</Badge>
                      {o.status === "on_track" && <Badge variant="success">On-track</Badge>}
                      {o.status === "at_risk" && <Badge variant="warning">At-risk</Badge>}
                    </div>
                    <CardTitle className="text-base">{o.title}</CardTitle>
                    <div className="text-xs text-zinc-500 mt-1">
                      {owner?.full_name ?? dept?.name ?? "—"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-zinc-900">{o.progress_pct}%</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-2 rounded-full bg-zinc-100 mb-3">
                  <div
                    className={`h-2 rounded-full ${
                      o.progress_pct >= 80
                        ? "bg-emerald-500"
                        : o.progress_pct >= 50
                          ? "bg-indigo-500"
                          : "bg-amber-500"
                    }`}
                    style={{ width: `${Math.min(100, o.progress_pct)}%` }}
                  />
                </div>
                <div className="space-y-2">
                  {objKrs.map((kr) => (
                    <div key={kr.id} className="rounded-lg border border-zinc-100 p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-zinc-700">{kr.title}</span>
                        <Badge variant="outline">{kr.progress_pct}%</Badge>
                      </div>
                      {kr.target_value != null && (
                        <div className="text-xs text-zinc-500">
                          {kr.actual_value?.toLocaleString("vi-VN") ?? "—"} /{" "}
                          {kr.target_value.toLocaleString("vi-VN")} {kr.unit ?? ""}
                        </div>
                      )}
                    </div>
                  ))}
                  {objKrs.length === 0 && (
                    <div className="text-xs text-zinc-400 text-center py-4">
                      Chưa có Key Result
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
