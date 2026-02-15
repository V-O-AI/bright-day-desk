import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { TrendingUp, TrendingDown, Target, DollarSign, ShoppingCart, Megaphone, Truck, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoiDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  overallRoi: number;
}

const roiItems = [
  {
    label: "ROI Рекламы",
    description: "Возврат инвестиций в рекламные кампании (ROAS)",
    value: 320,
    change: 12.4,
    invested: 4200,
    returned: 17640,
    icon: Megaphone,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    label: "ROI Продаж",
    description: "Эффективность вложений в продажи и дистрибуцию",
    value: 185,
    change: 5.2,
    invested: 8500,
    returned: 24225,
    icon: ShoppingCart,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    label: "ROI Логистики",
    description: "Окупаемость затрат на доставку и складирование",
    value: 140,
    change: -3.1,
    invested: 6200,
    returned: 14880,
    icon: Truck,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    label: "ROI Маркетинга",
    description: "Общая отдача от маркетинговых инвестиций",
    value: 245,
    change: 8.7,
    invested: 5800,
    returned: 20010,
    icon: Target,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    label: "ROI Операций",
    description: "Эффективность операционных расходов",
    value: 165,
    change: -1.5,
    invested: 12000,
    returned: 31800,
    icon: BarChart3,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
];

function formatCurrency(value: number): string {
  return `$${value.toLocaleString("en-US")}`;
}

export function RoiDetailModal({ open, onOpenChange, overallRoi }: RoiDetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
            Анализ ROI
          </DialogTitle>
          <DialogDescription>Возврат инвестиций по ключевым направлениям</DialogDescription>
        </DialogHeader>

        {/* Overall ROI */}
        <div className="rounded-xl bg-muted/50 border border-border/50 p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Общий ROI</p>
            <p className="text-2xl font-bold text-foreground">{overallRoi}%</p>
          </div>
          <div className={cn(
            "flex items-center gap-1 text-sm font-medium",
            overallRoi >= 100 ? "text-green-500" : "text-destructive"
          )}>
            {overallRoi >= 100 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            {overallRoi >= 100 ? "Прибыльно" : "Убыточно"}
          </div>
        </div>

        {/* ROI items */}
        <div className="space-y-3 mt-2">
          {roiItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-xl border border-border/50 p-4 bg-card hover:bg-muted/30 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", item.bgColor)}>
                    <Icon className={cn("h-4.5 w-4.5", item.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-sm font-semibold text-foreground">{item.label}</p>
                      <span className="text-lg font-bold text-foreground">{item.value}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{item.description}</p>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-muted-foreground">
                        Вложено: <span className="text-foreground font-medium">{formatCurrency(item.invested)}</span>
                      </span>
                      <span className="text-muted-foreground">
                        Возврат: <span className="text-green-500 font-medium">{formatCurrency(item.returned)}</span>
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-1">
                      {item.change >= 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-destructive" />
                      )}
                      <span className={cn("text-xs font-medium", item.change >= 0 ? "text-green-500" : "text-destructive")}>
                        {item.change >= 0 ? "+" : ""}{item.change}% за период
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
