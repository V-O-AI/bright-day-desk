import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Bell, X, Package, MessageCircle, CreditCard, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserDropdown } from "./UserDropdown";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

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

  // Responsive header heights
  const headerHeightClass = isHome 
    ? "h-[100px] xs:h-[110px] md:h-[120px] lg:h-[15vh] lg:min-h-[100px]" 
    : "h-[50px] xs:h-[55px] md:h-[60px] lg:h-[7.5vh] lg:min-h-[50px]";

  return (
    <header
      className={cn(
        "border-b border-border bg-card flex items-center justify-between px-4 xs:px-5 md:px-6 lg:px-8 relative",
        headerHeightClass
      )}
    >
      {/* Left — greeting (only on home page) */}
      {isHome && (
        <div className="opacity-0 animate-fade-in flex-1 min-w-0" style={{ animationFillMode: "forwards" }}>
          <h1 className="text-lg xs:text-xl md:text-2xl lg:text-3xl tracking-tight">
            <span className="font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent animate-fade-in" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
              {isMobile ? "Привет!" : "Добрый день,"}
            </span>{" "}
            <span className="text-muted-foreground font-normal opacity-0 animate-fade-in hidden xs:inline" style={{ animationDelay: "250ms", animationFillMode: "forwards" }}>
              {isMobile ? "чем помочь?" : "чем сегодня могу помочь?"}
            </span>
          </h1>
          <p className="text-[10px] xs:text-xs md:text-sm text-muted-foreground capitalize mt-0.5 xs:mt-1 opacity-0 animate-fade-in flex items-center" style={{ animationDelay: "400ms", animationFillMode: "forwards" }}>
            <span className="inline-block w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full bg-green-500 mr-1.5 xs:mr-2 animate-pulse" />
            <span className="hidden sm:inline">{weekday} / </span>
            {dateStr}
          </p>
        </div>
      )}

      {/* Spacer for non-home pages */}
      {!isHome && <div />}

      {/* Right — buttons (home only on larger screens) + notification + avatar */}
      <div className="flex items-center gap-2 xs:gap-3 opacity-0 animate-fade-in flex-shrink-0" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
        {/* Action buttons - Only show on desktop for home page */}
        {isHome && !isMobile && (
          <div className="hidden lg:flex items-center gap-2 xl:gap-3">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full transition-all duration-200 hover:shadow-md hover:shadow-primary/10 hover:-translate-y-0.5 active:scale-[0.97] text-xs xl:text-sm px-3 xl:px-4"
            >
              <span className="hidden xl:inline">Кнопка:</span>
              <span className="xl:hidden">Кн:</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full transition-all duration-200 hover:shadow-md hover:shadow-primary/10 hover:-translate-y-0.5 active:scale-[0.97] text-xs xl:text-sm px-3 xl:px-4"
            >
              <span className="hidden xl:inline">Кнопка:</span>
              <span className="xl:hidden">Кн:</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full transition-all duration-200 hover:shadow-md hover:shadow-primary/10 hover:-translate-y-0.5 active:scale-[0.97] text-xs xl:text-sm px-3 xl:px-4 hidden desktop:inline-flex"
            >
              Кнопка:
            </Button>
          </div>
        )}

        {/* Bell with notification dropdown (Popover) */}
        <Popover open={notifOpen} onOpenChange={setNotifOpen}>
          <PopoverTrigger asChild>
            <button
              className={cn(
                "relative p-2 xs:p-2.5 rounded-full transition-all duration-200 hover:bg-muted",
                notifOpen && "bg-muted"
              )}
            >
              <Bell className={cn(
                "h-4 w-4 xs:h-5 xs:w-5 text-muted-foreground transition-transform duration-200",
                notifOpen && "text-primary scale-110"
              )} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 xs:h-5 xs:w-5 rounded-full bg-destructive text-destructive-foreground text-[9px] xs:text-[10px] font-bold flex items-center justify-center animate-scale-in">
                  {unreadCount}
                </span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            sideOffset={8}
            className={cn(
              "p-0 bg-card border border-border rounded-xl xs:rounded-2xl shadow-2xl shadow-foreground/5",
              "w-[calc(100vw-2rem)] xs:w-[340px] sm:w-[380px]",
              "max-h-[calc(100vh-100px)]"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 xs:p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm xs:text-base text-foreground">Уведомления</h3>
                {unreadCount > 0 && (
                  <span className="px-1.5 xs:px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] xs:text-xs font-medium">
                    {unreadCount} {isMobile ? "" : "новых"}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[10px] xs:text-xs text-primary hover:text-primary/80 transition-colors px-1.5 xs:px-2 py-1 rounded-lg hover:bg-primary/5"
                  >
                    {isMobile ? "Все" : "Прочитать все"}
                  </button>
                )}
                <button
                  onClick={() => setNotifOpen(false)}
                  className="p-1 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="h-3.5 w-3.5 xs:h-4 xs:w-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-[280px] xs:max-h-[320px] sm:max-h-[360px] overflow-y-auto">
              {notifications.map((notification, idx) => (
                <div
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-2 xs:gap-3 p-3 xs:p-4 border-b border-border last:border-0 transition-all duration-200 hover:bg-muted/50 cursor-pointer",
                    !notification.read && "bg-primary/[0.02]"
                  )}
                >
                  <div className={cn("p-1.5 xs:p-2 rounded-lg xs:rounded-xl flex-shrink-0", notification.bgColor)}>
                    <notification.icon className={cn("h-3.5 w-3.5 xs:h-4 xs:w-4", notification.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 xs:gap-2">
                      <p className={cn("text-xs xs:text-sm font-medium truncate", !notification.read ? "text-foreground" : "text-muted-foreground")}>
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <span className="h-1.5 w-1.5 xs:h-2 xs:w-2 rounded-full bg-primary flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-[10px] xs:text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {notification.description}
                    </p>
                    <p className="text-[9px] xs:text-[11px] text-muted-foreground/60 mt-0.5 xs:mt-1">
                      {notification.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-2 xs:p-3 border-t border-border">
              <button className="w-full text-center text-xs xs:text-sm text-primary hover:text-primary/80 py-1.5 xs:py-2 rounded-lg xs:rounded-xl hover:bg-primary/5 transition-colors">
                {isMobile ? "Все уведомления" : "Показать все уведомления"}
              </button>
            </div>
          </PopoverContent>
        </Popover>

        <UserDropdown />
      </div>
    </header>
  );
}
