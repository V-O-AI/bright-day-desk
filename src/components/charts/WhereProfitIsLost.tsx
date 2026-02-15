import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { SlidersHorizontal } from "lucide-react";
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

const months = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];
const years = [2024, 2025, 2026];

// --- Mock data ---
const potentialProfit = 136000;
const actualProfit = 72800;
const totalLostProfit = potentialProfit - actualProfit;

interface LossCategory {
  name: string;
  amount: number;
  color: string;
  key: string;
}

const lossCategories: LossCategory[] = [
  { name: "Скидки", amount: 18200, color: "hsl(330, 80%, 65%)", key: "discounts" },
  { name: "Возвраты", amount: 14600, color: "hsl(0, 84%, 60%)", key: "returns" },
  { name: "Логистика", amount: 12400, color: "hsl(217, 91%, 60%)", key: "logistics" },
  { name: "Реклама", amount: 10800, color: "hsl(258, 90%, 66%)", key: "ads" },
  { name: "Комиссии", amount: 4200, color: "hsl(45, 93%, 55%)", key: "fees" },
  { name: "Низкая маржа товаров", amount: 3000, color: "hsl(160, 60%, 45%)", key: "low_margin" },
];

const maxLoss = Math.max(...lossCategories.map(c => c.amount));

// Per-category detailed data
const categoryDetails: Record<string, {
  skuTable: { sku: string; orders: number; metric: string; unitLoss: string; totalLoss: string }[];
  segments: { segment: string; loss: string }[];
  distribution: { range: string; pct: number }[];
  drivers: { name: string; value: number; color: string }[];
  insight: string;
  metricLabel: string;
}> = {
  discounts: {
    skuTable: [
      { sku: "Кроссовки спорт", orders: 95, metric: "28%", unitLoss: "24 ₽", totalLoss: "2 280 ₽" },
      { sku: "Конверт на выписку", orders: 150, metric: "22%", unitLoss: "18 ₽", totalLoss: "2 700 ₽" },
      { sku: "Боди хлопок", orders: 210, metric: "15%", unitLoss: "12 ₽", totalLoss: "2 520 ₽" },
      { sku: "Шапка вязаная", orders: 180, metric: "18%", unitLoss: "8 ₽", totalLoss: "1 440 ₽" },
      { sku: "Футболка оверсайз", orders: 130, metric: "12%", unitLoss: "6 ₽", totalLoss: "780 ₽" },
    ],
    segments: [
      { segment: "Промо-кампания", loss: "8 400 ₽" },
      { segment: "Сезонная распродажа", loss: "5 200 ₽" },
      { segment: "Купоны новых клиентов", loss: "3 100 ₽" },
      { segment: "Программа лояльности", loss: "1 500 ₽" },
    ],
    distribution: [
      { range: "0–5%", pct: 18 },
      { range: "5–10%", pct: 26 },
      { range: "10–20%", pct: 34 },
      { range: ">20%", pct: 22 },
    ],
    drivers: [
      { name: "Промо-акции", value: 42, color: "hsl(330, 80%, 65%)" },
      { name: "Купоны", value: 28, color: "hsl(258, 90%, 66%)" },
      { name: "Сезонные скидки", value: 20, color: "hsl(217, 91%, 60%)" },
      { name: "Ручные скидки", value: 10, color: "hsl(45, 93%, 55%)" },
    ],
    insight: "Товары со скидками более 15% генерируют отрицательную маржу в 38% случаев. Рекомендуется ограничить скидки до 10%.",
    metricLabel: "Скидка",
  },
  returns: {
    skuTable: [
      { sku: "Кроссовки спорт", orders: 95, metric: "18%", unitLoss: "32 ₽", totalLoss: "3 040 ₽" },
      { sku: "Комбинезон зимний", orders: 320, metric: "8%", unitLoss: "15 ₽", totalLoss: "4 800 ₽" },
      { sku: "Конверт на выписку", orders: 150, metric: "12%", unitLoss: "22 ₽", totalLoss: "3 300 ₽" },
      { sku: "Боди хлопок", orders: 210, metric: "6%", unitLoss: "10 ₽", totalLoss: "2 100 ₽" },
      { sku: "Шапка вязаная", orders: 180, metric: "4%", unitLoss: "5 ₽", totalLoss: "900 ₽" },
    ],
    segments: [
      { segment: "Не подошёл размер", loss: "5 800 ₽" },
      { segment: "Брак", loss: "4 200 ₽" },
      { segment: "Не соответствует описанию", loss: "2 900 ₽" },
      { segment: "Повреждение при доставке", loss: "1 700 ₽" },
    ],
    distribution: [
      { range: "0–5%", pct: 32 },
      { range: "5–10%", pct: 28 },
      { range: "10–20%", pct: 25 },
      { range: ">20%", pct: 15 },
    ],
    drivers: [
      { name: "Брак", value: 35, color: "hsl(0, 84%, 60%)" },
      { name: "Ошибка товара", value: 25, color: "hsl(330, 80%, 65%)" },
      { name: "Предпочтения клиента", value: 28, color: "hsl(217, 91%, 60%)" },
      { name: "Повреждение при доставке", value: 12, color: "hsl(45, 93%, 55%)" },
    ],
    insight: "18% возвратов Кроссовок спорт — из-за неточной размерной сетки. Уточнение размерной таблицы снизит возвраты на 30%.",
    metricLabel: "% возвратов",
  },
  logistics: {
    skuTable: [
      { sku: "Футболка оверсайз", orders: 130, metric: "22 ₽", unitLoss: "8 ₽", totalLoss: "1 040 ₽" },
      { sku: "Конверт на выписку", orders: 150, metric: "20 ₽", unitLoss: "6 ₽", totalLoss: "900 ₽" },
      { sku: "Комбинезон зимний", orders: 320, metric: "14 ₽", unitLoss: "4 ₽", totalLoss: "1 280 ₽" },
      { sku: "Шапка вязаная", orders: 180, metric: "18 ₽", unitLoss: "5 ₽", totalLoss: "900 ₽" },
      { sku: "Боди хлопок", orders: 210, metric: "16 ₽", unitLoss: "3 ₽", totalLoss: "630 ₽" },
    ],
    segments: [
      { segment: "СДЭК", loss: "4 800 ₽" },
      { segment: "Почта России", loss: "3 200 ₽" },
      { segment: "Boxberry", loss: "2 600 ₽" },
      { segment: "Курьерская доставка", loss: "1 800 ₽" },
    ],
    distribution: [
      { range: "0–5 ₽", pct: 25 },
      { range: "5–10 ₽", pct: 35 },
      { range: "10–15 ₽", pct: 28 },
      { range: ">15 ₽", pct: 12 },
    ],
    drivers: [
      { name: "Дальние регионы", value: 38, color: "hsl(217, 91%, 60%)" },
      { name: "Негабарит", value: 28, color: "hsl(258, 90%, 66%)" },
      { name: "Возвратная логистика", value: 22, color: "hsl(0, 84%, 60%)" },
      { name: "Срочная доставка", value: 12, color: "hsl(45, 93%, 55%)" },
    ],
    insight: "Консолидация отправлений в дальние регионы снизит логистические потери на 15%.",
    metricLabel: "Стоимость",
  },
  ads: {
    skuTable: [
      { sku: "Кроссовки спорт", orders: 95, metric: "60 ₽", unitLoss: "32 ₽", totalLoss: "3 040 ₽" },
      { sku: "Конверт на выписку", orders: 150, metric: "55 ₽", unitLoss: "28 ₽", totalLoss: "4 200 ₽" },
      { sku: "Шапка вязаная", orders: 180, metric: "42 ₽", unitLoss: "12 ₽", totalLoss: "2 160 ₽" },
      { sku: "Боди хлопок", orders: 210, metric: "35 ₽", unitLoss: "5 ₽", totalLoss: "1 050 ₽" },
      { sku: "Футболка оверсайз", orders: 130, metric: "48 ₽", unitLoss: "8 ₽", totalLoss: "1 040 ₽" },
    ],
    segments: [
      { segment: "Яндекс.Директ", loss: "4 500 ₽" },
      { segment: "VK Реклама", loss: "3 200 ₽" },
      { segment: "Таргет", loss: "2 100 ₽" },
      { segment: "Ретаргетинг", loss: "1 000 ₽" },
    ],
    distribution: [
      { range: "0–20 ₽", pct: 22 },
      { range: "20–40 ₽", pct: 35 },
      { range: "40–60 ₽", pct: 28 },
      { range: ">60 ₽", pct: 15 },
    ],
    drivers: [
      { name: "Высокий CPC", value: 40, color: "hsl(258, 90%, 66%)" },
      { name: "Низкая конверсия", value: 30, color: "hsl(330, 80%, 65%)" },
      { name: "Широкий таргетинг", value: 20, color: "hsl(217, 91%, 60%)" },
      { name: "Нецелевой трафик", value: 10, color: "hsl(0, 84%, 60%)" },
    ],
    insight: "Заказы с CAC выше 50 ₽ убыточны в 62% случаев. Оптимизация таргетинга снизит потери на 25%.",
    metricLabel: "CAC",
  },
  fees: {
    skuTable: [
      { sku: "Комбинезон зимний", orders: 320, metric: "3.2%", unitLoss: "6 ₽", totalLoss: "1 920 ₽" },
      { sku: "Футболка оверсайз", orders: 130, metric: "3.5%", unitLoss: "7 ₽", totalLoss: "910 ₽" },
      { sku: "Боди хлопок", orders: 210, metric: "3.0%", unitLoss: "5 ₽", totalLoss: "1 050 ₽" },
      { sku: "Шапка вязаная", orders: 180, metric: "2.8%", unitLoss: "4 ₽", totalLoss: "720 ₽" },
      { sku: "Конверт на выписку", orders: 150, metric: "3.1%", unitLoss: "4 ₽", totalLoss: "600 ₽" },
    ],
    segments: [
      { segment: "Банковские карты", loss: "2 100 ₽" },
      { segment: "Эквайринг", loss: "1 200 ₽" },
      { segment: "Маркетплейс комиссия", loss: "600 ₽" },
      { segment: "Платёжные системы", loss: "300 ₽" },
    ],
    distribution: [
      { range: "0–2%", pct: 15 },
      { range: "2–3%", pct: 40 },
      { range: "3–4%", pct: 32 },
      { range: ">4%", pct: 13 },
    ],
    drivers: [
      { name: "Эквайринг", value: 45, color: "hsl(45, 93%, 55%)" },
      { name: "Маркетплейсы", value: 30, color: "hsl(258, 90%, 66%)" },
      { name: "Платёжные агрегаторы", value: 15, color: "hsl(217, 91%, 60%)" },
      { name: "Возвратные комиссии", value: 10, color: "hsl(0, 84%, 60%)" },
    ],
    insight: "Переход на прямой эквайринг для топ-3 товаров снизит комиссионные расходы на 18%.",
    metricLabel: "Ставка",
  },
  low_margin: {
    skuTable: [
      { sku: "Кроссовки спорт", orders: 95, metric: "-15.4%", unitLoss: "20 ₽", totalLoss: "1 900 ₽" },
      { sku: "Конверт на выписку", orders: 150, metric: "-5.5%", unitLoss: "8 ₽", totalLoss: "1 200 ₽" },
      { sku: "Шапка вязаная", orders: 180, metric: "7.5%", unitLoss: "3 ₽", totalLoss: "540 ₽" },
    ],
    segments: [
      { segment: "Обувь", loss: "1 900 ₽" },
      { segment: "Аксессуары для новорождённых", loss: "1 200 ₽" },
      { segment: "Головные уборы", loss: "540 ₽" },
    ],
    distribution: [
      { range: "<-10%", pct: 12 },
      { range: "-10–0%", pct: 22 },
      { range: "0–5%", pct: 38 },
      { range: "5–10%", pct: 28 },
    ],
    drivers: [
      { name: "Высокая себестоимость", value: 40, color: "hsl(160, 60%, 45%)" },
      { name: "Высокий CAC", value: 35, color: "hsl(258, 90%, 66%)" },
      { name: "Частые скидки", value: 15, color: "hsl(330, 80%, 65%)" },
      { name: "Дорогая логистика", value: 10, color: "hsl(217, 91%, 60%)" },
    ],
    insight: "Кроссовки спорт убыточны: маржа -15.4%. Рекомендуется пересмотреть ценообразование или прекратить продвижение.",
    metricLabel: "Маржа",
  },
};

// General drawer data
const generalSkuLossTable = [
  { sku: "Конверт на выписку", orders: 150, discountUsed: "22%", unitMarginLoss: "18 ₽", totalLoss: "2 700 ₽" },
  { sku: "Кроссовки спорт", orders: 95, discountUsed: "28%", unitMarginLoss: "24 ₽", totalLoss: "2 280 ₽" },
  { sku: "Боди хлопок", orders: 210, discountUsed: "15%", unitMarginLoss: "12 ₽", totalLoss: "2 520 ₽" },
  { sku: "Шапка вязаная", orders: 180, discountUsed: "18%", unitMarginLoss: "8 ₽", totalLoss: "1 440 ₽" },
  { sku: "Футболка оверсайз", orders: 130, discountUsed: "12%", unitMarginLoss: "6 ₽", totalLoss: "780 ₽" },
];

const generalSegmentedLoss = [
  { segment: "Платная реклама", loss: "8 200 ₽" },
  { segment: "Органика", loss: "2 100 ₽" },
  { segment: "Промо-кампания", loss: "5 400 ₽" },
  { segment: "Склад А", loss: "1 800 ₽" },
];

const generalLossDistribution = [
  { range: "0–5%", pct: 22 },
  { range: "5–10%", pct: 34 },
  { range: "10–20%", pct: 27 },
  { range: ">20%", pct: 17 },
];

const generalDriverPieData = [
  { name: "Брак", value: 35, color: "hsl(0, 84%, 60%)" },
  { name: "Ошибка товара", value: 25, color: "hsl(330, 80%, 65%)" },
  { name: "Предпочтения клиента", value: 28, color: "hsl(217, 91%, 60%)" },
  { name: "Повреждение при доставке", value: 12, color: "hsl(45, 93%, 55%)" },
];

function CategoryDrawerContent({ categoryKey }: { categoryKey: string }) {
  const data = categoryDetails[categoryKey];
  if (!data) return null;

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
                <th className="text-right pb-2 font-medium">{data.metricLabel}</th>
                <th className="text-right pb-2 font-medium">Потеря/ед</th>
                <th className="text-right pb-2 font-medium">Итого</th>
              </tr>
            </thead>
            <tbody>
              {data.skuTable.map((row) => (
                <tr key={row.sku} className="border-b border-border/30">
                  <td className="py-2 font-medium text-foreground">{row.sku}</td>
                  <td className="py-2 text-right text-muted-foreground">{row.orders}</td>
                  <td className="py-2 text-right text-muted-foreground">{row.metric}</td>
                  <td className="py-2 text-right text-destructive">{row.unitLoss}</td>
                  <td className="py-2 text-right font-semibold text-destructive">{row.totalLoss}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-muted-foreground mb-2">По сегментам</h4>
        <div className="space-y-1.5">
          {data.segments.map((s) => (
            <div key={s.segment} className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2">
              <span className="text-xs text-foreground">{s.segment}</span>
              <span className="text-xs font-semibold text-destructive">{s.loss}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-muted-foreground mb-2">Распределение потерь</h4>
        <div className="h-[120px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.distribution} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="range" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} width={35} />
              <Bar dataKey="pct" fill="hsl(330, 80%, 65%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-muted-foreground mb-2">Драйверы потерь</h4>
        <div className="h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data.drivers} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={35} outerRadius={60}>
                {data.drivers.map((entry, i) => (
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
          {data.drivers.map((c) => (
            <span key={c.name} className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
              {c.name}
            </span>
          ))}
        </div>
      </div>

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
                <th className="text-right pb-2 font-medium">Скидка</th>
                <th className="text-right pb-2 font-medium">Потеря/ед</th>
                <th className="text-right pb-2 font-medium">Итого</th>
              </tr>
            </thead>
            <tbody>
              {generalSkuLossTable.map((row) => (
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

      <div>
        <h4 className="text-xs font-semibold text-muted-foreground mb-2">По сегментам</h4>
        <div className="space-y-1.5">
          {generalSegmentedLoss.map((s) => (
            <div key={s.segment} className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2">
              <span className="text-xs text-foreground">{s.segment}</span>
              <span className="text-xs font-semibold text-destructive">{s.loss}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-muted-foreground mb-2">Распределение потерь маржи</h4>
        <div className="h-[120px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={generalLossDistribution} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="range" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} width={35} />
              <Bar dataKey="pct" fill="hsl(330, 80%, 65%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-muted-foreground mb-2">Драйверы потерь</h4>
        <div className="h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={generalDriverPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={35} outerRadius={60}>
                {generalDriverPieData.map((entry, i) => (
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
          {generalDriverPieData.map((c) => (
            <span key={c.name} className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
              {c.name}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-primary/5 rounded-xl p-3 border border-primary/10">
        <p className="text-xs text-muted-foreground">
          <span className="text-primary font-medium">AI: </span>
          34% потенциальной прибыли теряется из-за скидок и возвратов.
        </p>
      </div>
    </div>
  );
}

export function WhereProfitIsLost() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<LossCategory | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(1); // February (0-indexed)
  const [selectedYear, setSelectedYear] = useState(2026);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };
    if (filterOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filterOpen]);

  const handleCategoryClick = (e: React.MouseEvent, cat: LossCategory) => {
    e.stopPropagation();
    setSelectedCategory(cat);
    setDrawerOpen(true);
  };

  const handleBlockClick = () => {
    setSelectedCategory(null);
    setDrawerOpen(true);
  };

  const drawerTitle = selectedCategory
    ? `${selectedCategory.name} — Детализация`
    : "Где теряется прибыль — Обзор";

  const drawerSubtitle = selectedCategory
    ? `Потери: −${selectedCategory.amount.toLocaleString()} ₽ · ${months[selectedMonth]} ${selectedYear}`
    : `Общие потери: −${totalLostProfit.toLocaleString()} ₽ · ${months[selectedMonth]} ${selectedYear}`;

  return (
    <>
      <div
        onClick={handleBlockClick}
        className="bg-card rounded-2xl p-5 border border-border h-full flex flex-col cursor-pointer hover:border-primary/30 transition-colors"
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-foreground text-sm">Где теряется прибыль</h3>
            <p className="text-xs text-muted-foreground">Источники потери маржи</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative" ref={filterRef}>
              <button
                onClick={(e) => { e.stopPropagation(); setFilterOpen(!filterOpen); }}
                className={cn(
                  "p-1.5 rounded-lg transition-colors",
                  filterOpen ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
              </button>
              {filterOpen && (
                <div
                  className="absolute right-0 top-full mt-1 z-50 bg-popover border border-border rounded-xl shadow-lg p-2 min-w-[140px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex gap-1 mb-1.5">
                    {years.map((y) => (
                      <button
                        key={y}
                        onClick={() => setSelectedYear(y)}
                        className={cn(
                          "text-[10px] px-2 py-0.5 rounded-md transition-colors",
                          selectedYear === y ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                        )}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-0.5">
                    {months.map((m, i) => (
                      <button
                        key={m}
                        onClick={() => { setSelectedMonth(i); setFilterOpen(false); }}
                        className={cn(
                          "text-[10px] px-1.5 py-1 rounded-md transition-colors text-center",
                          selectedMonth === i ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                        )}
                      >
                        {m.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Потеряно прибыли</p>
              <p className="text-sm font-bold text-destructive">−{totalLostProfit.toLocaleString()} ₽</p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-2.5">
          {lossCategories.map((cat) => {
            const pct = ((cat.amount / totalLostProfit) * 100).toFixed(0);
            const barWidth = (cat.amount / maxLoss) * 100;
            return (
              <div
                key={cat.name}
                className="cursor-pointer rounded-lg p-2 -mx-1 hover:bg-muted/50 transition-colors group"
                onClick={(e) => handleCategoryClick(e, cat)}
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

        <div className="mt-3 bg-primary/5 rounded-xl p-3 border border-primary/10">
          <p className="text-xs text-muted-foreground">
            <span className="text-primary font-medium">AI: </span>
            34% потенциальной прибыли теряется из-за скидок и возвратов.
          </p>
        </div>
      </div>

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-base">{drawerTitle}</SheetTitle>
            <SheetDescription className="text-xs">{drawerSubtitle}</SheetDescription>
          </SheetHeader>
          {selectedCategory ? (
            <CategoryDrawerContent categoryKey={selectedCategory.key} />
          ) : (
            <GeneralDrawerContent />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
