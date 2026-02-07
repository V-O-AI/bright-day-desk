import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface FinancialMetric {
  id: string;
  metric_key: string;
  label: string;
  value: number;
  change_percent: number | null;
  change_text: string | null;
  period: string;
  trend_data: number[];
}

export type MetricPeriod = "day" | "week" | "month" | "year";

export function useFinancialMetrics(period: MetricPeriod) {
  return useQuery({
    queryKey: ["financial-metrics", period],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("financial_metrics")
        .select("*")
        .eq("period", period)
        .order("metric_key");

      if (error) throw error;

      return (data ?? []).map((row: any) => ({
        ...row,
        value: Number(row.value),
        change_percent: row.change_percent ? Number(row.change_percent) : null,
        trend_data: Array.isArray(row.trend_data)
          ? row.trend_data.map(Number)
          : JSON.parse(row.trend_data || "[]").map(Number),
      })) as FinancialMetric[];
    },
  });
}
