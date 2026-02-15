import { useState } from "react";
import { cn } from "@/lib/utils";
import { Info, ChevronRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as ReTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

// --- Mock data ---
const totalRevenue = 248000;
const totalOrders = 1420;
const totalProductCost = 112000;
const totalAdSpend = 38400;
const totalShippingCost = 18200;
const totalDiscounts = 9800;
const totalProcessingFees = 4960;

const aov = totalRevenue / totalOrders;
const avgCogs = totalProductCost / totalOrders;
const avgCac = totalAdSpend / totalOrders;
const avgLogistics = totalShippingCost / totalOrders;
const avgDiscount = totalDiscounts / totalOrders;
const avgProcessingFee = totalProcessingFees / totalOrders;
const unitProfit = aov - avgCogs - avgCac - avgLogistics - avgDiscount - avgProcessingFee;
const contributionMargin = (unitProfit / aov) * 100;

function fmt(v: number) {
  return `${v.toFixed(0)} ₽`;
}

interface KpiCard {
  label: string;
  value: string;
  formula: string;
  key: string;
}

const kpiCards: KpiCard[] = [
  { label: "Ср. чек (AOV)", value: fmt(aov), formula: "Общая выручка / Кол-во заказов", key: "aov" },
  { label: "Прибыль на заказ", value: fmt(unitProfit), formula: "AOV – Себест. – CAC – Логистика – Скидки – Комиссии", key: "unit_profit" },
  { label: "Ср. себестоимость", value: fmt(avgCogs), formula: "Общая себестоимость / Кол-во заказов", key: "cogs" },
  { label: "Маржа вклада", value: `${contributionMargin.toFixed(1)}%`, formula: "Прибыль на заказ / AOV × 100", key: "margin" },
  { label: "Ср. CAC", value: fmt(avgCac), formula: "Рекламные расходы / Кол-во заказов", key: "cac" },
  { label: "Ср. логистика", value: fmt(avgLogistics), formula: "Расходы на доставку / Кол-во заказов", key: "logistics" },
];

// Drawer data
const skuBreakdown = [
  { sku: "Комбинезон зимний", orders: 320, avgRevenue: 185, avgCost: 82, cac: 28, logistics: 14, unitProfit: 61 },
  { sku: "Боди хлопок", orders: 210, avgRevenue: 174, avgCost: 95, cac: 35, logistics: 16, unitProfit: 28 },
  { sku: "Шапка вязаная", orders: 180, avgRevenue: 160, avgCost: 88, cac: 42, logistics: 18, unitProfit: 12 },
  { sku: "Конверт на выписку", orders: 150, avgRevenue: 145, avgCost: 78, cac: 55, logistics: 20, unitProfit: -8 },
  { sku: "Футболка оверсайз", orders: 130, avgRevenue: 198, avgCost: 110, cac: 48, logistics: 22, unitProfit: 18 },
  { sku: "Кроссовки спорт", orders: 95, avgRevenue: 130, avgCost: 75, cac: 60, logistics: 15, unitProfit: -20 },
];

const segmentData = [
  { segment: "Со скидкой", unitProfit: "3 ₽" },
  { segment: "Без скидки", unitProfit: "11 ₽" },
  { segment: "Платный трафик", unitProfit: "5 ₽" },
  { segment: "Органика", unitProfit: "16 ₽" },
];

const costPieData = [
  { name: "Себестоимость", value: avgCogs, color: "hsl(258, 90%, 66%)" },
  { name: "CAC", value: avgCac, color: "hsl(330, 80%, 65%)" },
  { name: "Логистика", value: avgLogistics, color: "hsl(217, 91%, 60%)" },
  { name: "Скидки", value: avgDiscount, color: "hsl(45, 93%, 55%)" },
  { name: "Комиссии", value: avgProcessingFee, color: "hsl(160, 60%, 45%)" },
];

const profitDistribution = [
  { range: "<0 ₽", pct: 9 },
  { range: "0–5 ₽", pct: 18 },
  { range: "5–10 ₽", pct: 32 },
  { range: "10–20 ₽", pct: 25 },
  { range: ">20 ₽", pct: 16 },
];

export function UnitEconomicsOverview() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string>("");

  const handleCardClick = (key: string) => {
    setSelectedMetric(key);
    setDrawerOpen(true);
  };

  return (
    <>
      <div className="bg-card rounded-2xl p-5 border border-border h-full flex flex-col">
        <div className="mb-3">
          <h3 className="font-semibold text-foreground text-sm">Юнит-экономика</h3>
          <p className="text-xs text-muted-foreground">Прибыль на заказ после всех затрат</p>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 gap-2 flex-1">
          {kpiCards.map((card) => (
            <TooltipProvider key={card.key}>
              <div
                onClick={() => handleCardClick(card.key)}
                className={cn(
                  "bg-muted/50 rounded-xl p-3 border border-border/50 cursor-pointer hover:bg-muted/80 transition-colors relative group"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-muted-foreground">{card.label}</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[200px]">
                      <p className="text-xs">{card.formula}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className={cn(
                  "text-sm font-bold",
                  card.key === "unit_profit" && unitProfit < 0 ? "text-destructive" : "text-foreground"
                )}>
                  {card.value}
                </p>
                <ChevronRight className="h-3 w-3 text-muted-foreground/30 absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </TooltipProvider>
          ))}
        </div>

        {/* AI Insight */}
        <div className="mt-3 bg-primary/5 rounded-xl p-3 border border-primary/10">
          <p className="text-xs text-muted-foreground">
            <span className="text-primary font-medium">AI: </span>
            27% заказов приносят менее 5 ₽ прибыли после вычета CAC и доставки.
          </p>
        </div>
      </div>

      {/* Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-base">
              {kpiCards.find(c => c.key === selectedMetric)?.label || "Прибыль на заказ"} — Детализация
            </SheetTitle>
            <SheetDescription className="text-xs">
              Период: Месяц · {totalOrders.toLocaleString()} заказов
            </SheetDescription>
          </SheetHeader>

          <div className="mt-4 space-y-5">
            {/* SKU Table */}
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground mb-2">По товарам</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="text-left pb-2 font-medium">Товар</th>
                      <th className="text-right pb-2 font-medium">Заказы</th>
                      <th className="text-right pb-2 font-medium">Выручка</th>
                      <th className="text-right pb-2 font-medium">Себест.</th>
                      <th className="text-right pb-2 font-medium">CAC</th>
                      <th className="text-right pb-2 font-medium">Прибыль/ед</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skuBreakdown.map((row) => (
                      <tr key={row.sku} className="border-b border-border/30">
                        <td className="py-2 font-medium text-foreground">{row.sku}</td>
                        <td className="py-2 text-right text-muted-foreground">{row.orders}</td>
                        <td className="py-2 text-right text-muted-foreground">{row.avgRevenue} ₽</td>
                        <td className="py-2 text-right text-muted-foreground">{row.avgCost} ₽</td>
                        <td className="py-2 text-right text-muted-foreground">{row.cac} ₽</td>
                        <td className={cn(
                          "py-2 text-right font-semibold",
                          row.unitProfit < 0 ? "text-destructive" : row.unitProfit < 5 ? "text-amber-500" : "text-foreground"
                        )}>
                          {row.unitProfit} ₽
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Segment Analysis */}
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground mb-2">Сегменты</h4>
              <div className="space-y-1.5">
                {segmentData.map((s) => (
                  <div key={s.segment} className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2">
                    <span className="text-xs text-foreground">{s.segment}</span>
                    <span className="text-xs font-semibold text-foreground">{s.unitProfit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cost Pie Chart */}
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground mb-2">Структура затрат на заказ</h4>
              <div className="h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={costPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={35} outerRadius={60}>
                      {costPieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <ReTooltip
                      formatter={(val: number) => [`${val.toFixed(0)} ₽`, ""]}
                      contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-2 mt-1">
                {costPieData.map((c) => (
                  <span key={c.name} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                    {c.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Profit Distribution */}
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground mb-2">Распределение заказов по прибыли</h4>
              <div className="h-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={profitDistribution} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="range" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} width={35} />
                    <Bar dataKey="pct" fill="hsl(258, 90%, 66%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Recommendation */}
            <div className="bg-primary/5 rounded-xl p-3 border border-primary/10">
              <p className="text-xs text-muted-foreground">
                <span className="text-primary font-medium">AI: </span>
                Заказы с CAC выше 20 ₽ генерируют отрицательную маржу в 41% случаев.
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
