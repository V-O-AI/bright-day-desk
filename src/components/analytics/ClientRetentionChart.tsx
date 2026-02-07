import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { period: "1 мес", rate: 92 },
  { period: "3 мес", rate: 78 },
  { period: "6 мес", rate: 65 },
  { period: "12 мес", rate: 52 },
  { period: "24 мес", rate: 41 },
];

export function ClientRetentionChart() {
  return (
    <div className="bg-card rounded-2xl p-5 border border-border h-full">
      <h3 className="font-semibold text-foreground mb-1">Удержание клиентов</h3>
      <p className="text-[10px] text-muted-foreground mb-4">
        Retention rate по периодам
      </p>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={28}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              vertical={false}
            />
            <XAxis
              dataKey="period"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
              width={30}
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              formatter={(value: number) => [`${value}%`, "Retention"]}
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Bar
              dataKey="rate"
              fill="hsl(258, 90%, 66%)"
              radius={[6, 6, 0, 0]}
              animationBegin={0}
              animationDuration={400}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
