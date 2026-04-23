import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/kpi/KpiCard";
import { fetchAlerts } from "@/lib/queries";
import { AlertTriangle, AlertCircle, Info, AlertOctagon } from "lucide-react";

const iconBy = {
  critical: AlertOctagon,
  danger: AlertTriangle,
  warning: AlertCircle,
  info: Info,
};

export default async function AlertsPage() {
  const alerts = await fetchAlerts();

  const critical = alerts.filter((a) => a.severity === "critical").length;
  const danger = alerts.filter((a) => a.severity === "danger").length;
  const warning = alerts.filter((a) => a.severity === "warning").length;
  const info = alerts.filter((a) => a.severity === "info").length;

  return (
    <div>
      <PageHeader
        title="Alerts Center"
        description="Tập trung mọi cảnh báo từ KPI, task, chi phí, cash flow, workload"
        actions={<Button variant="outline">Cài đặt rule cảnh báo</Button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <KpiCard label="Critical" value={String(critical)} accent="red" />
        <KpiCard label="Danger" value={String(danger)} accent="red" />
        <KpiCard label="Warning" value={String(warning)} accent="amber" />
        <KpiCard label="Info" value={String(info)} accent="indigo" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cảnh báo đang mở ({alerts.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {alerts.map((a) => {
            const Icon = iconBy[a.severity];
            return (
              <div
                key={a.id}
                className="flex items-start gap-3 rounded-lg border border-zinc-200 p-4 hover:bg-zinc-50"
              >
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                    a.severity === "critical" || a.severity === "danger"
                      ? "bg-red-100 text-red-600"
                      : a.severity === "warning"
                        ? "bg-amber-100 text-amber-600"
                        : "bg-indigo-100 text-indigo-600"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
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
                    <span className="text-xs text-zinc-400">
                      {new Date(a.created_at).toLocaleString("vi-VN")}
                    </span>
                  </div>
                  <div className="font-medium text-zinc-900 mt-1">{a.title}</div>
                  <pre className="text-xs text-zinc-500 mt-1 font-mono">
                    {JSON.stringify(a.detail, null, 0)}
                  </pre>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" variant="outline">
                    Resolve
                  </Button>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
