import { AppLayout } from "@/components/layout/AppLayout";
import { MessageCircle } from "lucide-react";

const Index = () => {
  return (
    <AppLayout>
      {/* Main Grid - 2 колонки, пропорции примерно 60/40 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full">
        
        {/* Левая колонка - 3/5 ширины */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          {/* Блок графика Cash Flow Trend */}
          <div className="bg-card rounded-2xl p-6 flex-1 min-h-[300px] border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Cash Flow Trend</h3>
              <div className="flex gap-4 text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-primary"></span>
                  Income
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-pink-400"></span>
                  Expense
                </span>
              </div>
              <div className="flex gap-1">
                <button className="px-3 py-1 bg-primary text-primary-foreground rounded-lg text-sm">1Y</button>
                <button className="px-3 py-1 bg-muted rounded-lg text-sm">6M</button>
                <button className="px-3 py-1 bg-muted rounded-lg text-sm">1Y</button>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              [Блок графика]
            </div>
          </div>

          {/* Блок с менеджером */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">👤</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Менеджер Улетс</h4>
                <p className="text-sm text-muted-foreground">Здравствуйте, команда агента готова к заботе о любой услуге!</p>
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
                className="w-full bg-muted rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </div>

        {/* Правая колонка - 2/5 ширины */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Блок последних чатов */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Последние 3 чата с клиентами</h3>
              <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm">
                <MessageCircle className="h-4 w-4" />
                Chat
              </button>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="font-medium">Никнейм клиента</span>
                  <span className="text-muted-foreground text-sm">Тип пользователя</span>
                  <button className="bg-foreground text-background px-4 py-1 rounded-lg text-sm">
                    кнопка
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Блок данных склада */}
          <div className="bg-card rounded-2xl p-6 border border-border flex-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Retention</p>
                <h3 className="font-semibold">Данные склада</h3>
                <p className="text-xs text-muted-foreground">Conversion Rate</p>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center">
              {/* Placeholder для круговой диаграммы */}
              <div className="w-40 h-40 rounded-full border-8 border-primary relative">
                <div className="absolute inset-2 rounded-full border-8 border-pink-400"></div>
                <div className="absolute inset-4 rounded-full border-8 border-yellow-400"></div>
                <div className="absolute inset-6 rounded-full border-8 border-blue-400"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
