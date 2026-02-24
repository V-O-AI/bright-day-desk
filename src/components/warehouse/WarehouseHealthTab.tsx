import { useState } from "react";
import { TrendingUp, TrendingDown, RotateCcw, AlertTriangle, Zap, Snail, ShoppingCart, Info, X } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip as RechartsTooltip } from "recharts";
import { cn } from "@/lib/utils";
import { products, deadStockItems } from "@/data/warehouseMockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// KPI calculations
const avgTurnover = Math.round(products.reduce((s, p) => s + p.turnoverDays, 0) / products.length);
const riskProducts = products.filter(p => p.riskScore >= 70);
const riskPercent = Math.round((riskProducts.length / products.length) * 100);
const fastMoving = products.filter(p => p.salesPerDay >= 5);
const fastPercent = Math.round((fastMoving.length / products.length) * 100);
const slowMoving = products.filter(p => p.salesPerDay < 2);
const slowPercent = Math.round((slowMoving.length / products.length) * 100);
const overstock = products.filter(p => p.daysLeft > 60);
const overstockPercent = Math.round((overstock.length / products.length) * 100);

interface KpiCard {
  label: string;
  value: string;
  unit: string;
  trend: number;
  icon: React.ReactNode;
  color: string;
  items: typeof products;
  description: string;
}

const kpis: KpiCard[] = [
  { label: "Ср. оборачиваемость", value: String(avgTurnover), unit: "дн.", trend: -2.5, icon: <RotateCcw className="h-4 w-4" />, color: "text-primary", items: products.sort((a, b) => a.turnoverDays - b.turnoverDays), description: "Среднее кол-во дней от поступления до продажи" },
  { label: "Риск закончится", value: `${riskPercent}`, unit: "%", trend: 5.2, icon: <AlertTriangle className="h-4 w-4" />, color: "text-destructive", items: riskProducts, description: "Товары с высоким риском нехватки запасов" },
  { label: "Быстро движущиеся", value: `${fastPercent}`, unit: "%", trend: 3.1, icon: <Zap className="h-4 w-4" />, color: "text-green-500", items: fastMoving, description: "Товары с продажами ≥5 шт/день" },
  { label: "Медленно движущиеся", value: `${slowPercent}`, unit: "%", trend: -1.8, icon: <Snail className="h-4 w-4" />, color: "text-orange-500", items: slowMoving, description: "Товары с продажами <2 шт/день" },
  { label: "Перекупленные товары", value: `${overstockPercent}`, unit: "%", trend: -4.0, icon: <ShoppingCart className="h-4 w-4" />, color: "text-blue-500", items: overstock, description: "Товары с запасом более чем на 60 дней" },
];

// ABC
const abcA = products.filter(p => p.abcGroup === "A");
const abcB = products.filter(p => p.abcGroup === "B");
const abcC = products.filter(p => p.abcGroup === "C");

function KpiModal({ kpi, open, onClose }: { kpi: KpiCard | null; open: boolean; onClose: () => void }) {
  if (!kpi) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">{kpi.icon}{kpi.label}</DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground mb-3">{kpi.description}</p>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted-foreground text-xs border-b border-border">
              <th className="text-left pb-2 font-medium">Товар</th>
              <th className="text-right pb-2 font-medium">Остаток</th>
              <th className="text-right pb-2 font-medium">Прод./день</th>
              <th className="text-right pb-2 font-medium">Оборот</th>
            </tr>
          </thead>
          <tbody>
            {kpi.items.map((p) => (
              <tr key={p.id} className="border-b border-border/50">
                <td className="py-2 text-foreground font-medium">{p.name}</td>
                <td className="py-2 text-right">{p.remaining} шт</td>
                <td className="py-2 text-right">
                  <span className={cn("font-semibold", p.salesPerDay >= 5 ? "text-green-500" : p.salesPerDay >= 2 ? "text-foreground" : "text-destructive")}>{p.salesPerDay}</span>
                </td>
                <td className="py-2 text-right text-muted-foreground">{p.turnoverDays} дн.</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
          <p className="text-xs text-muted-foreground flex items-start gap-2"><Info className="h-3.5 w-3.5 mt-0.5 text-primary flex-shrink-0" />AI Инсайт: Рекомендуется обратить внимание на товары с низкой оборачиваемостью и высоким риском. Оптимизация закупок может сократить замороженный капитал на 15-20%.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DeadStockTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-popover border border-border rounded-lg p-3 shadow-lg text-sm">
      <p className="font-semibold text-foreground">{d.name}</p>
      <p className="text-muted-foreground text-xs">Количество: {d.quantity} шт</p>
      <p className="text-muted-foreground text-xs">Прод./день: {d.salesPerDay}</p>
      <p className="text-muted-foreground text-xs">Дней без продаж: {d.daysNoSale}</p>
    </div>
  );
}

// Inventory Status Table
function getRiskColor(score: number) {
  if (score >= 70) return "text-destructive bg-destructive/10";
  if (score >= 40) return "text-orange-500 bg-orange-500/10";
  return "text-green-500 bg-green-500/10";
}

function ProductTooltipContent({ product }: { product: typeof products[0] }) {
  return (
    <div className="bg-popover border border-border rounded-lg p-3 shadow-xl text-xs max-w-[220px]">
      <p className="font-semibold text-foreground mb-1">{product.name}</p>
      <div className="space-y-0.5 text-muted-foreground">
        <p>Категория: {product.category}</p>
        <p>Цена: {product.price.toLocaleString()} ₽</p>
        <p>Склад: {product.warehouse}</p>
        <p>ABC: {product.abcGroup}</p>
        <p>Выкуп: {product.buyoutRate}%</p>
      </div>
    </div>
  );
}

export function WarehouseHealthTab() {
  const [selectedKpi, setSelectedKpi] = useState<KpiCard | null>(null);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {kpis.map((kpi, i) => (
          <div
            key={i}
            onClick={() => setSelectedKpi(kpi)}
            className="bg-card border border-border rounded-xl p-4 cursor-pointer hover:border-primary/40 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center bg-muted", kpi.color)}>{kpi.icon}</div>
              <p className="text-xs text-muted-foreground font-medium">{kpi.label}</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-foreground">{kpi.value}</span>
              <span className="text-xs text-muted-foreground">{kpi.unit}</span>
            </div>
            <div className="flex items-center gap-1 mt-2">
              {kpi.trend > 0 ? <TrendingUp className="h-3 w-3 text-green-500" /> : <TrendingDown className="h-3 w-3 text-destructive" />}
              <span className={cn("text-[10px] font-semibold", kpi.trend > 0 ? "text-green-500" : "text-destructive")}>{kpi.trend > 0 ? "+" : ""}{kpi.trend}%</span>
              <span className="text-[10px] text-muted-foreground">vs пр. период</span>
            </div>
          </div>
        ))}
      </div>

      {/* Dead Stock Chart */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-foreground">Мёртвые товары</h3>
          <span className="text-xs text-muted-foreground">Последние 30 дней</span>
        </div>
        <p className="text-xs text-muted-foreground mb-4">Количество товаров и скорость продаж</p>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={deadStockItems} barSize={40}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} interval={0} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} label={{ value: "Кол-во", angle: -90, position: "insideLeft", style: { fontSize: 10, fill: "hsl(var(--muted-foreground))" } }} />
              <RechartsTooltip content={<DeadStockTooltip />} />
              <Bar dataKey="quantity" radius={[6, 6, 0, 0]}>
                {deadStockItems.map((entry, index) => (
                  <Cell key={index} fill={entry.daysNoSale >= 8 ? "hsl(0, 72%, 55%)" : entry.daysNoSale >= 4 ? "hsl(35, 92%, 50%)" : "hsl(142, 71%, 45%)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-2 mt-2 text-[10px] text-muted-foreground justify-around">
          {deadStockItems.map((item, i) => (
            <span key={i} className="text-center">{item.salesPerDay} ед/день</span>
          ))}
        </div>
      </div>

      {/* ABC Cards */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-foreground mb-1">ABC — оборот</h3>
        <p className="text-xs text-muted-foreground mb-4">Классификация товаров по вкладу в общий оборот</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "A", pct: 65, count: abcA.length, totalPct: Math.round((abcA.length / products.length) * 100), items: abcA, color: "border-green-500/30 bg-green-500/5" },
            { label: "B", pct: 25, count: abcB.length, totalPct: Math.round((abcB.length / products.length) * 100), items: abcB, color: "border-orange-500/30 bg-orange-500/5" },
            { label: "C", pct: 10, count: abcC.length, totalPct: Math.round((abcC.length / products.length) * 100), items: abcC, color: "border-destructive/30 bg-destructive/5" },
          ].map((abc) => (
            <div key={abc.label} className={cn("border rounded-xl p-4", abc.color)}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-bold text-foreground">Категория {abc.label}</span>
              </div>
              <p className="text-sm text-foreground">{abc.totalPct}% товаров приносят <span className="font-bold">{abc.pct}%</span> оборота</p>
              <div className="mt-3 space-y-1">
                {abc.items.slice(0, 3).map(p => (
                  <div key={p.id} className="flex justify-between text-xs">
                    <span className="text-muted-foreground truncate max-w-[120px]">{p.name}</span>
                    <span className="text-foreground font-medium">{p.salesPerDay} шт/д</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-[10px] text-muted-foreground">тренд стабильный</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inventory Status Table */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-foreground mb-1">Состояние запасов</h3>
        <p className="text-xs text-muted-foreground mb-4">Детальная информация по каждому товару</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground text-xs border-b border-border">
                <th className="text-left pb-3 font-medium">Товар</th>
                <th className="text-right pb-3 font-medium">Остаток</th>
                <th className="text-right pb-3 font-medium">Зарезерв.</th>
                <th className="text-right pb-3 font-medium">В пути</th>
                <th className="text-right pb-3 font-medium">Дней до конца</th>
                <th className="text-right pb-3 font-medium">Продажи/день</th>
                <th className="text-right pb-3 font-medium">Риск неуспеть</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors relative group"
                  onMouseEnter={() => setHoveredProduct(p.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  <td className="py-3 text-foreground font-medium relative">
                    {p.name}
                    {hoveredProduct === p.id && (
                      <div className="absolute left-0 top-full z-50">
                        <ProductTooltipContent product={p} />
                      </div>
                    )}
                  </td>
                  <td className="py-3 text-right">
                    <span className={cn("font-medium", p.remaining < 30 ? "text-destructive" : "text-foreground")}>{p.remaining}</span>
                  </td>
                  <td className="py-3 text-right text-muted-foreground">{p.reserved}</td>
                  <td className="py-3 text-right text-muted-foreground">{p.inTransit || "—"}</td>
                  <td className="py-3 text-right">
                    <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", p.daysLeft <= 7 ? "bg-destructive/10 text-destructive" : p.daysLeft <= 21 ? "bg-orange-500/10 text-orange-500" : "bg-green-500/10 text-green-500")}>{p.daysLeft} дн.</span>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span className="font-medium text-foreground">{p.salesPerDay}</span>
                      {p.salesTrend > 0 ? <TrendingUp className="h-3 w-3 text-green-500" /> : <TrendingDown className="h-3 w-3 text-destructive" />}
                      <span className={cn("text-[10px]", p.salesTrend > 0 ? "text-green-500" : "text-destructive")}>{p.salesTrend > 0 ? "+" : ""}{p.salesTrend}%</span>
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", getRiskColor(p.riskScore))}>{p.riskScore}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <KpiModal kpi={selectedKpi} open={!!selectedKpi} onClose={() => setSelectedKpi(null)} />
    </div>
  );
}
