import { useState } from "react";
import { Filter, ChevronDown, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StorageRow {
  floor: number;
  section: string;
  category: string;
  storageUsed: number;
  percentage: number;
  available: number;
  total: number;
}

const mockData: StorageRow[] = [
  { floor: 1, section: "A1 – A10", category: "Electronics", storageUsed: 80, percentage: 80, available: 20, total: 100 },
  { floor: 2, section: "B1 – B10", category: "Apparel", storageUsed: 60, percentage: 60, available: 40, total: 100 },
  { floor: 1, section: "C1 – C10", category: "Home & Kitchen", storageUsed: 90, percentage: 90, available: 10, total: 100 },
  { floor: 3, section: "D1 – D10", category: "Automotive Parts", storageUsed: 50, percentage: 50, available: 50, total: 100 },
  { floor: 2, section: "E1 – E10", category: "Beauty & Health", storageUsed: 70, percentage: 70, available: 30, total: 100 },
];

const sortOptions = ["Section", "Floor", "Category"];

export function WarehouseStorageTable() {
  const [sortBy, setSortBy] = useState("Section");
  const [sortOpen, setSortOpen] = useState(false);

  return (
    <div className="bg-card rounded-2xl p-5 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Warehouse Storage</h3>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-xs text-muted-foreground border border-border rounded-lg px-3 py-1.5 hover:bg-muted/50 transition-colors">
            <Filter className="h-3 w-3" />
            Filter
          </button>
          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground border border-border rounded-lg px-3 py-1.5 hover:bg-muted/50 transition-colors"
            >
              Sort by: <span className="text-foreground font-medium">{sortBy}</span>
              <ChevronDown className="h-3 w-3" />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg z-10 min-w-[120px]">
                {sortOptions.map((opt) => (
                  <button
                    key={opt}
                    className={cn(
                      "block w-full text-left px-3 py-1.5 text-xs hover:bg-muted/50 transition-colors",
                      sortBy === opt && "text-primary font-medium"
                    )}
                    onClick={() => {
                      setSortBy(opt);
                      setSortOpen(false);
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted-foreground text-xs">
              <th className="text-left pb-3 font-medium">
                <span className="inline-flex items-center gap-1">Floor <ArrowUpDown className="h-3 w-3" /></span>
              </th>
              <th className="text-left pb-3 font-medium">
                <span className="inline-flex items-center gap-1">Section <ArrowUpDown className="h-3 w-3" /></span>
              </th>
              <th className="text-left pb-3 font-medium">
                <span className="inline-flex items-center gap-1">Category <ArrowUpDown className="h-3 w-3" /></span>
              </th>
              <th className="text-left pb-3 font-medium">
                <span className="inline-flex items-center gap-1">Storage Used <ArrowUpDown className="h-3 w-3" /></span>
              </th>
              <th className="text-left pb-3 font-medium">
                <span className="inline-flex items-center gap-1">Percentage <ArrowUpDown className="h-3 w-3" /></span>
              </th>
              <th className="text-left pb-3 font-medium">
                <span className="inline-flex items-center gap-1">Available Space <ArrowUpDown className="h-3 w-3" /></span>
              </th>
            </tr>
          </thead>
          <tbody>
            {mockData.map((row, idx) => (
              <tr key={idx} className="border-t border-border">
                <td className="py-3 text-foreground">{row.floor}</td>
                <td className="py-3 text-foreground">{row.section}</td>
                <td className="py-3 text-foreground">{row.category}</td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${row.percentage}%`,
                          backgroundColor: row.percentage >= 80 ? "hsl(0, 72%, 51%)" : row.percentage >= 60 ? "hsl(0, 72%, 51%)" : "hsl(0, 72%, 60%)",
                        }}
                      />
                    </div>
                  </div>
                </td>
                <td className="py-3 text-foreground">{row.percentage}%</td>
                <td className="py-3 text-muted-foreground">
                  {row.available}<span className="text-muted-foreground/50">/{row.total}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
