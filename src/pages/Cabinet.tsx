import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar as CalendarIcon, Plus, Settings, Copy, Check, Users, CreditCard, ChevronDown } from "lucide-react";
import { CalendarNotes } from "@/components/CalendarNotes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useUserProfile } from "@/hooks/useUserProfile";
// removed useLatestClientChats import
import ReferralProgram from "@/components/billing/ReferralProgram";
import PaymentModal from "@/components/billing/PaymentModal";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

import cardWarehouse from "@/assets/card-warehouse.jpg";
import cardConsultant from "@/assets/card-consultant.jpg";
import cardNotifications from "@/assets/card-notifications.jpg";

const RUSSIAN_CITIES = [
  "Москва", "Санкт-Петербург", "Новосибирск", "Екатеринбург", "Казань",
  "Нижний Новгород", "Челябинск", "Самара", "Омск", "Ростов-на-Дону",
  "Уфа", "Красноярск", "Воронеж", "Пермь", "Волгоград",
  "Краснодар", "Саратов", "Тюмень", "Тольятти", "Ижевск",
  "Барнаул", "Ульяновск", "Иркутск", "Хабаровск", "Ярославль",
  "Владивосток", "Махачкала", "Томск", "Оренбург", "Кемерово",
];

const CABINET_TRANSACTIONS = [
  { initials: "PT", title: 'Пробный период 14 дней "Professional"', amount: "- $0,00", color: "text-destructive", bgColor: "bg-purple-100 dark:bg-purple-900/30" },
  { initials: "PTC", title: 'Отмена пробного периода "Professional"', amount: "+ $0,00", color: "text-primary", bgColor: "bg-purple-100 dark:bg-purple-900/30" },
  { initials: "UP", title: 'Оплата плана "Growth" (месяц)', amount: "- $79,00", color: "text-destructive", bgColor: "bg-blue-100 dark:bg-blue-900/30" },
  { initials: "RF", title: 'Возврат за неиспользованный период', amount: "+ $23,50", color: "text-primary", bgColor: "bg-green-100 dark:bg-green-900/30" },
  { initials: "UP", title: 'Оплата плана "Growth" (месяц)', amount: "- $79,00", color: "text-destructive", bgColor: "bg-blue-100 dark:bg-blue-900/30" },
  { initials: "BN", title: 'Бонус за реферальную программу', amount: "+ $15,00", color: "text-primary", bgColor: "bg-amber-100 dark:bg-amber-900/30" },
  { initials: "UP", title: 'Оплата плана "Growth" (месяц)', amount: "- $79,00", color: "text-destructive", bgColor: "bg-blue-100 dark:bg-blue-900/30" },
  { initials: "TK", title: 'Применён тикет "5% кешбэк"', amount: "+ $3,95", color: "text-primary", bgColor: "bg-orange-100 dark:bg-orange-900/30" },
];

const MAX_VISIBLE_TRANSACTIONS = 8;

const Cabinet = () => {
  const [activeTab, setActiveTab] = useState<"cabinet" | "referral">("cabinet");
  const navigate = useNavigate();
  const { profile, isLoading, saveProfile } = useUserProfile();
  

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(false);

  const [cardSettingsOpen, setCardSettingsOpen] = useState(false);
  const [integrationModalIndex, setIntegrationModalIndex] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState<number | null>(null);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

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

  // Phone input handler - digits only
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only digits, +, spaces, hyphens, parentheses
    const cleaned = value.replace(/[^0-9+\s\-()]/g, "");
    setPhone(cleaned);
  };

  // Parse date string to Date object
  const parseDateString = (dateStr: string): Date | undefined => {
    if (!dateStr) return undefined;
    const parts = dateStr.split("/");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      const d = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      if (!isNaN(d.getTime())) return d;
    }
    return undefined;
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const formatted = format(date, "dd/MM/yyyy");
      setDateOfBirth(formatted);
      setDatePickerOpen(false);
    }
  };

  const filteredCities = RUSSIAN_CITIES.filter((c) =>
    c.toLowerCase().includes((citySearch || city).toLowerCase())
  );


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
      modalTitle: "Подключение склада к Telegram",
      modalDescription: "Интеграция позволяет управлять складом прямо из Telegram-бота. Вы сможете добавлять, редактировать и отслеживать товары, получать уведомления о поступлениях и списаниях, а также формировать отчёты — всё без необходимости открывать компьютер.",
      link: "https://t.me/your_warehouse_bot",
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
      modalTitle: "Подключение ИИ-консультанта",
      modalDescription: "ИИ-консультант автоматически отвечает клиентам на основе данных вашего склада и аналитики. Он обрабатывает запросы 24/7, снижает нагрузку на менеджеров и повышает скорость обслуживания, используя актуальную информацию о наличии и ценах.",
      link: "https://t.me/your_ai_consultant_bot",
    },
    {
      image: cardNotifications,
      title: "Уведомления о бизнесе через Telegram",
      advantages: [
        "Ежедневный мониторинг дел бизнеса",
        "Получение отчетов прямо в TG",
        "Моментальные уведомления об аномалиях бизнеса",
        "Уведомления о готовности клиента купить",
      ],
      modalTitle: "Подключение бизнес-уведомлений через Telegram",
      modalDescription: "Получайте ежедневные отчёты, оповещения об аномалиях (резкий рост или падение продаж, критический остаток товара) и уведомления о «горячих» клиентах прямо в Telegram. Настраивайте фильтры и расписание под свои потребности.",
      link: "https://t.me/your_notifications_bot",
    },
  ];

  const handleCopyLink = (index: number, link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(index);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <AppLayout>
      {/* Tab Navigation */}
      <div className="flex items-center gap-1 border-b border-border mb-6">
        <button
          onClick={() => setActiveTab("cabinet")}
          className={cn(
            "px-5 py-3 text-sm font-medium transition-colors relative",
            activeTab === "cabinet"
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Личный кабинет
          {activeTab === "cabinet" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("referral")}
          className={cn(
            "px-5 py-3 text-sm font-medium transition-colors relative",
            activeTab === "referral"
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            Реферальная программа
          </span>
          {activeTab === "referral" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t" />
          )}
        </button>
      </div>

      {activeTab === "referral" ? (
        <ReferralProgram />
      ) : (
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

            {/* Дата рождения - с date picker */}
            <div className="mb-4">
              <Label className="text-sm text-muted-foreground mb-2 block">Дата рождения</Label>
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger asChild>
                  <button
                    className={cn(
                      "flex h-10 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background items-center justify-between",
                      !dateOfBirth && "text-muted-foreground"
                    )}
                  >
                    <span>{dateOfBirth || "ДД/ММ/ГГГГ"}</span>
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-popover z-50" align="start">
                  <Calendar
                    mode="single"
                    selected={parseDateString(dateOfBirth)}
                    onSelect={handleDateSelect}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Телефон */}
            <div className="mb-4">
              <Label className="text-sm text-muted-foreground mb-2 block">Телефон</Label>
              <Input 
                type="tel"
                inputMode="numeric"
                placeholder="+7 (999) 123-45-67"
                value={phone}
                onChange={handlePhoneChange}
                className="bg-muted/50 border-border"
              />
            </div>

            {/* Email + toggle уведомлений */}
            <div className="mb-4">
              <Label className="text-sm text-muted-foreground mb-2 block">Электронная почта</Label>
              <Input 
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-muted/50 border-border"
              />
              <div className="flex items-center justify-between mt-2.5 px-1">
                <Label htmlFor="email-notifications" className="text-xs text-muted-foreground cursor-pointer">
                  Получать уведомления на эл. почту
                </Label>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                  className="scale-90"
                />
              </div>
            </div>

            {/* Город проживания - с dropdown */}
            <div className="mb-6">
              <Label className="text-sm text-muted-foreground mb-2 block">Город проживания</Label>
              <Popover open={cityDropdownOpen} onOpenChange={setCityDropdownOpen}>
                <PopoverTrigger asChild>
                  <button
                    className={cn(
                      "flex h-10 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background items-center justify-between",
                      !city && "text-muted-foreground"
                    )}
                  >
                    <span>{city || "Выберите город"}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-popover z-50" align="start">
                  <div className="p-2 border-b border-border">
                    <Input
                      placeholder="Поиск города..."
                      value={citySearch}
                      onChange={(e) => setCitySearch(e.target.value)}
                      className="h-8 text-sm"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto py-1">
                    {filteredCities.length > 0 ? (
                      filteredCities.map((c) => (
                        <button
                          key={c}
                          className={cn(
                            "w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors",
                            city === c && "bg-primary/10 text-primary font-medium"
                          )}
                          onClick={() => {
                            setCity(c);
                            setCitySearch("");
                            setCityDropdownOpen(false);
                          }}
                        >
                          {c}
                        </button>
                      ))
                    ) : (
                      <p className="px-3 py-2 text-sm text-muted-foreground">Не найдено</p>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
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
                <div 
                  key={index} 
                  className="bg-muted/30 rounded-xl p-3 hover:shadow-md transition-shadow flex flex-col cursor-pointer"
                  onClick={() => setIntegrationModalIndex(index)}
                >
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
            
            {/* Credit card visual — independent from account, masked */}
            <div className="relative w-full max-w-[280px] h-[160px] bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500 rounded-2xl p-5 mb-4 shadow-lg">
              <div className="absolute top-5 left-5">
                <div className="w-10 h-7 bg-yellow-300/80 rounded-md" />
              </div>
              <div className="absolute bottom-16 left-5 text-white/90 text-sm tracking-[0.2em] font-mono">
                •••• •••• •••• 6844
              </div>
              <div className="absolute bottom-5 left-5 text-white/70 text-sm font-mono">
                •••• ••••
              </div>
              <div className="absolute bottom-5 right-5">
                <div className="flex -space-x-3">
                  <div className="w-8 h-8 rounded-full bg-red-500/80" />
                  <div className="w-8 h-8 rounded-full bg-orange-400/80" />
                </div>
              </div>
            </div>

            {/* Добавить карту — интерактивная пустая карточка */}
            <div 
              className="relative w-full max-w-[280px] h-[160px] rounded-2xl border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-3 group"
              onClick={() => setCardSettingsOpen(true)}
            >
              <div className="w-12 h-12 rounded-full bg-muted/80 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                <CreditCard className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground group-hover:text-primary transition-colors font-medium">
                <Plus className="h-4 w-4" />
                Добавить карту
              </div>
            </div>
          </div>
        </div>

        {/* Правая колонка - Подписка & Транзакции & Календарь */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Подписка */}
          <div className="bg-card rounded-2xl p-6 border border-border opacity-0 animate-fade-in-up" style={{ animationDelay: "250ms", animationFillMode: "forwards" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Подписка</h3>
              <button 
                className="text-sm text-primary hover:underline"
                onClick={() => navigate("/billing")}
              >
                Все планы
              </button>
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

            <Button 
              className="w-full bg-primary hover:bg-primary/90"
              onClick={() => setPaymentModalOpen(true)}
            >
              Продлить подписку
            </Button>
          </div>

          {/* История транзакций — больше элементов + скролл */}
          <div className="bg-card rounded-2xl p-6 border border-border opacity-0 animate-fade-in-up" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Последние транзакции</h3>
              <button className="text-sm text-primary hover:underline">Все</button>
            </div>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin">
              {CABINET_TRANSACTIONS.slice(0, MAX_VISIBLE_TRANSACTIONS).map((transaction, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${transaction.bgColor} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-sm font-bold text-primary">{transaction.initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{transaction.title}</p>
                    <p className={`text-sm ${transaction.color}`}>{transaction.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Календарь / Заметки */}
          <CalendarNotes />
        </div>
      </div>
      )}

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

      {/* Модальное окно интеграции */}
      <Dialog open={integrationModalIndex !== null} onOpenChange={(open) => !open && setIntegrationModalIndex(null)}>
        <DialogContent>
          {integrationModalIndex !== null && (
            <>
              <DialogHeader>
                <DialogTitle>{integrationCards[integrationModalIndex].modalTitle}</DialogTitle>
                <DialogDescription>{integrationCards[integrationModalIndex].modalDescription}</DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Ссылка для подключения</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      readOnly 
                      value={integrationCards[integrationModalIndex].link} 
                      className="bg-muted/50 border-border text-sm flex-1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="flex-shrink-0"
                      onClick={() => handleCopyLink(integrationModalIndex, integrationCards[integrationModalIndex].link)}
                    >
                      {copiedLink === integrationModalIndex ? (
                        <Check className="h-4 w-4 text-primary" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Преимущества:</h4>
                  <ul className="space-y-1.5">
                    {integrationCards[integrationModalIndex].advantages.map((adv, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>{adv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Modal for subscription renewal */}
      <PaymentModal
        open={paymentModalOpen}
        onOpenChange={setPaymentModalOpen}
        plan={{
          name: "Professional",
          price: "$89.99",
          period: "/ год",
          badge: "PRO",
        }}
      />
    </AppLayout>
  );
};

export default Cabinet;
