import { useState } from "react";
import { cn } from "@/lib/utils";
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
const potentialProfit = 136000;
const actualProfit = 72800;
const totalLostProfit = potentialProfit - actualProfit;

interface LossCategory {
  name: string;
  amount: number;
  color: string;
}

const lossCategories: LossCategory[] = [
  { name: "Скидки", amount: 18200, color: "hsl(330, 80%, 65%)" },
  { name: "Возвраты", amount: 14600, color: "hsl(0, 84%, 60%)" },
  { name: "Логистика", amount: 12400, color: "hsl(217, 91%, 60%)" },
  { name: "Реклама", amount: 10800, color: "hsl(258, 90%, 66%)" },
  { name: "Комиссии", amount: 4200, color: "hsl(45, 93%, 55%)" },
  { name: "Низкая маржа товаров", amount: 3000, color: "hsl(160, 60%, 45%)" },
];

const maxLoss = Math.max(...lossCategories.map(c => c.amount));

// Drawer mock data per category
const skuLossTable = [
  { sku: "Конверт на выписку", orders: 150, discountUsed: "22%", unitMarginLoss: "18 ₽", totalLoss: "2 700 ₽" },
  { sku: "Кроссовки спорт", orders: 95, discountUsed: "28%", unitMarginLoss: "24 ₽", totalLoss: "2 280 ₽" },
  { sku: "Боди хлопок", orders: 210, discountUsed: "15%", unitMarginLoss: "12 ₽", totalLoss: "2 520 ₽" },
  { sku: "Шапка вязаная", orders: 180, discountUsed: "18%", unitMarginLoss: "8 ₽", totalLoss: "1 440 ₽" },
  { sku: "Футболка оверсайз", orders: 130, discountUsed: "12%", unitMarginLoss: "6 ₽", totalLoss: "780 ₽" },
];

const segmentedLoss = [
  { segment: "Платная реклама", loss: "8 200 ₽" },
  { segment: "Органика", loss: "2 100 ₽" },
  { segment: "Промо-кампания", loss: "5 400 ₽" },
  { segment: "Склад А", loss: "1 800 ₽" },
];

const lossDistribution = [
  { range: "0–5%", pct: 22 },
  { range: "5–10%", pct: 34 },
  { range: "10–20%", pct: 27 },
  { range: ">20%", pct: 17 },
];

const driverPieData = [
  { name: "Брак", value: 35, color: "hsl(0, 84%, 60%)" },
  { name: "Ошибка товара", value: 25, color: "hsl(330, 80%, 65%)" },
  { name: "Предпочтения клиента", value: 28, color: "hsl(217, 91%, 60%)" },
  { name: "Повреждение при доставке", value: 12, color: "hsl(45, 93%, 55%)" },
];

export function WhereProfitIsLost() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<LossCategory | null>(null);

  const handleCategoryClick = (cat: LossCategory) => {
    setSelectedCategory(cat);
    setDrawerOpen(true);
  };

  return (
    <>
      <div className="bg-card rounded-2xl p-5 border border-border h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-foreground text-sm">Где теряется прибыль</h3>
            <p className="text-xs text-muted-foreground">Источники потери маржи</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Потеряно прибыли</p>
            <p className="text-sm font-bold text-destructive">−{totalLostProfit.toLocaleString()} ₽</p>
          </div>
        </div>

        {/* Loss Bars */}
        <div className="flex-1 flex flex-col gap-2.5">
          {lossCategories.map((cat) => {
            const pct = ((cat.amount / totalLostProfit) * 100).toFixed(0);
            const barWidth = (cat.amount / maxLoss) * 100;
            return (
              <div
                key={cat.name}
                className="cursor-pointer rounded-lg p-2 -mx-1 hover:bg-muted/50 transition-colors group"
                onClick={() => handleCategoryClick(cat)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-foreground font-medium">{cat.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-destructive">−{cat.amount.toLocaleString()} ₽</span>
                    <span className="text-[10px] text-muted-foreground">{pct}%</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${barWidth}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* AI Insight */}
        <div className="mt-3 bg-primary/5 rounded-xl p-3 border border-primary/10">
          <p className="text-xs text-muted-foreground">
            <span className="text-primary font-medium">AI: </span>
            34% потенциальной прибыли теряется из-за скидок и возвратов.
          </p>
        </div>
      </div>

      {/* Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-base">
              {selectedCategory?.name || ""} — Детализация
            </SheetTitle>
            <SheetDescription className="text-xs">
              Потери: {selectedCategory ? `−${selectedCategory.amount.toLocaleString()} ₽` : ""} · Месяц
            </SheetDescription>
          </SheetHeader>

          <div className="mt-4 space-y-5">
            {/* SKU Loss Table */}
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground mb-2">По товарам</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="text-left pb-2 font-medium">Товар</th>
                      <th className="text-right pb-2 font-medium">Заказы</th>
                      <th className="text-right pb-2 font-medium">Скидка</th>
                      <th className="text-right pb-2 font-medium">Потеря/ед</th>
                      <th className="text-right pb-2 font-medium">Итого</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skuLossTable.map((row) => (
                      <tr key={row.sku} className="border-b border-border/30">
                        <td className="py-2 font-medium text-foreground">{row.sku}</td>
                        <td className="py-2 text-right text-muted-foreground">{row.orders}</td>
                        <td className="py-2 text-right text-muted-foreground">{row.discountUsed}</td>
                        <td className="py-2 text-right text-destructive">{row.unitMarginLoss}</td>
                        <td className="py-2 text-right font-semibold text-destructive">{row.totalLoss}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Segmented Loss */}
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground mb-2">По сегментам</h4>
              <div className="space-y-1.5">
                {segmentedLoss.map((s) => (
                  <div key={s.segment} className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2">
                    <span className="text-xs text-foreground">{s.segment}</span>
                    <span className="text-xs font-semibold text-destructive">{s.loss}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Loss Distribution */}
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground mb-2">Распределение потерь маржи</h4>
              <div className="h-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={lossDistribution} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="range" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} width={35} />
                    <Bar dataKey="pct" fill="hsl(330, 80%, 65%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Driver Pie */}
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground mb-2">Драйверы потерь</h4>
              <div className="h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={driverPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={35} outerRadius={60}>
                      {driverPieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <ReTooltip
                      formatter={(val: number) => [`${val}%`, ""]}
                      contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-2 mt-1">
                {driverPieData.map((c) => (
                  <span key={c.name} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                    {c.name}
                  </span>
                ))}
              </div>
            </div>

            {/* AI Recommendation */}
            <div className="bg-primary/5 rounded-xl p-3 border border-primary/10">
              <p className="text-xs text-muted-foreground">
                <span className="text-primary font-medium">AI: </span>
                Товары со скидками более 15% генерируют отрицательную маржу в 38% случаев.
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
