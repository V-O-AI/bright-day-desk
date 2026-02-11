import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MessageCircle } from "lucide-react";
import { TotalBalanceBlock } from "@/components/charts/TotalBalanceBlock";
import { WarehousePieChart } from "@/components/charts/WarehousePieChart";
import { MiniChat } from "@/components/chat/MiniChat";
import { useLatestClientChats } from "@/hooks/useClientChats";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { MetricPeriod } from "@/hooks/useFinancialMetrics";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const navigate = useNavigate();
  const { data: clientChats, isLoading: chatsLoading } = useLatestClientChats(3);
  const [period, setPeriod] = useState<MetricPeriod>("month");
  const isMobile = useIsMobile();

  return (
    <AppLayout>
      {/* Main Grid - Responsive from mobile to 4K */}
      <div className="grid grid-cols-1 lg:grid-cols-5 desktop:grid-cols-5 3xl:grid-cols-12 gap-4 xs:gap-5 md:gap-6 h-full">
        
        {/* Left column - Main content */}
        <div className="col-span-1 lg:col-span-3 desktop:col-span-3 3xl:col-span-7 flex flex-col gap-4 xs:gap-5 md:gap-6">
          
          {/* Total Balance Block — full version with period selector */}
          <div 
            className="opacity-0 animate-fade-in-up" 
            style={{ animationDelay: "0ms" }}
          >
            <TotalBalanceBlock
              period={period}
              onPeriodChange={setPeriod}
              showPeriodSelector
              compact={isMobile}
            />
          </div>

          {/* Mini chat - Responsive height */}
          <div 
            className="bg-card rounded-xl xs:rounded-2xl p-4 xs:p-5 md:p-6 border border-border flex-1 flex flex-col opacity-0 animate-fade-in-up transition-all duration-200 hover:shadow-lg hover:shadow-primary/5" 
            style={{ 
              minHeight: isMobile ? "240px" : "280px",
              animationDelay: "50ms" 
            }}
          >
            <MiniChat variant="compact" />
          </div>
        </div>

        {/* Right column - Secondary content */}
        <div className="col-span-1 lg:col-span-2 desktop:col-span-2 3xl:col-span-5 flex flex-col gap-4 xs:gap-5 md:gap-6">
          
          {/* Latest chats - Responsive card */}
          <div 
            className="bg-card rounded-xl xs:rounded-2xl p-4 xs:p-5 md:p-6 border border-border opacity-0 animate-fade-in-up transition-all duration-200 hover:shadow-lg hover:shadow-primary/5"
            style={{ animationDelay: "100ms" }}
          >
            <div className="flex items-center justify-between mb-3 xs:mb-4">
              <h3 className="font-semibold text-sm xs:text-base">
                {isMobile ? "Последние чаты" : "Последние 3 чата с клиентами"}
              </h3>
              <button 
                onClick={() => navigate("/client-chats")}
                className="flex items-center gap-1.5 xs:gap-2 bg-primary text-primary-foreground px-3 xs:px-4 py-1.5 xs:py-2 rounded-full text-xs xs:text-sm transition-all duration-150 active:scale-[0.97] hover:bg-primary/90"
              >
                <MessageCircle className="h-3.5 w-3.5 xs:h-4 xs:w-4" />
                <span className="hidden xs:inline">Chat</span>
              </button>
            </div>
            <div className="space-y-2 xs:space-y-3">
              {chatsLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 xs:h-12 rounded-lg" />
                ))
              ) : (
                (clientChats || []).map((chat) => (
                   <button
                    key={chat.id}
                    onClick={() => navigate(`/client-chats?chatId=${chat.id}&chatName=${encodeURIComponent(chat.client_name)}`, { replace: false })}
                    className="flex items-center justify-between py-1.5 xs:py-2 border-b border-border last:border-0 w-full text-left hover:bg-muted/50 rounded-lg px-2 -mx-2"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className="relative flex-shrink-0">
                        <div className="w-7 h-7 xs:w-8 xs:h-8 rounded-full bg-muted flex items-center justify-center text-[10px] xs:text-xs font-medium text-muted-foreground">
                          {chat.client_name.split(" ").map(n => n[0]).join("")}
                        </div>
                        {chat.is_online && (
                          <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 xs:h-2.5 xs:w-2.5 rounded-full bg-green-500 border-2 border-card" />
                        )}
                      </div>
                      <span className="font-medium text-xs xs:text-sm truncate">{chat.client_name}</span>
                    </div>
                    <span className="text-muted-foreground text-[10px] xs:text-xs hidden sm:block flex-shrink-0 mx-2">{chat.client_type}</span>
                    <div className="bg-foreground text-background px-2 xs:px-3 py-0.5 xs:py-1 rounded-lg text-[10px] xs:text-xs hover:opacity-90 flex-shrink-0">
                      {isMobile ? "→" : "Открыть"}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Warehouse chart - Responsive dimensions */}
          <div 
            className="bg-card rounded-xl xs:rounded-2xl p-4 xs:p-5 md:p-6 border border-border flex-1 opacity-0 animate-fade-in-up transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 cursor-pointer"
            style={{ animationDelay: "150ms" }}
            onClick={() => navigate("/my-data/warehouse")}
          >
            <div className="flex items-center justify-between mb-3 xs:mb-4">
              <div>
                <p className="text-[10px] xs:text-xs text-muted-foreground mb-0.5 xs:mb-1">Retention</p>
                <h3 className="font-semibold text-sm xs:text-base">Данные склада</h3>
                <p className="text-[10px] xs:text-xs text-muted-foreground">Conversion Rate</p>
              </div>
            </div>
            {/* Responsive chart height */}
            <div className="h-[200px] xs:h-[220px] md:h-[260px] lg:h-[240px] desktop:h-[260px] 3xl:h-[300px]">
              <WarehousePieChart enlarged={!isMobile} />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
