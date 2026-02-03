import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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

const formatYAxis = (value: number) => {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}k`;
  }
  return `$${value}`;
};

export function CashFlowChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(258, 90%, 66%)" stopOpacity={0.4} />
            <stop offset="100%" stopColor="hsl(258, 90%, 66%)" stopOpacity={0.05} />
          </linearGradient>
          <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
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
          width={50}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
          labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
          formatter={(value: number, name: string) => [
            `$${value.toLocaleString()}`,
            name === "income" ? "Income" : "Expense",
          ]}
        />
        <Area
          type="monotone"
          dataKey="income"
          stroke="hsl(258, 90%, 66%)"
          strokeWidth={2}
          fill="url(#incomeGradient)"
        />
        <Area
          type="monotone"
          dataKey="expense"
          stroke="hsl(330, 80%, 65%)"
          strokeWidth={2}
          fill="url(#expenseGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
