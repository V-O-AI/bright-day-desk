import { AppLayout } from "@/components/layout/AppLayout";
import { MessageCircle } from "lucide-react";
import { FinanceMetricCards } from "@/components/charts/FinanceMetricCards";
import { WarehousePieChart } from "@/components/charts/WarehousePieChart";
import { MiniChat } from "@/components/chat/MiniChat";

const Index = () => {
  return (
    <AppLayout>
      {/* Main Grid - 2 колонки, пропорции примерно 60/40 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full">
        
        {/* Левая колонка - 3/5 ширины */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          {/* Блок с 4 карточками метрик - 2x2 */}
          <div 
            className="bg-card rounded-2xl p-6 border border-border opacity-0 animate-fade-in-up transition-all duration-200 hover:shadow-lg hover:shadow-primary/5" 
            style={{ animationDelay: "0ms" }}
          >
            <FinanceMetricCards layout="grid" showFilter={true} />
          </div>

          {/* Блок с менеджером — синхронизированный мини-чат */}
          <div 
            className="bg-card rounded-2xl p-6 border border-border flex-1 flex flex-col opacity-0 animate-fade-in-up transition-all duration-200 hover:shadow-lg hover:shadow-primary/5" 
            style={{ minHeight: "280px", animationDelay: "50ms" }}
          >
            <MiniChat variant="compact" />
          </div>
        </div>

        {/* Правая колонка - 2/5 ширины */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Блок последних чатов */}
          <div 
            className="bg-card rounded-2xl p-6 border border-border opacity-0 animate-fade-in-up transition-all duration-200 hover:shadow-lg hover:shadow-primary/5"
            style={{ animationDelay: "100ms" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Последние 3 чата с клиентами</h3>
              <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm transition-all duration-150 active:scale-[0.97] hover:bg-primary/90">
                <MessageCircle className="h-4 w-4" />
                Chat
              </button>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="font-medium">Никнейм клиента</span>
                  <span className="text-muted-foreground text-sm">Тип пользователя</span>
                  <button className="bg-foreground text-background px-4 py-1 rounded-lg text-sm transition-all duration-150 active:scale-[0.97] hover:opacity-90">
                    кнопка
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Блок данных склада с круговой диаграммой */}
          <div 
            className="bg-card rounded-2xl p-6 border border-border flex-1 opacity-0 animate-fade-in-up transition-all duration-200 hover:shadow-lg hover:shadow-primary/5"
            style={{ animationDelay: "150ms" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Retention</p>
                <h3 className="font-semibold">Данные склада</h3>
                <p className="text-xs text-muted-foreground">Conversion Rate</p>
              </div>
            </div>
            <div className="h-[200px]">
              <WarehousePieChart />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
