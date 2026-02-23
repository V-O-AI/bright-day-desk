import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MessageCircle } from "lucide-react";
import { TotalBalanceBlock } from "@/components/charts/TotalBalanceBlock";
import { WarehousePieChart } from "@/components/charts/WarehousePieChart";
import { MiniChat } from "@/components/chat/MiniChat";
import { useLatestClientChats } from "@/hooks/useClientChats";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { MetricPeriod } from "@/hooks/useFinancialMetrics";
import { PreviewCard } from "@/components/dashboard/PreviewCard";
import { OnboardingModal } from "@/components/dashboard/OnboardingModal";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  const { data: clientChats, isLoading: chatsLoading } = useLatestClientChats(3);
  const [period, setPeriod] = useState<MetricPeriod>("month");
  const [modalOpen, setModalOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(false);

  // Check if user is authenticated (connected)
  useEffect(() => {
    const saved = localStorage.getItem("onboarding_done");
    if (saved === "true") {
      setOnboardingDone(true);
      setIsConnected(true);
    }
    supabase.auth.getSession().then(({ data }) => {
      if (data.session && saved === "true") setIsConnected(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && onboardingDone) setIsConnected(true);
    });
    return () => subscription.unsubscribe();
  }, [onboardingDone]);

  const handleOnboardingComplete = () => {
    localStorage.setItem("onboarding_done", "true");
    setOnboardingDone(true);
    setIsConnected(true);
  };

  const handleBlockClick = () => {
    if (!isConnected) {
      setModalOpen(true);
    }
  };

  // Empty state — user not connected
  if (!isConnected) {
    return (
      <AppLayout>
        <OnboardingModal open={modalOpen} onOpenChange={setModalOpen} onComplete={handleOnboardingComplete} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6 h-full">
          {/* Left column */}
          <div className="md:col-span-1 lg:col-span-3 flex flex-col gap-3 md:gap-4 lg:gap-6">
            {/* Total Balance Block */}
            <PreviewCard
              className="opacity-0 animate-fade-in-up"
              style={{ animationDelay: "0ms" }}
              onClick={handleBlockClick}
            >
              <div className="p-4 lg:p-6">
                <TotalBalanceBlock
                  period={period}
                  onPeriodChange={setPeriod}
                  showPeriodSelector
                  compact
                />
              </div>
            </PreviewCard>

            {/* Mini chat */}
            <PreviewCard
              className="flex-1 opacity-0 animate-fade-in-up"
              style={{ minHeight: "180px", animationDelay: "50ms" }}
              onClick={handleBlockClick}
            >
              <div className="p-4 lg:p-6 flex flex-col" style={{ minHeight: "280px" }}>
                <MiniChat variant="compact" />
              </div>
            </PreviewCard>
          </div>

          {/* Right column */}
          <div className="md:col-span-1 lg:col-span-2 flex flex-col gap-3 md:gap-4 lg:gap-6">
            {/* Latest chats */}
            <PreviewCard
              className="opacity-0 animate-fade-in-up"
              style={{ animationDelay: "100ms" }}
              onClick={handleBlockClick}
            >
              <div className="p-4 lg:p-6">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <h3 className="font-semibold text-sm md:text-base">Последние чаты</h3>
                  <div className="flex items-center gap-1.5 md:gap-2 bg-primary text-primary-foreground px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm">
                    <MessageCircle className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    Chat
                  </div>
                </div>
                <div className="space-y-2 md:space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <span className="font-medium text-sm">Никнейм клиента</span>
                      <span className="text-muted-foreground text-xs">Тип</span>
                      <div className="bg-foreground text-background px-3 py-1 rounded-lg text-xs">
                        Открыть
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </PreviewCard>

            {/* Warehouse chart */}
            <PreviewCard
              className="flex-1 opacity-0 animate-fade-in-up"
              style={{ animationDelay: "150ms" }}
              onClick={handleBlockClick}
            >
              <div className="p-4 lg:p-6 h-full">
                <div className="flex items-center justify-between mb-2 md:mb-3 lg:mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Retention</p>
                    <h3 className="font-semibold text-sm md:text-base">Данные склада</h3>
                    <p className="text-xs text-muted-foreground">Conversion Rate</p>
                  </div>
                </div>
                <div className="h-[200px] md:h-[220px] lg:h-[260px]">
                  <WarehousePieChart enlarged />
                </div>
              </div>
            </PreviewCard>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Connected state — normal dashboard
  return (
    <AppLayout>
      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6 h-full">
        {/* Left column */}
        <div className="md:col-span-1 lg:col-span-3 flex flex-col gap-3 md:gap-4 lg:gap-6">
          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: "0ms" }}>
            <TotalBalanceBlock period={period} onPeriodChange={setPeriod} showPeriodSelector compact />
          </div>
          <div
            className="bg-card rounded-2xl p-4 lg:p-6 border border-border flex-1 flex flex-col opacity-0 animate-fade-in-up transition-all duration-200 hover:shadow-lg hover:shadow-primary/5"
            style={{ minHeight: "180px", animationDelay: "50ms" }}
          >
            <MiniChat variant="compact" />
          </div>
        </div>

        {/* Right column */}
        <div className="md:col-span-1 lg:col-span-2 flex flex-col gap-3 md:gap-4 lg:gap-6">
          <div
            className="bg-card rounded-2xl p-4 lg:p-6 border border-border opacity-0 animate-fade-in-up transition-all duration-200 hover:shadow-lg hover:shadow-primary/5"
            style={{ animationDelay: "100ms" }}
          >
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h3 className="font-semibold text-sm md:text-base">Последние чаты</h3>
              <button
                onClick={() => navigate("/client-chats")}
                className="flex items-center gap-1.5 md:gap-2 bg-primary text-primary-foreground px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm transition-all duration-150 active:scale-[0.97] hover:bg-primary/90"
              >
                <MessageCircle className="h-3.5 w-3.5 md:h-4 md:w-4" />
                Chat
              </button>
            </div>
            <div className="space-y-2 md:space-y-3">
              {chatsLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-11 md:h-12 rounded-lg" />
                ))
              ) : (
                (clientChats || []).map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => navigate(`/client-chats?chatId=${chat.id}&chatName=${encodeURIComponent(chat.client_name)}`, { replace: false })}
                    className="flex items-center py-2 border-b border-border last:border-0 w-full text-left hover:bg-muted/50 rounded-lg px-2 -mx-2 gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className="relative flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                          {chat.client_name.split(" ").map(n => n[0]).join("")}
                        </div>
                        {chat.is_online && (
                          <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-card" />
                        )}
                      </div>
                      <span className="font-medium text-sm truncate">{chat.client_name}</span>
                    </div>
                    <span className="text-muted-foreground text-xs hidden lg:inline flex-shrink-0 text-center min-w-[70px]">{chat.client_type}</span>
                    <div className="bg-foreground text-background px-3 py-1 rounded-lg text-xs hover:opacity-90 flex-shrink-0">
                      Открыть
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          <div
            className="bg-card rounded-2xl p-4 lg:p-6 border border-border flex-1 opacity-0 animate-fade-in-up transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 cursor-pointer"
            style={{ animationDelay: "150ms" }}
            onClick={() => navigate("/my-data/warehouse")}
          >
            <div className="flex items-center justify-between mb-2 md:mb-3 lg:mb-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Retention</p>
                <h3 className="font-semibold text-sm md:text-base">Данные склада</h3>
                <p className="text-xs text-muted-foreground">Conversion Rate</p>
              </div>
            </div>
            <div className="h-[200px] md:h-[220px] lg:h-[260px]">
              <WarehousePieChart enlarged />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
