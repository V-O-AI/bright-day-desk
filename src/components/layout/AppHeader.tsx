import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Bell, X, Package, MessageCircle, CreditCard, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserDropdown } from "./UserDropdown";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const mockNotifications = [
  {
    id: 1,
    icon: Package,
    title: "Новый заказ #1042",
    description: "Поступил новый заказ на 15 единиц товара",
    time: "5 мин назад",
    read: false,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    id: 2,
    icon: MessageCircle,
    title: "Новое сообщение",
    description: "Клиент задал вопрос о доставке",
    time: "12 мин назад",
    read: false,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    id: 3,
    icon: CreditCard,
    title: "Оплата получена",
    description: "Платёж на сумму ₽12,500 успешно обработан",
    time: "1 час назад",
    read: true,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    id: 4,
    icon: AlertCircle,
    title: "Остаток на складе",
    description: 'Товар "Футболка базовая" заканчивается',
    time: "2 часа назад",
    read: true,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    id: 5,
    icon: CheckCircle,
    title: "Доставка завершена",
    description: "Заказ #1038 успешно доставлен клиенту",
    time: "3 часа назад",
    read: true,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
];

export function AppHeader() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  const [notifications, setNotifications] = useState(mockNotifications);
  const [notifOpen, setNotifOpen] = useState(false);

  const today = new Date();
  const weekday = today.toLocaleDateString("ru-RU", { weekday: "long" });
  const dateStr = today.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <header
      className={cn(
        "border-b border-border bg-card flex items-center justify-between px-8 relative",
        isHome ? "h-[15vh] min-h-[100px]" : "h-[7.5vh] min-h-[50px]"
      )}
    >
      {/* Left — greeting (only on home page) */}
      {isHome && (
        <div className="opacity-0 animate-fade-in" style={{ animationFillMode: "forwards" }}>
          <h1 className="text-2xl lg:text-3xl tracking-tight">
            <span className="font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent animate-fade-in" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
              Добрый день,
            </span>{" "}
            <span className="text-muted-foreground font-normal opacity-0 animate-fade-in" style={{ animationDelay: "250ms", animationFillMode: "forwards" }}>
              чем сегодня могу помочь?
            </span>
          </h1>
          <p className="text-sm text-muted-foreground capitalize mt-1 opacity-0 animate-fade-in" style={{ animationDelay: "400ms", animationFillMode: "forwards" }}>
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
            {weekday} / {dateStr}
          </p>
        </div>
      )}

      {/* Spacer for non-home pages */}
      {!isHome && <div />}

      {/* Right — buttons (home only) + notification + avatar */}
      <div className="flex items-center gap-3 opacity-0 animate-fade-in" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
        {isHome && (
          <>
            <Button
              variant="outline"
              className="rounded-full transition-all duration-200 hover:shadow-md hover:shadow-primary/10 hover:-translate-y-0.5 active:scale-[0.97]"
            >
              Кнопка:
            </Button>
            <Button
              variant="outline"
              className="rounded-full transition-all duration-200 hover:shadow-md hover:shadow-primary/10 hover:-translate-y-0.5 active:scale-[0.97]"
            >
              Кнопка:
            </Button>
            <Button
              variant="outline"
              className="rounded-full transition-all duration-200 hover:shadow-md hover:shadow-primary/10 hover:-translate-y-0.5 active:scale-[0.97]"
            >
              Кнопка:
            </Button>
          </>
        )}

        {/* Bell with notification dropdown (Popover) */}
        <Popover open={notifOpen} onOpenChange={setNotifOpen}>
          <PopoverTrigger asChild>
            <button
              className={cn(
                "relative p-2.5 rounded-full transition-all duration-200 hover:bg-muted",
                notifOpen && "bg-muted"
              )}
            >
              <Bell className={cn(
                "h-5 w-5 text-muted-foreground transition-transform duration-200",
                notifOpen && "text-primary scale-110"
              )} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center animate-scale-in">
                  {unreadCount}
                </span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            sideOffset={8}
            className="w-[380px] p-0 bg-card border border-border rounded-2xl shadow-2xl shadow-foreground/5"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">Уведомления</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {unreadCount} новых
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-primary hover:text-primary/80 transition-colors px-2 py-1 rounded-lg hover:bg-primary/5"
                  >
                    Прочитать все
                  </button>
                )}
                <button
                  onClick={() => setNotifOpen(false)}
                  className="p-1 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-[360px] overflow-y-auto">
              {notifications.map((notification, idx) => (
                <div
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-3 p-4 border-b border-border last:border-0 transition-all duration-200 hover:bg-muted/50 cursor-pointer",
                    !notification.read && "bg-primary/[0.02]"
                  )}
                >
                  <div className={cn("p-2 rounded-xl flex-shrink-0", notification.bgColor)}>
                    <notification.icon className={cn("h-4 w-4", notification.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={cn("text-sm font-medium truncate", !notification.read ? "text-foreground" : "text-muted-foreground")}>
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {notification.description}
                    </p>
                    <p className="text-[11px] text-muted-foreground/60 mt-1">
                      {notification.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-border">
              <button className="w-full text-center text-sm text-primary hover:text-primary/80 py-2 rounded-xl hover:bg-primary/5 transition-colors">
                Показать все уведомления
              </button>
            </div>
          </PopoverContent>
        </Popover>

        <UserDropdown />
      </div>
    </header>
  );
}
