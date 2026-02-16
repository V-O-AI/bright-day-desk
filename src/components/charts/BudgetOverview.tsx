import { useState } from "react";
import { cn } from "@/lib/utils";
import { WarehouseMoneyPieModal } from "./WarehouseMoneyPieModal";

interface WarehouseItem {
  label: string;
  current: number;
  total: number;
  color: string;
  pctLabel: string;
  status?: string;
  statusColor?: string;
  modalTitle: string;
  modalDescription: string;
  valueMultiplier: number;
}

const warehouseItems: WarehouseItem[] = [
  {
    label: "Стоимость всего склада",
    current: 4200,
    total: 5000,
    color: "hsl(258, 90%, 66%)",
    pctLabel: "от последней закупки",
    status: "Почти достигнут",
    statusColor: "text-amber-500 bg-amber-500/10",
    modalTitle: "Стоимость склада по категориям",
    modalDescription: "Общая стоимость товаров в каждой категории",
    valueMultiplier: 120,
  },
  {
    label: "Потенциальная прибыль склада",
    current: 2300,
    total: 4000,
    color: "hsl(217, 91%, 60%)",
    pctLabel: "осталось с последней закупки",
    status: "В норме",
    statusColor: "text-green-500 bg-green-500/10",
    modalTitle: "Потенциальная прибыль по категориям",
    modalDescription: "За сколько может продаться каждая категория",
    valueMultiplier: 180,
  },
];

function formatCurrency(value: number): string {
  return `$${value.toLocaleString("en-US")}`;
}

export function BudgetOverview() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <div className="bg-card rounded-2xl p-4 md:p-6 border border-border h-full flex flex-col">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h3 className="font-semibold text-foreground">Деньги в складе</h3>
            <p className="text-xs text-muted-foreground">
              Стоимость и потенциальная прибыль
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-5 mt-4 flex-1 justify-center">
          {warehouseItems.map((item, idx) => {
            const pct = Math.round((item.current / item.total) * 100);
            return (
              <div
                key={item.label}
                className="cursor-pointer rounded-xl p-2 -mx-2 transition-colors hover:bg-muted/50"
                onClick={() => setOpenIndex(idx)}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-muted-foreground">
                    {item.label}
                  </span>
                  {item.status && (
                    <span
                      className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-medium",
                        item.statusColor
                      )}
                    >
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
                    style={{
                      width: `${pct}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {pct}% {item.pctLabel}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      {warehouseItems.map((item, idx) => (
        <WarehouseMoneyPieModal
          key={item.label}
          open={openIndex === idx}
          onOpenChange={(v) => {
            if (!v) setOpenIndex(null);
          }}
          title={item.modalTitle}
          description={item.modalDescription}
          valueMultiplier={item.valueMultiplier}
        />
      ))}
    </>
  );
}
