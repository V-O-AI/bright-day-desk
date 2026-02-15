import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bell, X, Package, MessageCircle, CreditCard, AlertCircle, CheckCircle, Bot, Send, Sparkles, FileText, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserDropdown } from "./UserDropdown";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type NotificationType = "info" | "error" | "ai_request";

interface Notification {
  id: number;
  icon: any;
  title: string;
  description: string;
  fullText: string;
  time: string;
  read: boolean;
  color: string;
  bgColor: string;
  type: NotificationType;
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    icon: Package,
    title: "Новый заказ #1042",
    description: "Поступил новый заказ на 15 единиц товара",
    fullText: "Поступил новый заказ #1042 на 15 единиц товара категории «Детские вещи». Клиент: Андреана Виола (VIP). Ожидаемая дата доставки: 15.02.2026. Сумма заказа: ₽45,200.",
    time: "5 мин назад",
    read: false,
    color: "text-primary",
    bgColor: "bg-primary/10",
    type: "info",
  },
  {
    id: 2,
    icon: MessageCircle,
    title: "Новое сообщение",
    description: "Клиент задал вопрос о доставке",
    fullText: "Клиент Михаил Петров задал вопрос о сроках доставки заказа #1038. Просит уточнить, возможна ли экспресс-доставка до 12.02.2026.",
    time: "12 мин назад",
    read: false,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    type: "info",
  },
  {
    id: 3,
    icon: CreditCard,
    title: "Оплата получена",
    description: "Платёж на сумму ₽12,500 успешно обработан",
    fullText: "Платёж на сумму ₽12,500 от клиента Елена Сидорова успешно обработан. Заказ #1039 переведён в статус «Оплачен». Средства зачислены на основной счёт.",
    time: "1 час назад",
    read: true,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    type: "info",
  },
  {
    id: 4,
    icon: AlertCircle,
    title: "Ошибка синхронизации склада",
    description: "Не удалось обновить остатки по категории «Обувь»",
    fullText: "Произошла ошибка при синхронизации остатков склада по категории «Обувь». Последнее обновление: 10.02.2026 14:30. Расхождение в данных: фактический остаток 234 ед., в системе 250 ед. Требуется ручная сверка или повторная синхронизация.",
    time: "2 часа назад",
    read: true,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    type: "error",
  },
  {
    id: 5,
    icon: CheckCircle,
    title: "Доставка завершена",
    description: "Заказ #1038 успешно доставлен клиенту",
    fullText: "Заказ #1038 успешно доставлен клиенту по адресу г. Москва, ул. Ленина, д. 15. Подпись получателя получена. Фото подтверждение загружено в систему.",
    time: "3 часа назад",
    read: true,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    type: "info",
  },
  {
    id: 6,
    icon: Bot,
    title: "ИИ-ассистент: аномалия в данных",
    description: "Обнаружено расхождение в финансовых показателях",
    fullText: "ИИ-ассистент обнаружил аномалию в финансовых данных за последнюю неделю: расходы по категории «Логистика» выросли на 47% без видимых причин. Возможные причины: дублирование записей, ошибка в расчёте стоимости доставки. Требуется ваше решение по дальнейшим действиям.",
    time: "4 часа назад",
    read: false,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    type: "ai_request",
  },
];

export function AppHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [notifOpen, setNotifOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [chatMessages, setChatMessages] = useState<{ role: "system" | "user"; text: string }[]>([]);

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

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
    );
    setSelectedNotification(notification);
    setChatMessages([{ role: "system", text: notification.fullText }]);
    setReplyText("");
    setDialogOpen(true);
    setNotifOpen(false);
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      { role: "user", text: replyText.trim() },
      { role: "system", text: "Спасибо за ответ. Ваше сообщение принято и будет обработано." },
    ]);
    setReplyText("");
  };

  const needsReply = selectedNotification?.type === "error" || selectedNotification?.type === "ai_request";

  return (
    <>
      <header
        className={cn(
          "border-b border-border bg-card flex items-center justify-between px-4 md:px-8 relative",
          isHome ? "h-auto min-h-[60px] md:h-[15vh] md:min-h-[100px] py-3 md:py-0" : "h-[7.5vh] min-h-[50px]"
        )}
      >
        {isHome && (
          <div className="opacity-0 animate-fade-in flex items-center gap-3 md:gap-4 min-w-0 flex-1" style={{ animationFillMode: "forwards" }}>
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 rounded-xl md:rounded-2xl px-3 md:px-6 py-2 md:py-3 min-w-0">
              <h1 className="text-lg md:text-2xl lg:text-3xl tracking-tight">
                <span className="font-bold bg-gradient-to-r from-primary via-foreground to-primary bg-clip-text text-transparent animate-fade-in" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
                  Добрый день 👋
                </span>{" "}
                <span className="text-muted-foreground font-normal opacity-0 animate-fade-in hidden sm:inline" style={{ animationDelay: "250ms", animationFillMode: "forwards" }}>
                  Чем займёмся сегодня?
                </span>
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground capitalize mt-1 opacity-0 animate-fade-in" style={{ animationDelay: "400ms", animationFillMode: "forwards" }}>
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                {weekday} / {dateStr}
              </p>
            </div>
          </div>
        )}

        {!isHome && <div />}

        <div className="flex items-center gap-1.5 md:gap-3 opacity-0 animate-fade-in flex-shrink-0" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
          {isHome && (
            <>
              {/* Full buttons on md+, icon-only on mobile */}
              <Button
                variant="outline"
                size="icon"
                className="rounded-full md:hidden h-9 w-9 transition-all active:scale-[0.97]"
                onClick={() => navigate("/staff-chat?new=true")}
              >
                <Sparkles className="h-4 w-4 text-primary" />
              </Button>
              <Button
                variant="outline"
                className="rounded-full transition-all duration-200 hover:bg-primary/5 hover:border-primary/30 hover:shadow-md hover:shadow-primary/10 hover:-translate-y-0.5 active:scale-[0.97] gap-2 hidden md:inline-flex"
                onClick={() => navigate("/staff-chat?new=true")}
              >
                <Sparkles className="h-4 w-4 text-primary" />
                Обратиться к AI
              </Button>
              <Button
                variant="outline"
                className="rounded-full transition-all duration-200 hover:bg-primary/5 hover:border-primary/30 hover:shadow-md hover:shadow-primary/10 hover:-translate-y-0.5 active:scale-[0.97] gap-2 hidden lg:inline-flex"
                onClick={() => navigate("/staff-chat?new=true&message=" + encodeURIComponent("Подготовить таблицу"))}
              >
                <FileText className="h-4 w-4 text-primary" />
                Подготовить отчёт
              </Button>
              <Button
                variant="outline"
                className="rounded-full transition-all duration-200 hover:bg-primary/5 hover:border-primary/30 hover:shadow-md hover:shadow-primary/10 hover:-translate-y-0.5 active:scale-[0.97] gap-2 hidden lg:inline-flex"
                onClick={() => navigate("/cabinet")}
              >
                <CalendarCheck className="h-4 w-4 text-primary" />
                Запланировать задачу
              </Button>
            </>
          )}

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
                    <button onClick={markAllRead} className="text-xs text-primary hover:text-primary/80 transition-colors px-2 py-1 rounded-lg hover:bg-primary/5">
                      Прочитать все
                    </button>
                  )}
                  <button onClick={() => setNotifOpen(false)} className="p-1 rounded-lg hover:bg-muted transition-colors">
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </div>

              <div className="max-h-[360px] overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "flex items-start gap-3 p-4 border-b border-border last:border-0 transition-all duration-200 hover:bg-muted/50 cursor-pointer",
                      !notification.read && "bg-primary/[0.02]"
                    )}
                    onClick={() => handleNotificationClick(notification)}
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

      {/* Notification Detail Modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedNotification && (
                <>
                  <div className={cn("p-1.5 rounded-lg", selectedNotification.bgColor)}>
                    <selectedNotification.icon className={cn("h-4 w-4", selectedNotification.color)} />
                  </div>
                  {selectedNotification.title}
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "p-3 rounded-xl text-sm",
                  msg.role === "system"
                    ? "bg-muted text-foreground"
                    : "bg-primary text-primary-foreground ml-8"
                )}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {needsReply && (
            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <Input
                placeholder="Напишите ответ..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendReply()}
                className="flex-1"
              />
              <Button size="icon" onClick={handleSendReply} disabled={!replyText.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
