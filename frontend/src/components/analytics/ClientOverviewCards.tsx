import { Users, UserCheck, UserX, TrendingUp } from "lucide-react";

const metrics = [
  {
    label: "Всего клиентов",
    value: "1 247",
    change: "+12%",
    trend: "up" as const,
    icon: Users,
  },
  {
    label: "Активные",
    value: "943",
    change: "+8%",
    trend: "up" as const,
    icon: UserCheck,
  },
  {
    label: "Отток",
    value: "67",
    change: "-3%",
    trend: "down" as const,
    icon: UserX,
  },
  {
    label: "Конверсия",
    value: "24.8%",
    change: "+2.1%",
    trend: "up" as const,
    icon: TrendingUp,
  },
];

export function ClientOverviewCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="bg-card rounded-2xl p-5 border border-border"
        >
          <div className="flex items-center justify-between mb-3">
            <m.icon className="h-5 w-5 text-muted-foreground" />
            <span
              className={`text-xs font-medium ${
                m.trend === "up"
                  ? "text-emerald-600"
                  : "text-destructive"
              }`}
            >
              {m.change}
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground">{m.value}</p>
          <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
        </div>
      ))}
    </div>
  );
}
