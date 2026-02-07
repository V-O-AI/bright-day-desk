import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { WarehousePieChart } from "@/components/charts/WarehousePieChart";

const MyDataWarehouse = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/my-data")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Мой склад</h1>
            <p className="text-muted-foreground text-sm">Товары и инвентарь</p>
          </div>
        </div>
        
        {/* Interactive Warehouse Pie Chart */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Распределение по категориям</h3>
              <p className="text-xs text-muted-foreground">Нажмите на сектор для детализации</p>
            </div>
          </div>
          <div className="h-[350px]">
            <WarehousePieChart />
          </div>
        </div>

        <div className="flex items-center justify-center h-[300px] border border-dashed border-border rounded-lg">
          <p className="text-muted-foreground">Дополнительный контент склада будет здесь</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default MyDataWarehouse;
