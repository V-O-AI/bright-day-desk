import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Lightbulb, TrendingUp, TrendingDown, RotateCcw, AlertTriangle, Zap, Snail, ShoppingCart, Info } from "lucide-react";
import { TotalBalanceBlock } from "@/components/charts/TotalBalanceBlock";
import { MiniChat } from "@/components/chat/MiniChat";
import { useNavigate } from "react-router-dom";
import { MetricPeriod } from "@/hooks/useFinancialMetrics";
import { PreviewCard } from "@/components/dashboard/PreviewCard";
import { OnboardingModal } from "@/components/dashboard/OnboardingModal";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { products } from "@/data/warehouseMockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// KPI calculations (same as warehouse)
const avgTurnover = Math.round(products.reduce((s, p) => s + p.turnoverDays, 0) / products.length);
const riskProducts = products.filter(p => p.riskScore >= 70);
const riskPercent = Math.round((riskProducts.length / products.length) * 100);
const fastMoving = products.filter(p => p.salesPerDay >= 5);
const fastPercent = Math.round((fastMoving.length / products.length) * 100);
const slowMoving = products.filter(p => p.salesPerDay < 2);
const slowPercent = Math.round((slowMoving.length / products.length) * 100);
const overstock = products.filter(p => p.daysLeft > 60);
const overstockPercent = Math.round((overstock.length / products.length) * 100);

interface HomeKpi {
  label: string;
  value: string;
  unit: string;
  trend: number;
  icon: React.ReactNode;
  color: string;
  items: typeof products;
  description: string;
}

const homeKpis: HomeKpi[] = [
  { label: "Ср. оборачиваемость", value: String(avgTurnover), unit: "дн.", trend: -2.5, icon: <RotateCcw className="h-3.5 w-3.5" />, color: "text-primary", items: [...products].sort((a, b) => a.turnoverDays - b.turnoverDays), description: "Среднее кол-во дней от поступления до продажи" },
  { label: "Риск закончится", value: `${riskPercent}`, unit: "%", trend: 5.2, icon: <AlertTriangle className="h-3.5 w-3.5" />, color: "text-destructive", items: riskProducts, description: "Товары с высоким риском нехватки запасов" },
  { label: "Перекупленные", value: `${overstockPercent}`, unit: "%", trend: -4.0, icon: <ShoppingCart className="h-3.5 w-3.5" />, color: "text-blue-500", items: overstock, description: "Товары с запасом более чем на 60 дней" },
  { label: "Быстро движущиеся", value: `${fastPercent}`, unit: "%", trend: 3.1, icon: <Zap className="h-3.5 w-3.5" />, color: "text-green-500", items: fastMoving, description: "Товары с продажами ≥5 шт/день" },
  { label: "Медленно движущиеся", value: `${slowPercent}`, unit: "%", trend: -1.8, icon: <Snail className="h-3.5 w-3.5" />, color: "text-orange-500", items: slowMoving, description: "Товары с продажами <2 шт/день" },
];

const insights = [
  { source: "Склад", text: "Роутер Wi-Fi 6 закончится через 3 дня — срочно оформите закупку", priority: "high" as const },
  { source: "Финансы", text: "Маржинальность снизилась на 4% за последнюю неделю по категории электроника", priority: "high" as const },
  { source: "Склад", text: "Кроссовки Nike Air имеют 12 дней без продаж — рассмотрите скидку или перемещение", priority: "medium" as const },
  { source: "Клиенты", text: "Средний чек вырос на 8% — увеличьте ассортимент в категории «премиум»", priority: "low" as const },
  { source: "Склад", text: "Категория C замораживает ~450 000₽ — ликвидация высвободит до 30% средств", priority: "high" as const },
  { source: "Финансы", text: "Положительный тренд ROI +2.3% — продолжайте текущую стратегию закупок", priority: "low" as const },
  { source: "Склад", text: "5 товаров имеют критический уровень запасов (менее 7 дней)", priority: "high" as const },
  { source: "Клиенты", text: "Повторные покупки снизились на 3% — запустите программу лояльности", priority: "medium" as const },
  { source: "Финансы", text: "Расходы на логистику выросли на 12% — оптимизируйте маршруты доставки", priority: "medium" as const },
  { source: "Склад", text: "Свечи зажигания (580 шт) не продавались 12 дней — рассмотрите ликвидацию", priority: "medium" as const },
];

const priorityConfig = {
  high: { label: "Высокий", className: "bg-destructive/10 text-destructive" },
  medium: { label: "Средний", className: "bg-orange-500/10 text-orange-500" },
  low: { label: "Низкий", className: "bg-green-500/10 text-green-500" },
};

function HomeKpiModal({ kpi, open, onClose }: { kpi: HomeKpi | null; open: boolean; onClose: () => void }) {
  if (!kpi) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">{kpi.icon}{kpi.label}</DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground mb-3">{kpi.description}</p>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted-foreground text-xs border-b border-border">
              <th className="text-left pb-2 font-medium">Товар</th>
              <th className="text-right pb-2 font-medium">Остаток</th>
              <th className="text-right pb-2 font-medium">Прод./день</th>
              <th className="text-right pb-2 font-medium">Оборот</th>
            </tr>
          </thead>
          <tbody>
            {kpi.items.map(p => (
              <tr key={p.id} className="border-b border-border/50">
                <td className="py-2 text-foreground font-medium">{p.name}</td>
                <td className="py-2 text-right">{p.remaining} шт</td>
                <td className="py-2 text-right">
                  <span className={cn("font-semibold", p.salesPerDay >= 5 ? "text-green-500" : p.salesPerDay >= 2 ? "text-foreground" : "text-destructive")}>{p.salesPerDay}</span>
                </td>
                <td className="py-2 text-right text-muted-foreground">{p.turnoverDays} дн.</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
          <p className="text-xs text-muted-foreground flex items-start gap-2"><Info className="h-3.5 w-3.5 mt-0.5 text-primary flex-shrink-0" />AI Инсайт: Рекомендуется обратить внимание на товары с низкой оборачиваемостью и высоким риском.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Insights list block
function InsightsBlock() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <h3 className="font-semibold text-sm md:text-base">Главные инсайды</h3>
        <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-medium">
          <Lightbulb className="h-3.5 w-3.5" />
          {insights.length}
        </div>
      </div>
      <ScrollArea className="flex-1" style={{ maxHeight: "220px" }}>
        <div className="space-y-2 pr-3">
          {insights.map((ins, i) => {
            const pc = priorityConfig[ins.priority];
            return (
              <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg border border-border bg-muted/30 hover:bg-muted/60 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{ins.source}</span>
                    <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full", pc.className)}>{pc.label}</span>
                  </div>
                  <p className="text-xs text-foreground leading-relaxed">{ins.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

// KPI cards block for home (5 cards: 3 top + 2 bottom)
function HomeKpiCards({ onKpiClick }: { onKpiClick: (kpi: HomeKpi) => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <div>
          <h3 className="font-semibold text-sm md:text-base">KPI склада</h3>
          <p className="text-xs text-muted-foreground">Ключевые показатели</p>
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-2">
        {/* Top row: 3 cards */}
        <div className="grid grid-cols-3 gap-2">
          {homeKpis.slice(0, 3).map((kpi, i) => (
            <div key={i} onClick={() => onKpiClick(kpi)} className="bg-muted/40 border border-border rounded-xl p-3 cursor-pointer hover:border-primary/40 hover:shadow-md transition-all">
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className={cn("h-6 w-6 rounded-md flex items-center justify-center bg-muted", kpi.color)}>{kpi.icon}</div>
              </div>
              <p className="text-[10px] text-muted-foreground font-medium leading-tight mb-1">{kpi.label}</p>
              <div className="flex items-baseline gap-0.5">
                <span className="text-lg font-bold text-foreground">{kpi.value}</span>
                <span className="text-[10px] text-muted-foreground">{kpi.unit}</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                {kpi.trend > 0 ? <TrendingUp className="h-2.5 w-2.5 text-green-500" /> : <TrendingDown className="h-2.5 w-2.5 text-destructive" />}
                <span className={cn("text-[9px] font-semibold", kpi.trend > 0 ? "text-green-500" : "text-destructive")}>{kpi.trend > 0 ? "+" : ""}{kpi.trend}%</span>
              </div>
            </div>
          ))}
        </div>
        {/* Bottom row: 2 cards with gap in middle */}
        <div className="grid grid-cols-3 gap-2">
          {homeKpis.slice(3, 5).map((kpi, i) => (
            <div key={i} onClick={() => onKpiClick(kpi)} className={cn("bg-muted/40 border border-border rounded-xl p-3 cursor-pointer hover:border-primary/40 hover:shadow-md transition-all", i === 0 ? "col-start-1" : "col-start-3")}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className={cn("h-6 w-6 rounded-md flex items-center justify-center bg-muted", kpi.color)}>{kpi.icon}</div>
              </div>
              <p className="text-[10px] text-muted-foreground font-medium leading-tight mb-1">{kpi.label}</p>
              <div className="flex items-baseline gap-0.5">
                <span className="text-lg font-bold text-foreground">{kpi.value}</span>
                <span className="text-[10px] text-muted-foreground">{kpi.unit}</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                {kpi.trend > 0 ? <TrendingUp className="h-2.5 w-2.5 text-green-500" /> : <TrendingDown className="h-2.5 w-2.5 text-destructive" />}
                <span className={cn("text-[9px] font-semibold", kpi.trend > 0 ? "text-green-500" : "text-destructive")}>{kpi.trend > 0 ? "+" : ""}{kpi.trend}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const Index = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<MetricPeriod>("month");
  const [modalOpen, setModalOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [selectedKpi, setSelectedKpi] = useState<HomeKpi | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("onboarding_done");
    if (saved === "true") {
      setOnboardingDone(true);
      setIsConnected(true);
    }
    supabase.auth.getSession().then(({ data }) => {
      if (data.session && saved === "true") setIsConnected(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && onboardingDone) setIsConnected(true);
    });
    return () => subscription.unsubscribe();
  }, [onboardingDone]);

  const handleOnboardingComplete = () => {
    localStorage.setItem("onboarding_done", "true");
    setOnboardingDone(true);
    setIsConnected(true);
  };

  const handleBlockClick = () => {
    if (!isConnected) setModalOpen(true);
  };

  // Empty state
  if (!isConnected) {
    return (
      <AppLayout>
        <OnboardingModal open={modalOpen} onOpenChange={setModalOpen} onComplete={handleOnboardingComplete} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6 h-full">
          <div className="md:col-span-1 lg:col-span-3 flex flex-col gap-3 md:gap-4 lg:gap-6">
            <PreviewCard className="opacity-0 animate-fade-in-up" style={{ animationDelay: "0ms" }} onClick={handleBlockClick}>
              <div className="p-4 lg:p-6">
                <TotalBalanceBlock period={period} onPeriodChange={setPeriod} showPeriodSelector compact />
              </div>
            </PreviewCard>
            <PreviewCard className="flex-1 opacity-0 animate-fade-in-up" style={{ minHeight: "180px", animationDelay: "50ms" }} onClick={handleBlockClick}>
              <div className="p-4 lg:p-6 flex flex-col" style={{ minHeight: "280px" }}>
                <MiniChat variant="compact" />
              </div>
            </PreviewCard>
          </div>
          <div className="md:col-span-1 lg:col-span-2 flex flex-col gap-3 md:gap-4 lg:gap-6">
            <PreviewCard className="opacity-0 animate-fade-in-up" style={{ animationDelay: "100ms" }} onClick={handleBlockClick}>
              <div className="p-4 lg:p-6">
                <InsightsBlock />
              </div>
            </PreviewCard>
            <PreviewCard className="flex-1 opacity-0 animate-fade-in-up" style={{ animationDelay: "150ms" }} onClick={handleBlockClick}>
              <div className="p-4 lg:p-6 h-full">
                <HomeKpiCards onKpiClick={() => {}} />
              </div>
            </PreviewCard>
          </div>
        </div>
        <HomeKpiModal kpi={selectedKpi} open={!!selectedKpi} onClose={() => setSelectedKpi(null)} />
      </AppLayout>
    );
  }

  // Connected state
  return (
    <AppLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6 h-full">
        <div className="md:col-span-1 lg:col-span-3 flex flex-col gap-3 md:gap-4 lg:gap-6">
          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: "0ms" }}>
            <TotalBalanceBlock period={period} onPeriodChange={setPeriod} showPeriodSelector compact />
          </div>
          <div
            className="bg-card rounded-2xl p-4 lg:p-6 border border-border flex-1 flex flex-col opacity-0 animate-fade-in-up transition-all duration-200 hover:shadow-lg hover:shadow-primary/5"
            style={{ minHeight: "180px", animationDelay: "50ms" }}
          >
            <MiniChat variant="compact" />
          </div>
        </div>

        <div className="md:col-span-1 lg:col-span-2 flex flex-col gap-3 md:gap-4 lg:gap-6">
          {/* Insights block */}
          <div
            className="bg-card rounded-2xl p-4 lg:p-6 border border-border opacity-0 animate-fade-in-up transition-all duration-200 hover:shadow-lg hover:shadow-primary/5"
            style={{ animationDelay: "100ms" }}
          >
            <InsightsBlock />
          </div>

          {/* KPI Cards block */}
          <div
            className="bg-card rounded-2xl p-4 lg:p-6 border border-border flex-1 opacity-0 animate-fade-in-up transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 cursor-pointer"
            style={{ animationDelay: "150ms" }}
            onClick={() => navigate("/my-data/warehouse")}
          >
            <HomeKpiCards onKpiClick={setSelectedKpi} />
          </div>
        </div>
      </div>
      <HomeKpiModal kpi={selectedKpi} open={!!selectedKpi} onClose={() => setSelectedKpi(null)} />
    </AppLayout>
  );
};

export default Index;
