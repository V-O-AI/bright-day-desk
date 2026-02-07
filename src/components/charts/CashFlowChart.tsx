import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format, isWithinInterval, isSameDay } from "date-fns";
import { ru } from "date-fns/locale";
import { DayPicker, DateRange } from "react-day-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const data = [
  { month: "Янв", income: 3000, expense: 1500 },
  { month: "Фев", income: 3500, expense: 1800 },
  { month: "Мар", income: 4200, expense: 2000 },
  { month: "Апр", income: 4800, expense: 2200 },
  { month: "Май", income: 5500, expense: 2500 },
  { month: "Июн", income: 6200, expense: 2800 },
  { month: "Июл", income: 7800, expense: 4900 },
  { month: "Авг", income: 9500, expense: 5200 },
  { month: "Сен", income: 11000, expense: 5800 },
  { month: "Окт", income: 12500, expense: 6500 },
  { month: "Ноя", income: 14000, expense: 7200 },
  { month: "Дек", income: 15000, expense: 8000 },
];

const periodOptions = ["1Y", "6M", "1M"] as const;

const formatYAxis = (value: number) => {
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
  return `$${value}`;
};

export function CashFlowChart() {
  const [activePeriod, setActivePeriod] = useState<string>("1Y");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [calendarOpen, setCalendarOpen] = useState(false);

  const filteredData =
    activePeriod === "1M"
      ? data.slice(-1)
      : activePeriod === "6M"
        ? data.slice(-6)
        : data;

  const handleRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  const rangeLabel =
    dateRange?.from && dateRange?.to
      ? `${format(dateRange.from, "dd.MM.yy")} — ${format(dateRange.to, "dd.MM.yy")}`
      : dateRange?.from
        ? `${format(dateRange.from, "dd.MM.yy")} — ...`
        : null;

  return (
    <div className="bg-card rounded-2xl p-6 border border-border h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold text-foreground">Тенденция движения прибыли</h3>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Доходы
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: "hsl(330, 80%, 65%)" }}
              />
              Расходы
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Calendar picker */}
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "p-2 rounded-lg border border-border hover:bg-muted transition-colors relative",
                  dateRange?.from && "border-primary/40"
                )}
                title="Выберите период"
              >
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end" sideOffset={8}>
              <div className="p-3 pb-1">
                <p className="text-sm font-medium text-foreground mb-1">Выберите период</p>
                {rangeLabel && (
                  <p className="text-xs text-muted-foreground mb-1">{rangeLabel}</p>
                )}
              </div>
              <DayPicker
                mode="range"
                selected={dateRange}
                onSelect={handleRangeSelect}
                locale={ru}
                showOutsideDays
                className="p-3 pointer-events-auto"
                modifiersClassNames={{
                  range_start: "rdp-range-start",
                  range_end: "rdp-range-end",
                  range_middle: "rdp-range-middle",
                }}
                classNames={{
                  months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                  month: "space-y-4",
                  caption: "flex justify-center pt-1 relative items-center",
                  caption_label: "text-sm font-medium",
                  nav: "space-x-1 flex items-center",
                  nav_button: cn(
                    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 inline-flex items-center justify-center rounded-md border border-input",
                  ),
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell:
                    "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                  row: "flex w-full mt-2",
                  cell: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                  day: "h-9 w-9 p-0 font-normal rounded-full flex items-center justify-center transition-colors hover:bg-muted aria-selected:opacity-100",
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
                      isWithinInterval(day, {
                        start: dateRange.from,
                        end: dateRange.to,
                      }) &&
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

          {/* Period toggles */}
          <div className="flex gap-1">
            {periodOptions.map((p) => (
              <button
                key={p}
                onClick={() => setActivePeriod(p)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium transition-all",
                  activePeriod === p
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={filteredData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="incomeGradientNew" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(258, 90%, 66%)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="hsl(258, 90%, 66%)" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="expenseGradientNew" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(330, 80%, 65%)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="hsl(330, 80%, 65%)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--border))"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              tickFormatter={formatYAxis}
              width={50}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                padding: "10px 14px",
              }}
              labelStyle={{
                color: "hsl(var(--foreground))",
                fontWeight: 600,
                marginBottom: 4,
              }}
              formatter={(value: number, name: string) => [
                `$${value.toLocaleString()}`,
                name === "income" ? "Доходы" : "Расходы",
              ]}
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke="hsl(258, 90%, 66%)"
              strokeWidth={2}
              fill="url(#incomeGradientNew)"
            />
            <Area
              type="monotone"
              dataKey="expense"
              stroke="hsl(330, 80%, 65%)"
              strokeWidth={2}
              fill="url(#expenseGradientNew)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
