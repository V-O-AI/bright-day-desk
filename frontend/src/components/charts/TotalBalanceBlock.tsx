import { useState } from "react";
import { TrendingUp, TrendingDown, CalendarIcon, ChevronDown } from "lucide-react";
import { useFinancialMetrics, MetricPeriod } from "@/hooks/useFinancialMetrics";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { IncomeDetailModal } from "./IncomeDetailModal";
import { ExpenseDetailModal } from "./ExpenseDetailModal";
import { format, isWithinInterval, isSameDay } from "date-fns";
import { ru } from "date-fns/locale";
import { DayPicker, DateRange } from "react-day-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";

interface TotalBalanceBlockProps {
  period?: MetricPeriod;
  compact?: boolean;
  onPeriodChange?: (period: MetricPeriod) => void;
  showPeriodSelector?: boolean;
}

const periodLabels: Record<MetricPeriod, string> = {
  day: "День",
  week: "Неделя",
  month: "Месяц",
  year: "Год",
};

const periodLabelsShort: Record<MetricPeriod, string> = {
  day: "Д",
  week: "Н",
  month: "М",
  year: "Г",
};

function formatCurrency(value: number, short: boolean = false): string {
  if (short && value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M ₽`;
  }
  if (short && value >= 1000) {
    return `${(value / 1000).toFixed(0)}K ₽`;
  }
  return `${value.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₽`;
}

function formatPercent(value: number): string {
  return `${Math.abs(value).toFixed(1)}%`;
}

export function TotalBalanceBlock({
  period = "month",
  compact = false,
  onPeriodChange,
  showPeriodSelector = false,
}: TotalBalanceBlockProps) {
  const { data: metrics, isLoading } = useFinancialMetrics(period);
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const isMobile = useIsMobile();

  const rangeLabel =
    dateRange?.from && dateRange?.to
      ? `${format(dateRange.from, "dd.MM.yy")} — ${format(dateRange.to, "dd.MM.yy")}`
      : dateRange?.from
        ? `${format(dateRange.from, "dd.MM.yy")} — ...`
        : null;

  const totalRevenue = metrics?.find((m) => m.metric_key === "total_revenue");
  const subscriptions = metrics?.find((m) => m.metric_key === "subscriptions");
  const sales = metrics?.find((m) => m.metric_key === "sales");

  // Total balance = revenue * multiplier
  const balanceValue = totalRevenue ? totalRevenue.value * 4.8 : 0;
  const balanceChange = totalRevenue?.change_percent ?? 0;

  // Income
  const incomeValue = totalRevenue?.value ?? 0;
  const incomeChange = totalRevenue?.change_percent ?? 0;

  // Expenses
  const expenseValue = subscriptions?.value ?? 0;
  const expenseChange = subscriptions?.change_percent ?? 0;

  // Margin = (income - expense) / income * 100
  const marginPercent = incomeValue > 0 ? ((incomeValue - expenseValue) / incomeValue) * 100 : 0;
  // Compare with previous period — use sales change as proxy
  const marginChange = sales?.change_percent ?? 0;

  if (isLoading) {
    return <Skeleton className={cn("rounded-xl xs:rounded-2xl", compact ? "h-[160px] xs:h-[180px]" : "h-[220px] xs:h-[240px] md:h-[260px]")} />;
  }

  const periodText = period === "day" ? "день" : period === "week" ? "неделю" : period === "year" ? "год" : "месяц";
  const currentPeriodLabel = periodLabels[period];

  return (
    <>
      <div className="bg-card rounded-xl xs:rounded-2xl p-4 xs:p-5 md:p-6 border border-border h-full flex flex-col justify-between">
        {/* Top section */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs xs:text-sm text-muted-foreground font-medium">
              {isMobile ? "Прибыль" : "Общая прибыль"}
            </span>
            <div className="flex items-center gap-1.5 xs:gap-2">
              {showPeriodSelector && onPeriodChange && (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-0.5 xs:gap-1 px-2 xs:px-3 py-1 xs:py-1.5 rounded-lg bg-muted text-xs xs:text-sm text-foreground hover:bg-muted/80 transition-colors">
                    {isMobile ? periodLabelsShort[period] : periodLabels[period]}
                    <ChevronDown className="h-3 w-3 xs:h-3.5 xs:w-3.5 text-muted-foreground" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover border border-border z-50">
                    {(Object.keys(periodLabels) as MetricPeriod[]).map((p) => (
                      <DropdownMenuItem
                        key={p}
                        onClick={() => onPeriodChange(p)}
                        className={cn(
                          "cursor-pointer text-xs xs:text-sm",
                          period === p && "bg-primary/10 text-primary font-medium"
                        )}
                      >
                        {periodLabels[p]}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <button
                    className={cn(
                      "p-1.5 xs:p-2 rounded-lg xs:rounded-xl bg-muted hover:bg-muted/80 transition-colors",
                      dateRange?.from && "ring-1 ring-primary/30"
                    )}
                    title="Выберите период"
                  >
                    <CalendarIcon className="h-3.5 w-3.5 xs:h-4 xs:w-4 text-muted-foreground" />
                  </button>
                </PopoverTrigger>
                <PopoverContent 
                  className="w-auto p-0 z-50" 
                  align="end" 
                  sideOffset={8}
                >
                  <div className="p-2 xs:p-3 pb-1">
                    <p className="text-xs xs:text-sm font-medium text-foreground mb-1">Выберите период</p>
                    {rangeLabel && (
                      <p className="text-[10px] xs:text-xs text-muted-foreground mb-1">{rangeLabel}</p>
                    )}
                  </div>
                  <DayPicker
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    locale={ru}
                    showOutsideDays
                    className="p-2 xs:p-3 pointer-events-auto"
                    classNames={{
                      months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                      month: "space-y-3 xs:space-y-4",
                      caption: "flex justify-center pt-1 relative items-center",
                      caption_label: "text-xs xs:text-sm font-medium",
                      nav: "space-x-1 flex items-center",
                      nav_button: "h-6 w-6 xs:h-7 xs:w-7 bg-transparent p-0 opacity-50 hover:opacity-100 inline-flex items-center justify-center rounded-md border border-input",
                      nav_button_previous: "absolute left-1",
                      nav_button_next: "absolute right-1",
                      table: "w-full border-collapse space-y-1",
                      head_row: "flex",
                      head_cell: "text-muted-foreground rounded-md w-7 xs:w-9 font-normal text-[0.7rem] xs:text-[0.8rem]",
                      row: "flex w-full mt-1.5 xs:mt-2",
                      cell: "h-7 w-7 xs:h-9 xs:w-9 text-center text-xs xs:text-sm p-0 relative focus-within:relative focus-within:z-20",
                      day: "h-7 w-7 xs:h-9 xs:w-9 p-0 font-normal rounded-full flex items-center justify-center transition-colors hover:bg-muted aria-selected:opacity-100",
                      day_today: "bg-accent text-accent-foreground font-semibold",
                      day_outside: "text-muted-foreground opacity-50",
                      day_disabled: "text-muted-foreground opacity-50",
                      day_hidden: "invisible",
                    }}
                    modifiers={{
                      rangeStart: dateRange?.from ? [dateRange.from] : [],
                      rangeEnd: dateRange?.to ? [dateRange.to] : [],
                      rangeMiddle: (day: Date) => {
                        if (!dateRange?.from || !dateRange?.to) return false;
                        return (
                          isWithinInterval(day, { start: dateRange.from, end: dateRange.to }) &&
                          !isSameDay(day, dateRange.from) &&
                          !isSameDay(day, dateRange.to)
                        );
                      },
                    }}
                    modifiersStyles={{
                      rangeStart: {
                        backgroundColor: "hsl(217, 91%, 60%)",
                        color: "white",
                        borderRadius: "50%",
                      },
                      rangeEnd: {
                        backgroundColor: "hsl(0, 84%, 60%)",
                        color: "white",
                        borderRadius: "50%",
                      },
                      rangeMiddle: {
                        backgroundColor: "hsl(217, 91%, 60%, 0.15)",
                        color: "hsl(217, 91%, 60%)",
                        borderRadius: "0",
                      },
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <p className={cn(
            "font-bold text-foreground",
            compact ? "text-2xl xs:text-3xl" : "text-2xl xs:text-3xl md:text-4xl"
          )}>
            {formatCurrency(balanceValue, isMobile)}
          </p>
          <div className="flex items-center justify-between mt-1.5 xs:mt-2 flex-wrap gap-1">
            <span className={cn(
              "text-[10px] xs:text-xs md:text-sm flex items-center gap-0.5 xs:gap-1",
              balanceChange >= 0 ? "text-green-500" : "text-destructive"
            )}>
              {balanceChange >= 0 ? (
                <TrendingUp className="h-3 w-3 xs:h-3.5 xs:w-3.5" />
              ) : (
                <TrendingDown className="h-3 w-3 xs:h-3.5 xs:w-3.5" />
              )}
              {balanceChange >= 0 ? "+" : ""}{balanceChange}% {isMobile ? "" : `за ${periodText}`}
            </span>
            <span className="text-[9px] xs:text-xs text-muted-foreground hidden xs:block">Все связанные счета</span>
          </div>
        </div>

        {/* Sub cards row - Responsive grid */}
        <div className={cn(
          "grid gap-2 xs:gap-3",
          compact ? "mt-3 xs:mt-4 grid-cols-3" : "mt-4 xs:mt-5 md:mt-6 grid-cols-3"
        )}>
          {/* Доход */}
          <div
            onClick={() => setIncomeModalOpen(true)}
            className="bg-muted/50 rounded-lg xs:rounded-xl p-2 xs:p-3 border border-border/50 cursor-pointer hover:bg-muted/80 transition-colors"
          >
            <p className="text-[10px] xs:text-xs text-muted-foreground mb-0.5 xs:mb-1">Доход</p>
            <p className="text-xs xs:text-sm font-bold text-foreground truncate">
              {formatCurrency(incomeValue, isMobile)}
            </p>
            <p className={cn(
              "text-[9px] xs:text-xs mt-0.5 xs:mt-1 flex items-center gap-0.5",
              incomeChange >= 0 ? "text-green-500" : "text-destructive"
            )}>
              {incomeChange >= 0 ? (
                <TrendingUp className="h-2.5 w-2.5 xs:h-3 xs:w-3" />
              ) : (
                <TrendingDown className="h-2.5 w-2.5 xs:h-3 xs:w-3" />
              )}
              <span className="hidden xs:inline">{formatPercent(incomeChange)} за {periodText}</span>
              <span className="xs:hidden">{formatPercent(incomeChange)}</span>
            </p>
          </div>

          {/* Расходы */}
          <div
            onClick={() => setExpenseModalOpen(true)}
            className="bg-muted/50 rounded-lg xs:rounded-xl p-2 xs:p-3 border border-border/50 cursor-pointer hover:bg-muted/80 transition-colors"
          >
            <p className="text-[10px] xs:text-xs text-muted-foreground mb-0.5 xs:mb-1">Расходы</p>
            <p className="text-xs xs:text-sm font-bold text-foreground truncate">
              {formatCurrency(expenseValue, isMobile)}
            </p>
            <p className={cn(
              "text-[9px] xs:text-xs mt-0.5 xs:mt-1 flex items-center gap-0.5",
              expenseChange >= 0 ? "text-destructive" : "text-green-500"
            )}>
              {expenseChange >= 0 ? (
                <TrendingUp className="h-2.5 w-2.5 xs:h-3 xs:w-3" />
              ) : (
                <TrendingDown className="h-2.5 w-2.5 xs:h-3 xs:w-3" />
              )}
              <span className="hidden xs:inline">{formatPercent(expenseChange)} за {periodText}</span>
              <span className="xs:hidden">{formatPercent(expenseChange)}</span>
            </p>
          </div>

          {/* Маржа */}
          <div className="bg-muted/50 rounded-lg xs:rounded-xl p-2 xs:p-3 border border-border/50">
            <p className="text-[10px] xs:text-xs text-muted-foreground mb-0.5 xs:mb-1">Маржа</p>
            <div className="flex items-center gap-1 xs:gap-1.5">
              <p className="text-xs xs:text-sm font-bold text-foreground">
                {marginPercent.toFixed(isMobile ? 0 : 1)}%
              </p>
              {marginChange >= 0 ? (
                <TrendingUp className="h-3 w-3 xs:h-4 xs:w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 xs:h-4 xs:w-4 text-destructive" />
              )}
            </div>
            <p className={cn(
              "text-[9px] xs:text-xs mt-0.5 xs:mt-1 flex items-center gap-0.5",
              marginChange >= 0 ? "text-green-500" : "text-destructive"
            )}>
              <span className="hidden xs:inline">{marginChange >= 0 ? "+" : ""}{marginChange.toFixed(1)}% за {periodText}</span>
              <span className="xs:hidden">{marginChange >= 0 ? "+" : ""}{marginChange.toFixed(0)}%</span>
            </p>
          </div>
        </div>
      </div>

      <IncomeDetailModal
        open={incomeModalOpen}
        onOpenChange={setIncomeModalOpen}
        totalIncome={incomeValue}
        periodLabel={currentPeriodLabel}
      />
      <ExpenseDetailModal
        open={expenseModalOpen}
        onOpenChange={setExpenseModalOpen}
        totalExpense={expenseValue}
        periodLabel={currentPeriodLabel}
      />
    </>
  );
}
