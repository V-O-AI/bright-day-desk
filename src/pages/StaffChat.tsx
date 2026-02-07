import { useState, useRef } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  ChevronDown,
  Paperclip,
  FileText,
  ClipboardList,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { MiniChat, MiniChatHandle } from "@/components/chat/MiniChat";

// Professional hint / quick-action suggestions
const quickActions = [
  {
    id: 1,
    icon: ClipboardList,
    label: "Подготовить отчёт за неделю",
  },
  {
    id: 2,
    icon: TrendingUp,
    label: "Проанализировать продажи",
  },
  {
    id: 3,
    icon: BarChart3,
    label: "Сводка по складу",
  },
];

// Chat history mock
const initialHistory = {
  today: [{ id: "c1", title: "Lovable Функционал Обновлен..." }],
  yesterday: [
    { id: "c2", title: "Данные ДоГода 2026" },
    { id: "c3", title: "Темы курсовых по ООП" },
  ],
  january: [{ id: "c4", title: "Расширение Kilo Code для VS ..." }],
  "2025": [
    { id: "c5", title: "Урок информатики 6 класса по..." },
    { id: "c6", title: "Электрическая Цепь Постоянн..." },
  ],
};

const StaffChat = () => {
  const chatRef = useRef<MiniChatHandle>(null);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const handleQuickAction = (text: string) => {
    chatRef.current?.setInputText(text);
  };

  const handleNewChat = () => {
    setActiveChatId(`new-${Date.now()}`);
  };

  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
  };

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-5rem)] gap-0 -m-6">
        {/* ── Main Chat Area ── */}
        <div className="flex-1 flex flex-col border-r border-border">
          {/* Quick-action hint bar */}
          <div className="flex items-center gap-3 p-4 border-b border-border overflow-x-auto">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action.label)}
                className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium transition-all duration-150 hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm active:scale-[0.97] whitespace-nowrap"
              >
                <action.icon className="h-4 w-4 text-primary flex-shrink-0" />
                <span>{action.label}</span>
              </button>
            ))}
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col p-6 max-w-3xl mx-auto w-full">
            <MiniChat ref={chatRef} variant="full" activeChatId={activeChatId} />
          </div>
        </div>

        {/* ── Right Sidebar ── */}
        <div className="w-72 flex flex-col bg-background">
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-5">
              {/* ─── Data tables section ─── */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Привязать таблицы
                </span>
                <div className="space-y-1">
                  <button className="flex items-center gap-2.5 w-full rounded-lg px-3 py-2 text-sm hover:bg-muted/60 transition-colors text-left">
                    <Paperclip className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>Данные о складе</span>
                  </button>
                  <button className="flex items-center gap-2.5 w-full rounded-lg px-3 py-2 text-sm hover:bg-muted/60 transition-colors text-left">
                    <Paperclip className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>Данные о финансах</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Актуальные таблицы
                </span>
                <div className="space-y-1">
                  <button className="flex items-center gap-2.5 w-full rounded-lg px-3 py-2 text-sm hover:bg-muted/60 transition-colors text-left">
                    <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span>Обновлённые данные о складе</span>
                  </button>
                  <button className="flex items-center gap-2.5 w-full rounded-lg px-3 py-2 text-sm hover:bg-muted/60 transition-colors text-left">
                    <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span>Финансовые операции за день</span>
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-border" />

              {/* New Chat Button */}
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={handleNewChat}
              >
                <Plus className="h-4 w-4" />
                Новый чат
              </Button>

              {/* ─── Chat history ─── */}
              <div>
                <button className="flex items-center justify-between w-full text-sm text-muted-foreground hover:text-foreground transition-colors mb-2">
                  <span>Все чаты</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {/* Today */}
                <div className="py-1.5">
                  <span className="text-xs text-muted-foreground">Сегодня</span>
                  {initialHistory.today.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => handleSelectChat(chat.id)}
                      className={`w-full text-left py-2 px-2 -mx-2 text-sm rounded-lg transition-colors truncate ${
                        activeChatId === chat.id
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-muted/50 hover:text-primary"
                      }`}
                    >
                      {chat.title}
                    </button>
                  ))}
                </div>

                {/* Yesterday */}
                <div className="py-1.5">
                  <span className="text-xs text-muted-foreground">Вчера</span>
                  {initialHistory.yesterday.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => handleSelectChat(chat.id)}
                      className={`w-full text-left py-2 px-2 -mx-2 text-sm rounded-lg transition-colors truncate ${
                        activeChatId === chat.id
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-muted/50 hover:text-primary"
                      }`}
                    >
                      {chat.title}
                    </button>
                  ))}
                </div>

                {/* January */}
                <div className="py-1.5">
                  <span className="text-xs text-muted-foreground">Январь</span>
                  {initialHistory.january.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => handleSelectChat(chat.id)}
                      className={`w-full text-left py-2 px-2 -mx-2 text-sm rounded-lg transition-colors truncate ${
                        activeChatId === chat.id
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-muted/50 hover:text-primary"
                      }`}
                    >
                      {chat.title}
                    </button>
                  ))}
                </div>

                {/* 2025 */}
                <div className="py-1.5">
                  <span className="text-xs text-muted-foreground">2025</span>
                  {initialHistory["2025"].map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => handleSelectChat(chat.id)}
                      className={`w-full text-left py-2 px-2 -mx-2 text-sm rounded-lg transition-colors truncate ${
                        activeChatId === chat.id
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-muted/50 hover:text-primary"
                      }`}
                    >
                      {chat.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </AppLayout>
  );
};

export default StaffChat;
