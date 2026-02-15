import { useState, useMemo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
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

type SortKey = "id" | "category" | "productName" | "remaining_pct" | "remaining" | "lastChange" | "turnoverDays";
type SortDir = "asc" | "desc";

const parseDate = (d: string) => {
  const [day, month, year] = d.split(".");
  return new Date(+year, +month - 1, +day).getTime();
};

const columns: { key: SortKey; label: string }[] = [
  { key: "id", label: "№" },
  { key: "category", label: "Категория" },
  { key: "productName", label: "Товар" },
  { key: "remaining_pct", label: "Остаток" },
  { key: "remaining", label: "Кол-во" },
  { key: "lastChange", label: "Посл. продажа" },
  { key: "turnoverDays", label: "Оборот" },
];

export function WarehouseStorageTable() {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sortedData = useMemo(() => {
    if (!sortKey) return mockData;
    return [...mockData].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "id": cmp = a.id - b.id; break;
        case "category": cmp = a.category.localeCompare(b.category); break;
        case "productName": cmp = a.productName.localeCompare(b.productName); break;
        case "remaining_pct": cmp = (a.remaining / a.purchased) - (b.remaining / b.purchased); break;
        case "remaining": cmp = a.remaining - b.remaining; break;
        case "lastChange": cmp = parseDate(a.lastChange) - parseDate(b.lastChange); break;
        case "turnoverDays": cmp = a.turnoverDays - b.turnoverDays; break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [sortKey, sortDir]);

  const getRemainingColor = (ratio: number) => {
    if (ratio <= 0.15) return "hsl(0, 72%, 51%)";
    if (ratio <= 0.35) return "hsl(35, 92%, 50%)";
    return "hsl(142, 71%, 45%)";
  };

  const SortIcon = ({ colKey }: { colKey: SortKey }) => {
    if (sortKey !== colKey) return <ArrowUpDown className="h-3 w-3 opacity-40" />;
    return sortDir === "asc" ? <ArrowUp className="h-3 w-3 text-primary" /> : <ArrowDown className="h-3 w-3 text-primary" />;
  };

  return (
    <div className="bg-card rounded-2xl p-5 border border-border flex flex-col" style={{ maxHeight: 420 }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Таблица данных</h3>
      </div>

      <div className="overflow-x-auto overflow-y-auto flex-1">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-card z-[1]">
            <tr className="text-muted-foreground text-xs">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left pb-3 font-medium cursor-pointer select-none hover:text-foreground transition-colors"
                  onClick={() => handleSort(col.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label} <SortIcon colKey={col.key} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row) => {
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
