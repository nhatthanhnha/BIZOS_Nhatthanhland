import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Simulator } from "@/components/forecast/Simulator";
import { fetchKpis, fetchKpiTargets, fetchKpiActuals } from "@/lib/queries";
import { buildKpiRows } from "@/lib/kpi/cascade";

export default async function ForecastPage() {
  const [kpis, targets, actuals] = await Promise.all([
    fetchKpis(),
    fetchKpiTargets(),
    fetchKpiActuals(),
  ]);
  const rows = buildKpiRows(kpis, targets, actuals);

  return (
    <div>
      <PageHeader
        title="Forecast / Mô phỏng"
        description="What-if scenarios: thay đổi KPI đầu vào để xem tác động lên kết quả cuối"
      />

      <Simulator rows={rows} />

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Câu hỏi mẫu</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-zinc-700 space-y-2">
          <p>
            <strong>Sales hụt 20%:</strong> kéo slider của SAL.CLOSE hoặc E8.CLOSE/E9.CLOSE xuống
            -20%, xem Net Profit thay đổi thế nào.
          </p>
          <p>
            <strong>Marketing cải thiện CPL:</strong> kéo E11.CPL xuống -10%, xem CAC và Gross Profit
            cải thiện bao nhiêu.
          </p>
          <p>
            <strong>Operations siết SLA:</strong> kéo OPS.SLA lên +5%, xem Gross Profit tăng bao
            nhiêu.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
