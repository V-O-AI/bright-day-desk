import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Plus, 
  Search, 
  FileText, 
  ChevronDown,
  Send
} from "lucide-react";
import { useState } from "react";

// Mock data for chat messages
const mockMessages = [
  {
    id: 1,
    type: "user",
    content: "Внеси этот новый товар 10 штук.",
    avatars: 1,
  },
  {
    id: 2,
    type: "ai",
    content: "Вот ваш результат...",
    avatars: 1,
  },
  {
    id: 3,
    type: "user",
    content: "Добавь столько же того же товара, и дай сводку по финансам, и оценкам клиентов по нему.",
    avatars: 2,
  },
  {
    id: 4,
    type: "ai",
    content: "Вот ваш результат...\n...\n...\n...\n...",
    avatars: 2,
  },
  {
    id: 5,
    type: "user",
    content: "Привет, было продано 10 худи, с принтом. По окончанию добавления дай мне сводку по финансам с обновленными данными.",
    avatars: 1,
  },
  {
    id: 6,
    type: "ai",
    content: "Менеджер Учета делегирует задачу Аналитику Клиентов...\nАналитик Клиентов Провожу сентиментальный анализ...",
    avatars: 3,
  },
];

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

// Avatar component with delegation states
function MessageAvatar({ count }: { count: number }) {
  if (count === 1) {
    return (
      <Avatar className="h-8 w-8 bg-muted">
        <AvatarFallback className="bg-muted" />
      </Avatar>
    );
  }
  
  if (count === 2) {
    return (
      <div className="flex items-center">
        <Avatar className="h-8 w-8 bg-muted">
          <AvatarFallback className="bg-muted" />
        </Avatar>
        <Avatar className="h-6 w-6 bg-muted/60 -ml-2">
          <AvatarFallback className="bg-muted/60" />
        </Avatar>
      </div>
    );
  }
  
  return (
    <div className="flex items-center">
      <Avatar className="h-8 w-8 bg-muted">
        <AvatarFallback className="bg-muted" />
      </Avatar>
      <Avatar className="h-6 w-6 bg-muted/60 -ml-2">
        <AvatarFallback className="bg-muted/60" />
      </Avatar>
      <Avatar className="h-5 w-5 bg-muted/40 -ml-2">
        <AvatarFallback className="bg-muted/40" />
      </Avatar>
    </div>
  );
}

const StaffChat = () => {
  const [message, setMessage] = useState("");

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-5rem)] gap-0 -m-6">
        {/* Main Chat Area */}
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

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6 max-w-3xl mx-auto">
              {mockMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 animate-fade-in ${
                    msg.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.type === "ai" && <MessageAvatar count={msg.avatars} />}
                  <div
                    className={`max-w-md rounded-lg px-4 py-3 ${
                      msg.type === "user"
                        ? "bg-muted text-foreground"
                        : "bg-background border border-border"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{msg.content}</p>
                  </div>
                  {msg.type === "user" && <MessageAvatar count={msg.avatars} />}
                </div>
              ))}

              {/* Delegation indicator */}
              <div className="flex items-center justify-center gap-2 py-4">
                <div className="w-3 h-3 bg-muted-foreground/60 rounded-sm" />
                <div className="w-3 h-3 bg-muted-foreground/60 rounded-sm" />
                <div className="w-3 h-3 bg-muted-foreground/60 rounded-sm" />
                <span className="text-muted-foreground">•••</span>
              </div>
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-2 max-w-3xl mx-auto">
              <div className="flex-1 relative">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Добавь 5 футболок на склад..."
                  className="pr-12 rounded-full bg-muted/50 border-border"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
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
