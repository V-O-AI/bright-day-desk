import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

const data = [
  { month: "Jan", income: 3000, expense: 1500 },
  { month: "Feb", income: 3500, expense: 1800 },
  { month: "Mar", income: 4200, expense: 2000 },
  { month: "Apr", income: 4800, expense: 2200 },
  { month: "May", income: 5500, expense: 2500 },
  { month: "Jun", income: 6200, expense: 2800 },
  { month: "Jul", income: 7800, expense: 4900 },
  { month: "Aug", income: 9500, expense: 5200 },
  { month: "Sep", income: 11000, expense: 5800 },
  { month: "Oct", income: 12500, expense: 6500 },
  { month: "Nov", income: 14000, expense: 7200 },
  { month: "Dec", income: 15000, expense: 8000 },
];

const periodOptions = ["1Y", "6M", "1M"] as const;

const formatYAxis = (value: number) => {
  if (value >= 1000) return `$${(value / 1000).toFixed(0)},000`;
  return `$${value}`;
};

export function CashFlowChart() {
  const [activePeriod, setActivePeriod] = useState<string>("1Y");

  const filteredData =
    activePeriod === "1M"
      ? data.slice(-1)
      : activePeriod === "6M"
        ? data.slice(-6)
        : data;

  return (
    <div className="bg-card rounded-2xl p-6 border border-border h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold text-foreground">Cash Flow Trend</h3>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Income
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "hsl(330, 80%, 65%)" }} />
              Expense
            </span>
          </div>
        </div>
        <div className="flex gap-1">
          {periodOptions.map((p) => (
            <button
              key={p}
              onClick={() => setActivePeriod(p)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition-all",
                activePeriod === p
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={filteredData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="incomeGradientNew" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(258, 90%, 66%)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="hsl(258, 90%, 66%)" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="expenseGradientNew" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(330, 80%, 65%)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="hsl(330, 80%, 65%)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--border))"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              tickFormatter={formatYAxis}
              width={60}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                padding: "10px 14px",
              }}
              labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600, marginBottom: 4 }}
              formatter={(value: number, name: string) => [
                `$${value.toLocaleString()}`,
                name === "income" ? "Income" : "Expenses",
              ]}
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke="hsl(258, 90%, 66%)"
              strokeWidth={2}
              fill="url(#incomeGradientNew)"
            />
            <Area
              type="monotone"
              dataKey="expense"
              stroke="hsl(330, 80%, 65%)"
              strokeWidth={2}
              fill="url(#expenseGradientNew)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
