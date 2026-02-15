import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Target, DollarSign, ShoppingCart, Megaphone, Truck, BarChart3, ArrowLeft, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface RoiItem {
  label: string;
  description: string;
  value: number;
  change: number;
  invested: number;
  returned: number;
  icon: any;
  color: string;
  bgColor: string;
  details: {
    subtitle: string;
    explanation: string;
    breakdown: { name: string; invested: number; returned: number; roi: number }[];
    tips: string[];
  };
}

const roiItems: RoiItem[] = [
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
    details: {
      subtitle: "Анализ эффективности рекламных каналов",
      explanation: "ROI рекламы (ROAS) показывает, сколько долларов выручки приносит каждый вложенный доллар в рекламу. Значение 320% означает, что на каждый $1 вложений вы получаете $3.20 выручки.",
      breakdown: [
        { name: "Таргет Instagram", invested: 1400, returned: 6300, roi: 350 },
        { name: "Google Ads", invested: 1200, returned: 4560, roi: 280 },
        { name: "Контекстная реклама", invested: 900, returned: 3780, roi: 320 },
        { name: "TikTok Ads", invested: 700, returned: 3000, roi: 329 },
      ],
      tips: [
        "Instagram показывает лучший ROAS — рассмотрите увеличение бюджета",
        "Google Ads ниже среднего — оптимизируйте ключевые слова",
      ],
    },
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
    details: {
      subtitle: "Рентабельность каналов продаж",
      explanation: "ROI продаж измеряет отдачу от инвестиций в каналы сбыта: маркетплейсы, собственный сайт, оптовые продажи. Учитывает комиссии, стоимость обработки заказов и логистику до клиента.",
      breakdown: [
        { name: "Wildberries", invested: 3200, returned: 7040, roi: 120 },
        { name: "Ozon", invested: 2500, returned: 6250, roi: 150 },
        { name: "Собственный сайт", invested: 1800, returned: 6300, roi: 250 },
        { name: "Оптовые клиенты", invested: 1000, returned: 4635, roi: 364 },
      ],
      tips: [
        "Собственный сайт и оптовые клиенты — самые рентабельные каналы",
        "Маркетплейсы съедают маржу комиссиями — пересмотрите ценообразование",
      ],
    },
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
    details: {
      subtitle: "Эффективность логистических затрат",
      explanation: "ROI логистики показывает, насколько эффективно расходуются средства на хранение, упаковку и доставку товаров. Снижение на 3.1% связано с ростом тарифов транспортных компаний.",
      breakdown: [
        { name: "Складское хранение", invested: 2200, returned: 4840, roi: 120 },
        { name: "Доставка до клиента", invested: 2400, returned: 5520, roi: 130 },
        { name: "Упаковка", invested: 800, returned: 2240, roi: 180 },
        { name: "Возвратная логистика", invested: 800, returned: 2280, roi: 185 },
      ],
      tips: [
        "Рост тарифов снижает ROI — рассмотрите оптовые договоры с перевозчиками",
        "Упаковка — неожиданно высокий ROI за счёт снижения порчи товаров",
      ],
    },
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
    details: {
      subtitle: "Анализ маркетинговых инвестиций",
      explanation: "Общий ROI маркетинга включает все маркетинговые активности: контент, email-рассылки, партнёрства, акции и сезонные кампании. Не путать с ROI рекламы — здесь учитываются все маркетинговые расходы.",
      breakdown: [
        { name: "Email-маркетинг", invested: 600, returned: 3600, roi: 500 },
        { name: "Контент-маркетинг", invested: 1200, returned: 4200, roi: 250 },
        { name: "Промо-акции", invested: 2400, returned: 7200, roi: 200 },
        { name: "Партнёрские программы", invested: 1600, returned: 5010, roi: 213 },
      ],
      tips: [
        "Email-маркетинг — самый рентабельный канал с ROI 500%",
        "Промо-акции дают объём, но маржинальность ниже — следите за скидками",
      ],
    },
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
    details: {
      subtitle: "Операционная эффективность бизнеса",
      explanation: "ROI операций оценивает отдачу от расходов на ведение бизнеса: зарплаты, аренду, ПО, коммунальные услуги. Показатель 165% означает, что операционная деятельность окупается, но есть потенциал оптимизации.",
      breakdown: [
        { name: "Зарплаты и HR", invested: 5500, returned: 11550, roi: 110 },
        { name: "Аренда помещений", invested: 3200, returned: 7680, roi: 140 },
        { name: "IT и ПО", invested: 1800, returned: 6300, roi: 250 },
        { name: "Коммунальные услуги", invested: 1500, returned: 6270, roi: 318 },
      ],
      tips: [
        "IT-инфраструктура показывает высокий ROI — автоматизация окупается",
        "Зарплатный фонд — самая крупная статья, рассмотрите KPI-систему мотивации",
      ],
    },
  },
];

function formatCurrency(value: number): string {
  return `$${value.toLocaleString("en-US")}`;
}

interface RoiDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  overallRoi: number;
}

export function RoiDetailModal({ open, onOpenChange, overallRoi }: RoiDetailModalProps) {
  const [selectedItem, setSelectedItem] = useState<RoiItem | null>(null);

  const handleClose = (v: boolean) => {
    if (!v) setSelectedItem(null);
    onOpenChange(v);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {selectedItem ? (
              <>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedItem(null)}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", selectedItem.bgColor)}>
                  <selectedItem.icon className={cn("h-4 w-4", selectedItem.color)} />
                </div>
                {selectedItem.label}
              </>
            ) : (
              <>
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
                Анализ ROI
              </>
            )}
          </DialogTitle>
          {!selectedItem && (
            <DialogDescription>Возврат инвестиций по ключевым направлениям</DialogDescription>
          )}
        </DialogHeader>

        {/* ===== DETAIL VIEW ===== */}
        {selectedItem && (
          <div className="space-y-4">
            {/* Summary card */}
            <div className={cn("rounded-xl p-4 border", selectedItem.bgColor, "border-border/50")}>
              <p className="text-sm font-semibold text-foreground mb-1">{selectedItem.details.subtitle}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{selectedItem.details.explanation}</p>
            </div>

            {/* KPI row */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-muted/40 rounded-xl p-3 border border-border/40 text-center">
                <p className="text-xs text-muted-foreground mb-1">ROI</p>
                <p className={cn("text-xl font-bold", selectedItem.value >= 200 ? "text-green-500" : selectedItem.value >= 100 ? "text-amber-500" : "text-destructive")}>
                  {selectedItem.value}%
                </p>
              </div>
              <div className="bg-muted/40 rounded-xl p-3 border border-border/40 text-center">
                <p className="text-xs text-muted-foreground mb-1">Вложено</p>
                <p className="text-sm font-bold text-foreground">{formatCurrency(selectedItem.invested)}</p>
              </div>
              <div className="bg-muted/40 rounded-xl p-3 border border-border/40 text-center">
                <p className="text-xs text-muted-foreground mb-1">Возврат</p>
                <p className="text-sm font-bold text-green-500">{formatCurrency(selectedItem.returned)}</p>
              </div>
            </div>

            <Separator />

            {/* Breakdown table */}
            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Детализация по каналам</p>
              <div className="space-y-2">
                {selectedItem.details.breakdown.map((row) => {
                  const profit = row.returned - row.invested;
                  return (
                    <div key={row.name} className="bg-muted/30 rounded-xl p-3 border border-border/30">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-foreground">{row.name}</span>
                        <span className={cn(
                          "text-sm font-bold",
                          row.roi >= 200 ? "text-green-500" : row.roi >= 100 ? "text-amber-500" : "text-destructive"
                        )}>
                          ROI {row.roi}%
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Вложено</span>
                          <p className="font-medium text-foreground">{formatCurrency(row.invested)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Возврат</span>
                          <p className="font-medium text-foreground">{formatCurrency(row.returned)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Прибыль</span>
                          <p className="font-medium text-green-500">{formatCurrency(profit)}</p>
                        </div>
                      </div>
                      {/* Mini progress bar */}
                      <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                        <div
                          className={cn(
                            "h-1.5 rounded-full transition-all",
                            row.roi >= 200 ? "bg-green-500" : row.roi >= 100 ? "bg-amber-500" : "bg-destructive"
                          )}
                          style={{ width: `${Math.min(row.roi / 5, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI tips */}
            <div className={cn("rounded-xl p-3 border", selectedItem.bgColor, "border-border/30")}>
              <p className="text-xs font-semibold text-foreground mb-2">💡 Рекомендации</p>
              <ul className="space-y-1.5">
                {selectedItem.details.tips.map((tip, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <span className="shrink-0 mt-0.5">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ===== LIST VIEW ===== */}
        {!selectedItem && (
          <>
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
            <div className="space-y-2 mt-2">
              {roiItems.map((item) => {
                const Icon = item.icon;
                const profit = item.returned - item.invested;
                return (
                  <div
                    key={item.label}
                    onClick={() => setSelectedItem(item)}
                    className="rounded-xl border border-border/50 p-4 bg-card hover:bg-muted/40 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", item.bgColor)}>
                        <Icon className={cn("h-4.5 w-4.5", item.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-semibold text-foreground">{item.label}</p>
                            <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <span className={cn(
                            "text-lg font-bold",
                            item.value >= 200 ? "text-green-500" : item.value >= 100 ? "text-amber-500" : "text-destructive"
                          )}>{item.value}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{item.description}</p>
                        <div className="flex items-center gap-4 text-xs">
                          <span className="text-muted-foreground">
                            Вложено: <span className="text-foreground font-medium">{formatCurrency(item.invested)}</span>
                          </span>
                          <span className="text-muted-foreground">
                            Возврат: <span className="text-green-500 font-medium">{formatCurrency(item.returned)}</span>
                          </span>
                          <span className="text-muted-foreground">
                            Прибыль: <span className="text-green-500 font-medium">{formatCurrency(profit)}</span>
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
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
