import { cn } from "@/lib/utils";

interface BudgetItem {
  label: string;
  current: number;
  total: number;
  color: string;
  status?: string;
  statusColor?: string;
}

const budgetItems: BudgetItem[] = [
  {
    label: "Marketing Budget",
    current: 4200,
    total: 5000,
    color: "hsl(258, 90%, 66%)",
    status: "Almost reached",
    statusColor: "text-amber-500 bg-amber-500/10",
  },
  {
    label: "Operations Budget",
    current: 2300,
    total: 4000,
    color: "hsl(217, 91%, 60%)",
    status: "On track",
    statusColor: "text-green-500 bg-green-500/10",
  },
];

function formatCurrency(value: number): string {
  return `$${value.toLocaleString("en-US")}`;
}

export function BudgetOverview() {
  return (
    <div className="bg-card rounded-2xl p-6 border border-border h-full flex flex-col">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h3 className="font-semibold text-foreground">Budget Overview</h3>
          <p className="text-xs text-muted-foreground">Track your budget utilization</p>
        </div>
        <button className="text-xs text-primary hover:underline">See All</button>
      </div>

      <div className="flex flex-col gap-5 mt-4 flex-1 justify-center">
        {budgetItems.map((item) => {
          const pct = Math.round((item.current / item.total) * 100);
          return (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                {item.status && (
                  <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", item.statusColor)}>
                    {item.status}
                  </span>
                )}
              </div>
              <p className="text-lg font-bold text-foreground mb-1">
                {formatCurrency(item.current)} / {formatCurrency(item.total)}
              </p>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: item.color }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">{pct}% of budget used</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
