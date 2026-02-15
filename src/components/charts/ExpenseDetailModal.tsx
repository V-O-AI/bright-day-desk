import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

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
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
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
  const totalOps = mockExpenseCategories.reduce((s, c) => s + c.totalTimes, 0);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0 gap-0 bg-card">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="flex items-center gap-2">
            {selectedCategory && (
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelectedCategory(null)}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
              <Wallet className="h-4 w-4 text-destructive" />
            </div>
            {selectedCategory ? `Расходы — ${selectedCategory.name}` : "Расходы"}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6">
          {!selectedCategory && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-muted/40 rounded-xl p-3 border border-border/40 text-center">
                <p className="text-xs text-muted-foreground mb-1">Общие расходы</p>
                <p className="text-lg font-bold text-destructive">{formatCurrency(totalExpense)}</p>
              </div>
              <div className="bg-muted/40 rounded-xl p-3 border border-border/40 text-center">
                <p className="text-xs text-muted-foreground mb-1">Операций</p>
                <p className="text-lg font-bold text-foreground">{totalOps}</p>
              </div>
              <div className="bg-muted/40 rounded-xl p-3 border border-border/40 text-center">
                <p className="text-xs text-muted-foreground mb-1">Период</p>
                <p className="text-lg font-bold text-foreground">{periodLabel || "—"}</p>
              </div>
            </div>
          )}

          {selectedCategory && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-muted/40 rounded-xl p-3 border border-border/40 text-center">
                <p className="text-xs text-muted-foreground mb-1">Сумма</p>
                <p className="text-base font-bold text-destructive">{formatCurrency(computeAmount(selectedCategory.percentOfTotal))}</p>
              </div>
              <div className="bg-muted/40 rounded-xl p-3 border border-border/40 text-center">
                <p className="text-xs text-muted-foreground mb-1">Операций</p>
                <p className="text-base font-bold text-foreground">{selectedCategory.totalTimes}</p>
              </div>
              <div className="bg-muted/40 rounded-xl p-3 border border-border/40 text-center">
                <p className="text-xs text-muted-foreground mb-1">Доля затрат</p>
                <p className="text-base font-bold text-foreground">{selectedCategory.percentOfTotal}%</p>
              </div>
            </div>
          )}

          <Separator className="mb-3" />
        </div>

        <ScrollArea className="flex-1 min-h-0 px-6 pb-6">
          <div className="space-y-2">
            {selectedCategory
              ? selectedCategory.items.map((item) => (
                  <div
                    key={item.name}
                    className="bg-muted/30 rounded-xl p-3 border border-border/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-foreground">{item.name}</span>
                      <span className="text-sm font-bold text-foreground">{formatCurrency(computeAmount(item.percentOfTotal))}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Раз</span>
                        <p className="font-medium text-foreground">{item.times}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Ср. стоимость</span>
                        <p className="font-medium text-foreground">{formatCurrency(item.avgCost)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Доля</span>
                        <p className="font-medium text-destructive">{item.percentOfTotal}%</p>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                      <div className="h-1.5 rounded-full bg-destructive/50" style={{ width: `${item.percentOfTotal * 2.5}%` }} />
                    </div>
                  </div>
                ))
              : mockExpenseCategories.map((cat) => (
                  <div
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat)}
                    className="bg-muted/30 rounded-xl p-3 border border-border/30 hover:bg-muted/50 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium text-foreground">{cat.name}</span>
                        <ArrowLeft className="h-3 w-3 text-muted-foreground rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-sm font-bold text-foreground">{formatCurrency(computeAmount(cat.percentOfTotal))}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Раз</span>
                        <p className="font-medium text-foreground">{cat.totalTimes}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Ср. стоимость</span>
                        <p className="font-medium text-foreground">{formatCurrency(cat.avgCost)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Доля</span>
                        <p className="font-medium text-destructive">{cat.percentOfTotal}%</p>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                      <div className="h-1.5 rounded-full bg-destructive/50" style={{ width: `${cat.percentOfTotal * 2.5}%` }} />
                    </div>
                  </div>
                ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
