import { useState, useMemo, useCallback } from "react";
import { ChevronLeft, ChevronRight, ArrowLeft, Calendar as CalendarIcon, Plus, Trash2, Check } from "lucide-react";
import { Input } from "@/components/ui/input";

const DAYS_RU = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const MONTHS_RU = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

interface Task {
  id: string;
  text: string;
  done: boolean;
}

type TasksMap = Record<string, Task[]>;

function dateKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

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
  const [tasksMap, setTasksMap] = useState<TasksMap>({});
  const [newTaskText, setNewTaskText] = useState("");

  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    let startWeekday = firstDay.getDay();
    startWeekday = startWeekday === 0 ? 6 : startWeekday - 1;

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const days: { day: number; isCurrentMonth: boolean; date: Date }[] = [];

    for (let i = startWeekday - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      days.push({ day: d, isCurrentMonth: false, date: new Date(currentYear, currentMonth - 1, d) });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true, date: new Date(currentYear, currentMonth, i) });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, isCurrentMonth: false, date: new Date(currentYear, currentMonth + 1, i) });
    }

    return days;
  }, [currentMonth, currentYear]);

  const goToPrevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else setCurrentMonth(currentMonth - 1);
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else setCurrentMonth(currentMonth + 1);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setNotesMode(true);
    setNewTaskText("");
  };

  const currentKey = selectedDate ? dateKey(selectedDate) : "";
  const currentTasks = tasksMap[currentKey] || [];

  const addTask = useCallback(() => {
    const text = newTaskText.trim();
    if (!text || !selectedDate) return;
    const key = dateKey(selectedDate);
    setTasksMap(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), { id: crypto.randomUUID(), text, done: false }],
    }));
    setNewTaskText("");
  }, [newTaskText, selectedDate]);

  const toggleTask = useCallback((taskId: string) => {
    if (!selectedDate) return;
    const key = dateKey(selectedDate);
    setTasksMap(prev => ({
      ...prev,
      [key]: (prev[key] || []).map(t => t.id === taskId ? { ...t, done: !t.done } : t),
    }));
  }, [selectedDate]);

  const deleteTask = useCallback((taskId: string) => {
    if (!selectedDate) return;
    const key = dateKey(selectedDate);
    setTasksMap(prev => ({
      ...prev,
      [key]: (prev[key] || []).filter(t => t.id !== taskId),
    }));
  }, [selectedDate]);

  const handlePrevDate = () => {
    if (selectedDate) {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() - 1);
      setSelectedDate(d);
      setNewTaskText("");
    }
  };

  const handleNextDate = () => {
    if (selectedDate) {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() + 1);
      setSelectedDate(d);
      setNewTaskText("");
    }
  };

  // Check if a date has tasks (for dots on calendar)
  const hasTasksForDate = (date: Date) => {
    const key = dateKey(date);
    return (tasksMap[key] || []).length > 0;
  };

  // Notes mode
  if (notesMode && selectedDate) {
    return (
      <div className="bg-card rounded-2xl p-5 border border-border opacity-0 animate-fade-in" style={{ animationDelay: "350ms", animationFillMode: "forwards" }}>
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => setNotesMode(false)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="h-4 w-4 text-muted-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">{formatFullDate(selectedDate)}</span>
          </div>
        </div>

        {/* Tasks list */}
        <div className="space-y-2 mb-4 max-h-[220px] overflow-y-auto pr-1">
          {currentTasks.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">Нет задач на эту дату</p>
          )}
          {currentTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-muted/30 border border-border/50 group"
            >
              <button
                onClick={() => toggleTask(task.id)}
                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                  task.done
                    ? "bg-primary border-primary"
                    : "border-primary/40 hover:border-primary"
                }`}
              >
                {task.done && <Check className="h-3 w-3 text-primary-foreground" />}
              </button>
              <span className={`text-sm flex-1 ${task.done ? "line-through text-muted-foreground" : ""}`}>
                {task.text}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 transition-all"
              >
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
              </button>
            </div>
          ))}
        </div>

        {/* Add task input */}
        <div className="flex items-center gap-2 mb-4">
          <Input
            placeholder="Новая задача..."
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            className="h-9 text-sm bg-muted/50"
          />
          <button
            onClick={addTask}
            disabled={!newTaskText.trim()}
            className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 transition-colors flex-shrink-0"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Date nav */}
        <div className="flex items-center justify-center gap-4">
          <button onClick={handlePrevDate} className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs text-muted-foreground">Листать задачи</span>
          <button onClick={handleNextDate} className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // Calendar mode
  return (
    <div className="bg-card rounded-2xl p-5 border border-border opacity-0 animate-fade-in" style={{ animationDelay: "350ms", animationFillMode: "forwards" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm">Календарь</h3>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mb-4">
        <button onClick={goToPrevMonth} className="p-1.5 rounded-full bg-foreground text-background hover:opacity-80 transition-opacity">
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
        <span className="text-sm font-medium min-w-[130px] text-center">
          {MONTHS_RU[currentMonth]} {currentYear}
        </span>
        <button onClick={goToNextMonth} className="p-1.5 rounded-full bg-foreground text-background hover:opacity-80 transition-opacity">
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {DAYS_RU.map((d) => (
          <div key={d} className="text-center text-[10px] font-medium text-muted-foreground py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {calendarDays.map((item, i) => {
          const isToday = isSameDay(item.date, today);
          const hasTasks = hasTasksForDate(item.date);
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
              {hasTasks && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
