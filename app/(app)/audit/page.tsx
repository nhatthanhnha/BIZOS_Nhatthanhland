import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { fetchAuditLogs, fetchEmployees } from "@/lib/queries";
import type { AuditLog } from "@/types/domain";

export default async function AuditPage() {
  const [logs, employees] = await Promise.all([fetchAuditLogs(), fetchEmployees()]);

  type Row = AuditLog & { actor_name: string };
  const rows: Row[] = logs.map((l) => ({
    ...l,
    actor_name: employees.find((e) => e.id === l.actor)?.full_name ?? (l.actor ?? "system"),
  }));

  const columns: Column<Row>[] = [
    {
      key: "time",
      header: "Thời gian",
      render: (r) => (
        <span className="font-mono text-xs">{new Date(r.created_at).toLocaleString("vi-VN")}</span>
      ),
    },
    { key: "actor", header: "Actor", render: (r) => r.actor_name },
    {
      key: "action",
      header: "Action",
      render: (r) => (
        <Badge variant="outline" className="font-mono">
          {r.action}
        </Badge>
      ),
    },
    {
      key: "entity",
      header: "Entity",
      render: (r) => (
        <span className="text-xs text-zinc-500 font-mono">
          {r.entity}:{r.entity_id?.slice(0, 8)}
        </span>
      ),
    },
    {
      key: "before",
      header: "Before",
      render: (r) => (
        <span className="text-xs text-red-600 font-mono">
          {r.before ? JSON.stringify(r.before) : "—"}
        </span>
      ),
    },
    {
      key: "after",
      header: "After",
      render: (r) => (
        <span className="text-xs text-emerald-600 font-mono">
          {r.after ? JSON.stringify(r.after) : "—"}
        </span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Audit Log"
        description="Lịch sử thay đổi: ai sửa gì, lúc nào"
      />

      <Card>
        <CardHeader>
          <CardTitle>{logs.length} bản ghi gần nhất</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} rows={rows} empty="Chưa có log" />
        </CardContent>
      </Card>
    </div>
  );
}
