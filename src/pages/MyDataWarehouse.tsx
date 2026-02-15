import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Trash2, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { WarehousePieChart } from "@/components/charts/WarehousePieChart";
import { WarehouseProductCards } from "@/components/warehouse/WarehouseProductCards";
import { WarehouseStorageTable } from "@/components/warehouse/WarehouseStorageTable";
import { WarehouseMapBlock, WarehouseMapHeader } from "@/components/warehouse/WarehouseMapBlock";
import { WarehouseActivityLog } from "@/components/warehouse/WarehouseActivityLog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Warehouse {
  id: string;
  name: string;
}

const MyDataWarehouse = () => {
  const navigate = useNavigate();
  const [warehouses, setWarehouses] = useState<Warehouse[]>([
    { id: "1", name: "Мой склад" },
  ]);
  const [activeWarehouseId, setActiveWarehouseId] = useState("1");
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const activeWarehouse = warehouses.find(w => w.id === activeWarehouseId);

  const handleCreate = () => {
    if (!newName.trim()) return;
    const id = Date.now().toString();
    setWarehouses(prev => [...prev, { id, name: newName.trim() }]);
    setActiveWarehouseId(id);
    setNewName("");
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    if (warehouses.length <= 1) return;
    setWarehouses(prev => prev.filter(w => w.id !== id));
    if (activeWarehouseId === id) {
      setActiveWarehouseId(warehouses.find(w => w.id !== id)?.id || "1");
    }
  };

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
          <h1 className="text-2xl font-bold text-foreground">
            {activeWarehouse?.name || "Мой склад"}
          </h1>

          {/* Warehouse tabs */}
          <div className="flex items-center gap-1 ml-2">
            {warehouses.map(w => (
              <div
                key={w.id}
                className="relative"
                onMouseEnter={() => setHoveredId(w.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <button
                  onClick={() => setActiveWarehouseId(w.id)}
                  className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                    activeWarehouseId === w.id
                      ? "bg-primary text-primary-foreground font-medium"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {w.name}
                </button>
                {hoveredId === w.id && warehouses.length > 1 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(w.id); }}
                    className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground rounded-full p-0.5 shadow-sm hover:scale-110 transition-transform"
                  >
                    <Trash2 className="h-2.5 w-2.5" />
                  </button>
                )}
              </div>
            ))}

            <Popover open={isCreating} onOpenChange={setIsCreating}>
              <PopoverTrigger asChild>
                <button className="p-1.5 rounded-lg bg-muted text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                  <Plus className="h-4 w-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-3" align="start">
                <p className="text-xs font-medium text-foreground mb-2">Новый склад</p>
                <div className="flex gap-2">
                  <Input
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="Название"
                    className="h-8 text-xs"
                    onKeyDown={e => e.key === "Enter" && handleCreate()}
                    autoFocus
                  />
                  <Button size="icon" className="h-8 w-8 shrink-0" onClick={handleCreate} disabled={!newName.trim()}>
                    <Check className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Row 1: Product Cards (full width) */}
        <div>
          <WarehouseProductCards />
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
