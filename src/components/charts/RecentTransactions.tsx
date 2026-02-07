import { cn } from "@/lib/utils";

interface Transaction {
  description: string;
  category: string;
  categoryColor: string;
  date: string;
  amount: number;
}

const transactions: Transaction[] = [
  { description: "Stripe Payment", category: "Sales", categoryColor: "bg-green-500/10 text-green-600", date: "Jan 24", amount: 1250 },
  { description: "Office Rent", category: "Rent", categoryColor: "bg-amber-500/10 text-amber-600", date: "Jan 23", amount: -2000 },
  { description: "Software Tools", category: "SaaS", categoryColor: "bg-blue-500/10 text-blue-600", date: "Jan 22", amount: -320 },
  { description: "Client Invoice", category: "Sales", categoryColor: "bg-green-500/10 text-green-600", date: "Jan 21", amount: 4500 },
  { description: "Stripe Payment", category: "Sales", categoryColor: "bg-green-500/10 text-green-600", date: "Jan 24", amount: 1250 },
];

function formatAmount(value: number): string {
  const prefix = value >= 0 ? "+" : "-";
  return `${prefix}$${Math.abs(value).toLocaleString("en-US")}`;
}

export function RecentTransactions() {
  return (
    <div className="bg-card rounded-2xl p-6 border border-border h-full flex flex-col">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h3 className="font-semibold text-foreground">Recent Transactions</h3>
          <p className="text-xs text-muted-foreground">Latest income and expenses</p>
        </div>
        <button className="text-xs text-primary hover:underline">See All</button>
      </div>

      <div className="mt-4 flex-1">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-muted-foreground font-medium pb-2 text-xs">Description</th>
              <th className="text-left text-muted-foreground font-medium pb-2 text-xs">Category</th>
              <th className="text-left text-muted-foreground font-medium pb-2 text-xs">Date</th>
              <th className="text-right text-muted-foreground font-medium pb-2 text-xs">Amount</th>
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
  );
}
