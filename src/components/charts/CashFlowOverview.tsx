import { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, ReferenceLine,
} from "recharts";
import { cn } from "@/lib/utils";
import { Info, Wallet, ArrowRightLeft, TrendingUp, Clock, Lightbulb } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";

/* ───── mock data ───── */
const projectionData = [
  { day: "Сегодня", inflow: 84200, outflow: 0, net: 84200 },
  { day: "+10д", inflow: 78000, outflow: 12000, net: 72000 },
  { day: "+20д", inflow: 71000, outflow: 18000, net: 62400 },
  { day: "+30д", inflow: 64000, outflow: 22000, net: 55000 },
  { day: "+40д", inflow: 56000, outflow: 26000, net: 48600 },
  { day: "+50д", inflow: 42000, outflow: 30000, net: 38000 },
  { day: "+60д", inflow: 30000, outflow: 34000, net: 24000 },
];

const waterfallRaw = [
  { name: "Начальный баланс", value: 84200, type: "start" },
  { name: "Выручка", value: 148000, type: "in" },
  { name: "Ожид. поступления", value: 16200, type: "in" },
  { name: "Себестоимость", value: -92700, type: "out" },
  { name: "Маркетинг", value: -31200, type: "out" },
  { name: "Логистика", value: -19400, type: "out" },
  { name: "Возвраты", value: -14200, type: "out" },
  { name: "Прочие расходы", value: -11800, type: "out" },
  { name: "Конечный баланс", value: 0, type: "end" },
];

const waterfallData = (() => {
  let running = 0;
  return waterfallRaw.map((item) => {
    if (item.type === "start") {
      running = item.value;
      return { ...item, base: 0, delta: item.value, total: running };
    }
    if (item.type === "end") {
      return { ...item, base: 0, delta: running, total: running, value: running };
    }
    const prev = running;
    running += item.value;
    return {
      ...item,
      base: item.value >= 0 ? prev : running,
      delta: Math.abs(item.value),
      total: running,
    };
  });
})();

const topInflows = [
  { id: 1, source: "Органические продажи", amount: 24400, pct: 15 },
  { id: 2, source: "Маркетплейсы", amount: 19200, pct: 12 },
  { id: 3, source: "Ожидаемые поступления", amount: 16200, pct: 10 },
  { id: 4, source: "Комбинезон зимний", amount: 7800, pct: 5 },
];

const topOutflows = [
  { id: 1, category: "Контекстная реклама", amount: 16100, pct: 12 },
  { id: 2, category: "Возвраты", amount: 14200, pct: 10 },
  { id: 3, category: "Логистика", amount: 11800, pct: 8 },
  { id: 4, category: "Таргетированная реклама", amount: 11300, pct: 8 },
];

const ordersData = [
  { orderId: "00021", sku: "Боди хлопок", inflow: 480, outflow: 620, net: -140 },
  { orderId: "00018", sku: "Шапка вязаная", inflow: 920, outflow: 630, net: 290 },
  { orderId: "00034", sku: "Пинетки", inflow: 640, outflow: 400, net: 240 },
];

const drawerBreakdown = [
  { sku: "Боди хлопок", revenue: 4800, cost: 2200, cac: 800, logistics: 600, returns: 400, net: 800 },
  { sku: "Шапка вязаная", revenue: 9200, cost: 3800, cac: 1200, logistics: 900, returns: 200, net: 3100 },
  { sku: "Пинетки", revenue: 6400, cost: 2800, cac: 600, logistics: 500, returns: 100, net: 2400 },
];

const fmt = (v: number) => v.toLocaleString("ru-RU") + " ₽";

/* ───── component ───── */
export function CashFlowOverview() {
  const [dateRange, setDateRange] = useState("60");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState("");

  const openDrawer = (title: string) => {
    setDrawerTitle(title);
    setDrawerOpen(true);
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-foreground">Обзор денежных потоков</h3>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger><Info className="w-4 h-4 text-muted-foreground" /></TooltipTrigger>
              <TooltipContent className="max-w-xs text-xs">
                Анализ движения денежных средств: притоки, оттоки, прогноз баланса и ликвидность.
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Период:</span>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[160px] h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="30">Последние 30 дней</SelectItem>
              <SelectItem value="60">Последние 60 дней</SelectItem>
              <SelectItem value="90">Последние 90 дней</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={<Wallet className="w-4 h-4 text-primary" />}
          label="Текущий баланс"
          value={fmt(84200)}
          onClick={() => openDrawer("Текущий баланс")}
        />
        <KpiCard
          icon={<ArrowRightLeft className="w-4 h-4 text-destructive" />}
          label="Чистый денежный поток"
          value={fmt(-12300)}
          valueClass="text-destructive"
          onClick={() => openDrawer("Чистый денежный поток")}
        />
        <KpiCard
          icon={<TrendingUp className="w-4 h-4 text-primary" />}
          label="Прогноз баланса"
          sub={
            <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
              <div>+30 дней: 62 400 ₽</div>
              <div>+60 дней: 24 000 ₽</div>
            </div>
          }
          onClick={() => openDrawer("Прогноз баланса")}
        />
        <CashRunwayCard onClick={() => openDrawer("Запас прочности")} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Projected cash flow area chart */}
        <div className="bg-muted/30 rounded-xl border border-border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-foreground">Прогноз денежного потока</h4>
              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger><Info className="w-3.5 h-3.5 text-muted-foreground" /></TooltipTrigger>
                  <TooltipContent className="text-xs max-w-xs">Прогноз движения денежных средств на 60 дней.</TooltipContent>
                </UITooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" />Притоки</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-destructive" />Оттоки</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-foreground" />Баланс</span>
            </div>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectionData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="cfInG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="cfOutG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)} width={45} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 10, fontSize: 12 }} formatter={(v: number, n: string) => [fmt(v), n === "inflow" ? "Притоки" : n === "outflow" ? "Оттоки" : "Баланс"]} />
                <Area type="monotone" dataKey="inflow" stroke="hsl(142, 71%, 45%)" strokeWidth={2} fill="url(#cfInG)" />
                <Area type="monotone" dataKey="outflow" stroke="hsl(0, 84%, 60%)" strokeWidth={2} fill="url(#cfOutG)" />
                <Area type="monotone" dataKey="net" stroke="hsl(var(--foreground))" strokeWidth={2.5} fill="none" strokeDasharray="6 3" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Waterfall chart */}
        <div className="bg-muted/30 rounded-xl border border-border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-foreground">Структура денежного потока</h4>
              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger><Info className="w-3.5 h-3.5 text-muted-foreground" /></TooltipTrigger>
                  <TooltipContent className="text-xs max-w-xs">Водопадная диаграмма движения денежных средств по категориям.</TooltipContent>
                </UITooltip>
              </TooltipProvider>
            </div>
            <span className="text-xs text-muted-foreground">Последние {dateRange} дней</span>
          </div>
          <div className="text-xs text-muted-foreground mb-1">Начальный баланс: <span className="font-semibold text-foreground">84 200 ₽</span></div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waterfallData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} interval={0} angle={-20} textAnchor="end" height={50} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)} width={40} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 10, fontSize: 12 }} formatter={(v: number, n: string) => {
                  if (n === "base") return [null, null];
                  return [fmt(v), "Сумма"];
                }} />
                <Bar dataKey="base" stackId="a" fill="transparent" />
                <Bar dataKey="delta" stackId="a" radius={[4, 4, 0, 0]}>
                  {waterfallData.map((d, i) => (
                    <Cell key={i} fill={d.type === "out" ? "hsl(0, 84%, 60%)" : d.type === "end" ? "hsl(217, 91%, 60%)" : "hsl(142, 71%, 45%)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top Inflows */}
        <div className="bg-muted/30 rounded-xl border border-border p-4">
          <h4 className="text-sm font-semibold text-foreground mb-3">Топ притоков</h4>
          <table className="w-full text-xs">
            <thead><tr className="text-muted-foreground border-b border-border">
              <th className="text-left py-1.5 font-medium">#</th>
              <th className="text-left py-1.5 font-medium">Источник</th>
              <th className="text-right py-1.5 font-medium">Приток</th>
              <th className="text-right py-1.5 font-medium">% итого</th>
            </tr></thead>
            <tbody>
              {topInflows.map((r) => (
                <tr key={r.id} className="border-b border-border/50 hover:bg-muted/40 cursor-pointer" onClick={() => openDrawer(`Приток: ${r.source}`)}>
                  <td className="py-2 text-muted-foreground">{r.id}</td>
                  <td className="py-2 text-foreground">{r.source}</td>
                  <td className="py-2 text-right font-medium text-foreground">{fmt(r.amount)}</td>
                  <td className="py-2 text-right text-muted-foreground">{r.pct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Outflows */}
        <div className="bg-muted/30 rounded-xl border border-border p-4">
          <h4 className="text-sm font-semibold text-foreground mb-3">Топ оттоков</h4>
          <table className="w-full text-xs">
            <thead><tr className="text-muted-foreground border-b border-border">
              <th className="text-left py-1.5 font-medium">#</th>
              <th className="text-left py-1.5 font-medium">Категория</th>
              <th className="text-right py-1.5 font-medium">Отток</th>
              <th className="text-right py-1.5 font-medium">% итого</th>
            </tr></thead>
            <tbody>
              {topOutflows.map((r) => (
                <tr key={r.id} className="border-b border-border/50 hover:bg-muted/40 cursor-pointer" onClick={() => openDrawer(`Отток: ${r.category}`)}>
                  <td className="py-2 text-muted-foreground">{r.id}</td>
                  <td className="py-2 text-foreground">{r.category}</td>
                  <td className="py-2 text-right font-medium text-destructive">{fmt(r.amount)}</td>
                  <td className="py-2 text-right text-muted-foreground">{r.pct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Orders / Categories */}
        <div className="bg-muted/30 rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-foreground">Заказы / Категории</h4>
            <Select defaultValue="orders">
              <SelectTrigger className="w-[110px] h-7 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="orders">Заказы</SelectItem>
                <SelectItem value="categories">Категории</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <table className="w-full text-xs">
            <thead><tr className="text-muted-foreground border-b border-border">
              <th className="text-left py-1.5 font-medium">Заказ</th>
              <th className="text-left py-1.5 font-medium">Товар</th>
              <th className="text-right py-1.5 font-medium">Приток</th>
              <th className="text-right py-1.5 font-medium">Чистый поток</th>
            </tr></thead>
            <tbody>
              {ordersData.map((r) => (
                <tr key={r.orderId} className="border-b border-border/50 hover:bg-muted/40 cursor-pointer" onClick={() => openDrawer(`Заказ ${r.orderId}`)}>
                  <td className="py-2 text-foreground">{r.orderId}</td>
                  <td className="py-2 text-muted-foreground">{r.sku}</td>
                  <td className="py-2 text-right text-foreground">{fmt(r.inflow)}</td>
                  <td className={cn("py-2 text-right font-medium", r.net >= 0 ? "text-emerald-600" : "text-destructive")}>{fmt(r.net)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Insight */}
      <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl px-5 py-3">
        <Lightbulb className="w-5 h-5 text-amber-500 shrink-0" />
        <p className="text-sm text-foreground">
          <span className="font-semibold">AI Инсайт:</span> При сохранении текущих тенденций денежные резервы опустятся ниже{" "}
          <span className="text-destructive font-semibold italic">критического порога</span> через <span className="font-bold">28 дней</span>.
        </p>
      </div>

      {/* Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{drawerTitle}</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-5">
            <div className="text-xs text-muted-foreground">Период: Последние {dateRange} дней</div>
            {/* Breakdown table */}
            <div>
              <h4 className="text-sm font-semibold mb-2">Детализация по товарам</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead><tr className="border-b border-border text-muted-foreground">
                    <th className="text-left py-1.5">Товар</th>
                    <th className="text-right py-1.5">Выручка</th>
                    <th className="text-right py-1.5">Себест.</th>
                    <th className="text-right py-1.5">CAC</th>
                    <th className="text-right py-1.5">Лог.</th>
                    <th className="text-right py-1.5">Возвр.</th>
                    <th className="text-right py-1.5">Чистый</th>
                  </tr></thead>
                  <tbody>
                    {drawerBreakdown.map((r) => (
                      <tr key={r.sku} className="border-b border-border/50">
                        <td className="py-2 font-medium">{r.sku}</td>
                        <td className="py-2 text-right">{fmt(r.revenue)}</td>
                        <td className="py-2 text-right">{fmt(r.cost)}</td>
                        <td className="py-2 text-right">{fmt(r.cac)}</td>
                        <td className="py-2 text-right">{fmt(r.logistics)}</td>
                        <td className="py-2 text-right">{fmt(r.returns)}</td>
                        <td className={cn("py-2 text-right font-semibold", r.net >= 0 ? "text-emerald-600" : "text-destructive")}>{fmt(r.net)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Segment analysis */}
            <div>
              <h4 className="text-sm font-semibold mb-2">Сегментный анализ</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { segment: "Платный трафик", net: 5200 },
                  { segment: "Органический", net: 16400 },
                  { segment: "Регион А", net: 8600 },
                  { segment: "Регион Б", net: 4200 },
                ].map((s) => (
                  <div key={s.segment} className="bg-muted/50 rounded-lg p-3">
                    <div className="text-muted-foreground">{s.segment}</div>
                    <div className={cn("font-semibold mt-0.5", s.net >= 0 ? "text-emerald-600" : "text-destructive")}>{fmt(s.net)}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* AI rec */}
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-xs">
              <div className="font-semibold mb-1 flex items-center gap-1.5"><Lightbulb className="w-3.5 h-3.5 text-amber-500" />AI Рекомендация</div>
              <p className="text-muted-foreground">Отложите несущественные маркетинговые расходы на 2 недели для стабилизации кэш-флоу. Ускорьте сбор дебиторской задолженности.</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

/* ───── sub-components ───── */
function KpiCard({ icon, label, value, valueClass, sub, onClick }: {
  icon: React.ReactNode; label: string; value?: string; valueClass?: string;
  sub?: React.ReactNode; onClick?: () => void;
}) {
  return (
    <div
      className="bg-muted/30 border border-border rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
        {icon}
        <span>{label}</span>
      </div>
      {value && <div className={cn("text-2xl font-bold", valueClass || "text-foreground")}>{value}</div>}
      {sub}
    </div>
  );
}

function CashRunwayCard({ onClick }: { onClick: () => void }) {
  const days = 42;
  const pct = Math.min((days / 60) * 100, 100);
  return (
    <div className="bg-muted/30 border border-border rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-4 h-4 text-amber-500" />
          <span>Запас прочности</span>
        </div>
        <TooltipProvider>
          <UITooltip>
            <TooltipTrigger><Info className="w-3.5 h-3.5 text-muted-foreground" /></TooltipTrigger>
            <TooltipContent className="text-xs max-w-xs">Дней до критического порога баланса.</TooltipContent>
          </UITooltip>
        </TooltipProvider>
      </div>
      <div className="text-2xl font-bold text-amber-600">{days} дней</div>
      <div className="mt-2 relative">
        <Progress value={pct} className="h-2" />
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
          <span>60 дн.</span>
          <span>30 дн.</span>
          <span className="text-destructive font-medium">Критично</span>
        </div>
      </div>
    </div>
  );
}
