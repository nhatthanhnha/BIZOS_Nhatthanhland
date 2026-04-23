import { TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  delta,
  accent = "indigo",
  hint,
}: {
  label: string;
  value: string;
  delta?: number;
  accent?: "indigo" | "emerald" | "amber" | "red" | "violet";
  hint?: string;
}) {
  const accentMap = {
    indigo: "text-indigo-600 bg-indigo-50",
    emerald: "text-emerald-600 bg-emerald-50",
    amber: "text-amber-600 bg-amber-50",
    red: "text-red-600 bg-red-50",
    violet: "text-violet-600 bg-violet-50",
  };
  const positive = typeof delta === "number" && delta >= 0;

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="text-xs font-medium text-zinc-500">{label}</div>
          <div className="text-2xl font-bold text-zinc-900">{value}</div>
          {hint && <div className="text-xs text-zinc-400">{hint}</div>}
        </div>
        {typeof delta === "number" && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
              positive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700",
            )}
          >
            {positive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {Math.abs(delta).toFixed(1)}%
          </span>
        )}
      </div>
      <div className={cn("mt-3 h-1 w-full rounded-full", accentMap[accent])}>
        <div
          className={cn(
            "h-1 rounded-full",
            accent === "indigo" && "bg-indigo-500",
            accent === "emerald" && "bg-emerald-500",
            accent === "amber" && "bg-amber-500",
            accent === "red" && "bg-red-500",
            accent === "violet" && "bg-violet-500",
          )}
          style={{ width: `${Math.min(100, Math.max(10, (delta ?? 50) + 50))}%` }}
        />
      </div>
    </Card>
  );
}
