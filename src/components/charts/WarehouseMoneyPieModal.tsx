import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ArrowLeft } from "lucide-react";
import { useWarehouseCategories, useWarehouseProducts } from "@/hooks/useWarehouseData";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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
}: LabelProps) => {
  const insideRadius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const insideX = cx + insideRadius * Math.cos(-midAngle * RADIAN);
  const insideY = cy + insideRadius * Math.sin(-midAngle * RADIAN);

  const labelRadius = outerRadius + 30;
  const labelX = cx + labelRadius * Math.cos(-midAngle * RADIAN);
  const labelY = cy + labelRadius * Math.sin(-midAngle * RADIAN);

  const lineStartRadius = outerRadius + 5;
  const lineStartX = cx + lineStartRadius * Math.cos(-midAngle * RADIAN);
  const lineStartY = cy + lineStartRadius * Math.sin(-midAngle * RADIAN);

  const lineEndRadius = outerRadius + 22;
  const lineEndX = cx + lineEndRadius * Math.cos(-midAngle * RADIAN);
  const lineEndY = cy + lineEndRadius * Math.sin(-midAngle * RADIAN);

  const isRight = labelX > cx;
  const textAnchor = isRight ? "start" : "end";

  return (
    <g>
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
        style={{ fontSize: 12, fontWeight: 500 }}
      >
        {name}
      </text>
    </g>
  );
};

interface WarehouseMoneyPieModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  /** Multiplier applied to percentage to get a monetary value for display */
  valueMultiplier: number;
}

export function WarehouseMoneyPieModal({
  open,
  onOpenChange,
  title,
  description,
  valueMultiplier,
}: WarehouseMoneyPieModalProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null);

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

  const handleOpenChange = (v: boolean) => {
    if (!v) {
      setSelectedCategoryId(null);
      setSelectedCategoryName(null);
    }
    onOpenChange(v);
  };

  function formatCurrency(value: number): string {
    return `$${value.toLocaleString("en-US")}`;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {catLoading ? (
          <Skeleton className="h-[350px] w-full rounded-2xl" />
        ) : (
          <div className="space-y-4">
            {/* Back button when drilled down */}
            {isDrillDown && (
              <button
                onClick={handleBack}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-muted"
              >
                <ArrowLeft className="h-3 w-3" />
                {selectedCategoryName}
              </button>
            )}

            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={85}
                    paddingAngle={2}
                    dataKey="value"
                    labelLine={false}
                    label={renderCustomizedLabel}
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

            {/* Legend with monetary values */}
            <div className="grid grid-cols-2 gap-2">
              {chartData.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 text-xs text-muted-foreground"
                >
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="truncate">{item.name}</span>
                  <span className="ml-auto font-medium text-foreground">
                    {formatCurrency(Math.round(item.value * valueMultiplier))}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
