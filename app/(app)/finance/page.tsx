import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/kpi/KpiCard";
import { AreaTrend } from "@/components/charts/AreaTrend";
import { DonutStat } from "@/components/charts/DonutStat";
import { fetchAccounting, fetchPayroll, fetchDepartments, demo } from "@/lib/queries";
import { formatCompactVND, formatVND } from "@/lib/utils";

export default async function FinancePage() {
  const [entries, payroll, departments] = await Promise.all([
    fetchAccounting(),
    fetchPayroll(),
    fetchDepartments(),
  ]);

  const revenue = entries.filter((e) => e.account_code === "511").reduce((s, e) => s + e.credit, 0);
  const cogs = entries.filter((e) => e.account_code === "632").reduce((s, e) => s + e.debit, 0);
  const sellingExp = entries.filter((e) => e.account_code === "641").reduce((s, e) => s + e.debit, 0);
  const adminExp = entries.filter((e) => e.account_code === "642").reduce((s, e) => s + e.debit, 0);
  const payrollExp = payroll.reduce((s, p) => s + p.company_cost, 0);

  const grossProfit = revenue - cogs;
  const opex = sellingExp + adminExp + payrollExp;
  const netProfit = grossProfit - opex;

  const byDept = departments.map((d) => ({
    name: d.name,
    value: d.budget_monthly,
    color: ["#6366f1", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4"][departments.indexOf(d) % 6],
  }));

  return (
    <div>
      <PageHeader
        title="Tài chính"
        description="Dashboard tổng quan tháng 4/2026"
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <KpiCard label="Doanh thu" value={formatCompactVND(revenue)} delta={8.4} accent="indigo" />
        <KpiCard label="Gross Profit" value={formatCompactVND(grossProfit)} accent="emerald" />
        <KpiCard label="Net Profit" value={formatCompactVND(netProfit)} accent="violet" />
        <KpiCard label="Payroll cost" value={formatCompactVND(payrollExp)} accent="amber" />
        <KpiCard label="OPEX" value={formatCompactVND(opex)} accent="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Doanh thu 12 tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <AreaTrend data={demo.demoRevenueTrend} height={260} color="#6366f1" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cơ cấu chi phí theo phòng ban</CardTitle>
          </CardHeader>
          <CardContent>
            <DonutStat
              data={byDept}
              centerLabel="Budget/tháng"
              centerValue={formatCompactVND(departments.reduce((s, d) => s + d.budget_monthly, 0))}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Mini P&L</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1.5">
            <Row k="Doanh thu" v={formatVND(revenue)} />
            <Row k="Giá vốn" v={`-${formatVND(cogs)}`} />
            <Row k={<strong>Gross Profit</strong>} v={<strong>{formatVND(grossProfit)}</strong>} />
            <Row k="Chi phí bán hàng" v={`-${formatVND(sellingExp)}`} />
            <Row k="Chi phí quản lý" v={`-${formatVND(adminExp)}`} />
            <Row k="Payroll cost" v={`-${formatVND(payrollExp)}`} />
            <Row k={<strong>Net Profit</strong>} v={<strong>{formatVND(netProfit)}</strong>} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mini Balance Sheet</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1.5">
            <Row k="Tiền mặt + NH" v={formatVND(18_400_000_000)} />
            <Row k="Phải thu" v={formatVND(3_200_000_000)} />
            <Row k="Tồn kho" v={formatVND(1_800_000_000)} />
            <Row k={<strong>Tổng tài sản</strong>} v={<strong>{formatVND(23_400_000_000)}</strong>} />
            <Row k="Phải trả NCC" v={formatVND(1_100_000_000)} />
            <Row k="Lương phải trả" v={formatVND(560_000_000)} />
            <Row k="Vốn chủ" v={formatVND(21_740_000_000)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mini Cash Flow</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1.5">
            <Row k="OCF" v={formatVND(1_800_000_000)} />
            <Row k="ICF" v={`-${formatVND(250_000_000)}`} />
            <Row k="FCF" v={formatVND(0)} />
            <Row k={<strong>Net cash</strong>} v={<strong>{formatVND(1_550_000_000)}</strong>} />
            <Row k="Runway" v="11.5 tháng" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: React.ReactNode; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-zinc-500">{k}</span>
      <span className="text-zinc-900">{v}</span>
    </div>
  );
}
