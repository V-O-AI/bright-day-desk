import { useState, useRef, useEffect } from "react";
import { Bell, X, Package, MessageCircle, CreditCard, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserDropdown } from "./UserDropdown";
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
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const panelRef = useRef<HTMLDivElement>(null);

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

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener("mousedown", handler);
    }
    return () => document.removeEventListener("mousedown", handler);
  }, [showNotifications]);

  return (
    <header className="h-[15vh] min-h-[100px] border-b border-border bg-card flex items-center justify-between px-8 relative overflow-visible">
      {/* Left — greeting with animations */}
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

      {/* Right — buttons + notification + avatar */}
      <div className="flex items-center gap-3 opacity-0 animate-fade-in" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
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

        {/* Bell with notification panel */}
        <div className="relative" ref={panelRef}>
          <button
            onClick={() => setShowNotifications((v) => !v)}
            className={cn(
              "relative p-2.5 rounded-full transition-all duration-200 hover:bg-muted",
              showNotifications && "bg-muted"
            )}
          >
            <Bell className={cn(
              "h-5 w-5 text-muted-foreground transition-transform duration-200",
              showNotifications && "text-primary scale-110"
            )} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center animate-scale-in">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Panel */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-[380px] bg-card border border-border rounded-2xl shadow-2xl shadow-foreground/5 z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200">
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
                    onClick={() => setShowNotifications(false)}
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
                      "flex items-start gap-3 p-4 border-b border-border last:border-0 transition-all duration-200 hover:bg-muted/50 cursor-pointer opacity-0 animate-fade-in",
                      !notification.read && "bg-primary/[0.02]"
                    )}
                    style={{ animationDelay: `${idx * 50}ms`, animationFillMode: "forwards" }}
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
            </div>
          )}
        </div>

        <UserDropdown />
      </div>
    </header>
  );
}
