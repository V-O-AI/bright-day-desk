import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DollarSign, Users, ShoppingCart, Activity } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { useFinancialMetrics, MetricPeriod } from "@/hooks/useFinancialMetrics";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const iconMap: Record<string, React.ElementType> = {
  total_revenue: DollarSign,
  subscriptions: Users,
  sales: ShoppingCart,
  active_now: Activity,
};

const periodLabels: Record<MetricPeriod, string> = {
  day: "День",
  week: "Неделя",
  month: "Месяц",
  year: "Год",
};

function formatValue(key: string, value: number): string {
  if (key === "total_revenue") {
    return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `+${value.toLocaleString("en-US")}`;
}

interface FinanceMetricCardsProps {
  layout?: "grid" | "row";
  showFilter?: boolean;
  externalPeriod?: MetricPeriod;
}

export function FinanceMetricCards({ layout = "grid", showFilter = true, externalPeriod }: FinanceMetricCardsProps) {
  const [internalPeriod, setInternalPeriod] = useState<MetricPeriod>("month");
  const period = externalPeriod ?? internalPeriod;
  const { data: metrics, isLoading } = useFinancialMetrics(period);
  const navigate = useNavigate();

  // Ensure correct order
  const orderedKeys = ["total_revenue", "subscriptions", "sales", "active_now"];
  const sortedMetrics = orderedKeys
    .map((key) => metrics?.find((m) => m.metric_key === key))
    .filter(Boolean) as NonNullable<typeof metrics>[number][];

  return (
    <div className="space-y-4">
      {showFilter && !externalPeriod && (
        <div className="flex gap-1">
          {(Object.keys(periodLabels) as MetricPeriod[]).map((p) => (
            <button
              key={p}
              onClick={() => setInternalPeriod(p)}
              className={cn(
                "px-3 py-1 rounded-lg text-sm transition-all duration-150 active:scale-[0.97]",
                period === p
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              )}
            >
              {periodLabels[p]}
            </button>
          ))}
        </div>
      )}

      <div
        className={cn(
          "gap-4",
          layout === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2"
            : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        )}
      >
        {isLoading
          ? orderedKeys.map((key) => (
              <Skeleton key={key} className="h-[130px] rounded-2xl" />
            ))
          : sortedMetrics.map((metric, idx) => {
              const Icon = iconMap[metric.metric_key] || Activity;
              const isPositive =
                metric.change_percent !== null ? metric.change_percent >= 0 : true;
              const trendColor = isPositive
                ? "hsl(142, 76%, 50%)"
                : "hsl(0, 84%, 60%)";

              const sparkData = metric.trend_data.map((v, i) => ({
                value: v,
                idx: i,
              }));

              return (
                <button
                  key={metric.id}
                  onClick={() => navigate("/my-data/finances")}
                  className="opacity-0 animate-fade-in-up bg-card rounded-2xl p-5 border border-border text-left transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/20 active:scale-[0.98] group"
                  style={{
                    animationDelay: `${idx * 60}ms`,
                  }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">
                      {metric.label}
                    </span>
                    <div className="p-1.5 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                      <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>

                  {/* Value + Sparkline */}
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {formatValue(metric.metric_key, metric.value)}
                      </p>
                      <p
                        className={cn(
                          "text-xs mt-1",
                          isPositive ? "text-green-500" : "text-destructive"
                        )}
                      >
                        {metric.change_percent !== null
                          ? `${metric.change_percent >= 0 ? "+" : ""}${metric.change_percent}%`
                          : metric.change_text}
                      </p>
                    </div>

                    {/* Mini sparkline */}
                    <div className="w-[80px] h-[32px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={sparkData}>
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke={trendColor}
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </button>
              );
            })}
      </div>
    </div>
  );
}
