import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, ArrowLeft, Calendar as CalendarIcon } from "lucide-react";

const DAYS_RU = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const MONTHS_RU = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

// Static tasks for any date
const DEFAULT_TASKS = [
  "Заполни данные аккаунта",
  "Проверь финансы",
  "Исправь склад",
];

function formatFullDate(date: Date): string {
  const day = date.getDate();
  const month = MONTHS_RU[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

function isSameDay(a: Date, b: Date) {
  return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
}

export function CalendarNotes() {
  const today = useMemo(() => new Date(), []);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [notesMode, setNotesMode] = useState(false);

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    let startWeekday = firstDay.getDay(); // 0=Sun
    startWeekday = startWeekday === 0 ? 6 : startWeekday - 1; // Convert to Mon=0

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const days: { day: number; isCurrentMonth: boolean; date: Date }[] = [];

    // Previous month days
    for (let i = startWeekday - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      days.push({ day: d, isCurrentMonth: false, date: new Date(currentYear, currentMonth - 1, d) });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true, date: new Date(currentYear, currentMonth, i) });
    }

    // Next month days to fill remaining
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, isCurrentMonth: false, date: new Date(currentYear, currentMonth + 1, i) });
    }

    return days;
  }, [currentMonth, currentYear]);

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setNotesMode(true);
  };

  const handleBackToCalendar = () => {
    setNotesMode(false);
  };

  const handlePrevDate = () => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() - 1);
      setSelectedDate(newDate);
    }
  };

  const handleNextDate = () => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() + 1);
      setSelectedDate(newDate);
    }
  };

  // Notes mode
  if (notesMode && selectedDate) {
    return (
      <div className="bg-card rounded-2xl p-5 border border-border opacity-0 animate-fade-in" style={{ animationDelay: "350ms", animationFillMode: "forwards" }}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={handleBackToCalendar}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-muted-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">{formatFullDate(selectedDate)}</span>
          </div>
        </div>

        {/* Tasks list */}
        <div className="space-y-2.5 mb-5">
          {DEFAULT_TASKS.map((task, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border/50"
            >
              <div className="w-5 h-5 rounded-full border-2 border-primary/40 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{task}</span>
            </div>
          ))}
        </div>

        {/* Pagination arrows */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handlePrevDate}
            className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs text-muted-foreground">Листать задачи</span>
          <button
            onClick={handleNextDate}
            className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // Calendar mode
  return (
    <div className="bg-card rounded-2xl p-5 border border-border opacity-0 animate-fade-in" style={{ animationDelay: "350ms", animationFillMode: "forwards" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm">Календарь</h3>
        </div>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <button
          onClick={goToPrevMonth}
          className="p-1.5 rounded-full bg-foreground text-background hover:opacity-80 transition-opacity"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
        <span className="text-sm font-medium min-w-[130px] text-center">
          {MONTHS_RU[currentMonth]} {currentYear}
        </span>
        <button
          onClick={goToNextMonth}
          className="p-1.5 rounded-full bg-foreground text-background hover:opacity-80 transition-opacity"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS_RU.map((d) => (
          <div key={d} className="text-center text-[10px] font-medium text-muted-foreground py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((item, i) => {
          const isToday = isSameDay(item.date, today);
          return (
            <button
              key={i}
              onClick={() => handleDateClick(item.date)}
              className={`
                relative h-8 w-full flex items-center justify-center text-xs rounded-full transition-all
                ${!item.isCurrentMonth ? "text-muted-foreground/40" : "text-foreground hover:bg-muted"}
                ${isToday ? "bg-primary text-primary-foreground font-bold hover:bg-primary/90" : ""}
              `}
            >
              {item.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
