import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DollarSign, Users, ShoppingCart, Activity, TrendingUp, TrendingDown, MoreHorizontal } from "lucide-react";
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

const subtitleMap: Record<string, string> = {
  total_revenue: "Across all linked accounts",
  subscriptions: "Updated in real time",
  sales: "Categorized automatically",
  active_now: "Income minus expenses",
};

const periodLabels: Record<MetricPeriod, string> = {
  day: "День",
  week: "Неделя",
  month: "Месяц",
};

function formatValue(key: string, value: number): string {
  if (key === "total_revenue") {
    return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  if (key === "sales") {
    return `$${value.toLocaleString("en-US")}`;
  }
  if (key === "subscriptions") {
    return `$${value.toLocaleString("en-US")}`;
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

  const orderedKeys = ["total_revenue", "subscriptions", "sales", "active_now"];
  const sortedMetrics = orderedKeys
    .map((key) => metrics?.find((m) => m.metric_key === key))
    .filter(Boolean) as NonNullable<typeof metrics>[number][];

  const heroMetric = sortedMetrics.find((m) => m.metric_key === "total_revenue");
  const bottomMetrics = sortedMetrics.filter((m) => m.metric_key !== "total_revenue");

  if (isLoading) {
    return (
      <div className="space-y-4">
        {showFilter && !externalPeriod && (
          <div className="flex gap-1">
            {(Object.keys(periodLabels) as MetricPeriod[]).map((p) => (
              <Skeleton key={p} className="h-8 w-20 rounded-lg" />
            ))}
          </div>
        )}
        <Skeleton className="h-[140px] rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[120px] rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

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

      {/* Hero card — Total Balance */}
      {heroMetric && (
        <button
          onClick={() => navigate("/my-data/finances")}
          className="w-full opacity-0 animate-fade-in-up bg-card rounded-2xl p-6 border border-border text-left transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 active:scale-[0.99] group"
          style={{ animationDelay: "0ms" }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground font-medium">{heroMetric.label}</span>
            <div className="p-1.5 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <p className="text-3xl font-bold text-foreground mb-3">
            {formatValue(heroMetric.metric_key, heroMetric.value)}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {heroMetric.change_percent !== null && heroMetric.change_percent >= 0 ? (
                <TrendingUp className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-destructive" />
              )}
              <span
                className={cn(
                  "text-sm font-medium",
                  heroMetric.change_percent !== null && heroMetric.change_percent >= 0
                    ? "text-green-500"
                    : "text-destructive"
                )}
              >
                {heroMetric.change_percent !== null
                  ? `${heroMetric.change_percent >= 0 ? "" : ""}${heroMetric.change_percent}% this month`
                  : heroMetric.change_text}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {subtitleMap[heroMetric.metric_key]}
            </span>
          </div>
        </button>
      )}

      {/* Bottom 3 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {bottomMetrics.map((metric, idx) => {
          const Icon = iconMap[metric.metric_key] || Activity;
          const isPositive =
            metric.change_percent !== null ? metric.change_percent >= 0 : true;
          const trendColor = isPositive
            ? "hsl(142, 76%, 50%)"
            : "hsl(0, 84%, 60%)";

          return (
            <button
              key={metric.id}
              onClick={() => navigate("/my-data/finances")}
              className="opacity-0 animate-fade-in-up bg-card rounded-2xl p-5 border border-border text-left transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 active:scale-[0.99] group"
              style={{
                animationDelay: `${(idx + 1) * 60}ms`,
              }}
            >
              <span className="text-sm text-muted-foreground font-medium">
                {metric.label}
              </span>

              <p className="text-xl font-bold text-foreground mt-2 mb-2">
                {formatValue(metric.metric_key, metric.value)}
              </p>

              <div className="flex items-center gap-1.5 mb-1">
                {isPositive ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-destructive" />
                )}
                <span
                  className={cn(
                    "text-xs font-medium",
                    isPositive ? "text-green-500" : "text-destructive"
                  )}
                >
                  {metric.change_percent !== null
                    ? `${metric.change_percent >= 0 ? "" : ""}${metric.change_percent}% vs last month`
                    : metric.change_text}
                </span>
              </div>

              <span className="text-[11px] text-muted-foreground">
                {subtitleMap[metric.metric_key]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
