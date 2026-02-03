import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MessageCircle } from "lucide-react";
import { CashFlowChart } from "@/components/charts/CashFlowChart";
import { WarehousePieChart } from "@/components/charts/WarehousePieChart";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Index = () => {
  const [showEmptyState, setShowEmptyState] = useState(false);

  return (
    <AppLayout>
      {/* Демо-переключатель для empty state */}
      <div className="flex items-center gap-3 mb-4 p-3 bg-muted/50 rounded-lg border border-border">
        <Switch
          id="empty-state-toggle"
          checked={showEmptyState}
          onCheckedChange={setShowEmptyState}
        />
        <Label htmlFor="empty-state-toggle" className="text-sm cursor-pointer">
          Показать empty state (для демо)
        </Label>
      </div>

      {/* Main Grid - 2 колонки, пропорции примерно 60/40 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full">
        
        {/* Левая колонка - 3/5 ширины */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          {/* Блок графика Cash Flow Trend - уменьшен */}
          <div 
            className="bg-card rounded-2xl p-6 border border-border opacity-0 animate-fade-in-up transition-all duration-200 hover:shadow-lg hover:shadow-primary/5" 
            style={{ minHeight: "200px", animationDelay: "0ms" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Cash Flow Trend</h3>
              <div className="flex gap-4 text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                  Income
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "hsl(330, 80%, 65%)" }}></span>
                  Expense
                </span>
              </div>
              <div className="flex gap-1">
                <button className="px-3 py-1 bg-primary text-primary-foreground rounded-lg text-sm transition-all duration-150 active:scale-[0.97]">1Y</button>
                <button className="px-3 py-1 bg-muted rounded-lg text-sm transition-all duration-150 active:scale-[0.97] hover:bg-muted/80">6M</button>
                <button className="px-3 py-1 bg-muted rounded-lg text-sm transition-all duration-150 active:scale-[0.97] hover:bg-muted/80">1M</button>
              </div>
            </div>
            <div className="h-[140px]">
              <CashFlowChart isEmpty={showEmptyState} />
            </div>
          </div>

          {/* Блок с менеджером - увеличен в 2 раза */}
          <div 
            className="bg-card rounded-2xl p-6 border border-border flex-1 flex flex-col opacity-0 animate-fade-in-up transition-all duration-200 hover:shadow-lg hover:shadow-primary/5" 
            style={{ minHeight: "280px", animationDelay: "50ms" }}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                <span className="text-muted-foreground">👤</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Менеджер Улетс</h4>
                <p className="text-sm text-muted-foreground">Здравствуйте, команда агента готова к заботе о любой услуге!</p>
              </div>
            </div>
            
            {/* Расширенная область истории сообщений */}
            <div className="flex-1 mt-4 overflow-y-auto space-y-3 min-h-[120px]">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex-shrink-0"></div>
                <div className="bg-muted rounded-xl px-4 py-2 text-sm max-w-[80%]">
                  <p className="text-muted-foreground">Добрый день! Чем могу помочь?</p>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <div className="bg-primary/10 rounded-xl px-4 py-2 text-sm max-w-[80%]">
                  <p>Нужно добавить товары на склад</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex-shrink-0"></div>
                <div className="bg-muted rounded-xl px-4 py-2 text-sm max-w-[80%]">
                  <p className="text-muted-foreground">Конечно, напишите какие товары нужно добавить.</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <div className="w-8 h-8 rounded bg-muted"></div>
              <div className="w-8 h-8 rounded bg-muted"></div>
              <div className="w-8 h-8 rounded bg-muted"></div>
              <div className="w-8 h-8 rounded bg-muted"></div>
              <span className="text-muted-foreground">•••</span>
            </div>
            <div className="mt-4">
              <input 
                type="text" 
                placeholder="Добавь 5 футболок на склад..." 
                className="w-full bg-muted rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:outline-none"
              />
            </div>
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
              <WarehousePieChart isEmpty={showEmptyState} />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
