import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FinanceMetricCards } from "@/components/charts/FinanceMetricCards";
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

          {/* Period filter */}
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

        {/* 4 cards in a row */}
        <FinanceMetricCards layout="row" showFilter={false} externalPeriod={period} />
        
        <div className="flex items-center justify-center h-[300px] border border-dashed border-border rounded-lg">
          <p className="text-muted-foreground">Детальная аналитика финансов будет здесь</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default MyDataFinances;
