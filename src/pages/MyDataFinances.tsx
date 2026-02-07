import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TotalBalanceBlock } from "@/components/charts/TotalBalanceBlock";
import { BudgetOverview } from "@/components/charts/BudgetOverview";
import { SpendingByCategory } from "@/components/charts/SpendingByCategory";
import { CashFlowChart } from "@/components/charts/CashFlowChart";
import { RecentTransactions } from "@/components/charts/RecentTransactions";
import { MetricPeriod } from "@/hooks/useFinancialMetrics";
import { cn } from "@/lib/utils";

const periodLabels: Record<MetricPeriod, string> = {
  day: "День",
  week: "Неделя",
  month: "Месяц",
};

const MyDataFinances = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<MetricPeriod>("month");

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in" style={{ animationFillMode: "forwards" }}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/my-data")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Финансы</h1>
              <p className="text-muted-foreground text-sm">Доходы, расходы и прибыль</p>
            </div>
          </div>

          <div className="flex gap-1">
            {(Object.keys(periodLabels) as MetricPeriod[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm transition-all duration-150 active:scale-[0.97]",
                  period === p
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                )}
              >
                {periodLabels[p]}
              </button>
            ))}
          </div>
        </div>

        {/* Top row: Total Balance | Budget Overview | Spending by Category */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
          <div className="lg:col-span-3">
            <TotalBalanceBlock period={period} />
          </div>
          <div className="lg:col-span-2">
            <BudgetOverview />
          </div>
          <div className="lg:col-span-1">
            <SpendingByCategory />
          </div>
        </div>

        {/* Bottom row: Cash Flow Trend | Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3 h-[380px]">
            <CashFlowChart />
          </div>
          <div className="lg:col-span-2">
            <RecentTransactions />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default MyDataFinances;
