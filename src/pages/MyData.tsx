import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  Users, 
  Wallet,
  BarChart3,
  AlertCircle,
  Lightbulb,
  ChevronDown
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// Category cards data
const categoryCards = [
  {
    id: "finances",
    title: "Финансы",
    icon: Wallet,
    description: "Доходы, расходы и прибыль",
    url: "/my-data/finances",
    gradient: "from-emerald-500/20 to-emerald-600/10",
    iconColor: "text-emerald-500",
    borderColor: "border-emerald-500/30",
  },
  {
    id: "warehouse",
    title: "Мой склад",
    icon: Package,
    description: "Товары и инвентарь",
    url: "/my-data/warehouse",
    gradient: "from-blue-500/20 to-blue-600/10",
    iconColor: "text-blue-500",
    borderColor: "border-blue-500/30",
  },
  {
    id: "clients",
    title: "Аналитика клиентов",
    icon: Users,
    description: "Поведение и статистика",
    url: "/my-data/client-analytics",
    gradient: "from-purple-500/20 to-purple-600/10",
    iconColor: "text-purple-500",
    borderColor: "border-purple-500/30",
  },
];

// Metrics data
const metrics = [
  {
    categoryId: "finances",
    label: "Рост/падение прибыли",
    value: "+12.5%",
    trend: "up" as const,
    shape: "circle",
  },
  {
    categoryId: "warehouse",
    label: "Доля товаров которые дольше всего лежат без изменений",
    value: "23%",
    trend: "neutral" as const,
    shape: "triangle",
  },
  {
    categoryId: "clients",
    label: "Кол-во клиентов",
    value: "1,247",
    trend: "up" as const,
    shape: "square",
  },
];

// Insights data
const insights = [
  {
    category: "Финансы",
    type: "warning",
    text: "Некоторые товары имеют себестоимость выше продажи. Исправив этот компонент, ваш доход может вырасти на 8%",
  },
  {
    category: "Финансы",
    type: "success",
    text: 'Товар "Кроссовки Nike Air Max" имеет самое высокое количество продаж, стоит вкладываться в его рекламу, может принести увеличение дохода',
  },
  {
    category: "Мой склад",
    type: "warning",
    text: 'Товар "Футболка Adidas" стоит пополнить его количество, иначе в противном случае он закончится на складе через 3 дня',
  },
  {
    category: "Мой склад",
    type: "info",
    text: "У всех товаров количество находится в полном объеме, закупка товаров ближайшие 7 дней не планируется",
  },
  {
    category: "Аналитика клиентов",
    type: "success",
    text: 'Товары из категории "обувь" интересуются чаще всего, стоит обратить на это внимание',
  },
];

const periodOptions = [
  { value: "day", label: "День" },
  { value: "week", label: "Неделя" },
  { value: "month", label: "Месяц" },
];

const MetricShape = ({ shape, trend }: { shape: string; trend: "up" | "down" | "neutral" }) => {
  const baseClasses = "transition-all duration-300 flex items-center justify-center";
  
  const trendColor = trend === "up" 
    ? "text-emerald-500" 
    : trend === "down" 
    ? "text-red-500" 
    : "text-yellow-500";

  if (shape === "circle") {
    return (
      <div className={cn(
        baseClasses,
        "w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border-2 border-emerald-500/40"
      )}>
        {trend === "up" ? (
          <TrendingUp className={cn("h-7 w-7", trendColor)} />
        ) : (
          <TrendingDown className={cn("h-7 w-7", trendColor)} />
        )}
      </div>
    );
  }
  
  if (shape === "triangle") {
    return (
      <div className={cn(
        baseClasses,
        "w-16 h-16"
      )}>
        <div className="w-0 h-0 border-l-[32px] border-l-transparent border-r-[32px] border-r-transparent border-b-[56px] border-b-blue-500/40 relative">
          <BarChart3 className="h-6 w-6 text-blue-500 absolute top-4 left-1/2 -translate-x-1/2" />
        </div>
      </div>
    );
  }
  
  if (shape === "square") {
    return (
      <div className={cn(
        baseClasses,
        "w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-2 border-purple-500/40"
      )}>
        <Users className="h-7 w-7 text-purple-500" />
      </div>
    );
  }
  
  return null;
};

const InsightCard = ({ insight, index }: { insight: typeof insights[0]; index: number }) => {
  const typeStyles = {
    warning: {
      border: "border-yellow-500/30",
      bg: "bg-yellow-500/5",
      icon: AlertCircle,
      iconColor: "text-yellow-500",
    },
    success: {
      border: "border-emerald-500/30",
      bg: "bg-emerald-500/5",
      icon: Lightbulb,
      iconColor: "text-emerald-500",
    },
    info: {
      border: "border-blue-500/30",
      bg: "bg-blue-500/5",
      icon: Lightbulb,
      iconColor: "text-blue-500",
    },
  };

  const style = typeStyles[insight.type as keyof typeof typeStyles];
  const Icon = style.icon;

  return (
    <div 
      className={cn(
        "p-4 rounded-lg border transition-all duration-300 hover:shadow-md animate-fade-in",
        style.border,
        style.bg
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn("h-5 w-5 mt-0.5 flex-shrink-0", style.iconColor)} />
        <div className="flex-1">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {insight.category}
          </span>
          <p className="text-sm text-foreground mt-1 leading-relaxed">
            {insight.text}
          </p>
        </div>
      </div>
    </div>
  );
};

const MyData = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header with Period Selector */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Мои данные</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Обзор ключевых показателей и инсайтов
            </p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                {periodOptions.find(p => p.value === selectedPeriod)?.label}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {periodOptions.map((option) => (
                <DropdownMenuItem 
                  key={option.value}
                  onClick={() => setSelectedPeriod(option.value)}
                  className={cn(selectedPeriod === option.value && "bg-accent")}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categoryCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card 
                key={card.id}
                className={cn(
                  "cursor-pointer select-none bg-background",
                  card.borderColor,
                  "border"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => navigate(card.url)}
              >
                <CardContent className="p-6">
                  <div className="relative pointer-events-none">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
                      "bg-background border",
                      card.borderColor
                    )}>
                      <Icon className={cn("h-6 w-6", card.iconColor)} />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {card.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {card.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metrics.map((metric, index) => (
            <div 
              key={metric.categoryId}
              className="flex flex-col items-center text-center p-6 animate-fade-in"
              style={{ animationDelay: `${(index + 3) * 100}ms` }}
            >
              <MetricShape shape={metric.shape} trend={metric.trend} />
              <div className="mt-4">
                <div className="text-2xl font-bold text-foreground mb-1">
                  {metric.value}
                </div>
                <p className="text-xs text-muted-foreground max-w-[180px] leading-relaxed">
                  {metric.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Insights Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Инсайты и рекомендации
          </h2>
          <div className="grid gap-3">
            {insights.map((insight, index) => (
              <InsightCard key={index} insight={insight} index={index} />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default MyData;
