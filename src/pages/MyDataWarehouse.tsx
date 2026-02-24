import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { WarehouseHealthTab } from "@/components/warehouse/WarehouseHealthTab";
import { WarehouseEfficiencyTab } from "@/components/warehouse/WarehouseEfficiencyTab";
import { WarehousePlanningTab } from "@/components/warehouse/WarehousePlanningTab";

const tabs = [
  { id: "health", label: "Здоровье склада" },
  { id: "efficiency", label: "Эффективность товаров" },
  { id: "planning", label: "Планирование запасов" },
] as const;

type TabId = typeof tabs[number]["id"];

const MyDataWarehouse = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>("health");

  return (
    <AppLayout>
      <div className="space-y-5 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/my-data")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Мой склад</h1>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 bg-muted p-1 rounded-xl w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "health" && <WarehouseHealthTab />}
        {activeTab === "efficiency" && <WarehouseEfficiencyTab />}
        {activeTab === "planning" && <WarehousePlanningTab />}
      </div>
    </AppLayout>
  );
};

export default MyDataWarehouse;
