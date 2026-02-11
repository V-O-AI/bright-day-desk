import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ClientOverviewCards } from "@/components/analytics/ClientOverviewCards";
import { ClientSegmentChart } from "@/components/analytics/ClientSegmentChart";
import { ClientActivityChart } from "@/components/analytics/ClientActivityChart";
import { ClientRetentionChart } from "@/components/analytics/ClientRetentionChart";
import { TopClientsTable } from "@/components/analytics/TopClientsTable";
import { ClientGeographyChart } from "@/components/analytics/ClientGeographyChart";

const MyDataClientAnalytics = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
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
            <h1 className="text-2xl font-bold text-foreground">
              Аналитика клиентов
            </h1>
            <p className="text-muted-foreground text-sm">
              Поведение и статистика
            </p>
          </div>
        </div>

        {/* Overview metric cards */}
        <ClientOverviewCards />

        {/* Row 2: Activity chart + Segment pie */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <ClientActivityChart />
          </div>
          <div className="lg:col-span-1">
            <ClientSegmentChart />
          </div>
        </div>

        {/* Row 3: Retention + Geography */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <ClientRetentionChart />
          </div>
          <div className="lg:col-span-2">
            <TopClientsTable />
          </div>
        </div>

        {/* Row 4: Geography */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <ClientGeographyChart />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default MyDataClientAnalytics;
