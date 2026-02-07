import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Plus, 
  Search, 
  FileText, 
  ChevronDown,
} from "lucide-react";
import { MiniChat } from "@/components/chat/MiniChat";

// Mock data for chat history
const chatHistory = {
  today: [
    { id: 1, title: "Lovable Функционал Обновлен..." },
  ],
  yesterday: [
    { id: 2, title: "Данные ДоГода 2026" },
    { id: 3, title: "Темы курсовых по ООП" },
  ],
  january: [
    { id: 4, title: "Расширение Kilo Code для VS ..." },
  ],
  "2025": [
    { id: 5, title: "Урок информатики 6 класса по..." },
    { id: 6, title: "Электрическая Цепь Постоянн..." },
  ],
};

// Quick action buttons
const quickActions = [
  { id: 1, label: "Кнопка:\nПодготовить отчет за неделю", color: "bg-primary" },
  { id: 2, label: "Подсказка кнопкой, сделай то то и то", color: "bg-muted" },
  { id: 3, label: "Кнопка\nСделать то то и то то", color: "bg-primary" },
];

const StaffChat = () => {
  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-5rem)] gap-0 -m-6">
        {/* Main Chat Area — replaced with synced MiniChat */}
        <div className="flex-1 flex flex-col border-r border-border">
          {/* Quick Actions Bar */}
          <div className="flex items-center gap-3 p-4 border-b border-border overflow-x-auto">
            <div className="flex items-center gap-2 text-xs text-muted-foreground whitespace-nowrap">
              <span className="truncate max-w-[100px]">...от ваш результат...</span>
            </div>
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant={action.color === "bg-primary" ? "default" : "secondary"}
                className="h-auto py-2 px-4 text-xs whitespace-pre-line text-left min-w-[140px]"
              >
                {action.label}
              </Button>
            ))}
          </div>

          {/* Chat area — using shared MiniChat component */}
          <div className="flex-1 flex flex-col p-6 max-w-3xl mx-auto w-full">
            <MiniChat variant="full" />
          </div>
        </div>

        {/* Right Sidebar - Chat History */}
        <div className="w-72 flex flex-col bg-background">
          <div className="p-4 space-y-3">
            {/* New Chat Button */}
            <Button variant="outline" className="w-full justify-start gap-2">
              <Plus className="h-4 w-4" />
              Новый чат
            </Button>

            {/* Search */}
            <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground">
              <Search className="h-4 w-4" />
              Поиск в чатах
            </Button>
          </div>

          {/* Projects Section */}
          <div className="px-4 py-2">
            <button className="flex items-center justify-between w-full text-sm text-muted-foreground hover:text-foreground transition-colors">
              <span>Проекты</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            <Button variant="ghost" className="w-full justify-start gap-2 mt-2 text-sm">
              <FileText className="h-4 w-4" />
              Новый проект
            </Button>
          </div>

          {/* All Chats */}
          <div className="px-4 py-2">
            <button className="flex items-center justify-between w-full text-sm text-muted-foreground hover:text-foreground transition-colors">
              <span>Все чаты</span>
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          <ScrollArea className="flex-1 px-4">
            {/* Today */}
            <div className="py-2">
              <span className="text-xs text-muted-foreground">Сегодня</span>
              {chatHistory.today.map((chat) => (
                <button
                  key={chat.id}
                  className="w-full text-left py-2 text-sm hover:text-primary transition-colors truncate"
                >
                  {chat.title}
                </button>
              ))}
            </div>

            {/* Yesterday */}
            <div className="py-2">
              <span className="text-xs text-muted-foreground">Вчера</span>
              {chatHistory.yesterday.map((chat) => (
                <button
                  key={chat.id}
                  className="w-full text-left py-2 text-sm hover:text-primary transition-colors truncate"
                >
                  {chat.title}
                </button>
              ))}
            </div>

            {/* January */}
            <div className="py-2">
              <span className="text-xs text-muted-foreground">январь</span>
              {chatHistory.january.map((chat) => (
                <button
                  key={chat.id}
                  className="w-full text-left py-2 text-sm hover:text-primary transition-colors truncate"
                >
                  {chat.title}
                </button>
              ))}
            </div>

            {/* 2025 */}
            <div className="py-2">
              <span className="text-xs text-muted-foreground">2025</span>
              {chatHistory["2025"].map((chat) => (
                <button
                  key={chat.id}
                  className="w-full text-left py-2 text-sm hover:text-primary transition-colors truncate"
                >
                  {chat.title}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </AppLayout>
  );
};

export default StaffChat;
