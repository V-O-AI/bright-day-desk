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
  { month: "Авг", active: 780, new: 65 },
  { month: "Сен", active: 820, new: 72 },
  { month: "Окт", active: 860, new: 58 },
  { month: "Ноя", active: 890, new: 80 },
  { month: "Дек", active: 910, new: 95 },
  { month: "Янв", active: 943, new: 88 },
];

export function ClientActivityChart() {
  return (
    <div className="bg-card rounded-2xl p-5 border border-border h-full">
      <h3 className="font-semibold text-foreground mb-1">Динамика клиентов</h3>
      <p className="text-[10px] text-muted-foreground mb-4">
        Активные и новые за 6 месяцев
      </p>

      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="activeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(258, 90%, 66%)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(258, 90%, 66%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="newGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(210, 80%, 55%)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(210, 80%, 55%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
              width={35}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Area
              type="monotone"
              dataKey="active"
              stroke="hsl(258, 90%, 66%)"
              fill="url(#activeGrad)"
              strokeWidth={2}
              name="Активные"
            />
            <Area
              type="monotone"
              dataKey="new"
              stroke="hsl(210, 80%, 55%)"
              fill="url(#newGrad)"
              strokeWidth={2}
              name="Новые"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
