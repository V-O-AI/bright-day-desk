import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CategoryRow {
  name: string;
  salesCount: number;
  avgCheck: number;
  percentOfTotal: number;
  products: ProductRow[];
}

interface ProductRow {
  name: string;
  salesCount: number;
  avgCheck: number;
  percentOfTotal: number;
}

const mockCategories: CategoryRow[] = [
  {
    name: "Одежда",
    salesCount: 342,
    avgCheck: 4500,
    percentOfTotal: 38.2,
    products: [
      { name: "Майки", salesCount: 156, avgCheck: 2800, percentOfTotal: 17.4 },
      { name: "Джинсы", salesCount: 98, avgCheck: 6200, percentOfTotal: 12.1 },
      { name: "Куртки", salesCount: 88, avgCheck: 5400, percentOfTotal: 8.7 },
    ],
  },
  {
    name: "Обувь",
    salesCount: 218,
    avgCheck: 6800,
    percentOfTotal: 29.5,
    products: [
      { name: "Кроссовки", salesCount: 120, avgCheck: 7500, percentOfTotal: 17.9 },
      { name: "Ботинки", salesCount: 58, avgCheck: 8200, percentOfTotal: 6.8 },
      { name: "Сандалии", salesCount: 40, avgCheck: 3200, percentOfTotal: 4.8 },
    ],
  },
  {
    name: "Аксессуары",
    salesCount: 185,
    avgCheck: 2200,
    percentOfTotal: 16.4,
    products: [
      { name: "Сумки", salesCount: 75, avgCheck: 3500, percentOfTotal: 7.2 },
      { name: "Ремни", salesCount: 60, avgCheck: 1800, percentOfTotal: 5.1 },
      { name: "Шарфы", salesCount: 50, avgCheck: 1200, percentOfTotal: 4.1 },
    ],
  },
  {
    name: "Детские товары",
    salesCount: 127,
    avgCheck: 3100,
    percentOfTotal: 15.9,
    products: [
      { name: "Детская одежда", salesCount: 72, avgCheck: 2600, percentOfTotal: 9.3 },
      { name: "Детская обувь", salesCount: 55, avgCheck: 3800, percentOfTotal: 6.6 },
    ],
  },
];

function formatCurrency(value: number): string {
  return `${value.toLocaleString("ru-RU", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} ₽`;
}

interface IncomeDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  totalIncome?: number;
  periodLabel?: string;
}

export function IncomeDetailModal({ open, onOpenChange, totalIncome = 0, periodLabel }: IncomeDetailModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryRow | null>(null);

  const handleClose = (val: boolean) => {
    if (!val) {
      setSelectedCategory(null);
    }
    onOpenChange(val);
  };

  const computeAmount = (percent: number) => (percent / 100) * totalIncome;

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
            {selectedCategory ? `Доходы — ${selectedCategory.name}` : "История доходов"}
          </DialogTitle>
          {periodLabel && (
            <p className="text-sm text-muted-foreground">
              Период: {periodLabel} · Общий доход: {formatCurrency(totalIncome)}
            </p>
          )}
        </DialogHeader>

        <ScrollArea className="flex-1 min-h-0 px-6 pb-6">
          <div>
            {/* Table header */}
            <div className="grid grid-cols-5 gap-2 px-3 py-2 text-xs font-medium text-muted-foreground border-b border-border">
              <span>{selectedCategory ? "Вид товара" : "Категория"}</span>
              <span className="text-right">Кол-во продаж</span>
              <span className="text-right">Средний чек</span>
              <span className="text-right">% от дохода</span>
              <span className="text-right">Сумма</span>
            </div>

            {/* Rows */}
            {selectedCategory
              ? selectedCategory.products.map((product) => (
                  <div
                    key={product.name}
                    className="grid grid-cols-5 gap-2 px-3 py-3 text-sm border-b border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <span className="font-medium text-foreground">{product.name}</span>
                    <span className="text-right text-muted-foreground">{product.salesCount}</span>
                    <span className="text-right text-muted-foreground">{formatCurrency(product.avgCheck)}</span>
                    <span className="text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {product.percentOfTotal}%
                      </span>
                    </span>
                    <span className="text-right font-medium text-foreground">
                      {formatCurrency(computeAmount(product.percentOfTotal))}
                    </span>
                  </div>
                ))
              : mockCategories.map((cat) => (
                  <div
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat)}
                    className="grid grid-cols-5 gap-2 px-3 py-3 text-sm border-b border-border/50 hover:bg-muted/30 cursor-pointer transition-colors"
                  >
                    <span className="font-medium text-foreground underline decoration-dotted underline-offset-2">
                      {cat.name}
                    </span>
                    <span className="text-right text-muted-foreground">{cat.salesCount}</span>
                    <span className="text-right text-muted-foreground">{formatCurrency(cat.avgCheck)}</span>
                    <span className="text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
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
