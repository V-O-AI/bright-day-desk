import { useState, useMemo, useRef, useEffect } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StorageRow {
  id: number;
  category: string;
  productName: string;
  purchased: number;
  remaining: number;
  lastChange: string;
  turnoverDays: number;
  salesSpeed: number; // units per day
  expiresIn: string;
}

const mockData: StorageRow[] = [
  { id: 1, category: "Электроника", productName: "Смартфон X200", purchased: 200, remaining: 45, lastChange: "02.02.2026", turnoverDays: 12, salesSpeed: 3.8, expiresIn: "12 дн." },
  { id: 2, category: "Одежда", productName: "Куртка зимняя", purchased: 500, remaining: 120, lastChange: "01.02.2026", turnoverDays: 30, salesSpeed: 4.0, expiresIn: "30 дн." },
  { id: 3, category: "Дом и Кухня", productName: "Набор посуды", purchased: 150, remaining: 18, lastChange: "31.01.2026", turnoverDays: 7, salesSpeed: 2.6, expiresIn: "7 дн." },
  { id: 4, category: "Автозапчасти", productName: "Масляный фильтр", purchased: 1000, remaining: 340, lastChange: "03.02.2026", turnoverDays: 45, salesSpeed: 7.6, expiresIn: "45 дн." },
  { id: 5, category: "Красота и Здоровье", productName: "Крем для лица", purchased: 300, remaining: 75, lastChange: "30.01.2026", turnoverDays: 20, salesSpeed: 3.8, expiresIn: "20 дн." },
  { id: 6, category: "Электроника", productName: "Наушники BT-500", purchased: 400, remaining: 310, lastChange: "04.02.2026", turnoverDays: 60, salesSpeed: 1.5, expiresIn: "207 дн." },
  { id: 7, category: "Одежда", productName: "Футболка базовая", purchased: 800, remaining: 95, lastChange: "28.01.2026", turnoverDays: 8, salesSpeed: 11.9, expiresIn: "8 дн." },
  { id: 8, category: "Дом и Кухня", productName: "Чайник электрический", purchased: 250, remaining: 200, lastChange: "05.02.2026", turnoverDays: 55, salesSpeed: 0.9, expiresIn: "222 дн." },
  { id: 9, category: "Автозапчасти", productName: "Тормозные колодки", purchased: 600, remaining: 30, lastChange: "29.01.2026", turnoverDays: 5, salesSpeed: 6.0, expiresIn: "5 дн." },
  { id: 10, category: "Красота и Здоровье", productName: "Шампунь органик", purchased: 350, remaining: 280, lastChange: "03.02.2026", turnoverDays: 40, salesSpeed: 1.8, expiresIn: "156 дн." },
  { id: 11, category: "Электроника", productName: "Роутер Wi-Fi 6", purchased: 180, remaining: 12, lastChange: "27.01.2026", turnoverDays: 3, salesSpeed: 4.0, expiresIn: "3 дн." },
  { id: 12, category: "Одежда", productName: "Джинсы классика", purchased: 450, remaining: 370, lastChange: "04.02.2026", turnoverDays: 50, salesSpeed: 1.6, expiresIn: "231 дн." },
  { id: 13, category: "Дом и Кухня", productName: "Сковорода антипригар", purchased: 300, remaining: 55, lastChange: "01.02.2026", turnoverDays: 14, salesSpeed: 3.9, expiresIn: "14 дн." },
  { id: 14, category: "Автозапчасти", productName: "Свечи зажигания", purchased: 700, remaining: 580, lastChange: "05.02.2026", turnoverDays: 70, salesSpeed: 1.7, expiresIn: "341 дн." },
  { id: 15, category: "Красота и Здоровье", productName: "Маска для волос", purchased: 200, remaining: 25, lastChange: "26.01.2026", turnoverDays: 6, salesSpeed: 4.2, expiresIn: "6 дн." },
];

type SortKey = "category" | "productName" | "remaining_pct" | "remaining" | "lastChange" | "expiresIn" | "salesSpeed";
type SortDir = "asc" | "desc";

const parseDate = (d: string) => {
  const [day, month, year] = d.split(".");
  return new Date(+year, +month - 1, +day).getTime();
};

const parseDays = (s: string) => parseInt(s) || 0;

const columns: { key: SortKey; label: string }[] = [
  { key: "category", label: "Категория" },
  { key: "productName", label: "Товар" },
  { key: "remaining_pct", label: "Остаток" },
  { key: "remaining", label: "Кол-во" },
  { key: "lastChange", label: "Посл. продажа" },
  { key: "expiresIn", label: "Товар закон." },
  { key: "salesSpeed", label: "Скор. Продажи" },
];

function CategoryDropdown({ categories, selected, onSelect }: { categories: string[]; selected: string; onSelect: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const label = selected === "all" ? "Все категории" : selected;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-sm text-foreground hover:border-primary/30 transition-colors"
      >
        {label}
        <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 min-w-[180px] bg-popover border border-border rounded-lg shadow-lg py-1">
          <button
            onClick={() => { onSelect("all"); setOpen(false); }}
            className={cn(
              "w-full text-left px-3 py-2 text-sm transition-colors hover:bg-muted",
              selected === "all" && "text-primary font-medium"
            )}
          >
            Все категории
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { onSelect(cat); setOpen(false); }}
              className={cn(
                "w-full text-left px-3 py-2 text-sm transition-colors hover:bg-muted",
                selected === cat && "text-primary font-medium"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function WarehouseStorageTable() {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = useMemo(() => {
    const unique = Array.from(new Set(mockData.map((r) => r.category)));
    return unique.sort();
  }, []);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filteredData = useMemo(() => {
    if (selectedCategory === "all") return mockData;
    return mockData.filter((r) => r.category === selectedCategory);
  }, [selectedCategory]);

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "category": cmp = a.category.localeCompare(b.category); break;
        case "productName": cmp = a.productName.localeCompare(b.productName); break;
        case "remaining_pct": cmp = (a.remaining / a.purchased) - (b.remaining / b.purchased); break;
        case "remaining": cmp = a.remaining - b.remaining; break;
        case "lastChange": cmp = parseDate(a.lastChange) - parseDate(b.lastChange); break;
        case "expiresIn": cmp = parseDays(a.expiresIn) - parseDays(b.expiresIn); break;
        case "salesSpeed": cmp = a.salesSpeed - b.salesSpeed; break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [sortKey, sortDir, filteredData]);

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
      <div className="flex items-center justify-between mb-4 gap-3">
        <h3 className="font-semibold text-foreground">Таблица данных</h3>
        <CategoryDropdown
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      <div className="overflow-x-auto overflow-y-auto flex-1">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-card z-[1]">
            <tr className="text-muted-foreground text-xs">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left pb-3 font-medium cursor-pointer select-none hover:text-foreground transition-colors whitespace-nowrap"
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
                  <td className="py-3 text-foreground">{row.category}</td>
                  <td className="py-3 text-foreground">{row.productName}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-14 h-2 bg-muted rounded-full overflow-hidden">
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
                        parseDays(row.expiresIn) <= 10
                          ? "bg-destructive/10 text-destructive"
                          : parseDays(row.expiresIn) <= 30
                          ? "bg-orange-500/10 text-orange-500"
                          : "bg-green-500/10 text-green-500"
                      )}
                    >
                      {row.expiresIn}
                    </span>
                  </td>
                  <td className="py-3">
                    <span
                      className={cn(
                        "text-xs font-semibold",
                        row.salesSpeed >= 5
                          ? "text-green-500"
                          : row.salesSpeed >= 2
                          ? "text-foreground"
                          : "text-destructive"
                      )}
                    >
                      {row.salesSpeed} шт/д
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
