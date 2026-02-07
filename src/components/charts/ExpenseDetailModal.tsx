import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExpenseCategoryRow {
  name: string;
  items: ExpenseItemRow[];
  totalTimes: number;
  percentOfTotal: number;
}

interface ExpenseItemRow {
  name: string;
  times: number;
  percentOfTotal: number;
}

const mockExpenseCategories: ExpenseCategoryRow[] = [
  {
    name: "Логистика",
    totalTimes: 48,
    percentOfTotal: 32.5,
    items: [
      { name: "Доставка товара", times: 28, percentOfTotal: 18.9 },
      { name: "Возврат товара", times: 12, percentOfTotal: 8.1 },
      { name: "Хранение на складе", times: 8, percentOfTotal: 5.5 },
    ],
  },
  {
    name: "Маркетинг",
    totalTimes: 35,
    percentOfTotal: 25.8,
    items: [
      { name: "Таргетированная реклама", times: 15, percentOfTotal: 11.2 },
      { name: "Контекстная реклама", times: 12, percentOfTotal: 8.8 },
      { name: "SMM продвижение", times: 8, percentOfTotal: 5.8 },
    ],
  },
  {
    name: "Закупки",
    totalTimes: 27,
    percentOfTotal: 22.4,
    items: [
      { name: "Одежда оптом", times: 12, percentOfTotal: 10.2 },
      { name: "Обувь оптом", times: 9, percentOfTotal: 7.5 },
      { name: "Аксессуары оптом", times: 6, percentOfTotal: 4.7 },
    ],
  },
  {
    name: "Операционные",
    totalTimes: 22,
    percentOfTotal: 19.3,
    items: [
      { name: "Аренда", times: 4, percentOfTotal: 8.1 },
      { name: "Зарплаты", times: 4, percentOfTotal: 7.2 },
      { name: "Коммунальные услуги", times: 14, percentOfTotal: 4.0 },
    ],
  },
];

interface ExpenseDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExpenseDetailModal({ open, onOpenChange }: ExpenseDetailModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategoryRow | null>(null);

  const handleClose = (val: boolean) => {
    if (!val) {
      setSelectedCategory(null);
    }
    onOpenChange(val);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-card">
        <DialogHeader>
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
        </DialogHeader>

        <div className="mt-2">
          {/* Table header */}
          <div className="grid grid-cols-4 gap-2 px-3 py-2 text-xs font-medium text-muted-foreground border-b border-border">
            <span>Категория</span>
            <span>{selectedCategory ? "" : "Название"}</span>
            <span className="text-right">Кол-во раз</span>
            <span className="text-right">% от затрат</span>
          </div>

          {selectedCategory
            ? selectedCategory.items.map((item) => (
                <div
                  key={item.name}
                  className="grid grid-cols-4 gap-2 px-3 py-3 text-sm border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <span className="font-medium text-foreground col-span-2">{item.name}</span>
                  <span className="text-right text-muted-foreground">{item.times}</span>
                  <span className="text-right">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                      {item.percentOfTotal}%
                    </span>
                  </span>
                </div>
              ))
            : mockExpenseCategories.map((cat) => (
                <div
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat)}
                  className="grid grid-cols-4 gap-2 px-3 py-3 text-sm border-b border-border/50 hover:bg-muted/30 cursor-pointer transition-colors"
                >
                  <span className="font-medium text-foreground underline decoration-dotted underline-offset-2">
                    {cat.name}
                  </span>
                  <span className="text-muted-foreground">—</span>
                  <span className="text-right text-muted-foreground">{cat.totalTimes}</span>
                  <span className="text-right">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                      {cat.percentOfTotal}%
                    </span>
                  </span>
                </div>
              ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
