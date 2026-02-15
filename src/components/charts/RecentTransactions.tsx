import { useState } from "react";
import { cn } from "@/lib/utils";
import { TransactionHistoryModal } from "./TransactionHistoryModal";

interface Transaction {
  description: string;
  category: string;
  categoryColor: string;
  date: string;
  amount: number;
}

const transactions: Transaction[] = [
  { description: "Оплата Stripe", category: "Продажи", categoryColor: "bg-green-500/10 text-green-600", date: "24 Янв", amount: 1250 },
  { description: "Аренда офиса", category: "Аренда", categoryColor: "bg-amber-500/10 text-amber-600", date: "23 Янв", amount: -2000 },
  { description: "Подписка SaaS", category: "SaaS", categoryColor: "bg-blue-500/10 text-blue-600", date: "22 Янв", amount: -320 },
  { description: "Счёт клиента", category: "Продажи", categoryColor: "bg-green-500/10 text-green-600", date: "21 Янв", amount: 4500 },
  { description: "Закупка товара", category: "Закупки", categoryColor: "bg-purple-500/10 text-purple-600", date: "20 Янв", amount: -1800 },
];

function formatAmount(value: number): string {
  const prefix = value >= 0 ? "+" : "-";
  return `${prefix}$${Math.abs(value).toLocaleString("en-US")}`;
}

export function RecentTransactions() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div
        className="bg-card rounded-2xl p-6 border border-border h-full flex flex-col cursor-pointer hover:border-primary/30 transition-colors"
        onClick={() => setModalOpen(true)}
      >
        <div className="flex items-center justify-between mb-1">
          <div>
            <h3 className="font-semibold text-foreground">История операций</h3>
            <p className="text-xs text-muted-foreground">Последние доходы и расходы</p>
          </div>
          <button className="text-xs text-primary hover:underline">Все</button>
        </div>

        <div className="mt-4 flex-1">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-muted-foreground font-medium pb-2 text-xs">Название</th>
                <th className="text-left text-muted-foreground font-medium pb-2 text-xs">Категория</th>
                <th className="text-left text-muted-foreground font-medium pb-2 text-xs">Дата</th>
                <th className="text-right text-muted-foreground font-medium pb-2 text-xs">Стоимость</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, i) => (
                <tr key={i} className="border-b border-border/50 last:border-0">
                  <td className="py-2.5 text-foreground font-medium">{tx.description}</td>
                  <td className="py-2.5">
                    <span className={cn("text-xs px-2 py-0.5 rounded-md font-medium", tx.categoryColor)}>
                      {tx.category}
                    </span>
                  </td>
                  <td className="py-2.5 text-muted-foreground">{tx.date}</td>
                  <td className={cn(
                    "py-2.5 text-right font-medium",
                    tx.amount >= 0 ? "text-green-500" : "text-destructive"
                  )}>
                    {formatAmount(tx.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <TransactionHistoryModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}
