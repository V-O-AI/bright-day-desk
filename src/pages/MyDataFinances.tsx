import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TotalBalanceBlock } from "@/components/charts/TotalBalanceBlock";
import { BudgetOverview } from "@/components/charts/BudgetOverview";
import { CashFlowChart } from "@/components/charts/CashFlowChart";
import { RecentTransactions } from "@/components/charts/RecentTransactions";
import { MetricPeriod } from "@/hooks/useFinancialMetrics";

const MyDataFinances = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<MetricPeriod>("month");

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in" style={{ animationFillMode: "forwards" }}>
        {/* Header */}
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

        {/* Top row: Total Balance | Budget Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3">
            <TotalBalanceBlock
              period={period}
              onPeriodChange={setPeriod}
              showPeriodSelector
            />
          </div>
          <div className="lg:col-span-2">
            <BudgetOverview />
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
