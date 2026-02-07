import { useState } from "react";
import { Filter, ChevronDown, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StorageRow {
  id: number;
  category: string;
  productName: string;
  purchased: number;
  remaining: number;
  lastChange: string;
  turnoverDays: number;
}

const mockData: StorageRow[] = [
  { id: 1, category: "Электроника", productName: "Смартфон X200", purchased: 200, remaining: 45, lastChange: "02.02.2026", turnoverDays: 12 },
  { id: 2, category: "Одежда", productName: "Куртка зимняя", purchased: 500, remaining: 120, lastChange: "01.02.2026", turnoverDays: 30 },
  { id: 3, category: "Дом и Кухня", productName: "Набор посуды", purchased: 150, remaining: 18, lastChange: "31.01.2026", turnoverDays: 7 },
  { id: 4, category: "Автозапчасти", productName: "Масляный фильтр", purchased: 1000, remaining: 340, lastChange: "03.02.2026", turnoverDays: 45 },
  { id: 5, category: "Красота и Здоровье", productName: "Крем для лица", purchased: 300, remaining: 75, lastChange: "30.01.2026", turnoverDays: 20 },
  { id: 6, category: "Электроника", productName: "Наушники BT-500", purchased: 400, remaining: 310, lastChange: "04.02.2026", turnoverDays: 60 },
  { id: 7, category: "Одежда", productName: "Футболка базовая", purchased: 800, remaining: 95, lastChange: "28.01.2026", turnoverDays: 8 },
  { id: 8, category: "Дом и Кухня", productName: "Чайник электрический", purchased: 250, remaining: 200, lastChange: "05.02.2026", turnoverDays: 55 },
  { id: 9, category: "Автозапчасти", productName: "Тормозные колодки", purchased: 600, remaining: 30, lastChange: "29.01.2026", turnoverDays: 5 },
  { id: 10, category: "Красота и Здоровье", productName: "Шампунь органик", purchased: 350, remaining: 280, lastChange: "03.02.2026", turnoverDays: 40 },
  { id: 11, category: "Электроника", productName: "Роутер Wi-Fi 6", purchased: 180, remaining: 12, lastChange: "27.01.2026", turnoverDays: 3 },
  { id: 12, category: "Одежда", productName: "Джинсы классика", purchased: 450, remaining: 370, lastChange: "04.02.2026", turnoverDays: 50 },
  { id: 13, category: "Дом и Кухня", productName: "Сковорода антипригар", purchased: 300, remaining: 55, lastChange: "01.02.2026", turnoverDays: 14 },
  { id: 14, category: "Автозапчасти", productName: "Свечи зажигания", purchased: 700, remaining: 580, lastChange: "05.02.2026", turnoverDays: 70 },
  { id: 15, category: "Красота и Здоровье", productName: "Маска для волос", purchased: 200, remaining: 25, lastChange: "26.01.2026", turnoverDays: 6 },
];

const sortOptions = ["Категория", "Товар", "Остаток"];

export function WarehouseStorageTable() {
  const [sortBy, setSortBy] = useState("Категория");
  const [sortOpen, setSortOpen] = useState(false);

  const getRemainingColor = (ratio: number) => {
    if (ratio <= 0.15) return "hsl(0, 72%, 51%)";
    if (ratio <= 0.35) return "hsl(35, 92%, 50%)";
    return "hsl(142, 71%, 45%)";
  };

  return (
    <div className="bg-card rounded-2xl p-5 border border-border flex flex-col" style={{ maxHeight: 420 }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Таблица данных</h3>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-xs text-muted-foreground border border-border rounded-lg px-3 py-1.5 hover:bg-muted/50 transition-colors">
            <Filter className="h-3 w-3" />
            Фильтр
          </button>
          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground border border-border rounded-lg px-3 py-1.5 hover:bg-muted/50 transition-colors"
            >
              Сорт: <span className="text-foreground font-medium">{sortBy}</span>
              <ChevronDown className="h-3 w-3" />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg z-10 min-w-[120px]">
                {sortOptions.map((opt) => (
                  <button
                    key={opt}
                    className={cn(
                      "block w-full text-left px-3 py-1.5 text-xs hover:bg-muted/50 transition-colors",
                      sortBy === opt && "text-primary font-medium"
                    )}
                    onClick={() => {
                      setSortBy(opt);
                      setSortOpen(false);
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto overflow-y-auto flex-1">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-card z-[1]">
            <tr className="text-muted-foreground text-xs">
              <th className="text-left pb-3 font-medium">
                <span className="inline-flex items-center gap-1">№ <ArrowUpDown className="h-3 w-3" /></span>
              </th>
              <th className="text-left pb-3 font-medium">
                <span className="inline-flex items-center gap-1">Категория <ArrowUpDown className="h-3 w-3" /></span>
              </th>
              <th className="text-left pb-3 font-medium">
                <span className="inline-flex items-center gap-1">Товар <ArrowUpDown className="h-3 w-3" /></span>
              </th>
              <th className="text-left pb-3 font-medium">
                <span className="inline-flex items-center gap-1">Остаток <ArrowUpDown className="h-3 w-3" /></span>
              </th>
              <th className="text-left pb-3 font-medium">
                <span className="inline-flex items-center gap-1">Кол-во <ArrowUpDown className="h-3 w-3" /></span>
              </th>
              <th className="text-left pb-3 font-medium">
                <span className="inline-flex items-center gap-1">Посл. изменения <ArrowUpDown className="h-3 w-3" /></span>
              </th>
              <th className="text-left pb-3 font-medium">
                <span className="inline-flex items-center gap-1">Оборот <ArrowUpDown className="h-3 w-3" /></span>
              </th>
            </tr>
          </thead>
          <tbody>
            {mockData.map((row) => {
              const remainingPct = Math.round((row.remaining / row.purchased) * 100);
              const remainingColor = getRemainingColor(remainingPct / 100);

              return (
                <tr key={row.id} className="border-t border-border">
                  <td className="py-3 text-foreground font-medium">{row.id}</td>
                  <td className="py-3 text-foreground">{row.category}</td>
                  <td className="py-3 text-foreground">{row.productName}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${remainingPct}%`,
                            backgroundColor: remainingColor,
                          }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{remainingPct}%</span>
                    </div>
                  </td>
                  <td className="py-3 text-foreground">{row.remaining.toLocaleString()} шт</td>
                  <td className="py-3 text-muted-foreground text-xs">{row.lastChange}</td>
                  <td className="py-3">
                    <span
                      className={cn(
                        "text-xs font-medium px-2 py-0.5 rounded-full",
                        row.turnoverDays <= 10
                          ? "bg-red-500/10 text-red-500"
                          : row.turnoverDays <= 25
                          ? "bg-orange-500/10 text-orange-500"
                          : "bg-green-500/10 text-green-500"
                      )}
                    >
                      {row.turnoverDays} дн.
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
