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
import { cn } from "@/lib/utils";

type FinanceTab = "basic" | "advanced";

const MyDataFinances = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<MetricPeriod>("month");
  const [activeTab, setActiveTab] = useState<FinanceTab>("basic");
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

        {/* Tab switcher */}
        <div className="flex items-center gap-1 border-b border-border overflow-x-auto">
          <button
            onClick={() => setActiveTab("basic")}
            className={cn(
              "px-4 lg:px-5 py-2.5 lg:py-3 text-sm font-medium transition-colors relative whitespace-nowrap",
              activeTab === "basic" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Базовая аналитика
            {activeTab === "basic" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t" />}
          </button>
          <button
            onClick={() => setActiveTab("advanced")}
            className={cn(
              "px-4 lg:px-5 py-2.5 lg:py-3 text-sm font-medium transition-colors relative whitespace-nowrap",
              activeTab === "advanced" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Углублённая аналитика
            {activeTab === "advanced" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t" />}
          </button>
        </div>

        {activeTab === "basic" ? (
          /* Basic: Total Balance + Recent Transactions in one row */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TotalBalanceBlock
              period={period}
              onPeriodChange={setPeriod}
              showPeriodSelector
              compact={isMobile}
            />
            <RecentTransactions />
          </div>
        ) : (
          /* Advanced analytics */
          <div className="space-y-4 md:space-y-6">
            {/* Row 1: Cash Flow Overview — full width */}
            <CashFlowOverview />

            {/* Row 2: SKU Profitability Matrix — full width */}
            <SkuProfitabilityMatrix />

            {/* Row 3: Unit Economics | Where Profit Lost | Budget Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <UnitEconomicsOverview />
              <WhereProfitIsLost />
              <BudgetOverview />
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default MyDataFinances;
