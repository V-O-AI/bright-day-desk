import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface MarginCategory {
  id: string;
  name: string;
  revenue: number;
  marginPercent: number;
  products: MarginProduct[];
}

interface MarginProduct {
  id: string;
  name: string;
  revenue: number;
  marginPercent: number;
}

function getMarginType(margin: number): { label: string; variant: "default" | "secondary" | "destructive" } {
  if (margin < 0) return { label: "Убыточный", variant: "destructive" };
  if (margin < 20) return { label: "Оборотный", variant: "secondary" };
  return { label: "Драйвер прибыли", variant: "default" };
}

function formatCurrency(v: number) {
  return `$${v.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

const MOCK_CATEGORIES: MarginCategory[] = [
  {
    id: "1", name: "Детские вещи", revenue: 1_250_000, marginPercent: 62,
    products: [
      { id: "p1", name: "Комбинезоны", revenue: 420_000, marginPercent: 68 },
      { id: "p2", name: "Боди", revenue: 310_000, marginPercent: 55 },
      { id: "p3", name: "Шапки", revenue: 220_000, marginPercent: 72 },
      { id: "p4", name: "Пинетки", revenue: 180_000, marginPercent: 58 },
      { id: "p5", name: "Слюнявчики", revenue: 120_000, marginPercent: 45 },
    ],
  },
  {
    id: "2", name: "Одежда", revenue: 980_000, marginPercent: 15,
    products: [
      { id: "p6", name: "Футболки", revenue: 350_000, marginPercent: 18 },
      { id: "p7", name: "Джинсы", revenue: 280_000, marginPercent: 12 },
      { id: "p8", name: "Куртки", revenue: 200_000, marginPercent: 14 },
      { id: "p9", name: "Платья", revenue: 150_000, marginPercent: 16 },
    ],
  },
  {
    id: "3", name: "Обувь", revenue: 540_000, marginPercent: -5,
    products: [
      { id: "p10", name: "Кроссовки", revenue: 220_000, marginPercent: -3 },
      { id: "p11", name: "Сандалии", revenue: 180_000, marginPercent: -8 },
      { id: "p12", name: "Ботинки", revenue: 140_000, marginPercent: -4 },
    ],
  },
  {
    id: "4", name: "Аксессуары", revenue: 320_000, marginPercent: 55,
    products: [
      { id: "p13", name: "Сумки", revenue: 140_000, marginPercent: 60 },
      { id: "p14", name: "Ремни", revenue: 100_000, marginPercent: 52 },
      { id: "p15", name: "Шарфы", revenue: 80_000, marginPercent: 48 },
    ],
  },
];

interface MarginMatrixModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MarginMatrixModal({ open, onOpenChange }: MarginMatrixModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<MarginCategory | null>(null);

  const handleClose = (v: boolean) => {
    if (!v) setSelectedCategory(null);
    onOpenChange(v);
  };

  const renderRow = (
    item: { id: string; name: string; revenue: number; marginPercent: number },
    onClick?: () => void
  ) => {
    const type = getMarginType(item.marginPercent);
    return (
      <TableRow
        key={item.id}
        className={cn(onClick && "cursor-pointer hover:bg-muted/60 transition-colors")}
        onClick={onClick}
      >
        <TableCell className="font-medium">{item.name}</TableCell>
        <TableCell className="text-right">{formatCurrency(item.revenue)}</TableCell>
        <TableCell className={cn(
          "text-right font-semibold",
          item.marginPercent >= 50 ? "text-green-500" : item.marginPercent < 0 ? "text-destructive" : "text-foreground"
        )}>
          {item.marginPercent}%
        </TableCell>
        <TableCell className="text-right">
          <Badge variant={type.variant} className="text-xs">
            {type.label}
          </Badge>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {selectedCategory && (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedCategory(null)}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <DialogTitle className="text-lg">
              {selectedCategory ? selectedCategory.name : "Матрица маржинальности"}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="max-h-[420px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{selectedCategory ? "Товар" : "Категория"}</TableHead>
                <TableHead className="text-right">Выручка</TableHead>
                <TableHead className="text-right">Маржа %</TableHead>
                <TableHead className="text-right">Тип</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedCategory
                ? selectedCategory.products.map((p) => renderRow(p))
                : MOCK_CATEGORIES.map((c) => renderRow(c, () => setSelectedCategory(c)))
              }
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
