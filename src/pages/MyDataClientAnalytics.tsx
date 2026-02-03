import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MyDataClientAnalytics = () => {
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
            <h1 className="text-2xl font-bold text-foreground">Аналитика клиентов</h1>
            <p className="text-muted-foreground text-sm">Поведение и статистика</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center h-[400px] border border-dashed border-border rounded-lg">
          <p className="text-muted-foreground">Контент раздела "Аналитика клиентов" будет здесь</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default MyDataClientAnalytics;
