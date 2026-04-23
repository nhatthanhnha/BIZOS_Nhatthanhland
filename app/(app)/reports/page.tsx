import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { FileText, Download, Calendar, Mail, Clock } from "lucide-react";

const reports = [
  { id: "r1", title: "Báo cáo KPI công ty tháng 4/2026", kind: "kpi_company", period: "2026-04", generated_at: "2026-04-23T07:00:00Z", size: "1.2 MB", format: "PDF" },
  { id: "r2", title: "Báo cáo tài chính Q1/2026", kind: "finance_quarterly", period: "2026-Q1", generated_at: "2026-04-15T09:00:00Z", size: "3.4 MB", format: "PDF" },
  { id: "r3", title: "Payroll tháng 3/2026", kind: "payroll", period: "2026-03", generated_at: "2026-04-05T16:30:00Z", size: "820 KB", format: "XLSX" },
  { id: "r4", title: "Báo cáo hiệu suất phòng Sales", kind: "dept_perf", period: "2026-04", generated_at: "2026-04-22T10:00:00Z", size: "640 KB", format: "PDF" },
  { id: "r5", title: "Báo cáo tuyển dụng Q1/2026", kind: "recruiting", period: "2026-Q1", generated_at: "2026-04-10T14:00:00Z", size: "430 KB", format: "PDF" },
];

const schedules = [
  { id: "s1", kind: "KPI công ty", cron: "0 7 * * 1", next: "Thứ 2 hằng tuần, 7:00" },
  { id: "s2", kind: "Payroll", cron: "0 16 1 * *", next: "Ngày 1 hằng tháng, 16:00" },
  { id: "s3", kind: "Cash flow", cron: "0 8 * * *", next: "Hằng ngày, 8:00" },
];

export default function ReportsPage() {
  const columns: Column<(typeof reports)[number]>[] = [
    {
      key: "title",
      header: "Báo cáo",
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <div className="font-medium text-zinc-900">{r.title}</div>
            <div className="text-xs text-zinc-500">
              {r.period} · {r.size}
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
        title="Report Center"
        description="Báo cáo tổng hợp tuần / tháng / quý"
        actions={<Button>+ Tạo báo cáo</Button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Báo cáo đã tạo</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} rows={reports} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lịch gửi tự động</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {schedules.map((s) => (
              <div key={s.id} className="flex items-start gap-3 rounded-lg border border-zinc-100 p-3">
                <Calendar className="h-4 w-4 text-indigo-600 mt-0.5" />
                <div className="flex-1">
                  <div className="font-medium text-zinc-900 text-sm">{s.kind}</div>
                  <div className="text-xs text-zinc-500 mt-0.5">
                    <Clock className="inline h-3 w-3 mr-1" />
                    {s.next}
                  </div>
                </div>
                <Mail className="h-4 w-4 text-zinc-400" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
