import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar, Plus, Settings, MessageCircle, CalendarDays } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useLatestClientChats } from "@/hooks/useClientChats";

import cardWarehouse from "@/assets/card-warehouse.jpg";
import cardConsultant from "@/assets/card-consultant.jpg";
import cardNotifications from "@/assets/card-notifications.jpg";

const Cabinet = () => {
  const { profile, isLoading, saveProfile } = useUserProfile();
  const { data: chats } = useLatestClientChats(100);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");

  const [cardSettingsOpen, setCardSettingsOpen] = useState(false);

  // Sync form with profile
  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
      setDateOfBirth(profile.date_of_birth || "");
      setPhone(profile.phone || "");
      setEmail(profile.email || "");
      setCity(profile.city || "");
    }
  }, [profile]);

  const handleSave = async () => {
    await saveProfile({
      first_name: firstName,
      last_name: lastName,
      date_of_birth: dateOfBirth,
      phone: phone,
      email: email,
      city: city,
    });
  };

  const handleCancel = () => {
    if (profile) {
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
      setDateOfBirth(profile.date_of_birth || "");
      setPhone(profile.phone || "");
      setEmail(profile.email || "");
      setCity(profile.city || "");
    }
  };

  // Calculate days since registration
  const daysSinceRegistration = profile?.created_at
    ? Math.floor((Date.now() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  // Count new chats (unread_count > 0 as "processed by AI")
  const newChatsCount = chats?.filter(c => c.unread_count > 0).length || 0;

  const integrationCards = [
    {
      image: cardWarehouse,
      title: "Подключить склад к TG",
      advantages: [
        "Все в одном месте",
        "Быстрый учет фин операций",
        "Мгновенное действие без ПК",
        "Экономия времени",
        "Передача данных для аналитики",
      ],
    },
    {
      image: cardConsultant,
      title: "Подключить ИИ-консультанта",
      advantages: [
        "Экономия времени на ответ",
        "Сокращение ожидания пользователей",
        "Моментальный мониторинг склада",
        "Ответы исходя из аналитики клиентов",
      ],
    },
    {
      image: cardNotifications,
      title: "Подключить уведомления о своем бизнесе",
      advantages: [
        "Ежедневный мониторинг дел бизнеса",
        "Получение отчетов прямо в TG",
        "Моментальные уведомления об аномалиях бизнеса",
        "Уведомления о готовности клиента купить",
      ],
    },
  ];

  return (
    <AppLayout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full overflow-auto pb-6">
        
        {/* Левая колонка - Данные аккаунта */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-card rounded-2xl p-6 border border-border opacity-0 animate-fade-in-up" style={{ animationDelay: "0ms", animationFillMode: "forwards" }}>
            <h2 className="text-lg font-semibold mb-6">Данные аккаунта</h2>
            
            {/* Фото профиля */}
            <div className="mb-6">
              <Label className="text-sm text-muted-foreground mb-2 block">Фото профиля</Label>
              <div className="flex items-center gap-4">
                <Avatar className="w-14 h-14">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white text-lg">
                    {firstName?.[0]?.toUpperCase() || ""}{lastName?.[0]?.toUpperCase() || ""}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Загрузить фото</span>
                  <span className="text-xs text-muted-foreground">PNG, JPG макс. 5МБ</span>
                  <button className="text-xs text-destructive hover:underline text-left mt-1">Удалить</button>
                </div>
              </div>
            </div>

            {/* Имя */}
            <div className="mb-4">
              <Label className="text-sm text-muted-foreground mb-2 block">Имя</Label>
              <Input 
                placeholder="Введите имя"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-muted/50 border-border"
              />
            </div>

            {/* Фамилия */}
            <div className="mb-4">
              <Label className="text-sm text-muted-foreground mb-2 block">Фамилия</Label>
              <Input 
                placeholder="Введите фамилию"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-muted/50 border-border"
              />
            </div>

            {/* Дата рождения */}
            <div className="mb-4">
              <Label className="text-sm text-muted-foreground mb-2 block">Дата рождения</Label>
              <div className="relative">
                <Input 
                  placeholder="ДД/ММ/ГГГГ"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="bg-muted/50 border-border pr-10"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            {/* Телефон */}
            <div className="mb-4">
              <Label className="text-sm text-muted-foreground mb-2 block">Телефон</Label>
              <Input 
                placeholder="+7 (999) 123-45-67"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-muted/50 border-border"
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <Label className="text-sm text-muted-foreground mb-2 block">Электронная почта</Label>
              <Input 
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-muted/50 border-border"
              />
            </div>

            {/* Город проживания */}
            <div className="mb-6">
              <Label className="text-sm text-muted-foreground mb-2 block">Город проживания</Label>
              <Input 
                placeholder="Введите город"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="bg-muted/50 border-border"
              />
            </div>

            {/* Кнопки */}
            <Button className="w-full mb-3 bg-primary hover:bg-primary/90" onClick={handleSave}>
              Сохранить
            </Button>
            <Button variant="outline" className="w-full" onClick={handleCancel}>
              Отменить
            </Button>
          </div>
        </div>

        {/* Центральная колонка - Привязка аккаунтов & Карты */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Привязать аккаунты */}
          <div className="bg-card rounded-2xl p-6 border border-border opacity-0 animate-fade-in-up" style={{ animationDelay: "50ms", animationFillMode: "forwards" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Привязать аккаунты</h3>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {integrationCards.map((card, index) => (
                <div key={index} className="bg-muted/30 rounded-xl p-3 hover:shadow-md transition-shadow flex flex-col">
                  <div className="h-24 rounded-lg mb-3 overflow-hidden">
                    <img 
                      src={card.image} 
                      alt={card.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xs font-semibold mb-2 line-clamp-2">{card.title}</h3>
                  <h4 className="text-[10px] font-medium text-muted-foreground mb-1">Преимущества:</h4>
                  <ul className="space-y-0.5 flex-1">
                    {card.advantages.map((adv, i) => (
                      <li key={i} className="text-[10px] text-muted-foreground flex items-start gap-1">
                        <span className="text-primary mt-0.5">•</span>
                        <span>{adv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card rounded-2xl p-6 border border-border flex items-center gap-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Чатов с клиентами</p>
                <p className="text-2xl font-bold">{newChatsCount}</p>
              </div>
            </div>
            <div className="bg-card rounded-2xl p-6 border border-border flex items-center gap-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "150ms", animationFillMode: "forwards" }}>
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <CalendarDays className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Дней с нами</p>
                <p className="text-2xl font-bold">{daysSinceRegistration}</p>
              </div>
            </div>
          </div>

          {/* Блок с картами */}
          <div className="bg-card rounded-2xl p-6 border border-border opacity-0 animate-fade-in-up" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Карты</h3>
              <button 
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                onClick={() => setCardSettingsOpen(true)}
              >
                <Settings className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            
            {/* Credit card visual */}
            <div className="relative w-full max-w-[280px] h-[160px] bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500 rounded-2xl p-5 mb-4 shadow-lg">
              <div className="absolute top-5 left-5">
                <div className="w-10 h-7 bg-yellow-300/80 rounded-md" />
              </div>
              <div className="absolute bottom-16 left-5 text-white/90 text-sm tracking-[0.2em] font-mono">
                5632 5432 6733 6844
              </div>
              <div className="absolute bottom-5 left-5 text-white text-sm">
                {firstName || "Имя"} {lastName || "Фамилия"}
              </div>
              <div className="absolute bottom-5 right-5">
                <div className="flex -space-x-3">
                  <div className="w-8 h-8 rounded-full bg-red-500/80" />
                  <div className="w-8 h-8 rounded-full bg-orange-400/80" />
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Добавить карту
            </Button>
          </div>
        </div>

        {/* Правая колонка - Подписка & Транзакции */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Подписка */}
          <div className="bg-card rounded-2xl p-6 border border-border opacity-0 animate-fade-in-up" style={{ animationDelay: "250ms", animationFillMode: "forwards" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Подписка</h3>
              <button className="text-sm text-primary hover:underline">Все планы</button>
            </div>
            
            <div className="mb-4">
              <h4 className="font-semibold text-lg mb-2">Professional</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Полный набор функций включая персонального ИИ-консультанта и неограниченный доступ к материалам
              </p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold">$89.99</span>
                <span className="text-muted-foreground">/ год</span>
              </div>
            </div>

            <Button className="w-full bg-primary hover:bg-primary/90">
              Продлить подписку
            </Button>
          </div>

          {/* История транзакций */}
          <div className="bg-card rounded-2xl p-6 border border-border opacity-0 animate-fade-in-up" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Последние транзакции</h3>
              <button className="text-sm text-primary hover:underline">Все</button>
            </div>
            
            <div className="space-y-4">
              {[
                { initials: "PT", title: 'Пробный период 14 дней "Professional"', amount: "- $0,00", color: "text-destructive", bgColor: "bg-purple-100 dark:bg-purple-900/30" },
                { initials: "PTC", title: 'Отмена пробного периода "Professional"', amount: "+ $0,00", color: "text-primary", bgColor: "bg-purple-100 dark:bg-purple-900/30" },
              ].map((transaction, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${transaction.bgColor} flex items-center justify-center`}>
                    <span className="text-sm font-bold text-primary">{transaction.initials}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{transaction.title}</p>
                    <p className={`text-sm ${transaction.color}`}>{transaction.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно настроек карт */}
      <Dialog open={cardSettingsOpen} onOpenChange={setCardSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Настройки карт</DialogTitle>
            <DialogDescription>Управление привязанными банковскими картами</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-7 bg-gradient-to-r from-purple-500 to-pink-500 rounded-md" />
                <div>
                  <p className="text-sm font-medium">•••• •••• •••• 6844</p>
                  <p className="text-xs text-muted-foreground">Основная карта</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Удалить</Button>
            </div>
            <Button variant="outline" className="w-full flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Добавить новую карту
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Cabinet;
