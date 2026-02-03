import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";

const data = [
  { name: "Детские вещи", value: 50, color: "hsl(45, 90%, 55%)" },
  { name: "Одежда", value: 35, color: "hsl(258, 90%, 66%)" },
  { name: "Обувь", value: 15, color: "hsl(330, 80%, 65%)" },
];

const RADIAN = Math.PI / 180;

interface LabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  name: string;
  index: number;
}

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
  index,
}: LabelProps) => {
  // Position for percentage inside the slice
  const insideRadius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const insideX = cx + insideRadius * Math.cos(-midAngle * RADIAN);
  const insideY = cy + insideRadius * Math.sin(-midAngle * RADIAN);

  // Position for the label outside
  const labelRadius = outerRadius + 30;
  const labelX = cx + labelRadius * Math.cos(-midAngle * RADIAN);
  const labelY = cy + labelRadius * Math.sin(-midAngle * RADIAN);

  // Line start point (on the slice edge)
  const lineStartRadius = outerRadius + 5;
  const lineStartX = cx + lineStartRadius * Math.cos(-midAngle * RADIAN);
  const lineStartY = cy + lineStartRadius * Math.sin(-midAngle * RADIAN);

  // Line end point (near label)
  const lineEndRadius = outerRadius + 22;
  const lineEndX = cx + lineEndRadius * Math.cos(-midAngle * RADIAN);
  const lineEndY = cy + lineEndRadius * Math.sin(-midAngle * RADIAN);

  const isRight = labelX > cx;
  const textAnchor = isRight ? "start" : "end";

  return (
    <g>
      {/* Percentage inside */}
      <text
        x={insideX}
        y={insideY}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontSize: 12, fontWeight: 600 }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
      {/* Line pointing to the slice */}
      <line
        x1={lineStartX}
        y1={lineStartY}
        x2={lineEndX}
        y2={lineEndY}
        stroke="hsl(var(--muted-foreground))"
        strokeWidth={1}
      />
      {/* Label outside */}
      <text
        x={labelX}
        y={labelY}
        fill="hsl(var(--foreground))"
        textAnchor={textAnchor}
        dominantBaseline="central"
        style={{ fontSize: 12, fontWeight: 500 }}
      >
        {name}
      </text>
    </g>
  );
};

interface WarehousePieChartProps {
  isEmpty?: boolean;
}

export function WarehousePieChart({ isEmpty = false }: WarehousePieChartProps) {
  if (isEmpty) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground animate-fade-in">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-4 border-muted opacity-40" />
          <PieChartIcon className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40" />
        </div>
        <span className="text-sm font-medium mt-4">Нет данных</span>
        <span className="text-xs mt-1 opacity-60">Добавьте товары на склад</span>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={70}
          paddingAngle={2}
          dataKey="value"
          labelLine={false}
          label={renderCustomizedLabel}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
