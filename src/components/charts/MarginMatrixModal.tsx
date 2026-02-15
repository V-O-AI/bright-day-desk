import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
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
  const [selectedLevel, setSelectedLevel] = useState<"gross" | "operating" | "net" | null>(null);

  const handleClose = (v: boolean) => {
    if (!v) {
      setSelectedCategory(null);
      setSelectedLevel(null);
    }
    onOpenChange(v);
  };

  const handleBack = () => {
    if (selectedCategory) setSelectedCategory(null);
    else if (selectedLevel) setSelectedLevel(null);
  };

  const showBack = !!selectedCategory || !!selectedLevel;
  const getTitle = () => {
    if (selectedCategory) return selectedCategory.name;
    if (selectedLevel === "gross") return "Валовая прибыль";
    if (selectedLevel === "operating") return "Операционная прибыль";
    if (selectedLevel === "net") return "Чистая маржа";
    return "Матрица маржинальности";
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
      <DialogContent className="sm:max-w-[640px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {showBack && (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <DialogTitle className="text-lg">{getTitle()}</DialogTitle>
          </div>
        </DialogHeader>

        {/* ===== LEVEL DETAIL VIEW ===== */}
        {selectedLevel && !selectedCategory && (() => {
          const totalRevenue = MOCK_CATEGORIES.reduce((s, c) => s + c.revenue, 0);
          const avgMargin = MOCK_CATEGORIES.reduce((s, c) => s + c.marginPercent * c.revenue, 0) / totalRevenue;
          const cogs = totalRevenue * (1 - avgMargin / 100);
          const grossProfit = totalRevenue - cogs;
          const grossMargin = (grossProfit / totalRevenue) * 100;
          const opex = totalRevenue * 0.18;
          const operatingProfit = grossProfit - opex;
          const tax = operatingProfit * 0.15;
          const netProfit = operatingProfit - tax;
          const netMargin = (netProfit / totalRevenue) * 100;
          const operatingMargin = (operatingProfit / totalRevenue) * 100;

          if (selectedLevel === "gross") {
            return (
              <div className="space-y-4">
                <div className="bg-muted/30 rounded-xl p-4 border border-border/40 space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="text-base font-bold text-foreground">Валовая прибыль</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <strong>Формула:</strong> Выручка − Себестоимость (COGS)
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Показывает, сколько денег остаётся после вычета прямых затрат на производство/закупку товаров. 
                    Это базовый показатель рентабельности самого товара, без учёта операционных расходов.
                  </p>
                  <Separator />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-background rounded-lg p-3 border border-border/30">
                      <p className="text-xs text-muted-foreground mb-1">Выручка</p>
                      <p className="text-lg font-bold text-foreground">{formatCurrency(totalRevenue)}</p>
                    </div>
                    <div className="bg-background rounded-lg p-3 border border-border/30">
                      <p className="text-xs text-muted-foreground mb-1">COGS (Себестоимость)</p>
                      <p className="text-lg font-bold text-destructive">{formatCurrency(cogs)}</p>
                    </div>
                    <div className="bg-background rounded-lg p-3 border border-border/30">
                      <p className="text-xs text-muted-foreground mb-1">Валовая прибыль</p>
                      <p className="text-lg font-bold text-green-500">{formatCurrency(grossProfit)}</p>
                    </div>
                    <div className="bg-background rounded-lg p-3 border border-border/30">
                      <p className="text-xs text-muted-foreground mb-1">Валовая маржа</p>
                      <p className={cn("text-lg font-bold", grossMargin >= 50 ? "text-green-500" : grossMargin >= 30 ? "text-amber-500" : "text-destructive")}>
                        {grossMargin.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className={cn("h-2 rounded-full", grossMargin >= 50 ? "bg-green-500" : grossMargin >= 30 ? "bg-amber-500" : "bg-destructive")} style={{ width: `${Math.min(grossMargin, 100)}%` }} />
                  </div>
                </div>
                {/* Per-category breakdown */}
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">По категориям</p>
                  <div className="space-y-2">
                    {MOCK_CATEGORIES.map(c => {
                      const catCogs = c.revenue * (1 - c.marginPercent / 100);
                      const catGross = c.revenue - catCogs;
                      return (
                        <div key={c.id} className="flex items-center justify-between bg-muted/30 rounded-lg p-2.5 border border-border/30">
                          <div>
                            <p className="text-sm font-medium text-foreground">{c.name}</p>
                            <p className="text-xs text-muted-foreground">Выр: {formatCurrency(c.revenue)} · COGS: {formatCurrency(catCogs)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-foreground">{formatCurrency(catGross)}</p>
                            <p className={cn("text-xs font-semibold", c.marginPercent >= 50 ? "text-green-500" : c.marginPercent < 0 ? "text-destructive" : "text-amber-500")}>{c.marginPercent}%</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
                  <p className="text-xs text-green-500 font-semibold">💡 Ориентир для e-com</p>
                  <p className="text-xs text-muted-foreground mt-1">Валовая маржа &lt;30% — тревожный сигнал. 30–50% — норма. &gt;50% — здоровая зона.</p>
                </div>
              </div>
            );
          }

          if (selectedLevel === "operating") {
            const opexBreakdown = [
              { name: "Аренда и склад", amount: opex * 0.30, percent: 30 },
              { name: "Зарплаты", amount: opex * 0.35, percent: 35 },
              { name: "Маркетинг", amount: opex * 0.20, percent: 20 },
              { name: "Прочие расходы", amount: opex * 0.15, percent: 15 },
            ];
            return (
              <div className="space-y-4">
                <div className="bg-muted/30 rounded-xl p-4 border border-border/40 space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                    <span className="text-base font-bold text-foreground">Операционная прибыль</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <strong>Формула:</strong> Валовая прибыль − Операционные расходы (OPEX)
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Показывает прибыльность основной деятельности компании. Учитывает аренду, зарплаты, маркетинг и другие операционные затраты.
                    Если операционная маржа низкая при высокой валовой — проблема в расходах на ведение бизнеса.
                  </p>
                  <Separator />
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-background rounded-lg p-3 border border-border/30">
                      <p className="text-xs text-muted-foreground mb-1">Валовая прибыль</p>
                      <p className="text-base font-bold text-foreground">{formatCurrency(grossProfit)}</p>
                    </div>
                    <div className="bg-background rounded-lg p-3 border border-border/30">
                      <p className="text-xs text-muted-foreground mb-1">OPEX</p>
                      <p className="text-base font-bold text-destructive">{formatCurrency(opex)}</p>
                    </div>
                    <div className="bg-background rounded-lg p-3 border border-border/30">
                      <p className="text-xs text-muted-foreground mb-1">Опер. прибыль</p>
                      <p className="text-base font-bold text-blue-500">{formatCurrency(operatingProfit)}</p>
                    </div>
                  </div>
                  <div className="bg-background rounded-lg p-3 border border-border/30">
                    <p className="text-xs text-muted-foreground mb-1">Операционная маржа</p>
                    <p className={cn("text-lg font-bold", operatingMargin >= 20 ? "text-green-500" : operatingMargin >= 10 ? "text-amber-500" : "text-destructive")}>{operatingMargin.toFixed(1)}%</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">Структура OPEX</p>
                  <div className="space-y-2">
                    {opexBreakdown.map((item) => (
                      <div key={item.name} className="bg-muted/30 rounded-lg p-2.5 border border-border/30">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-foreground">{item.name}</span>
                          <span className="text-sm font-semibold text-foreground">{formatCurrency(item.amount)}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <div className="h-1.5 rounded-full bg-blue-500/70" style={{ width: `${item.percent}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          }

          // net
          return (
            <div className="space-y-4">
              <div className="bg-muted/30 rounded-xl p-4 border border-border/40 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-3 w-3 rounded-full bg-purple-500" />
                  <span className="text-base font-bold text-foreground">Чистая маржа</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong>Формула:</strong> Чистая прибыль / Выручка × 100%
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Это итоговый показатель — сколько реально остаётся «в кармане» после вычета всех расходов, налогов и прочих обязательств.
                  Именно на чистую маржу ориентируются инвесторы.
                </p>
                <Separator />
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-background rounded-lg p-3 border border-border/30">
                    <p className="text-xs text-muted-foreground mb-1">Опер. прибыль</p>
                    <p className="text-base font-bold text-foreground">{formatCurrency(operatingProfit)}</p>
                  </div>
                  <div className="bg-background rounded-lg p-3 border border-border/30">
                    <p className="text-xs text-muted-foreground mb-1">Налоги (15%)</p>
                    <p className="text-base font-bold text-destructive">{formatCurrency(tax)}</p>
                  </div>
                  <div className="bg-background rounded-lg p-3 border border-border/30">
                    <p className="text-xs text-muted-foreground mb-1">Чистая прибыль</p>
                    <p className="text-lg font-bold text-purple-500">{formatCurrency(netProfit)}</p>
                  </div>
                  <div className="bg-background rounded-lg p-3 border border-border/30">
                    <p className="text-xs text-muted-foreground mb-1">Чистая маржа</p>
                    <p className={cn("text-lg font-bold", netMargin >= 15 ? "text-green-500" : netMargin >= 5 ? "text-amber-500" : "text-destructive")}>
                      {netMargin.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
              {/* Waterfall breakdown */}
              <div>
                <p className="text-sm font-semibold text-foreground mb-2">Путь от выручки к чистой прибыли</p>
                <div className="space-y-1.5">
                  {[
                    { label: "Выручка", value: totalRevenue, color: "bg-foreground/80" },
                    { label: "− COGS", value: -cogs, color: "bg-destructive/70" },
                    { label: "= Валовая прибыль", value: grossProfit, color: "bg-green-500/70" },
                    { label: "− OPEX", value: -opex, color: "bg-destructive/70" },
                    { label: "= Опер. прибыль", value: operatingProfit, color: "bg-blue-500/70" },
                    { label: "− Налоги", value: -tax, color: "bg-destructive/70" },
                    { label: "= Чистая прибыль", value: netProfit, color: "bg-purple-500/70" },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between bg-muted/20 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className={cn("h-2 w-2 rounded-full", row.color)} />
                        <span className="text-sm text-foreground">{row.label}</span>
                      </div>
                      <span className={cn("text-sm font-semibold", row.value < 0 ? "text-destructive" : "text-foreground")}>
                        {row.value < 0 ? `−${formatCurrency(Math.abs(row.value))}` : formatCurrency(row.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3">
                <p className="text-xs text-purple-400 font-semibold">💡 Ориентир</p>
                <p className="text-xs text-muted-foreground mt-1">Чистая маржа &lt;5% — бизнес на грани. 5–15% — нормально. &gt;15% — отличный результат.</p>
              </div>
            </div>
          );
        })()}

        {/* ===== MAIN VIEW (margin levels + table) ===== */}
        {!selectedLevel && !selectedCategory && (
          <>
            <div className="space-y-2 mb-4">
              {(() => {
                const totalRevenue = MOCK_CATEGORIES.reduce((s, c) => s + c.revenue, 0);
                const avgMargin = MOCK_CATEGORIES.reduce((s, c) => s + c.marginPercent * c.revenue, 0) / totalRevenue;
                const cogs = totalRevenue * (1 - avgMargin / 100);
                const grossProfit = totalRevenue - cogs;
                const grossMargin = (grossProfit / totalRevenue) * 100;
                const opex = totalRevenue * 0.18;
                const operatingProfit = grossProfit - opex;
                const operatingMargin = (operatingProfit / totalRevenue) * 100;
                const tax = operatingProfit * 0.15;
                const netProfit = operatingProfit - tax;
                const netMargin = (netProfit / totalRevenue) * 100;

                return (
                  <>
                    {/* Gross */}
                    <div
                      onClick={() => setSelectedLevel("gross")}
                      className="bg-muted/40 rounded-xl p-3 border border-border/40 cursor-pointer hover:bg-muted/60 transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                          <span className="text-sm font-semibold text-foreground">Валовая прибыль</span>
                          <span className="text-xs text-muted-foreground">Выручка − COGS</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-foreground">{formatCurrency(grossProfit)}</span>
                          <span className={cn("text-xs font-bold", grossMargin >= 50 ? "text-green-500" : grossMargin >= 30 ? "text-amber-500" : "text-destructive")}>
                            {grossMargin.toFixed(1)}%
                          </span>
                          <ArrowLeft className="h-3.5 w-3.5 text-muted-foreground rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </div>

                    {/* Operating */}
                    <div
                      onClick={() => setSelectedLevel("operating")}
                      className="bg-muted/40 rounded-xl p-3 border border-border/40 cursor-pointer hover:bg-muted/60 transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                          <span className="text-sm font-semibold text-foreground">Операционная прибыль</span>
                          <span className="text-xs text-muted-foreground">− OPEX</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-foreground">{formatCurrency(operatingProfit)}</span>
                          <span className={cn("text-xs font-bold", operatingMargin >= 20 ? "text-green-500" : operatingMargin >= 10 ? "text-amber-500" : "text-destructive")}>
                            {operatingMargin.toFixed(1)}%
                          </span>
                          <ArrowLeft className="h-3.5 w-3.5 text-muted-foreground rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </div>

                    {/* Net */}
                    <div
                      onClick={() => setSelectedLevel("net")}
                      className="bg-muted/40 rounded-xl p-3 border border-border/40 cursor-pointer hover:bg-muted/60 transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-full bg-purple-500" />
                          <span className="text-sm font-semibold text-foreground">Чистая маржа</span>
                          <span className="text-xs text-muted-foreground">«В кармане»</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-foreground">{formatCurrency(netProfit)}</span>
                          <span className={cn("text-xs font-bold", netMargin >= 15 ? "text-green-500" : netMargin >= 5 ? "text-amber-500" : "text-destructive")}>
                            {netMargin.toFixed(1)}%
                          </span>
                          <ArrowLeft className="h-3.5 w-3.5 text-muted-foreground rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </div>

                    {/* Health */}
                    <div className={cn(
                      "rounded-xl p-2.5 border flex items-center gap-2",
                      grossMargin >= 50 ? "bg-green-500/10 border-green-500/20" : grossMargin >= 30 ? "bg-amber-500/10 border-amber-500/20" : "bg-destructive/10 border-destructive/20"
                    )}>
                      {grossMargin >= 50 ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" /> : grossMargin >= 30 ? <Info className="h-3.5 w-3.5 text-amber-500 shrink-0" /> : <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0" />}
                      <p className="text-xs text-muted-foreground">
                        Валовая маржа {grossMargin.toFixed(0)}% — {grossMargin >= 50 ? "здоровая зона" : grossMargin >= 30 ? "зона внимания" : "тревожный сигнал"}
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>

            <Separator className="mb-3" />

            <div className="max-h-[280px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Категория</TableHead>
                    <TableHead className="text-right">Выручка</TableHead>
                    <TableHead className="text-right">Маржа %</TableHead>
                    <TableHead className="text-right">Тип</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_CATEGORIES.map((c) => renderRow(c, () => setSelectedCategory(c)))}
                </TableBody>
              </Table>
            </div>
          </>
        )}

        {/* ===== CATEGORY DRILL-DOWN ===== */}
        {selectedCategory && (
          <div className="max-h-[420px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Товар</TableHead>
                  <TableHead className="text-right">Выручка</TableHead>
                  <TableHead className="text-right">Маржа %</TableHead>
                  <TableHead className="text-right">Тип</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedCategory.products.map((p) => renderRow(p))}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
