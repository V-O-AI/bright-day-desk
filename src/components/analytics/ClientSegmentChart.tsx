import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const segments = [
  { name: "Новые", value: 28, color: "hsl(258, 90%, 66%)" },
  { name: "Постоянные", value: 42, color: "hsl(210, 80%, 55%)" },
  { name: "VIP", value: 15, color: "hsl(45, 90%, 55%)" },
  { name: "Неактивные", value: 15, color: "hsl(240, 5%, 75%)" },
];

export function ClientSegmentChart() {
  return (
    <div className="bg-card rounded-2xl p-5 border border-border h-full">
      <h3 className="font-semibold text-foreground mb-1">Сегменты клиентов</h3>
      <p className="text-[10px] text-muted-foreground mb-4">
        Распределение по типам
      </p>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={segments}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={75}
              paddingAngle={3}
              dataKey="value"
              animationBegin={0}
              animationDuration={400}
            >
              {segments.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`${value}%`, ""]}
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-2">
        {segments.map((s) => (
          <div key={s.name} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: s.color }}
            />
            <span className="text-xs text-muted-foreground">{s.name}</span>
            <span className="text-xs font-medium text-foreground ml-auto">
              {s.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
