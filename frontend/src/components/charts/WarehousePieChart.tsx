import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ArrowLeft } from "lucide-react";
import { useWarehouseCategories, useWarehouseProducts } from "@/hooks/useWarehouseData";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";

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
  isMobile?: boolean;
}

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
  isMobile = false,
}: LabelProps) => {
  const insideRadius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const insideX = cx + insideRadius * Math.cos(-midAngle * RADIAN);
  const insideY = cy + insideRadius * Math.sin(-midAngle * RADIAN);

  // Responsive label positioning
  const labelOffset = isMobile ? 20 : 30;
  const lineStartOffset = isMobile ? 3 : 5;
  const lineEndOffset = isMobile ? 15 : 22;

  const labelRadius = outerRadius + labelOffset;
  const labelX = cx + labelRadius * Math.cos(-midAngle * RADIAN);
  const labelY = cy + labelRadius * Math.sin(-midAngle * RADIAN);

  const lineStartRadius = outerRadius + lineStartOffset;
  const lineStartX = cx + lineStartRadius * Math.cos(-midAngle * RADIAN);
  const lineStartY = cy + lineStartRadius * Math.sin(-midAngle * RADIAN);

  const lineEndRadius = outerRadius + lineEndOffset;
  const lineEndX = cx + lineEndRadius * Math.cos(-midAngle * RADIAN);
  const lineEndY = cy + lineEndRadius * Math.sin(-midAngle * RADIAN);

  const isRight = labelX > cx;
  const textAnchor = isRight ? "start" : "end";

  // Truncate name on mobile
  const displayName = isMobile && name.length > 8 ? name.slice(0, 7) + "…" : name;

  return (
    <g>
      <text
        x={insideX}
        y={insideY}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontSize: isMobile ? 10 : 12, fontWeight: 600 }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
      <line
        x1={lineStartX}
        y1={lineStartY}
        x2={lineEndX}
        y2={lineEndY}
        stroke="hsl(var(--muted-foreground))"
        strokeWidth={1}
      />
      <text
        x={labelX}
        y={labelY}
        fill="hsl(var(--foreground))"
        textAnchor={textAnchor}
        dominantBaseline="central"
        style={{ fontSize: isMobile ? 10 : 12, fontWeight: 500 }}
      >
        {displayName}
      </text>
    </g>
  );
};

interface WarehousePieChartProps {
  enlarged?: boolean;
}

export function WarehousePieChart({ enlarged = false }: WarehousePieChartProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const { data: categories, isLoading: catLoading } = useWarehouseCategories();
  const { data: products } = useWarehouseProducts(selectedCategoryId);

  const isDrillDown = !!selectedCategoryId;

  const chartData = isDrillDown
    ? (products || []).map((p) => ({
        name: p.name,
        value: p.percentage,
        color: p.color,
        id: p.id,
      }))
    : (categories || []).map((c) => ({
        name: c.name,
        value: c.percentage,
        color: c.color,
        id: c.id,
      }));

  const handleCellClick = (index: number) => {
    if (!isDrillDown && categories) {
      const category = categories[index];
      if (category) {
        setSelectedCategoryId(category.id);
        setSelectedCategoryName(category.name);
      }
    }
  };

  const handleBack = () => {
    setSelectedCategoryId(null);
    setSelectedCategoryName(null);
  };

  if (catLoading) {
    return <Skeleton className="h-full w-full rounded-xl xs:rounded-2xl" />;
  }

  // Responsive chart dimensions
  const innerRadius = isMobile ? (enlarged ? 40 : 30) : (enlarged ? 55 : 40);
  const outerRadius = isMobile ? (enlarged ? 70 : 55) : (enlarged ? 95 : 70);

  return (
    <div className="relative h-full" onClick={(e) => e.stopPropagation()}>
      {/* Back button when drilled down - Responsive */}
      {isDrillDown && (
        <button
          onClick={handleBack}
          className="absolute top-0 left-0 z-10 flex items-center gap-0.5 xs:gap-1 text-[10px] xs:text-xs text-muted-foreground hover:text-foreground transition-colors px-1.5 xs:px-2 py-0.5 xs:py-1 rounded-md xs:rounded-lg hover:bg-muted"
        >
          <ArrowLeft className="h-2.5 w-2.5 xs:h-3 xs:w-3" />
          <span className="truncate max-w-[80px] xs:max-w-none">{selectedCategoryName}</span>
        </button>
      )}

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={isMobile ? 1 : 2}
            dataKey="value"
            labelLine={false}
            label={(props) => renderCustomizedLabel({ ...props, isMobile })}
            style={{ cursor: isDrillDown ? "default" : "pointer" }}
            animationBegin={0}
            animationDuration={400}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                style={{ cursor: isDrillDown ? "default" : "pointer" }}
                onClick={() => handleCellClick(index)}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
