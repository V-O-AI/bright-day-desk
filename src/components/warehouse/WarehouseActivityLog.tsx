import { MoreHorizontal, Package } from "lucide-react";

interface ActivityEntry {
  user: string;
  action: string;
  time: string;
  color: string;
}

const activities: ActivityEntry[] = [
  {
    user: "Leo Fernandez",
    action: "confirmed receipt of 40 units of Winter Jacket Series in Section B3 (Apparel)",
    time: "01:45 PM",
    color: "hsl(var(--primary))",
  },
  {
    user: "Ava Martinez",
    action: "added 25 units of Smart Router Kit to Section A1 (Electronics)",
    time: "09:15 AM",
    color: "hsl(0, 72%, 51%)",
  },
  {
    user: "Oscar Liem",
    action: "dispatched 18 units of Stainless Steel Cookware Set from Section C5 (Home & Kitchen)",
    time: "05:30 PM",
    color: "hsl(var(--primary))",
  },
  {
    user: "Dina Choi",
    action: "created a shipment entry for Brake Pad Sets in Section D2 (Automotive Parts)",
    time: "04:10 PM",
    color: "hsl(0, 72%, 51%)",
  },
];

export function WarehouseActivityLog() {
  return (
    <div className="bg-card rounded-2xl p-5 border border-border h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Warehouse Activity Log</h3>
        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto">
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
    </div>
  );
}
