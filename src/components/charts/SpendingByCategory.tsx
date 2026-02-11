import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";

const waterfallRaw = [
  { name: "Начальная\nприбыль", value: 42000 },
  { name: "+ Рост\nдоходов", value: 18500 },
  { name: "- Рост\nрасходов", value: -12300 },
  { name: "= Итоговая\nприбыль", value: 48200 },
];

// Build waterfall data with invisible base
function buildWaterfallData() {
  let cumulative = 0;
  return waterfallRaw.map((item, idx) => {
    const isTotal = idx === waterfallRaw.length - 1;
    if (isTotal) {
      return { ...item, base: 0, bar: item.value };
    }
    const base = cumulative;
    cumulative += item.value;
    return {
      ...item,
      base: item.value >= 0 ? base : base + item.value,
      bar: Math.abs(item.value),
    };
  });
}

const data = buildWaterfallData();

const getBarColor = (index: number) => {
  if (index === 0) return "hsl(258, 90%, 66%)"; // primary purple
  if (index === 1) return "hsl(142, 76%, 50%)"; // green
  if (index === 2) return "hsl(0, 84%, 60%)";   // red
  return "hsl(217, 91%, 60%)";                    // blue - total
};

const formatValue = (value: number) => {
  if (Math.abs(value) >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return `${value}`;
};

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const item = payload[0]?.payload;
  if (!item) return null;
  const original = waterfallRaw.find((w) => w.name === item.name);
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2 shadow-lg text-xs">
      <p className="font-medium text-foreground mb-0.5">{item.name.replace("\n", " ")}</p>
      <p className="text-muted-foreground">
        {original && original.value >= 0 ? "+" : ""}
        ${original?.value.toLocaleString()}
      </p>
    </div>
  );
};

const MultiLineTick = ({ x, y, payload }: any) => {
  const lines = (payload.value as string).split("\n");
  return (
    <g transform={`translate(${x},${y + 10})`}>
      {lines.map((line: string, i: number) => (
        <text
          key={i}
          x={0}
          y={i * 13}
          textAnchor="middle"
          fill="hsl(var(--muted-foreground))"
          fontSize={10}
        >
          {line}
        </text>
      ))}
    </g>
  );
};

export function SpendingByCategory() {
  return (
    <div className="bg-card rounded-2xl p-6 border border-border h-full flex flex-col">
      <div className="mb-1">
        <h3 className="font-semibold text-foreground">Движение прибыли</h3>
        <p className="text-xs text-muted-foreground">Водопад за период</p>
      </div>

      <div className="flex-1 min-h-0 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 5, left: -10, bottom: 20 }}
            barCategoryGap="25%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--border))"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={<MultiLineTick />}
              interval={0}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
              tickFormatter={formatValue}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <ReferenceLine y={0} stroke="hsl(var(--border))" />
            {/* Invisible base */}
            <Bar dataKey="base" stackId="waterfall" fill="transparent" radius={0} />
            {/* Visible bar */}
            <Bar dataKey="bar" stackId="waterfall" radius={[4, 4, 0, 0]}>
              {data.map((_, index) => (
                <Cell key={index} fill={getBarColor(index)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
