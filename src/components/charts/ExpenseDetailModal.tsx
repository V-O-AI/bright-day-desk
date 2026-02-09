import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ExpenseCategoryRow {
  name: string;
  items: ExpenseItemRow[];
  totalTimes: number;
  avgCost: number;
  percentOfTotal: number;
}

interface ExpenseItemRow {
  name: string;
  times: number;
  avgCost: number;
  percentOfTotal: number;
}

const mockExpenseCategories: ExpenseCategoryRow[] = [
  {
    name: "Логистика",
    totalTimes: 48,
    avgCost: 3400,
    percentOfTotal: 32.5,
    items: [
      { name: "Доставка товара", times: 28, avgCost: 2800, percentOfTotal: 18.9 },
      { name: "Возврат товара", times: 12, avgCost: 4200, percentOfTotal: 8.1 },
      { name: "Хранение на складе", times: 8, avgCost: 4500, percentOfTotal: 5.5 },
    ],
  },
  {
    name: "Маркетинг",
    totalTimes: 35,
    avgCost: 4600,
    percentOfTotal: 25.8,
    items: [
      { name: "Таргетированная реклама", times: 15, avgCost: 4800, percentOfTotal: 11.2 },
      { name: "Контекстная реклама", times: 12, avgCost: 4700, percentOfTotal: 8.8 },
      { name: "SMM продвижение", times: 8, avgCost: 4100, percentOfTotal: 5.8 },
    ],
  },
  {
    name: "Закупки",
    totalTimes: 27,
    avgCost: 5200,
    percentOfTotal: 22.4,
    items: [
      { name: "Одежда оптом", times: 12, avgCost: 5500, percentOfTotal: 10.2 },
      { name: "Обувь оптом", times: 9, avgCost: 5400, percentOfTotal: 7.5 },
      { name: "Аксессуары оптом", times: 6, avgCost: 4600, percentOfTotal: 4.7 },
    ],
  },
  {
    name: "Операционные",
    totalTimes: 22,
    avgCost: 5500,
    percentOfTotal: 19.3,
    items: [
      { name: "Аренда", times: 4, avgCost: 12800, percentOfTotal: 8.1 },
      { name: "Зарплаты", times: 4, avgCost: 11500, percentOfTotal: 7.2 },
      { name: "Коммунальные услуги", times: 14, avgCost: 1800, percentOfTotal: 4.0 },
    ],
  },
];

function formatCurrency(value: number): string {
  return `${value.toLocaleString("ru-RU", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} ₽`;
}

interface ExpenseDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  totalExpense?: number;
  periodLabel?: string;
}

export function ExpenseDetailModal({ open, onOpenChange, totalExpense = 0, periodLabel }: ExpenseDetailModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategoryRow | null>(null);

  const handleClose = (val: boolean) => {
    if (!val) {
      setSelectedCategory(null);
    }
    onOpenChange(val);
  };

  const computeAmount = (percent: number) => (percent / 100) * totalExpense;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0 gap-0 bg-card">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="flex items-center gap-2">
            {selectedCategory && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setSelectedCategory(null)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            {selectedCategory ? `Расходы — ${selectedCategory.name}` : "История расходов"}
          </DialogTitle>
          {periodLabel && (
            <p className="text-sm text-muted-foreground">
              Период: {periodLabel} · Общие расходы: {formatCurrency(totalExpense)}
            </p>
          )}
        </DialogHeader>

        <ScrollArea className="flex-1 min-h-0 px-6 pb-6">
          <div>
            {/* Table header */}
            <div className="grid grid-cols-5 gap-2 px-3 py-2 text-xs font-medium text-muted-foreground border-b border-border">
              <span>{selectedCategory ? "Статья расхода" : "Категория"}</span>
              <span className="text-right">Кол-во раз</span>
              <span className="text-right">Средний чек</span>
              <span className="text-right">% от затрат</span>
              <span className="text-right">Сумма</span>
            </div>

            {selectedCategory
              ? selectedCategory.items.map((item) => (
                  <div
                    key={item.name}
                    className="grid grid-cols-5 gap-2 px-3 py-3 text-sm border-b border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <span className="font-medium text-foreground">{item.name}</span>
                    <span className="text-right text-muted-foreground">{item.times}</span>
                    <span className="text-right text-muted-foreground">{formatCurrency(item.avgCost)}</span>
                    <span className="text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                        {item.percentOfTotal}%
                      </span>
                    </span>
                    <span className="text-right font-medium text-foreground">
                      {formatCurrency(computeAmount(item.percentOfTotal))}
                    </span>
                  </div>
                ))
              : mockExpenseCategories.map((cat) => (
                  <div
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat)}
                    className="grid grid-cols-5 gap-2 px-3 py-3 text-sm border-b border-border/50 hover:bg-muted/30 cursor-pointer transition-colors"
                  >
                    <span className="font-medium text-foreground underline decoration-dotted underline-offset-2">
                      {cat.name}
                    </span>
                    <span className="text-right text-muted-foreground">{cat.totalTimes}</span>
                    <span className="text-right text-muted-foreground">{formatCurrency(cat.avgCost)}</span>
                    <span className="text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                        {cat.percentOfTotal}%
                      </span>
                    </span>
                    <span className="text-right font-medium text-foreground">
                      {formatCurrency(computeAmount(cat.percentOfTotal))}
                    </span>
                  </div>
                ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
