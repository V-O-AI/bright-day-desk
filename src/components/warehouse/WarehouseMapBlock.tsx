import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { MoreHorizontal, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const floors = ["Floor 1", "Floor 2", "Floor 3"];

const deadStockData = [
  { name: "Масляный\nфильтр", value: 2500, days: 120 },
  { name: "Набор\nпосуды", value: 2000, days: 95 },
  { name: "Куртка\nзимняя", value: 1800, days: 78 },
  { name: "Крем\nдля лица", value: 1500, days: 64 },
  { name: "Смартфон\nX200", value: 1200, days: 45 },
  { name: "Наушники\nBT", value: 1000, days: 32 },
];

const metrics = [
  { label: "Средний оборот", value: "24", unit: "дн.", change: "+2.58%" },
  { label: "Quantity on Hand", value: "12,450", unit: "units", change: "+4.37%" },
  { label: "Capacity Usage", value: "62.5%", unit: "Full", change: "+1.54%" },
];

export function WarehouseMapBlock() {
  return (
    <div className="flex gap-4 w-full">
      {/* Left metrics column */}
      <div className="flex flex-col gap-3 min-w-[140px]">
        {metrics.map((m, idx) => (
          <div
            key={idx}
            className="bg-card border border-border rounded-xl p-3"
          >
            <p className="text-[10px] text-muted-foreground">{m.label}</p>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-lg font-bold text-foreground">{m.value}</span>
              {m.unit && (
                <span className="text-[10px] text-muted-foreground">{m.unit}</span>
              )}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-[10px] text-green-500 font-medium">{m.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Dead stock chart */}
      <div className="flex-1 bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-foreground text-sm">Мертвые товары</h3>
          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className="text-2xl font-bold text-foreground">
          {deadStockData.length} <span className="text-xs font-normal text-muted-foreground">товаров</span>
        </p>

        <div className="h-[160px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={deadStockData} barSize={32}>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
                interval={0}
              />
              <YAxis hide />
              <Bar dataKey="days" radius={[6, 6, 0, 0]}>
                {deadStockData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.days >= 90
                        ? "hsl(0, 72%, 51%)"
                        : entry.days >= 60
                        ? "hsl(35, 92%, 50%)"
                        : "hsl(var(--muted))"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex gap-3 mt-2 text-[10px] text-muted-foreground">
          {deadStockData.map((item, idx) => (
            <span key={idx} className="flex-1 text-center">
              {item.days} дн. · {item.value.toLocaleString()} шт
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function WarehouseMapHeader() {
  const [activeFloor, setActiveFloor] = useState(0);

  return (
    <div className="flex items-center justify-between">
      <h3 className="font-semibold text-foreground">Полезные данные</h3>
      <div className="flex gap-1 bg-muted rounded-lg p-0.5">
        {floors.map((floor, idx) => (
          <button
            key={idx}
            className={cn(
              "px-3 py-1 text-xs rounded-md transition-colors",
              activeFloor === idx
                ? "bg-foreground text-background font-medium"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setActiveFloor(idx)}
          >
            {floor}
          </button>
        ))}
      </div>
    </div>
  );
}
