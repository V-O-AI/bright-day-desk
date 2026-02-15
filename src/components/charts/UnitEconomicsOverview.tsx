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
  return `$${v.toFixed(0)}`;
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

// Per-metric product data
const metricProductData: Record<string, { columns: string[]; rows: { name: string; orders: number; values: number[] }[]; insight: string }> = {
  aov: {
    columns: ["Товар", "Заказы", "Ср. чек"],
    rows: [
      { name: "Комбинезон зимний", orders: 320, values: [185] },
      { name: "Футболка оверсайз", orders: 130, values: [198] },
      { name: "Боди хлопок", orders: 210, values: [174] },
      { name: "Шапка вязаная", orders: 180, values: [160] },
      { name: "Конверт на выписку", orders: 150, values: [145] },
      { name: "Кроссовки спорт", orders: 95, values: [130] },
    ],
    insight: "Футболка оверсайз имеет самый высокий средний чек — $198. Кроссовки спорт — самый низкий ($130).",
  },
  cogs: {
    columns: ["Товар", "Заказы", "Ср. себестоимость"],
    rows: [
      { name: "Футболка оверсайз", orders: 130, values: [110] },
      { name: "Боди хлопок", orders: 210, values: [95] },
      { name: "Шапка вязаная", orders: 180, values: [88] },
      { name: "Комбинезон зимний", orders: 320, values: [82] },
      { name: "Конверт на выписку", orders: 150, values: [78] },
      { name: "Кроссовки спорт", orders: 95, values: [75] },
    ],
    insight: "Футболка оверсайз имеет самую высокую себестоимость — $110/ед, что сжимает маржу при скидках.",
  },
  cac: {
    columns: ["Товар", "Заказы", "Ср. CAC"],
    rows: [
      { name: "Кроссовки спорт", orders: 95, values: [60] },
      { name: "Конверт на выписку", orders: 150, values: [55] },
      { name: "Футболка оверсайз", orders: 130, values: [48] },
      { name: "Шапка вязаная", orders: 180, values: [42] },
      { name: "Боди хлопок", orders: 210, values: [35] },
      { name: "Комбинезон зимний", orders: 320, values: [28] },
    ],
    insight: "Кроссовки спорт: CAC $60 при чеке $130 — 46% выручки уходит на привлечение. Рекомендуется пересмотреть рекламные каналы.",
  },
  logistics: {
    columns: ["Товар", "Заказы", "Ср. логистика"],
    rows: [
      { name: "Футболка оверсайз", orders: 130, values: [22] },
      { name: "Конверт на выписку", orders: 150, values: [20] },
      { name: "Шапка вязаная", orders: 180, values: [18] },
      { name: "Боди хлопок", orders: 210, values: [16] },
      { name: "Кроссовки спорт", orders: 95, values: [15] },
      { name: "Комбинезон зимний", orders: 320, values: [14] },
    ],
    insight: "Футболка оверсайз и Конверт на выписку — самые дорогие в доставке. Консолидация отправлений снизит затраты на 12%.",
  },
  unit_profit: {
    columns: ["Товар", "Заказы", "Прибыль/ед"],
    rows: [
      { name: "Комбинезон зимний", orders: 320, values: [61] },
      { name: "Боди хлопок", orders: 210, values: [28] },
      { name: "Футболка оверсайз", orders: 130, values: [18] },
      { name: "Шапка вязаная", orders: 180, values: [12] },
      { name: "Конверт на выписку", orders: 150, values: [-8] },
      { name: "Кроссовки спорт", orders: 95, values: [-20] },
    ],
    insight: "2 товара убыточны на уровне единицы. Конверт на выписку и Кроссовки спорт теряют $8–$20 на каждом заказе.",
  },
  margin: {
    columns: ["Товар", "Заказы", "Маржа вклада"],
    rows: [
      { name: "Комбинезон зимний", orders: 320, values: [33.0] },
      { name: "Боди хлопок", orders: 210, values: [16.1] },
      { name: "Шапка вязаная", orders: 180, values: [7.5] },
      { name: "Футболка оверсайз", orders: 130, values: [9.1] },
      { name: "Конверт на выписку", orders: 150, values: [-5.5] },
      { name: "Кроссовки спорт", orders: 95, values: [-15.4] },
    ],
    insight: "Только Комбинезон зимний имеет маржу вклада выше 20%. 2 товара работают в убыток.",
  },
};

// General drawer data
const skuBreakdown = [
  { sku: "Комбинезон зимний", orders: 320, avgRevenue: 185, avgCost: 82, cac: 28, logistics: 14, unitProfit: 61 },
  { sku: "Боди хлопок", orders: 210, avgRevenue: 174, avgCost: 95, cac: 35, logistics: 16, unitProfit: 28 },
  { sku: "Шапка вязаная", orders: 180, avgRevenue: 160, avgCost: 88, cac: 42, logistics: 18, unitProfit: 12 },
  { sku: "Конверт на выписку", orders: 150, avgRevenue: 145, avgCost: 78, cac: 55, logistics: 20, unitProfit: -8 },
  { sku: "Футболка оверсайз", orders: 130, avgRevenue: 198, avgCost: 110, cac: 48, logistics: 22, unitProfit: 18 },
  { sku: "Кроссовки спорт", orders: 95, avgRevenue: 130, avgCost: 75, cac: 60, logistics: 15, unitProfit: -20 },
];

const segmentData = [
  { segment: "Со скидкой", unitProfit: "$3" },
  { segment: "Без скидки", unitProfit: "$11" },
  { segment: "Платный трафик", unitProfit: "$5" },
  { segment: "Органика", unitProfit: "$16" },
];

const costPieData = [
  { name: "Себестоимость", value: avgCogs, color: "hsl(258, 90%, 66%)" },
  { name: "CAC", value: avgCac, color: "hsl(330, 80%, 65%)" },
  { name: "Логистика", value: avgLogistics, color: "hsl(217, 91%, 60%)" },
  { name: "Скидки", value: avgDiscount, color: "hsl(45, 93%, 55%)" },
  { name: "Комиссии", value: avgProcessingFee, color: "hsl(160, 60%, 45%)" },
];

const profitDistribution = [
  { range: "<$0", pct: 9 },
  { range: "$0–5", pct: 18 },
  { range: "$5–10", pct: 32 },
  { range: "$10–20", pct: 25 },
  { range: ">$20", pct: 16 },
];

// Metric-specific segment data
const metricSegments: Record<string, { segment: string; value: string }[]> = {
  aov: [
    { segment: "Со скидкой", value: "$142" },
    { segment: "Без скидки", value: "$189" },
    { segment: "Платный трафик", value: "$155" },
    { segment: "Органика", value: "$178" },
  ],
  cogs: [
    { segment: "Одежда", value: "$92" },
    { segment: "Обувь", value: "$75" },
    { segment: "Аксессуары", value: "$45" },
    { segment: "Комплекты", value: "$108" },
  ],
  cac: [
    { segment: "Яндекс.Директ", value: "$52" },
    { segment: "VK Реклама", value: "$38" },
    { segment: "Таргет Instagram", value: "$44" },
    { segment: "Органика", value: "$0" },
  ],
  logistics: [
    { segment: "СДЭК", value: "$18" },
    { segment: "Почта России", value: "$12" },
    { segment: "Boxberry", value: "$15" },
    { segment: "Самовывоз", value: "$3" },
  ],
  unit_profit: [
    { segment: "Со скидкой", value: "$3" },
    { segment: "Без скидки", value: "$11" },
    { segment: "Платный трафик", value: "$5" },
    { segment: "Органика", value: "$16" },
  ],
  margin: [
    { segment: "Одежда", value: "18.2%" },
    { segment: "Обувь", value: "-15.4%" },
    { segment: "Аксессуары", value: "7.5%" },
    { segment: "Комплекты", value: "33.0%" },
  ],
};

function MetricDrawerContent({ metricKey }: { metricKey: string }) {
  const data = metricProductData[metricKey];
  const segments = metricSegments[metricKey] || [];
  const isPercent = metricKey === "margin";
  const valueCol = data.columns[2];

  return (
    <div className="mt-4 space-y-5">
      {/* Product table */}
      <div>
        <h4 className="text-xs font-semibold text-muted-foreground mb-2">По товарам</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left pb-2 font-medium">{data.columns[0]}</th>
                <th className="text-right pb-2 font-medium">{data.columns[1]}</th>
                <th className="text-right pb-2 font-medium">{valueCol}</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row) => {
                const val = row.values[0];
                const isNeg = val < 0;
                const isLow = !isPercent && val >= 0 && val < 5;
                const isLowPct = isPercent && val >= 0 && val < 10;
                return (
                  <tr key={row.name} className="border-b border-border/30">
                    <td className="py-2 font-medium text-foreground">{row.name}</td>
                    <td className="py-2 text-right text-muted-foreground">{row.orders}</td>
                    <td className={cn(
                      "py-2 text-right font-semibold",
                      isNeg ? "text-destructive" : (isLow || isLowPct) ? "text-amber-500" : "text-foreground"
                    )}>
                      {isPercent ? `${val.toFixed(1)}%` : `$${val}`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Segments */}
      {segments.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground mb-2">По сегментам</h4>
          <div className="space-y-1.5">
            {segments.map((s) => (
              <div key={s.segment} className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2">
                <span className="text-xs text-foreground">{s.segment}</span>
                <span className="text-xs font-semibold text-foreground">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI */}
      <div className="bg-primary/5 rounded-xl p-3 border border-primary/10">
        <p className="text-xs text-muted-foreground">
          <span className="text-primary font-medium">AI: </span>
          {data.insight}
        </p>
      </div>
    </div>
  );
}

function GeneralDrawerContent() {
  return (
    <div className="mt-4 space-y-5">
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
                  <td className="py-2 text-right text-muted-foreground">${row.avgRevenue}</td>
                  <td className="py-2 text-right text-muted-foreground">${row.avgCost}</td>
                  <td className="py-2 text-right text-muted-foreground">${row.cac}</td>
                  <td className={cn(
                    "py-2 text-right font-semibold",
                    row.unitProfit < 0 ? "text-destructive" : row.unitProfit < 5 ? "text-amber-500" : "text-foreground"
                  )}>
                    ${row.unitProfit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
                formatter={(val: number) => [`$${val.toFixed(0)}`, ""]}
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

      <div className="bg-primary/5 rounded-xl p-3 border border-primary/10">
        <p className="text-xs text-muted-foreground">
          <span className="text-primary font-medium">AI: </span>
          Заказы с CAC выше $20 генерируют отрицательную маржу в 41% случаев.
        </p>
      </div>
    </div>
  );
}

export function UnitEconomicsOverview() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  const handleCardClick = (e: React.MouseEvent, key: string) => {
    e.stopPropagation();
    setSelectedMetric(key);
    setDrawerOpen(true);
  };

  const handleBlockClick = () => {
    setSelectedMetric(null);
    setDrawerOpen(true);
  };

  const drawerTitle = selectedMetric
    ? `${kpiCards.find(c => c.key === selectedMetric)?.label} — Детализация`
    : "Юнит-экономика — Обзор";

  return (
    <>
      <div
        onClick={handleBlockClick}
        className="bg-card rounded-2xl p-5 border border-border h-full flex flex-col cursor-pointer hover:border-primary/30 transition-colors"
      >
        <div className="mb-3">
          <h3 className="font-semibold text-foreground text-sm">Юнит-экономика</h3>
          <p className="text-xs text-muted-foreground">Прибыль на заказ после всех затрат</p>
        </div>

        <div className="grid grid-cols-2 gap-2 flex-1">
          {kpiCards.map((card) => (
            <TooltipProvider key={card.key}>
              <div
                onClick={(e) => handleCardClick(e, card.key)}
                className={cn(
                  "bg-muted/50 rounded-xl p-3 border border-border/50 cursor-pointer hover:bg-muted/80 hover:border-primary/40 transition-colors relative group"
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

        <div className="mt-3 bg-primary/5 rounded-xl p-3 border border-primary/10">
          <p className="text-xs text-muted-foreground">
            <span className="text-primary font-medium">AI: </span>
            27% заказов приносят менее $5 прибыли после вычета CAC и доставки.
          </p>
        </div>
      </div>

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-base">{drawerTitle}</SheetTitle>
            <SheetDescription className="text-xs">
              Период: Месяц · {totalOrders.toLocaleString()} заказов
            </SheetDescription>
          </SheetHeader>
          {selectedMetric ? (
            <MetricDrawerContent metricKey={selectedMetric} />
          ) : (
            <GeneralDrawerContent />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
