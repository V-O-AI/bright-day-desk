import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  X, 
  SlidersHorizontal,
  DollarSign,
  User,
  Tag,
  Calendar,
  TrendingUp,
  ArrowLeft,
  Send,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  Star,
  Clock,
  FileText,
  Home,
  MessageCircle,
  MessagesSquare,
  UserCircle,
  CreditCard,
  Settings,
  HelpCircle
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";

// Mock data for client chats
const mockChats = [
  { id: 1, name: "Andreana Viola", message: "Hi, How are you today?", time: "1m ago", unread: 2, online: true, avatar: "" },
  { id: 2, name: "Михаил Петров", message: "Когда будет доставка?", time: "5m ago", unread: 1, online: false, avatar: "" },
  { id: 3, name: "Елена Сидорова", message: "Спасибо за помощь!", time: "12m ago", unread: 0, online: true, avatar: "" },
  { id: 4, name: "Pablo Martinez", message: "Moved thing. Second third onto...", time: "Just Now", unread: 5, online: false, avatar: "" },
  { id: 5, name: "Алексей Козлов", message: "Хочу оформить заказ", time: "25m ago", unread: 3, online: true, avatar: "" },
  { id: 6, name: "Pink Woman", message: "Yes I'm Really excited", time: "08:50AM", unread: 2, online: true, avatar: "" },
  { id: 7, name: "Ольга Новикова", message: "Есть вопрос по товару", time: "1h ago", unread: 0, online: false, avatar: "" },
  { id: 8, name: "Дмитрий Волков", message: "Можно узнать статус?", time: "2h ago", unread: 1, online: false, avatar: "" },
];

// Mock messages for selected chat
const mockMessages = [
  { id: 1, text: "Said, one let. Morning them, said. So were. Over after image. Given green, after evening won't days set darkness void.", time: "12:45 PM", isOwn: false },
  { id: 2, text: "Hey AAE, I just saw your message right now. so we are going on the trip right?", time: "12:46 PM", isOwn: true },
  { id: 3, text: "Yes I'm Really excited", time: "12:49 PM", isOwn: false },
  { id: 4, text: "Hey AAE, I just saw your message right now.so we are going on the trip right?", time: "12:50 PM", isOwn: true },
  { id: 5, text: "Moved thing.pdf", time: "12:51 PM", isOwn: false, isFile: true },
  { id: 6, text: "Thanks I got it. pack your things we will mouve out early in the morning", time: "12:52 PM", isOwn: true },
];

// Mock attachments
const mockAttachments = [
  { id: 1, type: "image", thumbnail: "🌅" },
  { id: 2, type: "image", thumbnail: "🍕" },
  { id: 3, type: "image", thumbnail: "✈️" },
  { id: 4, type: "image", thumbnail: "🔥" },
  { id: 5, type: "image", thumbnail: "🎵" },
  { id: 6, type: "image", thumbnail: "🎮" },
  { id: 7, type: "image", thumbnail: "📷" },
  { id: 8, type: "image", thumbnail: "🎨" },
];

type FilterCategory = "sales" | "status" | "category" | "date" | "stage";

interface FilterOption {
  id: string;
  label: string;
  category: FilterCategory;
}

const filterCategories: { id: FilterCategory; label: string; icon: React.ElementType }[] = [
  { id: "sales", label: "Продажи", icon: DollarSign },
  { id: "status", label: "Статус клиента", icon: User },
  { id: "category", label: "Категории", icon: Tag },
  { id: "date", label: "Дата последней", icon: Calendar },
  { id: "stage", label: "Этап продажи", icon: TrendingUp },
];

const filterOptions: Record<FilterCategory, FilterOption[]> = {
  sales: [
    { id: "sales_high", label: "Высокие продажи (>$1000)", category: "sales" },
    { id: "sales_medium", label: "Средние ($500-$1000)", category: "sales" },
    { id: "sales_low", label: "Низкие (<$500)", category: "sales" },
  ],
  status: [
    { id: "status_active", label: "Активный", category: "status" },
    { id: "status_inactive", label: "Неактивный", category: "status" },
    { id: "status_new", label: "Новый", category: "status" },
    { id: "status_vip", label: "VIP", category: "status" },
  ],
  category: [
    { id: "cat_retail", label: "Розница", category: "category" },
    { id: "cat_wholesale", label: "Опт", category: "category" },
    { id: "cat_online", label: "Онлайн", category: "category" },
  ],
  date: [
    { id: "date_today", label: "Сегодня", category: "date" },
    { id: "date_week", label: "За неделю", category: "date" },
    { id: "date_month", label: "За месяц", category: "date" },
    { id: "date_quarter", label: "За квартал", category: "date" },
  ],
  stage: [
    { id: "stage_lead", label: "Лид", category: "stage" },
    { id: "stage_negotiation", label: "Переговоры", category: "stage" },
    { id: "stage_deal", label: "Сделка", category: "stage" },
    { id: "stage_repeat", label: "Повторная покупка", category: "stage" },
  ],
};

interface SelectedChat {
  id: number;
  name: string;
  online: boolean;
  avatar: string;
}

// Sidebar navigation items for collapsed view
const sidebarNavItems = [
  { icon: Home, url: "/", label: "Главная" },
  { icon: User, url: "/cabinet", label: "Личный кабинет" },
  { icon: MessageCircle, url: "/staff-chat", label: "Чат с сотрудниками" },
  { icon: MessagesSquare, url: "/client-chats", label: "Чаты клиентов" },
  { icon: UserCircle, url: "/my-data", label: "Мои данные" },
];

const sidebarBottomItems = [
  { icon: CreditCard, url: "/billing", label: "Billing" },
  { icon: Settings, url: "/settings", label: "Settings" },
  { icon: HelpCircle, url: "/help", label: "Help Center" },
];

// Inner component that uses useSidebar - must be rendered inside SidebarProvider
const ClientChatsContent = () => {
  const [activeTab, setActiveTab] = useState<"flows" | "clients" | "direct">("direct");
  const [showFilters, setShowFilters] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState<FilterCategory | null>("sales");
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [salesMin, setSalesMin] = useState("");
  const [salesMax, setSalesMax] = useState("");
  const [avgMin, setAvgMin] = useState("");
  const [avgMax, setAvgMax] = useState("");
  const [selectedChat, setSelectedChat] = useState<SelectedChat | null>(null);
  const [messageInput, setMessageInput] = useState("");
  
  const { setOpen } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();

  // Open specific chat from URL query params (e.g. from dashboard)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const chatId = params.get("chatId");
    const chatName = params.get("chatName");
    if (chatId && chatName) {
      // Find the chat in mockChats or create a temporary entry
      const existingChat = mockChats.find(c => c.id.toString() === chatId || c.name === chatName);
      if (existingChat) {
        setSelectedChat({
          id: existingChat.id,
          name: existingChat.name,
          online: existingChat.online,
          avatar: existingChat.avatar,
        });
      } else {
        setSelectedChat({
          id: parseInt(chatId) || 999,
          name: chatName,
          online: true,
          avatar: "",
        });
      }
    }
  }, [location.search]);

  // Collapse sidebar when chat is selected
  useEffect(() => {
    if (selectedChat) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [selectedChat, setOpen]);

  const toggleFilter = (filterId: string) => {
    setActiveFilters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(filterId)) {
        newSet.delete(filterId);
      } else {
        newSet.add(filterId);
      }
      return newSet;
    });
  };

  const toggleCategory = (categoryId: FilterCategory) => {
    setExpandedCategory(prev => prev === categoryId ? null : categoryId);
  };

  const clearFilters = () => {
    setActiveFilters(new Set());
    setSalesMin("");
    setSalesMax("");
    setAvgMin("");
    setAvgMax("");
  };

  const hasActiveFiltersInCategory = (categoryId: FilterCategory) => {
    return filterOptions[categoryId].some(opt => activeFilters.has(opt.id));
  };

  const handleSelectChat = (chat: typeof mockChats[0]) => {
    setSelectedChat({
      id: chat.id,
      name: chat.name,
      online: chat.online,
      avatar: chat.avatar
    });
  };

  const handleBackToList = () => {
    setSelectedChat(null);
  };

  // Chat View Mode (when a chat is selected)
  if (selectedChat) {
    return (
      <div className="flex h-[calc(100vh-5rem)] gap-0 animate-fade-in">
        {/* Mini Sidebar with Icons */}
        <div className="w-14 bg-sidebar border-r border-sidebar-border flex flex-col items-center py-4 transition-all duration-300 animate-fade-in">
          {/* Main nav items */}
          <div className="flex-1 flex flex-col items-center gap-1">
            {sidebarNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.url;
              return (
                <button
                  key={item.url}
                  onClick={() => navigate(item.url)}
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200",
                    isActive 
                      ? "bg-sidebar-accent text-primary" 
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                  title={item.label}
                >
                  <Icon className="h-5 w-5" />
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="w-8 h-px bg-sidebar-border my-2" />

          {/* Bottom nav items */}
          <div className="flex flex-col items-center gap-1">
            {sidebarBottomItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.url;
              return (
                <button
                  key={item.url}
                  onClick={() => navigate(item.url)}
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200",
                    isActive 
                      ? "bg-sidebar-accent text-primary" 
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                  title={item.label}
                >
                  <Icon className="h-5 w-5" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Compact Chat List */}
        <div className="w-64 bg-card border-r border-border flex flex-col transition-all duration-300 animate-fade-in">
          {/* Search Header */}
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search in your Inbox"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9 text-sm bg-muted/50"
              />
            </div>
          </div>

          {/* Compact Chat List */}
          <ScrollArea className="flex-1">
            <div className="py-1">
              {mockChats.map((chat, index) => (
                <div
                  key={chat.id}
                  onClick={() => handleSelectChat(chat)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-all duration-200",
                    selectedChat.id === chat.id 
                      ? "bg-primary/10 border-l-2 border-primary" 
                      : "hover:bg-muted/50"
                  )}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="relative flex-shrink-0">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={chat.avatar} />
                      <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                        {chat.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    {chat.online && (
                      <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-card" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-medium text-foreground text-sm truncate">{chat.name}</span>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">{chat.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{chat.message}</p>
                  </div>

                  {chat.unread > 0 && (
                    <Badge className="bg-primary text-primary-foreground h-5 min-w-5 flex items-center justify-center rounded-full text-[10px]">
                      {chat.unread}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Dialog Area */}
        <div className="flex-1 flex flex-col bg-background transition-all duration-300">
          {/* Chat Header */}
          <div className="h-14 px-4 border-b border-border flex items-center justify-between bg-card">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 mr-1"
                onClick={handleBackToList}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Avatar className="h-9 w-9">
                <AvatarImage src={selectedChat.avatar} />
                <AvatarFallback className="bg-primary/20 text-primary text-sm">
                  {selectedChat.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-foreground text-sm">{selectedChat.name}</h3>
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Active Now
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4 max-w-3xl mx-auto">
              {mockMessages.map((msg, index) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex items-end gap-2 animate-fade-in",
                    msg.isOwn ? "justify-end" : "justify-start"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {!msg.isOwn && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="bg-primary/20 text-primary text-xs">
                        {selectedChat.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className={cn("max-w-[70%]", msg.isOwn && "order-1")}>
                    <div
                      className={cn(
                        "px-4 py-2.5 rounded-2xl text-sm",
                        msg.isOwn
                          ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-br-md"
                          : "bg-muted text-foreground rounded-bl-md",
                        msg.isFile && "flex items-center gap-2"
                      )}
                    >
                      {msg.isFile && <FileText className="h-4 w-4" />}
                      {msg.text}
                    </div>
                    <p className={cn(
                      "text-[10px] text-muted-foreground mt-1",
                      msg.isOwn ? "text-right" : "text-left"
                    )}>
                      {msg.time}
                    </p>
                  </div>
                  {msg.isOwn && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                        ME
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t border-border bg-card">
            <div className="flex items-center gap-3 max-w-3xl mx-auto">
              <div className="flex-1 relative">
                <Input
                  placeholder="Type your message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="pr-10 h-11 bg-muted/50"
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                >
                  <Paperclip className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
              <Button size="icon" className="h-11 w-11 bg-primary hover:bg-primary/90">
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right Info Panel - max 20% width */}
        <div className="w-[20%] min-w-[200px] max-w-[280px] bg-card border-l border-border flex flex-col transition-all duration-300 animate-fade-in">
          {/* Profile Section */}
          <div className="p-4 flex flex-col items-center border-b border-border">
            <Avatar className="h-20 w-20 mb-3">
              <AvatarImage src={selectedChat.avatar} />
              <AvatarFallback className="bg-primary/20 text-primary text-xl">
                {selectedChat.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-foreground text-center">{selectedChat.name}</h3>
            <p className="text-sm text-green-500">Active Now</p>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2 mt-4">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-muted">
                <Star className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-muted">
                <Clock className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-muted">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-muted">
                <Video className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Attachments Section */}
          <div className="p-4 flex-1">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-foreground">Attachement</h4>
              <Badge variant="secondary" className="h-5 text-xs">9</Badge>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {mockAttachments.map((att, index) => (
                <div 
                  key={att.id}
                  className="aspect-square rounded-lg bg-muted flex items-center justify-center text-2xl hover:bg-muted/80 cursor-pointer transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {att.thumbnail}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default List View (no chat selected)
  return (
    <div className="flex h-[calc(100vh-5rem)] gap-6 animate-fade-in">
      {/* Chat List Section */}
      <div className="flex-1 flex flex-col bg-card rounded-xl border border-border overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold text-foreground">Chat</h1>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Search className="h-4 w-4" />
              </Button>
              <Button size="icon" className="h-9 w-9 bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 bg-muted rounded-full p-1 w-fit">
            <button
              onClick={() => setActiveTab("flows")}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                activeTab === "flows" 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Flows
            </button>
            <button
              onClick={() => setActiveTab("clients")}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                activeTab === "clients" 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Clients
            </button>
            <button
              onClick={() => setActiveTab("direct")}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                activeTab === "direct" 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Direct
              <Badge className="bg-primary text-primary-foreground text-xs h-5 min-w-5 flex items-center justify-center">
                2
              </Badge>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск чатов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Chat List */}
        <ScrollArea className="flex-1">
          <div className="divide-y divide-border">
            {mockChats.map((chat, index) => (
              <div
                key={chat.id}
                onClick={() => handleSelectChat(chat)}
                className="flex items-center gap-3 p-4 hover:bg-muted/50 cursor-pointer transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={chat.avatar} />
                    <AvatarFallback className="bg-muted text-muted-foreground">
                      {chat.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  {chat.online && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-card" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-foreground truncate">{chat.name}</span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{chat.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{chat.message}</p>
                </div>

                {chat.unread > 0 && (
                  <Badge className="bg-destructive text-destructive-foreground h-6 min-w-6 flex items-center justify-center rounded-full text-xs">
                    {chat.unread}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="w-80 bg-card rounded-xl border border-border overflow-hidden animate-fade-in flex flex-col">
          {/* Filter Header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-foreground" />
              <span className="font-semibold text-foreground">Filter</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setShowFilters(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Filter Categories */}
          <div className="p-4 border-b border-border">
            <div className="flex flex-wrap gap-2">
              {filterCategories.map((cat) => {
                const Icon = cat.icon;
                const isActive = expandedCategory === cat.id;
                const hasFilters = hasActiveFiltersInCategory(cat.id);
                
                return (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                      isActive 
                        ? "bg-primary text-primary-foreground" 
                        : hasFilters
                          ? "bg-primary/20 text-primary border border-primary/30"
                          : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filter Options */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-6">
              {/* Sales Range Inputs */}
              {expandedCategory === "sales" && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label className="text-sm font-medium text-primary mb-3 block">Сумма продаж</label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Min: $400"
                          value={salesMin}
                          onChange={(e) => setSalesMin(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                      <span className="text-muted-foreground">—</span>
                      <div className="relative flex-1">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Max: $800"
                          value={salesMax}
                          onChange={(e) => setSalesMax(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-primary mb-3 block">Средняя покупка</label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Min: $400"
                          value={avgMin}
                          onChange={(e) => setAvgMin(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                      <span className="text-muted-foreground">—</span>
                      <div className="relative flex-1">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Max: $800"
                          value={avgMax}
                          onChange={(e) => setAvgMax(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 space-y-2">
                    {filterOptions.sales.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => toggleFilter(option.id)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-lg text-sm transition-all",
                          activeFilters.has(option.id)
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/50 text-foreground hover:bg-muted"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Status Options */}
              {expandedCategory === "status" && (
                <div className="space-y-2 animate-fade-in">
                  <label className="text-sm font-medium text-primary mb-3 block">Статус клиента</label>
                  {filterOptions.status.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => toggleFilter(option.id)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-sm transition-all",
                        activeFilters.has(option.id)
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/50 text-foreground hover:bg-muted"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Category Options */}
              {expandedCategory === "category" && (
                <div className="space-y-2 animate-fade-in">
                  <label className="text-sm font-medium text-primary mb-3 block">Категории</label>
                  {filterOptions.category.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => toggleFilter(option.id)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-sm transition-all",
                        activeFilters.has(option.id)
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/50 text-foreground hover:bg-muted"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Date Options */}
              {expandedCategory === "date" && (
                <div className="space-y-2 animate-fade-in">
                  <label className="text-sm font-medium text-primary mb-3 block">Дата последней активности</label>
                  {filterOptions.date.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => toggleFilter(option.id)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-sm transition-all",
                        activeFilters.has(option.id)
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/50 text-foreground hover:bg-muted"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Stage Options */}
              {expandedCategory === "stage" && (
                <div className="space-y-2 animate-fade-in">
                  <label className="text-sm font-medium text-primary mb-3 block">Этап продажи</label>
                  {filterOptions.stage.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => toggleFilter(option.id)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-sm transition-all",
                        activeFilters.has(option.id)
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/50 text-foreground hover:bg-muted"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Clear Filters */}
          {activeFilters.size > 0 && (
            <div className="p-4 border-t border-border">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={clearFilters}
              >
                Сбросить фильтры ({activeFilters.size})
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Toggle Filter Button (when hidden) */}
      {!showFilters && (
        <Button
          variant="outline"
          size="icon"
          className="fixed right-6 top-24 h-10 w-10"
          onClick={() => setShowFilters(true)}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

// Main component that wraps content in AppLayout (which provides SidebarProvider)
const ClientChats = () => {
  return (
    <AppLayout>
      <ClientChatsContent />
    </AppLayout>
  );
};

export default ClientChats;
