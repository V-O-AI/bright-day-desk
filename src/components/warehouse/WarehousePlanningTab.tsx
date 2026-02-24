import { useState } from "react";
import { TrendingUp, TrendingDown, Info, MapPin, Package, ChevronRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { cn } from "@/lib/utils";
import { products, warehouses, inTransitOrders, orderHistory } from "@/data/warehouseMockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

function getRiskBadge(score: number) {
  if (score >= 70) return { color: "bg-destructive/10 text-destructive", label: "Высокий" };
  if (score >= 40) return { color: "bg-orange-500/10 text-orange-500", label: "Средний" };
  return { color: "bg-green-500/10 text-green-500", label: "Низкий" };
}

function getRecommendation(p: typeof products[0]) {
  if (p.riskScore >= 80) return { action: "Закупить у поставщика", dateRecommend: "25.02.2026", qty: Math.ceil(p.salesPerDay * 30), arrivalForecast: "05.03.2026" };
  if (p.riskScore >= 50) return { action: "Перераспределить со склада Казань", dateRecommend: "01.03.2026", qty: Math.ceil(p.salesPerDay * 14), arrivalForecast: "08.03.2026" };
  return { action: "Мониторить", dateRecommend: "—", qty: 0, arrivalForecast: "—" };
}

const warehouseColors: Record<string, string> = {
  "Москва": "hsl(217, 71%, 53%)",
  "Казань": "hsl(35, 92%, 50%)",
  "Санкт-Петербург": "hsl(258, 90%, 66%)",
};

function WarehouseDetailModal({ warehouse, open, onClose }: { warehouse: typeof warehouses[0] | null; open: boolean; onClose: () => void }) {
  if (!warehouse) return null;
  const warehouseProducts = products.filter(p => p.warehouse === warehouse.name || (warehouse.name === "Санкт-Петербург" && p.warehouse === "СПб"));
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><MapPin className="h-4 w-4" />{warehouse.name}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-muted/50 rounded-lg p-3"><p className="text-xs text-muted-foreground">Остаток</p><p className="font-bold text-foreground">{warehouse.stock} шт</p></div>
          <div className="bg-muted/50 rounded-lg p-3"><p className="text-xs text-muted-foreground">Продажи/день</p><p className="font-bold text-foreground">{warehouse.salesPerDay}/день</p></div>
          <div className="bg-muted/50 rounded-lg p-3"><p className="text-xs text-muted-foreground">В пути</p><p className="font-bold text-foreground">{warehouse.inTransit} шт</p></div>
          <div className="bg-muted/50 rounded-lg p-3"><p className="text-xs text-muted-foreground">Срок доставки</p><p className="font-bold text-foreground">{warehouse.deliveryDays} дн.</p></div>
        </div>
        <h4 className="font-semibold text-foreground text-sm mb-2">Товары на складе ({warehouseProducts.length})</h4>
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {warehouseProducts.map(p => (
            <div key={p.id} className="flex items-center justify-between py-2 border-b border-border/50 text-sm">
              <div>
                <p className="text-foreground font-medium">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.category} · {p.salesPerDay} шт/день</p>
              </div>
              <div className="text-right">
                <p className="text-foreground font-medium">{p.remaining} шт</p>
                <p className={cn("text-xs", p.daysLeft <= 7 ? "text-destructive" : "text-muted-foreground")}>закон. {p.daysLeft} дн.</p>
              </div>
            </div>
          ))}
          {warehouseProducts.length === 0 && <p className="text-muted-foreground text-sm text-center py-4">Нет товаров</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function WarehousePlanningTab() {
  const [selectedWarehouse, setSelectedWarehouse] = useState<typeof warehouses[0] | null>(null);

  const sortedProducts = [...products].sort((a, b) => b.riskScore - a.riskScore);

  // Mini forecast chart data per warehouse
  const getForecastData = (wh: typeof warehouses[0]) => {
    const days = ["Сегодня", "2д.", "3д.", "4д.", "5д.", "7д."];
    let stock = wh.stock;
    return days.map(d => {
      const val = Math.max(0, stock);
      stock -= wh.salesPerDay * (d === "7д." ? 2 : 1);
      return { day: d, value: val };
    });
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Smart Planning Table */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-foreground mb-1">Умное планирование</h3>
        <p className="text-xs text-muted-foreground mb-4">Рекомендации по закупкам и перемещениям</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground text-xs border-b border-border">
                <th className="text-left pb-3 font-medium">Товар</th>
                <th className="text-right pb-3 font-medium">Остаток</th>
                <th className="text-right pb-3 font-medium">Риск</th>
                <th className="text-left pb-3 font-medium">Рекомендация</th>
                <th className="text-right pb-3 font-medium">Дата / Кол-во</th>
                <th className="text-right pb-3 font-medium">Прогноз прибытия</th>
              </tr>
            </thead>
            <tbody>
              {sortedProducts.map((p) => {
                const rec = getRecommendation(p);
                const risk = getRiskBadge(p.riskScore);
                const endDate = new Date();
                endDate.setDate(endDate.getDate() + p.daysLeft);
                const endStr = `${endDate.getDate().toString().padStart(2, '0')}.${(endDate.getMonth() + 1).toString().padStart(2, '0')}`;
                return (
                  <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 text-foreground font-medium">{p.name}</td>
                    <td className="py-3 text-right">
                      <span className={cn("font-medium", p.remaining < 30 ? "text-destructive" : "text-foreground")}>{p.remaining} шт</span>
                      <p className="text-[10px] text-muted-foreground">{endStr}</p>
                    </td>
                    <td className="py-3 text-right">
                      <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", risk.color)}>{p.riskScore} · {risk.label}</span>
                    </td>
                    <td className="py-3 text-foreground text-xs max-w-[180px]">{rec.action}</td>
                    <td className="py-3 text-right text-xs">
                      {rec.qty > 0 && <><span className="font-medium text-foreground">{rec.dateRecommend}</span><br /><span className="text-muted-foreground">{rec.qty} шт</span></>}
                      {rec.qty === 0 && <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="py-3 text-right text-xs text-muted-foreground">{rec.arrivalForecast}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Warehouse Distribution */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-foreground mb-1">Распределение остатков по складам</h3>
        <p className="text-xs text-muted-foreground mb-4">Кликните на склад для детальной аналитики</p>

        {/* Summary KPIs */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 flex items-center gap-2">
            <Package className="h-5 w-5 text-yellow-600" />
            <div><p className="text-xs text-muted-foreground">SKU</p><p className="text-lg font-bold text-foreground">{products.length}</p></div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            <div><p className="text-xs text-muted-foreground">Всего шт.</p><p className="text-lg font-bold text-foreground">{warehouses.reduce((s, w) => s + w.stock, 0).toLocaleString()}</p></div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 flex items-center gap-2">
            <Package className="h-5 w-5 text-green-600" />
            <div><p className="text-xs text-muted-foreground">Продаж/день</p><p className="text-lg font-bold text-foreground">{warehouses.reduce((s, w) => s + w.salesPerDay, 0)}</p></div>
          </div>
        </div>

        {/* Warehouse Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {warehouses.map((wh) => {
            const color = warehouseColors[wh.name] || "hsl(var(--primary))";
            const forecastData = getForecastData(wh);
            return (
              <div
                key={wh.id}
                onClick={() => setSelectedWarehouse(wh)}
                className="border border-border rounded-xl p-4 cursor-pointer hover:border-primary/40 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" style={{ color }} />
                    <span className="font-semibold text-foreground">{wh.name}</span>
                  </div>
                  <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", wh.deliveryDays <= 5 ? "bg-destructive/10 text-destructive" : wh.deliveryDays <= 10 ? "bg-orange-500/10 text-orange-500" : "bg-green-500/10 text-green-500")}>{wh.deliveryDays} Дней</span>
                </div>

                {/* Fill bar */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${wh.fillPercent}%`, backgroundColor: color }} />
                  </div>
                  <span className="text-xs text-muted-foreground">{wh.fillPercent}%</span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between"><span className="text-muted-foreground">Остаток:</span><span className="text-foreground font-medium">{wh.stock.toLocaleString()} шт.</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Продажи:</span><span className="text-green-500 font-medium">{wh.salesPerDay} / день</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">В пути:</span><span className="text-foreground">{wh.inTransit} шт.</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Прогноз:</span><span className={cn("font-medium", wh.forecast > 0 ? "text-green-500" : "text-destructive")}>{wh.forecast > 0 ? "+" : ""}{wh.forecast} шт.</span></div>
                </div>

                {/* Mini forecast chart */}
                <div className="mt-3 pt-2 border-t border-border/50">
                  <p className={cn("text-xs font-medium mb-1", wh.deliveryDays <= 5 ? "text-destructive" : "text-muted-foreground")}>
                    📦 Закончится за {wh.deliveryDays <= 5 ? wh.deliveryDays : Math.round(wh.stock / wh.salesPerDay)} дней
                  </p>
                  <div className="h-[50px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={forecastData} barSize={12}>
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: "hsl(var(--muted-foreground))" }} />
                        <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                          {forecastData.map((_, i) => (
                            <Cell key={i} fill={color} opacity={1 - i * 0.12} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {wh.deliveryDays <= 5 && (
                  <button className="mt-2 w-full bg-destructive/10 text-destructive text-xs font-medium py-2 rounded-lg hover:bg-destructive/20 transition-colors flex items-center justify-center gap-1">
                    Переместить со склада Казань <ChevronRight className="h-3 w-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom: In-Transit + Order History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* In Transit */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-foreground mb-1">Товары в пути</h3>
          <p className="text-xs text-muted-foreground mb-3">{inTransitOrders.length} активных заказов</p>
          <div className="overflow-x-auto max-h-[350px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card">
                <tr className="text-muted-foreground text-xs border-b border-border">
                  <th className="text-left pb-2 font-medium">Товар</th>
                  <th className="text-right pb-2 font-medium">Кол-во</th>
                  <th className="text-right pb-2 font-medium">Заказан</th>
                  <th className="text-right pb-2 font-medium">Прибытие</th>
                  <th className="text-right pb-2 font-medium">Склад</th>
                </tr>
              </thead>
              <tbody>
                {inTransitOrders.map((o) => (
                  <tr key={o.id} className="border-b border-border/50">
                    <td className="py-2 text-foreground font-medium">{o.product}</td>
                    <td className="py-2 text-right text-foreground">{o.quantity} шт</td>
                    <td className="py-2 text-right text-muted-foreground text-xs">{o.orderedDate}</td>
                    <td className="py-2 text-right text-xs text-foreground">{o.arrivalDate}</td>
                    <td className="py-2 text-right text-xs text-muted-foreground">{o.warehouse}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order History */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-foreground mb-1">История заказов</h3>
          <p className="text-xs text-muted-foreground mb-3">Выполненные поставки</p>
          <div className="overflow-x-auto max-h-[350px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card">
                <tr className="text-muted-foreground text-xs border-b border-border">
                  <th className="text-left pb-2 font-medium">Дата</th>
                  <th className="text-left pb-2 font-medium">Товар</th>
                  <th className="text-right pb-2 font-medium">Кол-во</th>
                  <th className="text-right pb-2 font-medium">Склад</th>
                  <th className="text-right pb-2 font-medium">Прибыл</th>
                </tr>
              </thead>
              <tbody>
                {orderHistory.map((o) => (
                  <tr key={o.id} className="border-b border-border/50">
                    <td className="py-2 text-muted-foreground text-xs">{o.date}</td>
                    <td className="py-2 text-foreground font-medium">{o.product}</td>
                    <td className="py-2 text-right text-foreground">{o.quantity} шт</td>
                    <td className="py-2 text-right text-xs text-muted-foreground">{o.warehouse}</td>
                    <td className="py-2 text-right text-xs text-green-500">{o.arrivedDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <WarehouseDetailModal warehouse={selectedWarehouse} open={!!selectedWarehouse} onClose={() => setSelectedWarehouse(null)} />
    </div>
  );
}
