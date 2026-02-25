import { useState, useMemo, useRef, useEffect } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { products } from "@/data/warehouseMockData";
import { TrendingUp, TrendingDown } from "lucide-react";

// ---------- types ----------
type SortDir = "asc" | "desc";
type SortKey = "name" | "remaining" | "remaining_pct" | "reserved" | "inTransit" | "daysLeft" | "salesPerDay" | "riskScore" | "warehouse" | "category";

const parseExpire = (d: number) => d;

function getRemainingBarColor(ratio: number) {
  if (ratio <= 0.15) return "hsl(0, 72%, 51%)";
  if (ratio <= 0.35) return "hsl(35, 92%, 50%)";
  return "hsl(142, 71%, 45%)";
}

function getRiskColor(score: number) {
  if (score >= 70) return "text-destructive bg-destructive/10";
  if (score >= 40) return "text-orange-500 bg-orange-500/10";
  return "text-green-500 bg-green-500/10";
}

function getRiskLabel(score: number) {
  if (score >= 70) return "▲";
  if (score >= 40) return "—";
  return "▼";
}

// ---------- dropdown ----------
function CategoryDropdown({ categories, selected, onSelect }: { categories: string[]; selected: string; onSelect: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(o => !o)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-sm text-foreground hover:border-primary/30 transition-colors">
        {selected === "all" ? "Все категории" : selected}
        <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 min-w-[180px] bg-popover border border-border rounded-lg shadow-lg py-1">
          <button onClick={() => { onSelect("all"); setOpen(false); }} className={cn("w-full text-left px-3 py-2 text-sm hover:bg-muted", selected === "all" && "text-primary font-medium")}>Все категории</button>
          {categories.map(c => (
            <button key={c} onClick={() => { onSelect(c); setOpen(false); }} className={cn("w-full text-left px-3 py-2 text-sm hover:bg-muted", selected === c && "text-primary font-medium")}>{c}</button>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- tooltip ----------
function ProductTooltipContent({ product }: { product: typeof products[0] }) {
  return (
    <div className="bg-popover border border-border rounded-lg p-3 shadow-xl text-xs max-w-[240px]">
      <p className="font-bold text-foreground mb-1">{product.name}</p>
      <p className="text-muted-foreground">Категория: {product.category}</p>
      <p className="text-muted-foreground">Цена: {product.price.toLocaleString()} ₽</p>
      <p className="text-muted-foreground">Склад: {product.warehouse}</p>
      <p className="text-muted-foreground">ABC: {product.abcGroup}</p>
      <p className="text-muted-foreground">Выкуп: {product.buyoutRate}%</p>
      <p className="text-muted-foreground">Оборачиваемость: {product.turnoverDays} дн.</p>
    </div>
  );
}

// ---------- column config ----------
const columns: { key: SortKey; label: string; group?: string; align?: "left" | "right" }[] = [
  { key: "name", label: "SKU", group: "", align: "left" },
  { key: "remaining", label: "Остаток", group: "Inventory", align: "right" },
  { key: "reserved", label: "Зарезерв.", group: "Inventory", align: "right" },
  { key: "inTransit", label: "В пути", group: "Inventory", align: "right" },
  { key: "daysLeft", label: "Дней до конца", group: "Health & Risk", align: "right" },
  { key: "salesPerDay", label: "Продажи/день", group: "Health & Risk", align: "right" },
  { key: "riskScore", label: "Риск", group: "Health & Risk", align: "right" },
  { key: "warehouse", label: "Склад", group: "", align: "right" },
];

// ---------- main ----------
export function WarehouseStorageTable() {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const categories = useMemo(() => Array.from(new Set(products.map(p => p.category))).sort(), []);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const filtered = useMemo(() => selectedCategory === "all" ? products : products.filter(p => p.category === selectedCategory), [selectedCategory]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "name": cmp = a.name.localeCompare(b.name, "ru"); break;
        case "remaining": cmp = a.remaining - b.remaining; break;
        case "reserved": cmp = a.reserved - b.reserved; break;
        case "inTransit": cmp = a.inTransit - b.inTransit; break;
        case "daysLeft": cmp = a.daysLeft - b.daysLeft; break;
        case "salesPerDay": cmp = a.salesPerDay - b.salesPerDay; break;
        case "riskScore": cmp = a.riskScore - b.riskScore; break;
        case "warehouse": cmp = a.warehouse.localeCompare(b.warehouse, "ru"); break;
        default: break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [sortKey, sortDir, filtered]);

  const SortIcon = ({ colKey }: { colKey: SortKey }) => {
    if (sortKey !== colKey) return <ArrowUpDown className="h-3 w-3 opacity-30" />;
    return sortDir === "asc" ? <ArrowUp className="h-3 w-3 text-primary" /> : <ArrowDown className="h-3 w-3 text-primary" />;
  };

  // Summary
  const totalRemaining = sorted.reduce((s, p) => s + p.remaining, 0);
  const totalReserved = sorted.reduce((s, p) => s + p.reserved, 0);
  const totalInTransit = sorted.reduce((s, p) => s + p.inTransit, 0);
  const avgSalesDay = (sorted.reduce((s, p) => s + p.salesPerDay, 0) / (sorted.length || 1)).toFixed(1);
  const avgRisk = Math.round(sorted.reduce((s, p) => s + p.riskScore, 0) / (sorted.length || 1));

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-5 pb-0">
        <div>
          <h3 className="font-semibold text-foreground text-lg">Состояние запасов</h3>
          <p className="text-xs text-muted-foreground">Детальная информация по каждому товару</p>
        </div>
        <CategoryDropdown categories={categories} selected={selectedCategory} onSelect={setSelectedCategory} />
      </div>

      {/* Summary cards */}
      <div className="flex gap-3 p-5 pb-3 overflow-x-auto">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 min-w-fit">
          <span className="text-green-600 font-bold text-sm">📦 {totalRemaining.toLocaleString()} шт.</span>
          <div className="w-16 h-2 bg-green-200 rounded-full overflow-hidden"><div className="h-full bg-green-500 rounded-full" style={{ width: "65%" }} /></div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 min-w-fit">
          <span className="text-blue-600 font-bold text-sm">🔒 {totalReserved.toLocaleString()} шт.</span>
          <div className="w-16 h-2 bg-blue-200 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full" style={{ width: "45%" }} /></div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/10 min-w-fit">
          <span className="text-orange-600 font-bold text-sm">🚛 {totalInTransit} шт.</span>
          <div className="w-16 h-2 bg-orange-200 rounded-full overflow-hidden"><div className="h-full bg-orange-500 rounded-full" style={{ width: "30%" }} /></div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-destructive/10 min-w-fit">
          <span className="text-destructive font-bold text-sm">⚠ Ср. риск {avgRisk}%</span>
        </div>
      </div>

      {/* Column groups */}
      <div className="px-5">
        <div className="overflow-x-auto" style={{ maxHeight: 520 }}>
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-card z-10">
              {/* Group row */}
              <tr className="border-b border-border/60">
                <th className="w-[180px]"></th>
                <th colSpan={3} className="text-center text-xs font-bold text-foreground pb-1 pt-3 border-x border-border/30">Inventory</th>
                <th colSpan={3} className="text-center text-xs font-bold text-foreground pb-1 pt-3 border-r border-border/30">Health & Risk</th>
                <th></th>
              </tr>
              {/* Column headers */}
              <tr className="border-b-2 border-border">
                {columns.map(col => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className={cn(
                      "pb-3 pt-2 px-2 font-medium text-xs text-muted-foreground whitespace-nowrap cursor-pointer hover:text-foreground select-none transition-colors",
                      col.align === "right" ? "text-right" : "text-left",
                    )}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      <SortIcon colKey={col.key} />
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((p, idx) => {
                const remainPct = Math.min(100, Math.round((p.remaining / (p.remaining + p.reserved + p.inTransit || 1)) * 100));
                return (
                  <tr
                    key={p.id}
                    className={cn(
                      "border-b border-border/30 transition-colors",
                      idx % 2 === 0 ? "bg-card" : "bg-muted/15",
                      "hover:bg-accent/30",
                    )}
                    onMouseEnter={() => setHoveredId(p.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    {/* SKU */}
                    <td className="py-3 px-2 relative">
                      <span className="font-medium text-foreground">{p.name}</span>
                      {hoveredId === p.id && (
                        <div className="absolute left-0 top-full z-50">
                          <ProductTooltipContent product={p} />
                        </div>
                      )}
                    </td>
                    {/* Остаток */}
                    <td className="py-3 px-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className={cn("font-semibold", p.remaining < 30 ? "text-destructive" : "text-foreground")}>{p.remaining}</span>
                        <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${remainPct}%`, backgroundColor: getRemainingBarColor(remainPct / 100) }} />
                        </div>
                      </div>
                    </td>
                    {/* Зарезерв */}
                    <td className="py-3 px-2 text-right text-muted-foreground">{p.reserved}</td>
                    {/* В пути */}
                    <td className="py-3 px-2 text-right">
                      {p.inTransit > 0 ? (
                        <span className="text-foreground">{p.inTransit} 📦</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    {/* Дней до конца */}
                    <td className="py-3 px-2 text-right">
                      <span className={cn(
                        "text-xs font-semibold px-2 py-0.5 rounded-full",
                        p.daysLeft <= 7 ? "bg-destructive/10 text-destructive" :
                        p.daysLeft <= 21 ? "bg-orange-500/10 text-orange-500" :
                        "bg-green-500/10 text-green-500"
                      )}>
                        {p.daysLeft <= 7 ? "▲" : p.daysLeft <= 21 ? "—" : "▼"} {p.daysLeft} дн.
                      </span>
                    </td>
                    {/* Продажи/день */}
                    <td className="py-3 px-2 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <span className="font-medium text-foreground">{p.salesPerDay}</span>
                        <div className="flex flex-col gap-px">
                          {/* mini sparkline-like bars */}
                          {[0.6, 0.8, 1, 0.7, 0.9].map((h, i) => (
                            <div key={i} className="w-1 rounded-full bg-primary/40" style={{ height: `${h * 8}px` }} />
                          ))}
                        </div>
                        {p.salesTrend > 0 ? (
                          <TrendingUp className="h-3 w-3 text-green-500" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-destructive" />
                        )}
                        <span className={cn("text-[10px] font-semibold", p.salesTrend > 0 ? "text-green-500" : "text-destructive")}>
                          {p.salesTrend > 0 ? "+" : ""}{p.salesTrend}%
                        </span>
                      </div>
                    </td>
                    {/* Риск */}
                    <td className="py-3 px-2 text-right">
                      <span className={cn("text-xs font-bold px-2 py-1 rounded-lg", getRiskColor(p.riskScore))}>
                        {p.riskScore >= 70 ? "▲" : p.riskScore >= 40 ? "—" : "▼"} {p.riskScore.toFixed(1)}%
                      </span>
                    </td>
                    {/* Склад */}
                    <td className="py-3 px-2 text-right text-xs text-muted-foreground">{p.warehouse}</td>
                  </tr>
                );
              })}
            </tbody>
            {/* Footer totals */}
            <tfoot>
              <tr className="border-t-2 border-border bg-muted/30 font-semibold text-sm">
                <td className="py-3 px-2 text-foreground">Итого ({sorted.length})</td>
                <td className="py-3 px-2 text-right text-foreground">{totalRemaining.toLocaleString()} шт.</td>
                <td className="py-3 px-2 text-right text-foreground">{totalReserved}</td>
                <td className="py-3 px-2 text-right text-foreground">{totalInTransit}</td>
                <td className="py-3 px-2 text-right text-muted-foreground">—</td>
                <td className="py-3 px-2 text-right text-foreground">{avgSalesDay}</td>
                <td className="py-3 px-2 text-right">
                  <span className={cn("text-xs font-bold px-2 py-1 rounded-lg", getRiskColor(avgRisk))}>{avgRisk}%</span>
                </td>
                <td className="py-3 px-2"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <div className="h-3" />
    </div>
  );
}
