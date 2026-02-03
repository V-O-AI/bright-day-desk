import { useState } from "react";
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
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for client chats
const mockChats = [
  { id: 1, name: "Andreana Viola", message: "Hi, How are you today?", time: "1m ago", unread: 2, online: true, avatar: "" },
  { id: 2, name: "Михаил Петров", message: "Когда будет доставка?", time: "5m ago", unread: 1, online: false, avatar: "" },
  { id: 3, name: "Елена Сидорова", message: "Спасибо за помощь!", time: "12m ago", unread: 0, online: true, avatar: "" },
  { id: 4, name: "Andreana Viola", message: "Hi, How are you today?", time: "1m ago", unread: 2, online: false, avatar: "" },
  { id: 5, name: "Алексей Козлов", message: "Хочу оформить заказ", time: "25m ago", unread: 3, online: true, avatar: "" },
  { id: 6, name: "Andreana Viola", message: "Hi, How are you today?", time: "1m ago", unread: 2, online: false, avatar: "" },
  { id: 7, name: "Ольга Новикова", message: "Есть вопрос по товару", time: "1h ago", unread: 0, online: false, avatar: "" },
  { id: 8, name: "Andreana Viola", message: "Hi, How are you today?", time: "1m ago", unread: 2, online: true, avatar: "" },
  { id: 9, name: "Дмитрий Волков", message: "Можно узнать статус?", time: "2h ago", unread: 1, online: false, avatar: "" },
  { id: 10, name: "Andreana Viola", message: "Hi, How are you today?", time: "1m ago", unread: 2, online: false, avatar: "" },
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

const ClientChats = () => {
  const [activeTab, setActiveTab] = useState<"flows" | "clients" | "direct">("direct");
  const [showFilters, setShowFilters] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState<FilterCategory | null>("sales");
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [salesMin, setSalesMin] = useState("");
  const [salesMax, setSalesMax] = useState("");
  const [avgMin, setAvgMin] = useState("");
  const [avgMax, setAvgMax] = useState("");

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

  return (
    <AppLayout>
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
    </AppLayout>
  );
};

export default ClientChats;
