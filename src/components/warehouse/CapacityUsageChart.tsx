import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { MoreHorizontal } from "lucide-react";

const usagePercent = 62.5;
const loaded = 40;
const empty = 24;

const data = [
  { name: "Loaded", value: usagePercent },
  { name: "Empty", value: 100 - usagePercent },
];

const COLORS = ["hsl(0, 72%, 51%)", "hsl(var(--muted))"];

export function CapacityUsageChart() {
  return (
    <div className="bg-foreground rounded-2xl p-5 flex flex-col h-full text-background">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-sm">Capacity Usage</h3>
        <MoreHorizontal className="h-4 w-4 opacity-60" />
      </div>

      <div className="flex-1 flex items-center justify-center relative">
        <ResponsiveContainer width="100%" height={140}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={62}
              startAngle={90}
              endAngle={-270}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] opacity-60">Total Usage</span>
          <span className="text-2xl font-bold">{usagePercent}%</span>
        </div>
      </div>

      <div className="flex justify-between mt-2 text-xs">
        <div className="text-center">
          <p className="opacity-60">Loaded</p>
          <p className="font-semibold">{loaded} shelves</p>
        </div>
        <div className="text-center">
          <p className="opacity-60">Empty</p>
          <p className="font-semibold">{empty} shelves</p>
        </div>
      </div>
    </div>
  );
}
