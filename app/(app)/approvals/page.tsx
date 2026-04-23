import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/kpi/KpiCard";
import { fetchApprovals, fetchEmployees } from "@/lib/queries";

const kindLabel: Record<string, string> = {
  payroll_adjustment: "Điều chỉnh payroll",
  job_requisition: "Tuyển dụng",
  kpi_change: "Thay đổi KPI",
  project_budget: "Budget dự án",
};

export default async function ApprovalsPage() {
  const [approvals, employees] = await Promise.all([fetchApprovals(), fetchEmployees()]);

  const pending = approvals.filter((a) => a.status === "pending").length;
  const approved = approvals.filter((a) => a.status === "approved").length;
  const rejected = approvals.filter((a) => a.status === "rejected").length;

  return (
    <div>
      <PageHeader
        title="Approval Center"
        description="KPI, công thức, thưởng, ngân sách, tuyển dụng cần duyệt"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <KpiCard label="Pending" value={String(pending)} accent="amber" />
        <KpiCard label="Approved" value={String(approved)} accent="emerald" />
        <KpiCard label="Rejected" value={String(rejected)} accent="red" />
        <KpiCard label="Tổng" value={String(approvals.length)} accent="indigo" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Yêu cầu phê duyệt</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {approvals.map((a) => {
            const requester = employees.find((e) => e.id === a.requested_by);
            return (
              <div
                key={a.id}
                className="flex items-start justify-between gap-3 rounded-lg border border-zinc-200 p-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline">{kindLabel[a.kind] ?? a.kind}</Badge>
                    <Badge
                      variant={
                        a.status === "approved"
                          ? "success"
                          : a.status === "rejected"
                            ? "danger"
                            : a.status === "cancelled"
                              ? "outline"
                              : "warning"
                      }
                    >
                      {a.status}
                    </Badge>
                    <span className="text-xs text-zinc-400">
                      {new Date(a.created_at).toLocaleString("vi-VN")}
                    </span>
                  </div>
                  <div className="font-medium text-zinc-900">{a.title}</div>
                  <div className="text-xs text-zinc-500 mt-1">
                    Yêu cầu bởi: {requester?.full_name ?? "—"}
                  </div>
                  <pre className="text-xs text-zinc-500 mt-1 font-mono">
                    {JSON.stringify(a.payload, null, 0)}
                  </pre>
                </div>
                {a.status === "pending" && (
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" variant="outline">
                      Từ chối
                    </Button>
                    <Button size="sm">Duyệt</Button>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
