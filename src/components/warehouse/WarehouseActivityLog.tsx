import { useState } from "react";
import { MoreHorizontal, Package, Search, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ActivityEntry {
  user: string;
  action: string;
  time: string;
  date: string;
  product: string;
  color: string;
}

const activities: ActivityEntry[] = [
  {
    user: "Лео Фернандес",
    action: "подтвердил получение 40 ед. Зимней Куртки в секции B3 (Одежда)",
    time: "13:45",
    date: "2026-02-15",
    product: "Куртка зимняя",
    color: "hsl(var(--primary))",
  },
  {
    user: "Ава Мартинес",
    action: "добавила 25 ед. Роутера Wi-Fi 6 в секцию A1 (Электроника)",
    time: "09:15",
    date: "2026-02-15",
    product: "Роутер Wi-Fi 6",
    color: "hsl(0, 72%, 51%)",
  },
  {
    user: "Оскар Лием",
    action: "отправил 18 ед. Набора посуды из секции C5 (Дом и Кухня)",
    time: "17:30",
    date: "2026-02-14",
    product: "Набор посуды",
    color: "hsl(var(--primary))",
  },
  {
    user: "Дина Чой",
    action: "создала запись отгрузки Тормозных колодок в секции D2 (Автозапчасти)",
    time: "16:10",
    date: "2026-02-14",
    product: "Тормозные колодки",
    color: "hsl(0, 72%, 51%)",
  },
  {
    user: "Марк Иванов",
    action: "принял 60 ед. Смартфона X200 в секцию A2 (Электроника)",
    time: "11:00",
    date: "2026-02-13",
    product: "Смартфон X200",
    color: "hsl(var(--primary))",
  },
  {
    user: "Елена Козлова",
    action: "отправила 30 ед. Крема для лица из секции E1 (Красота)",
    time: "14:20",
    date: "2026-02-13",
    product: "Крем для лица",
    color: "hsl(0, 72%, 51%)",
  },
  {
    user: "Алексей Петров",
    action: "добавил 100 ед. Футболки базовой в секцию B1 (Одежда)",
    time: "08:30",
    date: "2026-02-12",
    product: "Футболка базовая",
    color: "hsl(var(--primary))",
  },
  {
    user: "Софья Белова",
    action: "подтвердила возврат 5 ед. Наушников BT-500 в секцию A3 (Электроника)",
    time: "15:45",
    date: "2026-02-12",
    product: "Наушники BT-500",
    color: "hsl(0, 72%, 51%)",
  },
];

const allProducts = [...new Set(activities.map((a) => a.product))];
const allDates = [...new Set(activities.map((a) => a.date))].sort().reverse();

function ActivityItem({ entry }: { entry: ActivityEntry }) {
  return (
    <div className="flex gap-3">
      <div
        className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
        style={{ backgroundColor: entry.color + "15" }}
      >
        <Package className="h-4 w-4" style={{ color: entry.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground leading-snug">
          <span className="font-medium" style={{ color: entry.color }}>
            {entry.user}
          </span>{" "}
          {entry.action}
        </p>
        <p className="text-[10px] text-muted-foreground mt-1">{entry.time}</p>
      </div>
    </div>
  );
}

export function WarehouseActivityLog() {
  const [modalOpen, setModalOpen] = useState(false);
  const [filterProduct, setFilterProduct] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filteredModal = activities.filter((a) => {
    if (filterProduct !== "all" && a.product !== filterProduct) return false;
    if (filterDate !== "all" && a.date !== filterDate) return false;
    if (search && !a.action.toLowerCase().includes(search.toLowerCase()) && !a.user.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <div
        className="bg-card rounded-2xl p-5 border border-border h-full flex flex-col cursor-pointer hover:border-primary/30 transition-colors"
        onClick={() => setModalOpen(true)}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">История закупок</h3>
          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto max-h-[280px]">
          {activities.slice(0, 4).map((entry, idx) => (
            <ActivityItem key={idx} entry={entry} />
          ))}
        </div>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>История закупок</DialogTitle>
          </DialogHeader>

          {/* Filters */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Поиск..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterProduct}
                onChange={(e) => setFilterProduct(e.target.value)}
                className="flex-1 h-8 rounded-md border border-border bg-background px-2 text-xs text-foreground"
              >
                <option value="all">Все товары</option>
                {allProducts.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <select
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="flex-1 h-8 rounded-md border border-border bg-background px-2 text-xs text-foreground"
              >
                <option value="all">Все даты</option>
                {allDates.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto space-y-4 mt-2">
            {filteredModal.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Нет записей</p>
            ) : (
              filteredModal.map((entry, idx) => (
                <div key={idx}>
                  <ActivityItem entry={entry} />
                  <p className="text-[10px] text-muted-foreground ml-11 mt-0.5">{entry.date}</p>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
