import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Transaction {
  id: number;
  description: string;
  category: string;
  categoryColor: string;
  date: Date;
  amount: number;
}

// Expanded mock data for scrolling demonstration
const allTransactions: Transaction[] = [
  // Today
  { id: 1, description: "Оплата Stripe", category: "Продажи", categoryColor: "bg-green-500/10 text-green-600", date: new Date(), amount: 1250 },
  { id: 2, description: "Доставка Яндекс", category: "Логистика", categoryColor: "bg-orange-500/10 text-orange-600", date: new Date(), amount: -450 },
  { id: 17, description: "Продажа через сайт", category: "Продажи", categoryColor: "bg-green-500/10 text-green-600", date: new Date(), amount: 3800 },
  { id: 18, description: "Оплата курьера", category: "Логистика", categoryColor: "bg-orange-500/10 text-orange-600", date: new Date(), amount: -280 },
  // Yesterday
  { id: 3, description: "Аренда офиса", category: "Аренда", categoryColor: "bg-amber-500/10 text-amber-600", date: new Date(Date.now() - 86400000), amount: -2000 },
  { id: 4, description: "Счёт клиента", category: "Продажи", categoryColor: "bg-green-500/10 text-green-600", date: new Date(Date.now() - 86400000), amount: 4500 },
  { id: 5, description: "Подписка CRM", category: "SaaS", categoryColor: "bg-blue-500/10 text-blue-600", date: new Date(Date.now() - 86400000), amount: -320 },
  { id: 19, description: "Возврат от поставщика", category: "Закупки", categoryColor: "bg-purple-500/10 text-purple-600", date: new Date(Date.now() - 86400000), amount: 1200 },
  { id: 20, description: "Оплата электричества", category: "Прочее", categoryColor: "bg-gray-500/10 text-gray-600", date: new Date(Date.now() - 86400000), amount: -650 },
  // This week
  { id: 6, description: "Закупка товара", category: "Закупки", categoryColor: "bg-purple-500/10 text-purple-600", date: new Date(Date.now() - 3 * 86400000), amount: -1800 },
  { id: 7, description: "Оплата за услуги", category: "Продажи", categoryColor: "bg-green-500/10 text-green-600", date: new Date(Date.now() - 4 * 86400000), amount: 3200 },
  { id: 8, description: "Маркетинг VK", category: "Маркетинг", categoryColor: "bg-pink-500/10 text-pink-600", date: new Date(Date.now() - 5 * 86400000), amount: -750 },
  { id: 21, description: "Продажа B2B партнёру", category: "Продажи", categoryColor: "bg-green-500/10 text-green-600", date: new Date(Date.now() - 3 * 86400000), amount: 8500 },
  { id: 22, description: "Реклама Instagram", category: "Маркетинг", categoryColor: "bg-pink-500/10 text-pink-600", date: new Date(Date.now() - 4 * 86400000), amount: -1200 },
  { id: 23, description: "Техобслуживание склада", category: "Прочее", categoryColor: "bg-gray-500/10 text-gray-600", date: new Date(Date.now() - 5 * 86400000), amount: -3400 },
  { id: 24, description: "Оптовый заказ одежды", category: "Продажи", categoryColor: "bg-green-500/10 text-green-600", date: new Date(Date.now() - 6 * 86400000), amount: 15000 },
  // Last month
  { id: 9, description: "Зарплаты", category: "ФОТ", categoryColor: "bg-red-500/10 text-red-600", date: new Date(Date.now() - 20 * 86400000), amount: -15000 },
  { id: 10, description: "Крупный заказ", category: "Продажи", categoryColor: "bg-green-500/10 text-green-600", date: new Date(Date.now() - 25 * 86400000), amount: 12500 },
  { id: 11, description: "Хостинг серверов", category: "SaaS", categoryColor: "bg-blue-500/10 text-blue-600", date: new Date(Date.now() - 30 * 86400000), amount: -890 },
  { id: 12, description: "Оборудование", category: "Закупки", categoryColor: "bg-purple-500/10 text-purple-600", date: new Date(Date.now() - 35 * 86400000), amount: -5400 },
  { id: 25, description: "Консалтинг услуги", category: "Продажи", categoryColor: "bg-green-500/10 text-green-600", date: new Date(Date.now() - 22 * 86400000), amount: 7200 },
  { id: 26, description: "Обновление ПО", category: "SaaS", categoryColor: "bg-blue-500/10 text-blue-600", date: new Date(Date.now() - 28 * 86400000), amount: -1500 },
  { id: 27, description: "Бонусы сотрудникам", category: "ФОТ", categoryColor: "bg-red-500/10 text-red-600", date: new Date(Date.now() - 32 * 86400000), amount: -4800 },
  { id: 28, description: "Партнёрская выплата", category: "Продажи", categoryColor: "bg-green-500/10 text-green-600", date: new Date(Date.now() - 34 * 86400000), amount: 5600 },
  // This year
  { id: 13, description: "Контракт B2B", category: "Продажи", categoryColor: "bg-green-500/10 text-green-600", date: new Date(Date.now() - 60 * 86400000), amount: 28000 },
  { id: 14, description: "Страховка", category: "Прочее", categoryColor: "bg-gray-500/10 text-gray-600", date: new Date(Date.now() - 90 * 86400000), amount: -3200 },
  { id: 15, description: "Налоги Q1", category: "Налоги", categoryColor: "bg-red-500/10 text-red-600", date: new Date(Date.now() - 120 * 86400000), amount: -8500 },
  { id: 16, description: "Партнёрская программа", category: "Продажи", categoryColor: "bg-green-500/10 text-green-600", date: new Date(Date.now() - 150 * 86400000), amount: 6700 },
  { id: 29, description: "Годовой контракт поддержки", category: "Продажи", categoryColor: "bg-green-500/10 text-green-600", date: new Date(Date.now() - 75 * 86400000), amount: 45000 },
  { id: 30, description: "Ремонт помещения", category: "Прочее", categoryColor: "bg-gray-500/10 text-gray-600", date: new Date(Date.now() - 100 * 86400000), amount: -12000 },
  { id: 31, description: "Лицензия на ПО", category: "SaaS", categoryColor: "bg-blue-500/10 text-blue-600", date: new Date(Date.now() - 130 * 86400000), amount: -2400 },
  { id: 32, description: "Крупная поставка обуви", category: "Закупки", categoryColor: "bg-purple-500/10 text-purple-600", date: new Date(Date.now() - 160 * 86400000), amount: -18000 },
];

const categories = ["Все", "Продажи", "Аренда", "SaaS", "Закупки", "Логистика", "Маркетинг", "ФОТ", "Налоги", "Прочее"];

function formatAmount(value: number): string {
  const prefix = value >= 0 ? "+" : "-";
  return `${prefix}$${Math.abs(value).toLocaleString("en-US")}`;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}

function isToday(date: Date): boolean {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

function isYesterday(date: Date): boolean {
  const yesterday = new Date(Date.now() - 86400000);
  return date.toDateString() === yesterday.toDateString();
}

function isThisWeek(date: Date): boolean {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay() + 1);
  weekStart.setHours(0, 0, 0, 0);
  return date >= weekStart && !isToday(date) && !isYesterday(date);
}

function isLastMonth(date: Date): boolean {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return date >= lastMonthStart && date < monthStart;
}

interface GroupedTransactions {
  label: string;
  transactions: Transaction[];
}

function groupTransactions(txs: Transaction[]): GroupedTransactions[] {
  const groups: GroupedTransactions[] = [];

  const todayTxs = txs.filter(t => isToday(t.date));
  const yesterdayTxs = txs.filter(t => isYesterday(t.date));
  const weekTxs = txs.filter(t => isThisWeek(t.date));
  const lastMonthTxs = txs.filter(t => isLastMonth(t.date));
  const olderTxs = txs.filter(t => !isToday(t.date) && !isYesterday(t.date) && !isThisWeek(t.date) && !isLastMonth(t.date));

  if (todayTxs.length > 0) groups.push({ label: "Сегодня", transactions: todayTxs });
  if (yesterdayTxs.length > 0) groups.push({ label: "Вчера", transactions: yesterdayTxs });
  if (weekTxs.length > 0) groups.push({ label: "На этой неделе", transactions: weekTxs });
  if (lastMonthTxs.length > 0) groups.push({ label: "За прошлый месяц", transactions: lastMonthTxs });
  if (olderTxs.length > 0) groups.push({ label: "За год", transactions: olderTxs });

  return groups;
}

type SortField = "description" | "category" | "date" | "amount";
type SortDir = "asc" | "desc";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransactionHistoryModal({ open, onOpenChange }: Props) {
  const [categoryFilter, setCategoryFilter] = useState("Все");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const filtered = useMemo(() => {
    let result = [...allTransactions];

    if (categoryFilter !== "Все") {
      result = result.filter(t => t.category === categoryFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(t =>
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      switch (sortField) {
        case "description": return dir * a.description.localeCompare(b.description);
        case "category": return dir * a.category.localeCompare(b.category);
        case "date": return dir * (a.date.getTime() - b.date.getTime());
        case "amount": return dir * (a.amount - b.amount);
        default: return 0;
      }
    });

    return result;
  }, [categoryFilter, search, sortField, sortDir]);

  const grouped = useMemo(() => groupTransactions(filtered), [filtered]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const sortIndicator = (field: SortField) => {
    if (sortField !== field) return null;
    return <span className="ml-1 text-[10px]">{sortDir === "asc" ? "↑" : "↓"}</span>;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[85vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0">
          <DialogTitle className="text-lg font-bold text-foreground">
            История операций
          </DialogTitle>
          <p className="text-sm text-muted-foreground">Все доходы и расходы за всё время</p>
        </DialogHeader>

        {/* Filters */}
        <div className="px-6 pb-4 flex flex-col sm:flex-row gap-3 flex-shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по названию..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[180px] h-9 text-sm">
              <SelectValue placeholder="Категория" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Scrollable history */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-6">
          <div className="space-y-4">
            {grouped.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Нет операций по выбранным фильтрам
              </div>
            )}

            {grouped.map((group) => (
              <div key={group.label}>
                {/* Date group label with separator */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                    {group.label}
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>

                {/* Table for this group */}
                <table className="w-full text-sm mb-2">
                  <thead>
                    <tr className="border-b border-border">
                      <th
                        className="text-left text-muted-foreground font-medium pb-2 text-xs cursor-pointer hover:text-foreground select-none"
                        onClick={() => handleSort("description")}
                      >
                        Название{sortIndicator("description")}
                      </th>
                      <th
                        className="text-left text-muted-foreground font-medium pb-2 text-xs cursor-pointer hover:text-foreground select-none"
                        onClick={() => handleSort("category")}
                      >
                        Категория{sortIndicator("category")}
                      </th>
                      <th
                        className="text-left text-muted-foreground font-medium pb-2 text-xs cursor-pointer hover:text-foreground select-none"
                        onClick={() => handleSort("date")}
                      >
                        Дата{sortIndicator("date")}
                      </th>
                      <th
                        className="text-right text-muted-foreground font-medium pb-2 text-xs cursor-pointer hover:text-foreground select-none"
                        onClick={() => handleSort("amount")}
                      >
                        Стоимость{sortIndicator("amount")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.transactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-border/50 last:border-0">
                        <td className="py-2.5 text-foreground font-medium">{tx.description}</td>
                        <td className="py-2.5">
                          <span className={cn("text-xs px-2 py-0.5 rounded-md font-medium", tx.categoryColor)}>
                            {tx.category}
                          </span>
                        </td>
                        <td className="py-2.5 text-muted-foreground">{formatDate(tx.date)}</td>
                        <td className={cn(
                          "py-2.5 text-right font-medium",
                          tx.amount >= 0 ? "text-green-500" : "text-destructive"
                        )}>
                          {formatAmount(tx.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
