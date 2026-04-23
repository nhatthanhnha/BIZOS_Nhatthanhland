import { TabsNav } from "@/components/ui/tabs";

export default function FinanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <TabsNav
        items={[
          { href: "/finance", label: "Tổng quan" },
          { href: "/finance/pnl", label: "Báo cáo P&L" },
          { href: "/finance/balance-sheet", label: "Balance Sheet" },
          { href: "/finance/cashflow", label: "Cash Flow" },
          { href: "/finance/budget", label: "Budget vs Actual" },
        ]}
      />
      {children}
    </div>
  );
}
