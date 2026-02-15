import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, TrendingUp, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

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
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
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
  const totalSales = mockCategories.reduce((s, c) => s + c.salesCount, 0);

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
            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
              <ShoppingBag className="h-4 w-4 text-green-500" />
            </div>
            {selectedCategory ? `Выручка — ${selectedCategory.name}` : "Выручка"}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6">
          {/* Summary KPIs */}
          {!selectedCategory && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-muted/40 rounded-xl p-3 border border-border/40 text-center">
                <p className="text-xs text-muted-foreground mb-1">Общая выручка</p>
                <p className="text-lg font-bold text-green-500">{formatCurrency(totalIncome)}</p>
              </div>
              <div className="bg-muted/40 rounded-xl p-3 border border-border/40 text-center">
                <p className="text-xs text-muted-foreground mb-1">Продаж</p>
                <p className="text-lg font-bold text-foreground">{totalSales}</p>
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
                <p className="text-xs text-muted-foreground mb-1">Выручка</p>
                <p className="text-base font-bold text-green-500">{formatCurrency(computeAmount(selectedCategory.percentOfTotal))}</p>
              </div>
              <div className="bg-muted/40 rounded-xl p-3 border border-border/40 text-center">
                <p className="text-xs text-muted-foreground mb-1">Продаж</p>
                <p className="text-base font-bold text-foreground">{selectedCategory.salesCount}</p>
              </div>
              <div className="bg-muted/40 rounded-xl p-3 border border-border/40 text-center">
                <p className="text-xs text-muted-foreground mb-1">Доля</p>
                <p className="text-base font-bold text-foreground">{selectedCategory.percentOfTotal}%</p>
              </div>
            </div>
          )}

          <Separator className="mb-3" />
        </div>

        <ScrollArea className="flex-1 min-h-0 px-6 pb-6">
          <div className="space-y-2">
            {selectedCategory
              ? selectedCategory.products.map((product) => (
                  <div
                    key={product.name}
                    className="bg-muted/30 rounded-xl p-3 border border-border/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-foreground">{product.name}</span>
                      <span className="text-sm font-bold text-foreground">{formatCurrency(computeAmount(product.percentOfTotal))}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Продаж</span>
                        <p className="font-medium text-foreground">{product.salesCount}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Ср. чек</span>
                        <p className="font-medium text-foreground">{formatCurrency(product.avgCheck)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Доля</span>
                        <p className="font-medium text-primary">{product.percentOfTotal}%</p>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                      <div className="h-1.5 rounded-full bg-green-500/60" style={{ width: `${product.percentOfTotal * 2.5}%` }} />
                    </div>
                  </div>
                ))
              : mockCategories.map((cat) => (
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
                        <span className="text-muted-foreground">Продаж</span>
                        <p className="font-medium text-foreground">{cat.salesCount}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Ср. чек</span>
                        <p className="font-medium text-foreground">{formatCurrency(cat.avgCheck)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Доля</span>
                        <p className="font-medium text-primary">{cat.percentOfTotal}%</p>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                      <div className="h-1.5 rounded-full bg-green-500/60" style={{ width: `${cat.percentOfTotal * 2.5}%` }} />
                    </div>
                  </div>
                ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
