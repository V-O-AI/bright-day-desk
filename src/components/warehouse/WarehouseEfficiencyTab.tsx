import { useState } from "react";
import { TrendingUp, TrendingDown, Info, X } from "lucide-react";
import { ComposedChart, Area, Line, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip, CartesianGrid, ReferenceLine, ScatterChart, Scatter, ZAxis, Cell } from "recharts";
import { cn } from "@/lib/utils";
import { products, salesVsStockMonthly } from "@/data/warehouseMockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Sales vs Stock KPIs
const totalSales = salesVsStockMonthly.reduce((s, m) => s + m.sales, 0);
const latestStock = salesVsStockMonthly[salesVsStockMonthly.length - 1].stock;
const turnoverRatio = (totalSales / latestStock * 12).toFixed(1);

function SalesStockTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border rounded-lg p-3 shadow-lg text-sm">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      <p className="text-muted-foreground text-xs">Продажи: {(payload[0]?.value || 0).toLocaleString()} шт</p>
      <p className="text-muted-foreground text-xs">Запасы: {(payload[1]?.value || 0).toLocaleString()} шт</p>
    </div>
  );
}

// ABC Aging Matrix
type AgingLevel = "normal" | "slowing" | "risk" | "problem" | "critical";
const agingRows: { label: string; sub: string; level: AgingLevel }[] = [
  { label: "Норма", sub: "0-3 дней", level: "normal" },
  { label: "Замедление", sub: "4-7 дней", level: "slowing" },
  { label: "Риск", sub: "8-14 дней", level: "risk" },
  { label: "Проблема", sub: "15+ дней", level: "problem" },
  { label: "Критично", sub: "31+ дней", level: "critical" },
];

function getAgingColor(abc: "A" | "B" | "C", level: AgingLevel): string {
  const matrix: Record<string, Record<AgingLevel, string>> = {
    A: { normal: "bg-green-100 text-green-800", slowing: "bg-green-200/70 text-green-800", risk: "bg-yellow-100 text-yellow-800", problem: "bg-orange-100 text-orange-800", critical: "bg-red-200 text-red-800" },
    B: { normal: "bg-green-50 text-green-700", slowing: "bg-yellow-100 text-yellow-700", risk: "bg-yellow-200 text-yellow-800", problem: "bg-orange-200 text-orange-800", critical: "bg-red-200 text-red-800" },
    C: { normal: "bg-yellow-50 text-yellow-700", slowing: "bg-orange-100 text-orange-700", risk: "bg-orange-200 text-orange-800", problem: "bg-red-100 text-red-700", critical: "bg-red-300 text-red-900" },
  };
  return matrix[abc]?.[level] || "bg-muted text-foreground";
}

function getAgingData(abc: "A" | "B" | "C", level: AgingLevel) {
  const filtered = products.filter(p => p.abcGroup === abc);
  const ranges: Record<AgingLevel, [number, number]> = {
    normal: [0, 3], slowing: [4, 7], risk: [8, 14], problem: [15, 30], critical: [31, 999],
  };
  const [min, max] = ranges[level];
  const matching = filtered.filter(p => p.daysSinceLastSale >= min && p.daysSinceLastSale <= max);
  return { count: matching.length, skuCount: filtered.length, items: matching };
}

// Bubble chart data
const bubbleData = products.map(p => ({
  x: p.stockoutRisk,
  y: p.profitability,
  z: p.remaining * p.price / 10000,
  name: p.name,
  ...p,
  segment: p.profitability >= 50 && p.stockoutRisk < 50 ? "stable" :
           p.profitability >= 50 && p.stockoutRisk >= 50 ? "maintain" :
           p.profitability < 50 && p.stockoutRisk < 50 ? "optimize" : "action",
}));

const segmentColors: Record<string, string> = {
  stable: "hsl(142, 71%, 45%)",
  maintain: "hsl(142, 50%, 55%)",
  optimize: "hsl(35, 92%, 50%)",
  action: "hsl(0, 72%, 55%)",
};

const segmentLabels: Record<string, string> = {
  stable: "Стабильные",
  optimize: "Оптимизировать",
  maintain: "Поддержать",
  action: "Принять меры",
};

function BubbleTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 shadow-xl text-xs max-w-[240px]">
      <p className="font-bold text-foreground text-sm mb-1">{d.name}</p>
      <div className="space-y-0.5 text-foreground">
        <p>Остаток: {d.remaining} шт</p>
        <p>В пути: {d.inTransit} шт{d.inTransit > 0 && ` (приемка ${d.lastSaleDate})`}</p>
        <p>Продажи/день: {d.salesPerDay}шт</p>
        <p>Тренд: {d.salesTrend > 0 ? "+" : ""}{d.salesTrend}%</p>
        <p>Выкуп: {d.buyoutRate}%{d.buyoutRate < 80 ? " (низко)" : ""}</p>
        <p>Товар закон.: {d.daysLeft} дня</p>
      </div>
      <p className="mt-2 text-primary font-medium">Рекомендации →</p>
    </div>
  );
}

export function WarehouseEfficiencyTab() {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [agingModal, setAgingModal] = useState<{ abc: string; level: string; items: typeof products } | null>(null);
  const [bubbleModal, setBubbleModal] = useState<typeof products[0] | null>(null);
  const [segmentFilter, setSegmentFilter] = useState<string>("all");

  const filteredBubbles = segmentFilter === "all" ? bubbleData : bubbleData.filter(b => b.segment === segmentFilter);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Sales vs Stock */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-foreground text-center text-lg">Продажи vs Запасы</h3>
        <p className="text-xs text-muted-foreground text-center mb-4">Объём продаж и уровень запасов по месяцам</p>

        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="border border-border rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground">Всего продаж</p>
            <p className="text-xl font-bold text-foreground">{(totalSales).toLocaleString()} <span className="text-xs font-normal">шт</span></p>
            <div className="flex items-center justify-center gap-1 mt-1"><TrendingUp className="h-3 w-3 text-green-500" /><span className="text-[10px] text-green-500">+18%</span></div>
          </div>
          <div className="border border-border rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground">Объём запасов</p>
            <p className="text-xl font-bold text-foreground">{(latestStock).toLocaleString()} <span className="text-xs font-normal">шт</span></p>
            <div className="flex items-center justify-center gap-1 mt-1"><TrendingDown className="h-3 w-3 text-destructive" /><span className="text-[10px] text-destructive">-12%</span></div>
          </div>
          <div className="border border-border rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground">Оборачиваемость</p>
            <p className="text-xl font-bold text-foreground">{turnoverRatio}x</p>
          </div>
        </div>

        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={salesVsStockMonthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} label={{ value: "Продажи", angle: -90, position: "insideLeft", style: { fontSize: 10, fill: "hsl(var(--muted-foreground))" } }} />
              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} label={{ value: "Запасы", angle: 90, position: "insideRight", style: { fontSize: 10, fill: "hsl(var(--muted-foreground))" } }} />
              <RechartsTooltip content={<SalesStockTooltip />} />
              <ReferenceLine yAxisId="right" y={2000000} stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" label={{ value: "Оптимум", position: "right", style: { fontSize: 10, fill: "hsl(var(--muted-foreground))" } }} />
              <Area yAxisId="left" type="monotone" dataKey="sales" fill="hsl(142, 71%, 45%)" fillOpacity={0.3} stroke="hsl(142, 71%, 45%)" strokeWidth={0} />
              <Line yAxisId="right" type="monotone" dataKey="stock" stroke="hsl(217, 71%, 53%)" strokeWidth={2} dot={{ r: 3, fill: "hsl(217, 71%, 53%)" }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Clickable months */}
        <div className="flex gap-1 mt-3 justify-center flex-wrap">
          {salesVsStockMonthly.map((m) => (
            <button key={m.month} onClick={() => setSelectedMonth(selectedMonth === m.month ? null : m.month)}
              className={cn("px-2 py-1 rounded-md text-[10px] transition-colors", selectedMonth === m.month ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80")}>
              {m.month}
            </button>
          ))}
        </div>
        {selectedMonth && (
          <div className="mt-3 p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Аналитика за {selectedMonth}:</p>
            {(() => {
              const d = salesVsStockMonthly.find(m => m.month === selectedMonth)!;
              const avgDaily = Math.round(d.sales / 30);
              return <p>Продажи: ~{avgDaily} шт/день. Запасов хватит на {Math.round(d.stock / avgDaily)} дней при текущем темпе.</p>;
            })()}
          </div>
        )}
      </div>

      {/* ABC Aging Matrix */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-foreground text-center text-lg">ABC Aging Matrix</h3>
        <p className="text-xs text-muted-foreground text-center mb-4">Здоровье SKU по важности оборота</p>

        <div className="flex items-center justify-end gap-3 mb-3 text-xs text-muted-foreground">
          <span>A: {products.filter(p => p.abcGroup === "A").length} SKU → 66% Оборота</span>
          <span>B: {products.filter(p => p.abcGroup === "B").length} SKU → 25%</span>
          <span>C: {products.filter(p => p.abcGroup === "C").length} SKU → 9%</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left text-xs text-muted-foreground pb-2 pr-3 w-24"></th>
                {(["A", "B", "C"] as const).map(abc => (
                  <th key={abc} className="text-center pb-2 w-1/3">
                    <div className={cn("inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold", abc === "A" ? "bg-blue-500 text-white" : abc === "B" ? "bg-orange-400 text-white" : "bg-gray-400 text-white")}>{abc}</div>
                    <p className="text-xs text-muted-foreground mt-1">{abc === "A" ? "Best Performers" : abc === "B" ? "Moderate" : "Low Performers"}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {agingRows.map((row) => (
                <tr key={row.level}>
                  <td className="text-xs text-muted-foreground py-1 pr-3 font-medium align-top">
                    <span className="font-semibold text-foreground">{row.label}:</span><br />{row.sub}
                  </td>
                  {(["A", "B", "C"] as const).map(abc => {
                    const data = getAgingData(abc, row.level);
                    return (
                      <td key={abc} className="p-1">
                        <div
                          onClick={() => data.count > 0 && setAgingModal({ abc, level: row.label, items: data.items })}
                          className={cn("rounded-lg p-3 text-center cursor-pointer hover:opacity-80 transition-opacity min-h-[60px]", getAgingColor(abc, row.level))}
                        >
                          <p className="text-2xl font-bold">{data.count}</p>
                          <p className="text-[10px]">{data.skuCount} SKU</p>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bubble Scatter Matrix */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-foreground mb-1">Матрица товаров</h3>
        <p className="text-xs text-muted-foreground mb-3">Y — Прибыльность, X — Риски закончится</p>

        <div className="flex gap-2 mb-4 flex-wrap">
          {["all", "stable", "optimize", "maintain", "action"].map(seg => (
            <button key={seg} onClick={() => setSegmentFilter(seg)}
              className={cn("px-3 py-1 rounded-full text-xs transition-colors", segmentFilter === seg ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80")}>
              {seg === "all" ? "Все" : segmentLabels[seg]}
            </button>
          ))}
        </div>

        <div className="h-[350px] relative">
          {/* Quadrant labels */}
          <div className="absolute top-2 left-12 text-xs font-semibold text-green-600 flex items-center gap-1">★ Стабильные</div>
          <div className="absolute top-2 right-4 text-xs font-semibold text-green-500">✓ Поддержать</div>
          <div className="absolute bottom-12 left-12 text-xs font-semibold text-orange-500">⚠ Оптимизировать</div>
          <div className="absolute bottom-12 right-4 text-xs font-semibold text-destructive">✕ Принять меры</div>

          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" dataKey="x" name="Риск" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} label={{ value: "Риски закончится →", position: "bottom", style: { fontSize: 10, fill: "hsl(var(--muted-foreground))" } }} />
              <YAxis type="number" dataKey="y" name="Прибыльность" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} label={{ value: "Прибыльность ↑", angle: -90, position: "insideLeft", style: { fontSize: 10, fill: "hsl(var(--muted-foreground))" } }} />
              <ZAxis type="number" dataKey="z" range={[80, 400]} />
              <RechartsTooltip content={<BubbleTooltip />} />
              <ReferenceLine x={50} stroke="hsl(var(--border))" strokeDasharray="4 4" />
              <ReferenceLine y={50} stroke="hsl(var(--border))" strokeDasharray="4 4" />
              <Scatter data={filteredBubbles} onClick={(d: any) => setBubbleModal(d)}>
                {filteredBubbles.map((entry, i) => (
                  <Cell key={i} fill={segmentColors[entry.segment]} fillOpacity={0.8} stroke={segmentColors[entry.segment]} strokeWidth={1} cursor="pointer" />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className="flex gap-4 mt-3 justify-center text-xs">
          {Object.entries(segmentLabels).map(([key, label]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: segmentColors[key] }} />
              <span className="text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-1">Размер = Общая стоимость запаса</p>

        {/* AI Insight */}
        <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">AI Insight:</span> {Math.round(bubbleData.filter(b => b.segment === "maintain").length / bubbleData.length * 100)}% продаж приходится на товары из зоны «Поддержать». Снижение риска дефицита для товаров из «Принять меры» увеличит выручку на ~115 000 ₽.
            </p>
          </div>
        </div>
      </div>

      {/* Aging Modal */}
      <Dialog open={!!agingModal} onOpenChange={() => setAgingModal(null)}>
        <DialogContent className="max-w-md max-h-[70vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Категория {agingModal?.abc} — {agingModal?.level}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {agingModal?.items.map(p => (
              <div key={p.id} className="flex justify-between items-center py-2 border-b border-border/50 text-sm">
                <span className="text-foreground font-medium">{p.name}</span>
                <span className="text-muted-foreground text-xs">{p.daysSinceLastSale} дн. без продаж</span>
              </div>
            ))}
            {agingModal?.items.length === 0 && <p className="text-muted-foreground text-sm text-center py-4">Нет товаров в этой категории</p>}
          </div>
        </DialogContent>
      </Dialog>

      {/* Bubble Modal */}
      <Dialog open={!!bubbleModal} onOpenChange={() => setBubbleModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{bubbleModal?.name}</DialogTitle>
          </DialogHeader>
          {bubbleModal && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-muted/50 rounded-lg p-3"><p className="text-xs text-muted-foreground">Остаток</p><p className="font-bold text-foreground">{bubbleModal.remaining} шт</p></div>
                <div className="bg-muted/50 rounded-lg p-3"><p className="text-xs text-muted-foreground">Продажи/день</p><p className="font-bold text-foreground">{bubbleModal.salesPerDay}</p></div>
                <div className="bg-muted/50 rounded-lg p-3"><p className="text-xs text-muted-foreground">В пути</p><p className="font-bold text-foreground">{bubbleModal.inTransit} шт</p></div>
                <div className="bg-muted/50 rounded-lg p-3"><p className="text-xs text-muted-foreground">Выкуп</p><p className="font-bold text-foreground">{bubbleModal.buyoutRate}%</p></div>
                <div className="bg-muted/50 rounded-lg p-3"><p className="text-xs text-muted-foreground">Закончится через</p><p className="font-bold text-foreground">{bubbleModal.daysLeft} дн.</p></div>
                <div className="bg-muted/50 rounded-lg p-3"><p className="text-xs text-muted-foreground">Тренд</p><p className={cn("font-bold", bubbleModal.salesTrend > 0 ? "text-green-500" : "text-destructive")}>{bubbleModal.salesTrend > 0 ? "+" : ""}{bubbleModal.salesTrend}%</p></div>
              </div>
              <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                <p className="text-xs text-muted-foreground"><Info className="h-3.5 w-3.5 inline mr-1 text-primary" />Рекомендация: {bubbleModal.riskScore >= 70 ? "Срочно пополнить запасы. Рассмотреть перемещение с других складов." : bubbleModal.riskScore >= 40 ? "Мониторить уровень запасов. Запланировать заказ в ближайшие дни." : "Запасов достаточно. Оптимизировать объём следующей закупки."}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
