import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { MoreHorizontal, TrendingUp, TrendingDown, X, Activity, PackageCheck, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const floors = ["Floor 1", "Floor 2", "Floor 3"];

const deadStockData = [
  { name: "Масляный\nфильтр", value: 2500, days: 120 },
  { name: "Набор\nпосуды", value: 2000, days: 95 },
  { name: "Куртка\nзимняя", value: 1800, days: 78 },
  { name: "Крем\nдля лица", value: 1500, days: 64 },
  { name: "Смартфон\nX200", value: 1200, days: 45 },
  { name: "Наушники\nBT", value: 1000, days: 32 },
];

// Modal data for each metric
const turnoverModalData = [
  { name: "Роутер Wi-Fi 6", turnover: 3, sales: 60, category: "Электроника" },
  { name: "Тормозные колодки", turnover: 5, sales: 570, category: "Автозапчасти" },
  { name: "Маска для волос", turnover: 6, sales: 175, category: "Красота" },
  { name: "Набор посуды", turnover: 7, sales: 132, category: "Дом и Кухня" },
  { name: "Футболка базовая", turnover: 8, sales: 705, category: "Одежда" },
  { name: "Смартфон X200", turnover: 12, sales: 155, category: "Электроника" },
  { name: "Сковорода антипригар", turnover: 14, sales: 245, category: "Дом и Кухня" },
  { name: "Крем для лица", turnover: 20, sales: 225, category: "Красота" },
  { name: "Куртка зимняя", turnover: 30, sales: 380, category: "Одежда" },
  { name: "Шампунь органик", turnover: 40, sales: 70, category: "Красота" },
  { name: "Масляный фильтр", turnover: 45, sales: 660, category: "Автозапчасти" },
  { name: "Джинсы классика", turnover: 50, sales: 80, category: "Одежда" },
  { name: "Чайник электрический", turnover: 55, sales: 50, category: "Дом и Кухня" },
  { name: "Наушники BT-500", turnover: 60, sales: 90, category: "Электроника" },
  { name: "Свечи зажигания", turnover: 70, sales: 120, category: "Автозапчасти" },
];

const activityModalData = [
  { name: "Смартфон X200", sold7d: 28, status: "active" },
  { name: "Куртка зимняя", sold7d: 35, status: "active" },
  { name: "Набор посуды", sold7d: 18, status: "active" },
  { name: "Масляный фильтр", sold7d: 42, status: "active" },
  { name: "Крем для лица", sold7d: 15, status: "active" },
  { name: "Наушники BT-500", sold7d: 3, status: "slow" },
  { name: "Футболка базовая", sold7d: 55, status: "active" },
  { name: "Чайник электрический", sold7d: 1, status: "slow" },
  { name: "Тормозные колодки", sold7d: 38, status: "active" },
  { name: "Шампунь органик", sold7d: 2, status: "slow" },
  { name: "Роутер Wi-Fi 6", sold7d: 12, status: "active" },
  { name: "Джинсы классика", sold7d: 0, status: "dead" },
  { name: "Сковорода антипригар", sold7d: 22, status: "active" },
  { name: "Свечи зажигания", sold7d: 0, status: "dead" },
  { name: "Маска для волос", sold7d: 20, status: "active" },
];

const availabilityModalData = [
  { category: "Электроника", totalProducts: 3, inStock: 3, pct: 100 },
  { category: "Одежда", totalProducts: 3, inStock: 3, pct: 100 },
  { category: "Дом и Кухня", totalProducts: 3, inStock: 3, pct: 100 },
  { category: "Автозапчасти", totalProducts: 3, inStock: 3, pct: 100 },
  { category: "Красота и Здоровье", totalProducts: 3, inStock: 3, pct: 100 },
];

type ModalType = "turnover" | "activity" | "availability" | null;

const metrics: { label: string; value: string; unit: string; change: string; positive: boolean; key: ModalType; icon: React.ReactNode }[] = [
  { label: "Средний оборот", value: "24", unit: "дн.", change: "+2.58%", positive: true, key: "turnover", icon: <RotateCcw className="h-4 w-4" /> },
  { label: "Активность склада", value: "73.3%", unit: "", change: "+4.37%", positive: true, key: "activity", icon: <Activity className="h-4 w-4" /> },
  { label: "Доступность склада", value: "100%", unit: "", change: "+1.54%", positive: true, key: "availability", icon: <PackageCheck className="h-4 w-4" /> },
];

function TurnoverModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-primary" />
            Средний оборот — детализация
          </DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground mb-3">Среднее время (в днях) от поступления до продажи товара. Чем ниже — тем лучше.</p>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted-foreground text-xs border-b border-border">
              <th className="text-left pb-2 font-medium">Товар</th>
              <th className="text-left pb-2 font-medium">Категория</th>
              <th className="text-right pb-2 font-medium">Оборот</th>
              <th className="text-right pb-2 font-medium">Продано</th>
            </tr>
          </thead>
          <tbody>
            {turnoverModalData.map((row, i) => (
              <tr key={i} className="border-b border-border/50">
                <td className="py-2 text-foreground font-medium">{row.name}</td>
                <td className="py-2 text-muted-foreground text-xs">{row.category}</td>
                <td className="py-2 text-right">
                  <span className={cn("text-xs font-semibold", row.turnover <= 10 ? "text-green-500" : row.turnover <= 30 ? "text-foreground" : "text-destructive")}>
                    {row.turnover} дн.
                  </span>
                </td>
                <td className="py-2 text-right text-foreground">{row.sales} шт</td>
              </tr>
            ))}
          </tbody>
        </table>
      </DialogContent>
    </Dialog>
  );
}

function ActivityModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const active = activityModalData.filter(r => r.status === "active").length;
  const total = activityModalData.length;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Активность склада — детализация
          </DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground mb-1">Процент товаров, которые активно продаются (≥5 продаж за 7 дней).</p>
        <p className="text-sm font-semibold text-foreground mb-3">{active} из {total} товаров активны ({Math.round(active / total * 100)}%)</p>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted-foreground text-xs border-b border-border">
              <th className="text-left pb-2 font-medium">Товар</th>
              <th className="text-right pb-2 font-medium">Продажи (7д)</th>
              <th className="text-right pb-2 font-medium">Статус</th>
            </tr>
          </thead>
          <tbody>
            {activityModalData.sort((a, b) => b.sold7d - a.sold7d).map((row, i) => (
              <tr key={i} className="border-b border-border/50">
                <td className="py-2 text-foreground font-medium">{row.name}</td>
                <td className="py-2 text-right text-foreground">{row.sold7d} шт</td>
                <td className="py-2 text-right">
                  <span className={cn(
                    "text-xs font-medium px-2 py-0.5 rounded-full",
                    row.status === "active" ? "bg-green-500/10 text-green-500" :
                    row.status === "slow" ? "bg-orange-500/10 text-orange-500" :
                    "bg-destructive/10 text-destructive"
                  )}>
                    {row.status === "active" ? "Активен" : row.status === "slow" ? "Медленно" : "Мёртвый"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DialogContent>
    </Dialog>
  );
}

function AvailabilityModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const totalCats = availabilityModalData.length;
  const available = availabilityModalData.filter(r => r.inStock > 0).length;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PackageCheck className="h-5 w-5 text-primary" />
            Доступность склада — детализация
          </DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground mb-1">Процент категорий, в которых есть товар с остатком &gt; 0.</p>
        <p className="text-sm font-semibold text-foreground mb-3">{available} из {totalCats} категорий доступны ({Math.round(available / totalCats * 100)}%)</p>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted-foreground text-xs border-b border-border">
              <th className="text-left pb-2 font-medium">Категория</th>
              <th className="text-right pb-2 font-medium">Всего товаров</th>
              <th className="text-right pb-2 font-medium">В наличии</th>
              <th className="text-right pb-2 font-medium">Доступность</th>
            </tr>
          </thead>
          <tbody>
            {availabilityModalData.map((row, i) => (
              <tr key={i} className="border-b border-border/50">
                <td className="py-2 text-foreground font-medium">{row.category}</td>
                <td className="py-2 text-right text-foreground">{row.totalProducts}</td>
                <td className="py-2 text-right text-foreground">{row.inStock}</td>
                <td className="py-2 text-right">
                  <span className={cn(
                    "text-xs font-semibold",
                    row.pct === 100 ? "text-green-500" : row.pct >= 50 ? "text-orange-500" : "text-destructive"
                  )}>
                    {row.pct}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DialogContent>
    </Dialog>
  );
}

export function WarehouseMapBlock() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  return (
    <>
      <div className="flex gap-4 w-full">
        {/* Left metrics column */}
        <div className="flex flex-col gap-3 min-w-[140px]">
          {metrics.map((m, idx) => (
            <div
              key={idx}
              className="bg-card border border-border rounded-xl p-3 cursor-pointer hover:border-primary/40 hover:shadow-sm transition-all"
              onClick={() => setActiveModal(m.key)}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground">{m.icon}</span>
                <p className="text-[10px] text-muted-foreground">{m.label}</p>
              </div>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-lg font-bold text-foreground">{m.value}</span>
                {m.unit && (
                  <span className="text-[10px] text-muted-foreground">{m.unit}</span>
                )}
              </div>
              <div className="flex items-center gap-1 mt-1">
                {m.positive ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-destructive" />
                )}
                <span className={cn("text-[10px] font-medium", m.positive ? "text-green-500" : "text-destructive")}>{m.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Dead stock chart */}
        <div className="flex-[0.9] bg-card border border-border rounded-2xl p-5">
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

      <TurnoverModal open={activeModal === "turnover"} onClose={() => setActiveModal(null)} />
      <ActivityModal open={activeModal === "activity"} onClose={() => setActiveModal(null)} />
      <AvailabilityModal open={activeModal === "availability"} onClose={() => setActiveModal(null)} />
    </>
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
