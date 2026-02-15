import { MoreHorizontal, Package } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ActivityEntry {
  user: string;
  action: string;
  time: string;
  color: string;
}

const activities: ActivityEntry[] = [
  {
    user: "Лео Фернандез",
    action: "подтвердил получение 40 ед. Зимней куртки в Секции B3 (Одежда)",
    time: "13:45",
    color: "hsl(var(--primary))",
  },
  {
    user: "Ава Мартинез",
    action: "добавила 25 ед. Роутера Smart Kit в Секцию A1 (Электроника)",
    time: "09:15",
    color: "hsl(0, 72%, 51%)",
  },
  {
    user: "Оскар Лием",
    action: "отправил 18 ед. Набора посуды из Секции C5 (Дом и кухня)",
    time: "17:30",
    color: "hsl(var(--primary))",
  },
  {
    user: "Дина Чой",
    action: "создала запись отгрузки тормозных колодок в Секции D2 (Автозапчасти)",
    time: "16:10",
    color: "hsl(0, 72%, 51%)",
  },
  {
    user: "Марк Иванов",
    action: "переместил 60 ед. Конструктора из Секции E1 в Секцию E4 (Игрушки)",
    time: "14:20",
    color: "hsl(var(--primary))",
  },
  {
    user: "Елена Козлова",
    action: "списала 5 ед. просроченного крема из Секции F2 (Косметика)",
    time: "12:00",
    color: "hsl(0, 72%, 51%)",
  },
  {
    user: "Артём Белов",
    action: "принял поставку 100 ед. кабелей USB-C в Секцию A3 (Электроника)",
    time: "10:45",
    color: "hsl(var(--primary))",
  },
  {
    user: "Наталья Сидорова",
    action: "обновила остатки муки пшеничной в Секции G1 (Продукты)",
    time: "08:30",
    color: "hsl(0, 72%, 51%)",
  },
];

export function WarehouseActivityLog() {
  return (
    <div className="bg-card rounded-2xl p-5 border border-border h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">История закупок</h3>
        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
      </div>

      <ScrollArea className="flex-1 max-h-[280px]">
        <div className="space-y-4 pr-3">
          {activities.map((entry, idx) => (
            <div key={idx} className="flex gap-3">
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ backgroundColor: entry.color + "15" }}
              >
                <Package
                  className="h-4 w-4"
                  style={{ color: entry.color }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground leading-snug">
                  <span className="font-medium" style={{ color: entry.color }}>
                    {entry.user}
                  </span>{" "}
                  {entry.action}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">{entry.time}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
