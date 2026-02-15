import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { WarehousePieChart } from "@/components/charts/WarehousePieChart";
import { WarehouseProductCards } from "@/components/warehouse/WarehouseProductCards";
import { CapacityUsageChart } from "@/components/warehouse/CapacityUsageChart";
import { WarehouseStorageTable } from "@/components/warehouse/WarehouseStorageTable";
import { WarehouseMapBlock, WarehouseMapHeader } from "@/components/warehouse/WarehouseMapBlock";
import { WarehouseActivityLog } from "@/components/warehouse/WarehouseActivityLog";

const MyDataWarehouse = () => {
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
          <h1 className="text-2xl font-bold text-foreground">Мой склад</h1>
        </div>

        {/* Row 1: Product Cards + Capacity Usage */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <WarehouseProductCards />
          </div>
          <div className="lg:col-span-1">
            <CapacityUsageChart />
          </div>
        </div>

        {/* Row 2: Storage Table + Pie Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3">
            <WarehouseStorageTable />
          </div>
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl p-5 border border-border h-full">
              <div className="mb-2">
                <h3 className="font-semibold text-foreground">Распределение по категориям</h3>
                <p className="text-[10px] text-muted-foreground">Нажмите на сектор для детализации</p>
              </div>
              <div className="h-[250px]">
                <WarehousePieChart />
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Warehouse Map + Activity Log */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <WarehouseMapHeader />
            <WarehouseMapBlock />
          </div>
          <div className="lg:col-span-1">
            <WarehouseActivityLog />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default MyDataWarehouse;
