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
import { SkuProfitabilityMatrix } from "@/components/charts/SkuProfitabilityMatrix";
import { UnitEconomicsOverview } from "@/components/charts/UnitEconomicsOverview";
import { WhereProfitIsLost } from "@/components/charts/WhereProfitIsLost";
import { CashFlowOverview } from "@/components/charts/CashFlowOverview";

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

        {/* Row 1: Total Balance | Budget Overview | Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <TotalBalanceBlock
            period={period}
            onPeriodChange={setPeriod}
            showPeriodSelector
          />
          <BudgetOverview />
          <RecentTransactions />
        </div>

        {/* Row 2: Cash Flow | Unit Economics | Where Profit Lost */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="h-[380px]">
            <CashFlowChart />
          </div>
          <UnitEconomicsOverview />
          <WhereProfitIsLost />
        </div>

        {/* SKU Profitability Matrix — full width */}
        <SkuProfitabilityMatrix />

        {/* Cash Flow Overview — full width */}
        <CashFlowOverview />
      </div>
    </AppLayout>
  );
};

export default MyDataFinances;
