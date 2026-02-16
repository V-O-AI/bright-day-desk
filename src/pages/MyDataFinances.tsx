import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TotalBalanceBlock } from "@/components/charts/TotalBalanceBlock";
import { BudgetOverview } from "@/components/charts/BudgetOverview";
import { RecentTransactions } from "@/components/charts/RecentTransactions";
import { MetricPeriod } from "@/hooks/useFinancialMetrics";
import { SkuProfitabilityMatrix } from "@/components/charts/SkuProfitabilityMatrix";
import { UnitEconomicsOverview } from "@/components/charts/UnitEconomicsOverview";
import { WhereProfitIsLost } from "@/components/charts/WhereProfitIsLost";
import { CashFlowOverview } from "@/components/charts/CashFlowOverview";
import { useIsMobile } from "@/hooks/use-mobile";

const MyDataFinances = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<MetricPeriod>("month");
  const isMobile = useIsMobile(768);

  return (
    <AppLayout>
      <div className="space-y-4 md:space-y-6 animate-fade-in" style={{ animationFillMode: "forwards" }}>
        {/* Header */}
        <div className="flex items-center gap-3 md:gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/my-data")}
            className="h-8 w-8 md:h-10 md:w-10"
          >
            <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Финансы</h1>
            <p className="text-muted-foreground text-xs md:text-sm">Доходы, расходы и прибыль</p>
          </div>
        </div>

        {/* Row 1: Total Balance + Budget Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4">
          <TotalBalanceBlock
            period={period}
            onPeriodChange={setPeriod}
            showPeriodSelector
            compact={isMobile}
          />
          <BudgetOverview />
        </div>

        {/* Row 2: Unit Economics | Where Profit Lost | Recent Transactions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <UnitEconomicsOverview />
          <WhereProfitIsLost />
          <RecentTransactions />
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
