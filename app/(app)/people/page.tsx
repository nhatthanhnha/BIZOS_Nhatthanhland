import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { fetchEmployees, fetchDepartments, fetchKpis } from "@/lib/queries";
import { formatCompactVND } from "@/lib/utils";
import type { Employee } from "@/types/domain";

export default async function PeoplePage() {
  const [employees, departments, kpis] = await Promise.all([
    fetchEmployees(),
    fetchDepartments(),
    fetchKpis(),
  ]);

  type Row = Employee & { dept_name: string; manager_name: string; kpi_count: number };
  const rows: Row[] = employees.map((e) => ({
    ...e,
    dept_name: departments.find((d) => d.id === e.department_id)?.name ?? "—",
    manager_name: employees.find((m) => m.id === e.manager_id)?.full_name ?? "—",
    kpi_count: kpis.filter((k) => k.owner_employee_id === e.id).length,
  }));

  const columns: Column<Row>[] = [
    {
      key: "name",
      header: "Nhân sự",
      render: (e) => (
        <Link href={`/people/${e.id}`} className="flex items-center gap-3 hover:text-indigo-700">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
            {e.full_name.slice(0, 1)}
          </div>
          <div>
            <div className="font-medium text-zinc-900">{e.full_name}</div>
            <div className="text-xs text-zinc-500">{e.email}</div>
          </div>
        </Link>
      ),
    },
    { key: "dept", header: "Phòng ban", render: (e) => e.dept_name },
    { key: "manager", header: "Manager", render: (e) => e.manager_name },
    {
      key: "salary",
      header: "Lương cơ bản",
      align: "right",
      render: (e) => formatCompactVND(e.base_salary),
    },
    {
      key: "kpi",
      header: "KPI",
      align: "right",
      render: (e) => String(e.kpi_count),
    },
    {
      key: "status",
      header: "",
      align: "right",
      render: (e) => (
        <Badge variant={e.status === "active" ? "success" : "outline"}>{e.status}</Badge>
      ),
    },
  ];

  const active = employees.filter((e) => e.status === "active").length;
  const totalPayroll = employees.reduce((s, e) => s + e.base_salary, 0);

  return (
    <div>
      <PageHeader
        title="Nhân sự"
        description="Employee directory + hồ sơ chi tiết"
        actions={<Button>+ Thêm nhân sự</Button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Card className="p-4">
          <div className="text-xs text-zinc-500">Tổng nhân sự</div>
          <div className="text-2xl font-bold">{employees.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-zinc-500">Đang làm việc</div>
          <div className="text-2xl font-bold text-emerald-600">{active}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-zinc-500">Phòng ban</div>
          <div className="text-2xl font-bold">{departments.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-zinc-500">Quỹ lương</div>
          <div className="text-2xl font-bold">{formatCompactVND(totalPayroll)}</div>
        </Card>
      </div>

      <DataTable columns={columns} rows={rows} />
    </div>
  );
}
