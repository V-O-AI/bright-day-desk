import { useState, useMemo, useCallback } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  Settings2,
  Star,
  XCircle,
  Lightbulb,
  Sparkles,
} from "lucide-react";

// ---------- types ----------
interface SkuData {
  id: string;
  name: string;
  category: string;
  revenue: number;
  price: number;
  variableCosts: number;
  adSpend: number;
  salesVolume: number;
  growthRate: number;
  returnPercent: number;
  totalProfit: number;
}

type Zone = "Scale" | "Optimize" | "Promote" | "Eliminate";

const ZONE_LABELS: Record<Zone, string> = {
  Scale: "Масштабировать",
  Optimize: "Оптимизировать",
  Promote: "Продвигать",
  Eliminate: "Исключить",
};

interface SkuPoint extends SkuData {
  revenueScore: number;
  efficiencyScore: number;
  zone: Zone;
  unitProfit: number;
  margin: number;
  roi: number;
  recommendation: string;
}

// ---------- mock data ----------
const CATEGORIES = ["Все", "Детские вещи", "Одежда", "Обувь", "Аксессуары"];

const MOCK_SKUS: SkuData[] = [
  { id: "SKU-101", name: "Комбинезон зимний", category: "Детские вещи", revenue: 42000, price: 3500, variableCosts: 1200, adSpend: 400, salesVolume: 12, growthRate: 0.15, returnPercent: 2, totalProfit: 22800 },
  { id: "SKU-102", name: "Боди хлопок", category: "Детские вещи", revenue: 31000, price: 800, variableCosts: 250, adSpend: 80, salesVolume: 39, growthRate: 0.08, returnPercent: 3, totalProfit: 18330 },
  { id: "SKU-103", name: "Шапка вязаная", category: "Детские вещи", revenue: 22000, price: 600, variableCosts: 150, adSpend: 60, salesVolume: 37, growthRate: 0.22, returnPercent: 1, totalProfit: 14430 },
  { id: "SKU-104", name: "Пинетки", category: "Детские вещи", revenue: 18000, price: 450, variableCosts: 120, adSpend: 50, salesVolume: 40, growthRate: 0.1, returnPercent: 2, totalProfit: 11200 },
  { id: "SKU-105", name: "Слюнявчик набор", category: "Детские вещи", revenue: 12000, price: 350, variableCosts: 100, adSpend: 40, salesVolume: 34, growthRate: 0.05, returnPercent: 1, totalProfit: 7140 },
  { id: "SKU-201", name: "Футболка оверсайз", category: "Одежда", revenue: 35000, price: 1200, variableCosts: 600, adSpend: 200, salesVolume: 29, growthRate: 0.12, returnPercent: 5, totalProfit: 11600 },
  { id: "SKU-202", name: "Джинсы slim", category: "Одежда", revenue: 28000, price: 2500, variableCosts: 1400, adSpend: 350, salesVolume: 11, growthRate: 0.03, returnPercent: 7, totalProfit: 8250 },
  { id: "SKU-203", name: "Куртка демисезон", category: "Одежда", revenue: 20000, price: 4000, variableCosts: 2200, adSpend: 500, salesVolume: 5, growthRate: -0.02, returnPercent: 8, totalProfit: 6500 },
  { id: "SKU-204", name: "Платье летнее", category: "Одежда", revenue: 15000, price: 1800, variableCosts: 900, adSpend: 250, salesVolume: 8, growthRate: 0.06, returnPercent: 4, totalProfit: 5200 },
  { id: "SKU-301", name: "Кроссовки спорт", category: "Обувь", revenue: 22000, price: 3200, variableCosts: 2000, adSpend: 600, salesVolume: 7, growthRate: -0.05, returnPercent: 10, totalProfit: 4200 },
  { id: "SKU-302", name: "Сандалии кожа", category: "Обувь", revenue: 18000, price: 2200, variableCosts: 1500, adSpend: 400, salesVolume: 8, growthRate: -0.03, returnPercent: 9, totalProfit: 2400 },
  { id: "SKU-303", name: "Ботинки зимние", category: "Обувь", revenue: 14000, price: 3800, variableCosts: 2600, adSpend: 700, salesVolume: 4, growthRate: -0.08, returnPercent: 12, totalProfit: 2000 },
  { id: "SKU-401", name: "Сумка кросс-боди", category: "Аксессуары", revenue: 14000, price: 1600, variableCosts: 500, adSpend: 150, salesVolume: 9, growthRate: 0.18, returnPercent: 2, totalProfit: 8550 },
  { id: "SKU-402", name: "Ремень кожаный", category: "Аксессуары", revenue: 10000, price: 900, variableCosts: 300, adSpend: 100, salesVolume: 11, growthRate: 0.07, returnPercent: 1, totalProfit: 5500 },
  { id: "SKU-403", name: "Шарф шерсть", category: "Аксессуары", revenue: 8000, price: 700, variableCosts: 200, adSpend: 80, salesVolume: 11, growthRate: 0.04, returnPercent: 1, totalProfit: 4620 },
  { id: "SKU-106", name: "Конверт на выписку", category: "Детские вещи", revenue: 38000, price: 4200, variableCosts: 1500, adSpend: 500, salesVolume: 9, growthRate: 0.2, returnPercent: 1, totalProfit: 19800 },
  { id: "SKU-205", name: "Худи базовое", category: "Одежда", revenue: 25000, price: 1500, variableCosts: 700, adSpend: 180, salesVolume: 17, growthRate: 0.09, returnPercent: 3, totalProfit: 10540 },
  { id: "SKU-304", name: "Тапочки домашние", category: "Обувь", revenue: 6000, price: 500, variableCosts: 350, adSpend: 100, salesVolume: 12, growthRate: -0.01, returnPercent: 4, totalProfit: 600 },
  { id: "SKU-404", name: "Браслет бисер", category: "Аксессуары", revenue: 5000, price: 300, variableCosts: 60, adSpend: 30, salesVolume: 17, growthRate: 0.25, returnPercent: 0, totalProfit: 3570 },
  { id: "SKU-206", name: "Пальто классика", category: "Одежда", revenue: 16000, price: 6000, variableCosts: 3500, adSpend: 800, salesVolume: 3, growthRate: -0.04, returnPercent: 6, totalProfit: 5100 },
];

const ZONE_COLORS: Record<Zone, string> = {
  Scale: "#22c55e",
  Optimize: "#eab308",
  Promote: "#3b82f6",
  Eliminate: "#ef4444",
};

const ZONE_BG: Record<Zone, string> = {
  Scale: "rgba(34,197,94,0.07)",
  Optimize: "rgba(234,179,8,0.07)",
  Promote: "rgba(59,130,246,0.07)",
  Eliminate: "rgba(239,68,68,0.07)",
};

const ZONE_ICONS: Record<Zone, React.ReactNode> = {
  Scale: <TrendingUp className="h-4 w-4" />,
  Optimize: <Settings2 className="h-4 w-4" />,
  Promote: <Star className="h-4 w-4" />,
  Eliminate: <XCircle className="h-4 w-4" />,
};

// ---------- helpers ----------
function normalize(arr: number[]): number[] {
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  if (max === min) return arr.map(() => 0.5);
  return arr.map((v) => (v - min) / (max - min));
}

function median(nums: number[]): number {
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function getRecommendation(zone: Zone, margin: number, returnPercent: number): string {
  if (zone === "Scale") return "Увеличить объём закупки и рекламный бюджет";
  if (zone === "Optimize") {
    if (margin < 15) return "Поднять цену на 5–8%";
    if (returnPercent > 6) return "Снизить % возвратов, улучшить описание";
    return "Сократить рекламные расходы";
  }
  if (zone === "Promote") return "Усилить продвижение, увеличить охват";
  return "Рассмотреть вывод из ассортимента";
}

function fmt(v: number) {
  return "$" + v.toLocaleString("en-US");
}

// ---------- component ----------
export function SkuProfitabilityMatrix() {
  const [category, setCategory] = useState("Все");
  const [period, setPeriod] = useState("90");
  const [minRevenue, setMinRevenue] = useState([0]);
  const [roiFilter, setRoiFilter] = useState("all");
  const [segment, setSegment] = useState<Zone | "All">("All");
  const [selectedSku, setSelectedSku] = useState<SkuPoint | null>(null);

  const points = useMemo<SkuPoint[]>(() => {
    let filtered = MOCK_SKUS.filter(
      (s) => (category === "Все" || s.category === category) && s.revenue >= minRevenue[0]
    );

    const totalRevenue = filtered.reduce((s, x) => s + x.revenue, 0) || 1;
    const salesNorm = normalize(filtered.map((s) => s.salesVolume));
    const growthNorm = normalize(filtered.map((s) => s.growthRate));

    let pts = filtered.map((s, i) => {
      const revenueShare = s.revenue / totalRevenue;
      const revenueScore = 0.6 * revenueShare + 0.2 * salesNorm[i] + 0.2 * growthNorm[i];
      const unitProfit = s.price - s.variableCosts - s.adSpend;
      const efficiencyScore = unitProfit / s.price;
      const margin = ((s.revenue - s.variableCosts * (s.revenue / s.price)) / s.revenue) * 100;
      const roi = s.adSpend > 0 ? s.totalProfit / s.adSpend : 0;
      return { ...s, revenueScore, efficiencyScore, unitProfit, margin, roi, zone: "Scale" as Zone, recommendation: "" };
    });

    if (roiFilter !== "all") {
      const threshold = parseFloat(roiFilter);
      pts = pts.filter((p) => p.roi >= threshold);
    }

    const medX = median(pts.map((p) => p.revenueScore));
    const medY = median(pts.map((p) => p.efficiencyScore));

    pts = pts.map((p) => {
      let zone: Zone;
      if (p.revenueScore >= medX && p.efficiencyScore >= medY) zone = "Scale";
      else if (p.revenueScore >= medX && p.efficiencyScore < medY) zone = "Optimize";
      else if (p.revenueScore < medX && p.efficiencyScore >= medY) zone = "Promote";
      else zone = "Eliminate";
      return { ...p, zone, recommendation: getRecommendation(zone, p.margin, p.returnPercent) };
    });

    return pts;
  }, [category, minRevenue, roiFilter]);

  const medX = useMemo(() => median(points.map((p) => p.revenueScore)), [points]);
  const medY = useMemo(() => median(points.map((p) => p.efficiencyScore)), [points]);

  const aiInsight = useMemo(() => {
    const optimizePts = points.filter((p) => p.zone === "Optimize");
    const totalRev = points.reduce((s, p) => s + p.revenue, 0) || 1;
    const optRev = optimizePts.reduce((s, p) => s + p.revenue, 0);
    const pct = Math.round((optRev / totalRev) * 100);
    const potentialGain = Math.round(optimizePts.reduce((s, p) => s + p.totalProfit * 0.04, 0));
    return { pct, potentialGain };
  }, [points]);

  const segments: (Zone | "All")[] = ["All", "Scale", "Optimize", "Promote", "Eliminate"];

  const CustomTooltip = useCallback(({ active, payload }: any) => {
    if (!active || !payload?.[0]) return null;
    const d: SkuPoint = payload[0].payload;
    return (
      <div className="rounded-lg border bg-card p-3 shadow-lg text-sm space-y-1 max-w-[240px]">
        <p className="font-bold text-foreground">{d.name}</p>
        <p className="text-[10px] text-muted-foreground/70">{d.category} · {d.id}</p>
        <p className="text-muted-foreground">Выручка: {fmt(d.revenue)}</p>
        <p className="text-muted-foreground">Маржа: {d.margin.toFixed(0)}%</p>
        <p className="text-muted-foreground">ROI: {d.roi.toFixed(1)}</p>
        <p className="text-muted-foreground">Прибыль/ед: {fmt(d.unitProfit)}</p>
        <p className="text-muted-foreground">Возвраты: {d.returnPercent}%</p>
          <div className="flex items-center gap-1.5 pt-1">
            <div className="h-2.5 w-2.5 rounded-full" style={{ background: ZONE_COLORS[d.zone] }} />
            <span className="font-medium text-foreground">{ZONE_LABELS[d.zone]}</span>
          </div>
        <div className="border-t pt-1 mt-1">
          <p className="text-xs text-muted-foreground italic flex items-start gap-1">
            <Lightbulb className="h-3 w-3 mt-0.5 shrink-0" />
            {d.recommendation}
          </p>
        </div>
      </div>
    );
  }, []);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Матрица прибыльности товаров</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* FILTERS */}
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Категория</span>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[150px] h-9 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Период</span>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[150px] h-9 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 дней</SelectItem>
                <SelectItem value="90">90 дней</SelectItem>
                <SelectItem value="180">180 дней</SelectItem>
                <SelectItem value="365">Год</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1 w-[160px]">
            <span className="text-xs text-muted-foreground">Мин. выручка: {fmt(minRevenue[0])}</span>
            <Slider
              value={minRevenue}
              onValueChange={setMinRevenue}
              min={0}
              max={30000}
              step={1000}
              className="mt-2"
            />
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">ROI</span>
            <Select value={roiFilter} onValueChange={setRoiFilter}>
              <SelectTrigger className="w-[110px] h-9 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все</SelectItem>
                <SelectItem value="1">{">"} 1.0</SelectItem>
                <SelectItem value="1.5">{">"} 1.5</SelectItem>
                <SelectItem value="2">{">"} 2.0</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* SEGMENT TOGGLE */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground mr-1">Сегмент:</span>
          {segments.map((s) => (
            <Button
              key={s}
              size="sm"
              variant={segment === s ? "default" : "outline"}
              className={cn("h-7 px-3 text-xs", segment === s && s !== "All" && "text-white")}
              style={segment === s && s !== "All" ? { backgroundColor: ZONE_COLORS[s as Zone] } : undefined}
              onClick={() => setSegment(s)}
            >
              {s === "All" ? "Все" : ZONE_LABELS[s as Zone]}
            </Button>
          ))}
        </div>

        {/* CHART */}
        <div className="relative rounded-lg border bg-muted/20 p-2">
          {/* Quadrant labels */}
          <div className="absolute top-3 left-6 text-xs font-medium flex items-center gap-1" style={{ color: ZONE_COLORS.Promote }}>
            {ZONE_ICONS.Promote} {ZONE_LABELS.Promote}
          </div>
          <div className="absolute top-3 right-6 text-xs font-medium flex items-center gap-1" style={{ color: ZONE_COLORS.Scale }}>
            {ZONE_ICONS.Scale} {ZONE_LABELS.Scale}
          </div>
          <div className="absolute bottom-10 left-6 text-xs font-medium flex items-center gap-1" style={{ color: ZONE_COLORS.Eliminate }}>
            {ZONE_ICONS.Eliminate} {ZONE_LABELS.Eliminate}
          </div>
          <div className="absolute bottom-10 right-6 text-xs font-medium flex items-center gap-1" style={{ color: ZONE_COLORS.Optimize }}>
            {ZONE_ICONS.Optimize} {ZONE_LABELS.Optimize}
          </div>

          <ResponsiveContainer width="100%" height={380}>
            <ScatterChart margin={{ top: 30, right: 30, bottom: 20, left: 10 }}>
              <XAxis
                type="number"
                dataKey="revenueScore"
                name="Revenue Impact"
                tick={{ fontSize: 11 }}
                label={{ value: "Влияние на выручку →", position: "bottom", fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                type="number"
                dataKey="efficiencyScore"
                name="Эффективность прибыли"
                tick={{ fontSize: 11 }}
                label={{ value: "Эффективность прибыли ↑", angle: -90, position: "insideLeft", fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              />
              <ZAxis type="number" dataKey="totalProfit" range={[40, 400]} />
              <ReferenceLine x={medX} stroke="hsl(var(--border))" strokeDasharray="4 4" />
              <ReferenceLine y={medY} stroke="hsl(var(--border))" strokeDasharray="4 4" />
              <Tooltip content={<CustomTooltip />} />
              <Scatter data={points} onClick={(data: any) => setSelectedSku(data)}>
                {points.map((p, i) => (
                  <Cell
                    key={p.id}
                    fill={ZONE_COLORS[p.zone]}
                    fillOpacity={segment === "All" || segment === p.zone ? 0.85 : 0.15}
                    stroke={ZONE_COLORS[p.zone]}
                    strokeWidth={1}
                    cursor="pointer"
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* LEGEND */}
        <div className="flex flex-wrap items-center gap-4 text-sm">
          {(["Scale", "Optimize", "Promote", "Eliminate"] as Zone[]).map((z) => (
            <div key={z} className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-sm" style={{ background: ZONE_COLORS[z] }} />
              <span className="text-muted-foreground">{ZONE_LABELS[z]}</span>
            </div>
          ))}
          <span className="text-xs text-muted-foreground ml-2">Размер = Общая прибыль</span>
        </div>

        {/* AI INSIGHT */}
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="default" className="gap-1 text-xs">
              <Sparkles className="h-3 w-3" />
              AI Insight
            </Badge>
          </div>
          <p className="text-sm text-foreground italic">
            {aiInsight.pct}% выручки приходится на товары в зоне «Оптимизировать».
            Увеличение их маржи на 4% принесёт дополнительно{" "}
            <span className="font-bold text-primary">+{fmt(aiInsight.potentialGain)}</span> прибыли.
          </p>
        </div>

        {/* DRAWER */}
        <Sheet open={!!selectedSku} onOpenChange={(v) => !v && setSelectedSku(null)}>
          <SheetContent className="sm:max-w-[400px] overflow-y-auto">
            {selectedSku && (
              <>
                <SheetHeader>
                  <SheetTitle className="text-lg">{selectedSku.name}</SheetTitle>
                  <p className="text-xs text-muted-foreground">{selectedSku.category} · {selectedSku.id}</p>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ background: ZONE_COLORS[selectedSku.zone] }} />
                    <Badge style={{ backgroundColor: ZONE_COLORS[selectedSku.zone], color: "#fff" }}>{ZONE_LABELS[selectedSku.zone]}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {[
                      ["Выручка", fmt(selectedSku.revenue)],
                      ["Общая прибыль", fmt(selectedSku.totalProfit)],
                      ["Маржа", `${selectedSku.margin.toFixed(1)}%`],
                      ["Рекламные расходы", fmt(selectedSku.adSpend)],
                      ["Переменные расходы", fmt(selectedSku.variableCosts)],
                      ["Возвраты", `${selectedSku.returnPercent}%`],
                      ["ROI", selectedSku.roi.toFixed(2)],
                      ["Прибыль/ед", fmt(selectedSku.unitProfit)],
                      ["Объём продаж", `${selectedSku.salesVolume} шт.`],
                      ["Рост", `${(selectedSku.growthRate * 100).toFixed(0)}%`],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-md border p-2.5">
                        <p className="text-xs text-muted-foreground">{label}</p>
                        <p className="font-semibold text-foreground">{value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
                    <p className="text-xs font-medium text-primary flex items-center gap-1 mb-1">
                      <Sparkles className="h-3 w-3" /> AI Рекомендация
                    </p>
                    <p className="text-sm text-foreground">{selectedSku.recommendation}</p>
                  </div>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  );
}
