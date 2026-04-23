import { PageHeader } from "@/components/layout/PageHeader";
import { tServer } from "@/lib/i18n/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/kpi/KpiCard";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { ProgressList } from "@/components/widgets/ProgressList";
import { StatChip } from "@/components/widgets/StatChip";
import { FileText, Download, Calendar, Mail, Clock, FileSpreadsheet, Sparkles } from "lucide-react";

const reports = [
  { id: "r1", title: "Báo cáo KPI công ty tháng 4/2026", kind: "kpi_company", period: "2026-04", generated_at: "2026-04-23T07:00:00Z", size: "1.2 MB", format: "PDF", downloads: 4 },
  { id: "r2", title: "Báo cáo tài chính Q1/2026", kind: "finance_quarterly", period: "2026-Q1", generated_at: "2026-04-15T09:00:00Z", size: "3.4 MB", format: "PDF", downloads: 12 },
  { id: "r3", title: "Payroll tháng 3/2026", kind: "payroll", period: "2026-03", generated_at: "2026-04-05T16:30:00Z", size: "820 KB", format: "XLSX", downloads: 8 },
  { id: "r4", title: "Báo cáo hiệu suất phòng Sales", kind: "dept_perf", period: "2026-04", generated_at: "2026-04-22T10:00:00Z", size: "640 KB", format: "PDF", downloads: 2 },
  { id: "r5", title: "Báo cáo tuyển dụng Q1/2026", kind: "recruiting", period: "2026-Q1", generated_at: "2026-04-10T14:00:00Z", size: "430 KB", format: "PDF", downloads: 3 },
  { id: "r6", title: "Payroll tháng 2/2026", kind: "payroll", period: "2026-02", generated_at: "2026-03-05T16:00:00Z", size: "780 KB", format: "XLSX", downloads: 6 },
];

const schedules = [
  { id: "s1", kind: "KPI công ty", cron: "0 7 * * 1", next: "Thứ 2 hằng tuần, 7:00", recipients: 3 },
  { id: "s2", kind: "Payroll", cron: "0 16 1 * *", next: "Ngày 1 hằng tháng, 16:00", recipients: 2 },
  { id: "s3", kind: "Cash flow", cron: "0 8 * * *", next: "Hằng ngày, 8:00", recipients: 5 },
  { id: "s4", kind: "Dept perf", cron: "0 9 1 * *", next: "Ngày 1 hằng tháng, 9:00", recipients: 6 },
];

export default async function ReportsPage() {
  const { t } = await tServer();
  const columns: Column<(typeof reports)[number]>[] = [
    {
      key: "title",
      header: "Báo cáo",
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${r.format === "XLSX" ? "bg-emerald-50 text-emerald-600" : "bg-indigo-50 text-indigo-600"}`}>
            {r.format === "XLSX" ? <FileSpreadsheet className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
          </div>
          <div>
            <div className="font-medium text-zinc-900">{r.title}</div>
            <div className="text-xs text-zinc-500">
              {r.period} · {r.size} · {r.downloads} lượt tải
            </div>
          </div>
        </div>
      ),
    },
    { key: "format", header: "Định dạng", render: (r) => <Badge variant="outline">{r.format}</Badge> },
    {
      key: "gen",
      header: "Tạo lúc",
      render: (r) => (
        <span className="text-xs text-zinc-500">
          {new Date(r.generated_at).toLocaleString("vi-VN")}
        </span>
      ),
    },
    {
      key: "act",
      header: "",
      align: "right",
      render: () => (
        <Button size="sm" variant="outline">
          <Download className="h-3.5 w-3.5" /> Tải
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title={t("reports.title")}
        description={t("reports.subtitle")}
        actions={<Button>{t("reports.new")}</Button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <KpiCard label="Báo cáo" value={String(reports.length)} accent="indigo" icon={<FileText className="h-3.5 w-3.5" />} />
        <KpiCard label="Lịch gửi" value={String(schedules.length)} accent="violet" icon={<Calendar className="h-3.5 w-3.5" />} />
        <KpiCard label="Lượt tải tháng" value={String(reports.reduce((s, r) => s + r.downloads, 0))} accent="emerald" />
        <KpiCard label="Recipients" value={String(schedules.reduce((s, r) => s + r.recipients, 0))} accent="amber" icon={<Mail className="h-3.5 w-3.5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
        <Card className="lg:col-span-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Báo cáo đã tạo</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} rows={reports} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Lịch gửi tự động</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {schedules.map((s) => (
              <div key={s.id} className="flex items-start gap-3 rounded-lg border border-zinc-100 p-3">
                <Calendar className="h-4 w-4 text-indigo-600 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-zinc-900 text-sm truncate">{s.kind}</div>
                  <div className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {s.next}
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5 flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {s.recipients} người nhận
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <Card className="lg:col-span-5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Báo cáo phổ biến (downloads)</CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressList
              rows={reports
                .sort((a, b) => b.downloads - a.downloads)
                .slice(0, 5)
                .map((r) => ({
                  label: r.title,
                  value: r.downloads,
                  max: Math.max(...reports.map((x) => x.downloads)),
                  right: `${r.downloads} lượt`,
                  color: "#6366f1",
                }))}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              Gợi ý báo cáo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <StatChip label="Weekly KPI (CEO)" value="tạo ngay" tone="info" />
            <StatChip label="Burn / Runway (CFO)" value="tạo ngay" tone="warning" />
            <StatChip label="Recruiting Q2" value="tạo ngay" tone="violet" />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Format</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <StatChip label="PDF" value={reports.filter((r) => r.format === "PDF").length} tone="info" />
            <StatChip label="XLSX" value={reports.filter((r) => r.format === "XLSX").length} tone="success" />
            <StatChip label="CSV" value={0} tone="default" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
