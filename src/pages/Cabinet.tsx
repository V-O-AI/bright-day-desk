import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar as CalendarIcon, Plus, Settings, Copy, Check, Users, CreditCard, ChevronDown, User, LinkIcon, Wallet } from "lucide-react";
import { CalendarNotes } from "@/components/CalendarNotes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useUserProfile } from "@/hooks/useUserProfile";
import ReferralProgram from "@/components/billing/ReferralProgram";
import PaymentModal from "@/components/billing/PaymentModal";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useIsMobile } from "@/hooks/use-mobile";

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
  { initials: "UP", title: 'Оплата плана "Professional" (месяц)', amount: "- $89,00", color: "text-destructive", bgColor: "bg-blue-100 dark:bg-blue-900/30" },
  { initials: "BN", title: 'Бонус за приглашённого друга', amount: "+ $10,00", color: "text-primary", bgColor: "bg-amber-100 dark:bg-amber-900/30" },
  { initials: "RF", title: 'Частичный возврат средств', amount: "+ $12,00", color: "text-primary", bgColor: "bg-green-100 dark:bg-green-900/30" },
  { initials: "UP", title: 'Оплата плана "Professional" (месяц)', amount: "- $89,00", color: "text-destructive", bgColor: "bg-blue-100 dark:bg-blue-900/30" },
  { initials: "TK", title: 'Применён тикет "10% скидка"', amount: "+ $8,90", color: "text-primary", bgColor: "bg-orange-100 dark:bg-orange-900/30" },
  { initials: "UP", title: 'Оплата плана "Professional" (месяц)', amount: "- $89,00", color: "text-destructive", bgColor: "bg-blue-100 dark:bg-blue-900/30" },
  { initials: "BN", title: 'Кешбэк за годовую подписку', amount: "+ $45,00", color: "text-primary", bgColor: "bg-amber-100 dark:bg-amber-900/30" },
];

type MobileSection = "profile" | "accounts" | "finance";

const Cabinet = () => {
  const [activeTab, setActiveTab] = useState<"cabinet" | "referral">("cabinet");
  const [mobileSection, setMobileSection] = useState<MobileSection>("profile");
  const navigate = useNavigate();
  const { profile, isLoading, saveProfile } = useUserProfile();
  const isMobile = useIsMobile(1024);

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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleaned = value.replace(/[^0-9+\s\-()]/g, "");
    setPhone(cleaned);
  };

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
      advantages: ["Все в одном месте", "Быстрый учет фин операций", "Мгновенное действие без ПК", "Экономия времени", "Передача данных для аналитики"],
      modalTitle: "Подключение склада к Telegram",
      modalDescription: "Интеграция позволяет управлять складом прямо из Telegram-бота. Вы сможете добавлять, редактировать и отслеживать товары, получать уведомления о поступлениях и списаниях, а также формировать отчёты — всё без необходимости открывать компьютер.",
      link: "https://t.me/your_warehouse_bot",
    },
    {
      image: cardConsultant,
      title: "Подключить ИИ-консультанта",
      advantages: ["Экономия времени на ответ", "Сокращение ожидания пользователей", "Моментальный мониторинг склада", "Ответы исходя из аналитики клиентов"],
      modalTitle: "Подключение ИИ-консультанта",
      modalDescription: "ИИ-консультант автоматически отвечает клиентам на основе данных вашего склада и аналитики. Он обрабатывает запросы 24/7, снижает нагрузку на менеджеров и повышает скорость обслуживания, используя актуальную информацию о наличии и ценах.",
      link: "https://t.me/your_ai_consultant_bot",
    },
    {
      image: cardNotifications,
      title: "Уведомления о бизнесе через Telegram",
      advantages: ["Ежедневный мониторинг дел бизнеса", "Получение отчетов прямо в TG", "Моментальные уведомления об аномалиях бизнеса", "Уведомления о готовности клиента купить"],
      modalTitle: "Подключение бизнес-уведомлений через Telegram",
      modalDescription: "Получайте ежедневные отчёты, оповещения об аномалиях и уведомления о «горячих» клиентах прямо в Telegram.",
      link: "https://t.me/your_notifications_bot",
    },
  ];

  const handleCopyLink = (index: number, link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(index);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  // ── Shared sub-components ──

  const ProfileSection = () => (
    <div className="bg-card rounded-2xl p-4 lg:p-6 border border-border opacity-0 animate-fade-in-up" style={{ animationDelay: "0ms", animationFillMode: "forwards" }}>
      <h2 className="text-base lg:text-lg font-semibold mb-4 lg:mb-6">Данные аккаунта</h2>
      
      {/* Фото профиля */}
      <div className="mb-4 lg:mb-6">
        <Label className="text-sm text-muted-foreground mb-2 block">Фото профиля</Label>
        <div className="flex items-center gap-4">
          <Avatar className="w-12 h-12 lg:w-14 lg:h-14">
            <AvatarImage src="" />
            <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white text-base lg:text-lg">
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

      {/* Name fields — side by side on mobile */}
      <div className="grid grid-cols-2 gap-3 mb-3 lg:mb-4 lg:grid-cols-1">
        <div>
          <Label className="text-sm text-muted-foreground mb-1.5 block">Имя</Label>
          <Input placeholder="Введите имя" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="bg-muted/50 border-border" />
        </div>
        <div>
          <Label className="text-sm text-muted-foreground mb-1.5 block">Фамилия</Label>
          <Input placeholder="Введите фамилию" value={lastName} onChange={(e) => setLastName(e.target.value)} className="bg-muted/50 border-border" />
        </div>
      </div>

      {/* Date of birth */}
      <div className="mb-3 lg:mb-4">
        <Label className="text-sm text-muted-foreground mb-1.5 block">Дата рождения</Label>
        <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
          <PopoverTrigger asChild>
            <button className={cn("flex h-10 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background items-center justify-between", !dateOfBirth && "text-muted-foreground")}>
              <span>{dateOfBirth || "ДД/ММ/ГГГГ"}</span>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-popover z-50" align="start">
            <Calendar mode="single" selected={parseDateString(dateOfBirth)} onSelect={handleDateSelect} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus className="p-3 pointer-events-auto" />
          </PopoverContent>
        </Popover>
      </div>

      {/* Phone */}
      <div className="mb-3 lg:mb-4">
        <Label className="text-sm text-muted-foreground mb-1.5 block">Телефон</Label>
        <Input type="tel" inputMode="numeric" placeholder="+7 (999) 123-45-67" value={phone} onChange={handlePhoneChange} className="bg-muted/50 border-border" />
      </div>

      {/* Email */}
      <div className="mb-3 lg:mb-4">
        <Label className="text-sm text-muted-foreground mb-1.5 block">Электронная почта</Label>
        <Input type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-muted/50 border-border" />
        <div className="flex items-center justify-between mt-2 px-1">
          <Label htmlFor="email-notifications" className="text-xs text-muted-foreground cursor-pointer">Получать уведомления на эл. почту</Label>
          <Switch id="email-notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} className="scale-90" />
        </div>
      </div>

      {/* City */}
      <div className="mb-4 lg:mb-6">
        <Label className="text-sm text-muted-foreground mb-1.5 block">Город проживания</Label>
        <Popover open={cityDropdownOpen} onOpenChange={setCityDropdownOpen}>
          <PopoverTrigger asChild>
            <button className={cn("flex h-10 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background items-center justify-between", !city && "text-muted-foreground")}>
              <span>{city || "Выберите город"}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-popover z-50" align="start">
            <div className="p-2 border-b border-border">
              <Input placeholder="Поиск города..." value={citySearch} onChange={(e) => setCitySearch(e.target.value)} className="h-8 text-sm" autoFocus />
            </div>
            <div className="max-h-48 overflow-y-auto py-1">
              {filteredCities.length > 0 ? filteredCities.map((c) => (
                <button key={c} className={cn("w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors", city === c && "bg-primary/10 text-primary font-medium")} onClick={() => { setCity(c); setCitySearch(""); setCityDropdownOpen(false); }}>{c}</button>
              )) : <p className="px-3 py-2 text-sm text-muted-foreground">Не найдено</p>}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 lg:flex-col">
        <Button className="flex-1 lg:w-full bg-primary hover:bg-primary/90" onClick={handleSave}>Сохранить</Button>
        <Button variant="outline" className="flex-1 lg:w-full" onClick={handleCancel}>Отменить</Button>
      </div>
    </div>
  );

  const CardsBlock = () => (
    <div className="bg-card rounded-2xl p-4 lg:p-6 border border-border opacity-0 animate-fade-in-up" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
      <div className="flex items-center justify-between mb-3 lg:mb-4">
        <h3 className="font-semibold text-sm lg:text-base">Карты</h3>
        <button className="p-2 hover:bg-muted rounded-lg transition-colors" onClick={() => setCardSettingsOpen(true)}>
          <Settings className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative w-full sm:max-w-[280px] h-[150px] sm:h-[160px] bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500 rounded-2xl p-5 shadow-lg flex-shrink-0">
          <div className="absolute top-5 left-5"><div className="w-10 h-7 bg-yellow-300/80 rounded-md" /></div>
          <div className="absolute bottom-16 left-5 text-white/90 text-sm tracking-[0.2em] font-mono">•••• •••• •••• 6844</div>
          <div className="absolute bottom-5 left-5 text-white/70 text-sm font-mono">•••• ••••</div>
          <div className="absolute bottom-5 right-5"><div className="flex -space-x-3"><div className="w-8 h-8 rounded-full bg-red-500/80" /><div className="w-8 h-8 rounded-full bg-orange-400/80" /></div></div>
        </div>
        <div className="relative w-full sm:max-w-[280px] h-[120px] sm:h-[160px] rounded-2xl border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 group" onClick={() => setCardSettingsOpen(true)}>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-muted/80 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
            <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground group-hover:text-primary transition-colors font-medium">
            <Plus className="h-4 w-4" />Добавить карту
          </div>
        </div>
      </div>
    </div>
  );

  const AccountsSection = () => (
    <div className="space-y-4 lg:space-y-6">
      {/* Привязать аккаунты */}
      <div className="bg-card rounded-2xl p-4 lg:p-6 border border-border opacity-0 animate-fade-in-up" style={{ animationDelay: "50ms", animationFillMode: "forwards" }}>
        <div className="flex items-center justify-between mb-3 lg:mb-4">
          <h3 className="font-semibold text-sm lg:text-base">Привязать аккаунты</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {integrationCards.map((card, index) => (
            <div key={index} className="bg-muted/30 rounded-xl p-3 hover:shadow-md transition-shadow flex flex-col cursor-pointer" onClick={() => setIntegrationModalIndex(index)}>
              <div className="h-20 sm:h-24 rounded-lg mb-2 sm:mb-3 overflow-hidden">
                <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xs font-semibold mb-1.5 sm:mb-2 line-clamp-2">{card.title}</h3>
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

      {/* Карты — only on desktop */}
      {!isMobile && <CardsBlock />}

      {/* Календарь — only on mobile */}
      {isMobile && <CalendarNotes />}
    </div>
  );

  const FinanceSection = () => (
    <div className="space-y-4 lg:space-y-6">
      {/* Подписка */}
      <div className="bg-card rounded-2xl p-4 lg:p-6 border border-border opacity-0 animate-fade-in-up" style={{ animationDelay: "250ms", animationFillMode: "forwards" }}>
        <div className="flex items-center justify-between mb-3 lg:mb-4">
          <h3 className="font-semibold text-sm lg:text-base">Подписка</h3>
          <button className="text-sm text-primary hover:underline" onClick={() => navigate("/billing")}>Все планы</button>
        </div>
        <div className="mb-4">
          <h4 className="font-semibold text-base lg:text-lg mb-2">Professional</h4>
          <p className="text-sm text-muted-foreground mb-3 lg:mb-4">Полный набор функций включая персонального ИИ-консультанта и неограниченный доступ к материалам</p>
          <div className="flex items-baseline gap-1 mb-3 lg:mb-4">
            <span className="text-2xl lg:text-3xl font-bold">$89.99</span>
            <span className="text-muted-foreground">/ год</span>
          </div>
        </div>
        <Button className="w-full bg-primary hover:bg-primary/90" onClick={() => setPaymentModalOpen(true)}>Продлить подписку</Button>
      </div>

      {/* Карты — only on mobile */}
      {isMobile && <CardsBlock />}

      {/* Транзакции */}
      <div className="bg-card rounded-2xl p-4 lg:p-6 border border-border opacity-0 animate-fade-in-up" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
        <div className="flex items-center justify-between mb-3 lg:mb-4">
          <h3 className="font-semibold text-sm lg:text-base">Последние транзакции</h3>
          <button className="text-sm text-primary hover:underline">Все</button>
        </div>
        <div className="space-y-3 lg:space-y-4 max-h-[280px] lg:max-h-[340px] overflow-y-auto pr-1 scrollbar-thin">
          {CABINET_TRANSACTIONS.map((transaction, index) => (
            <div key={index} className="flex items-center gap-3 lg:gap-4">
              <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl ${transaction.bgColor} flex items-center justify-center flex-shrink-0`}>
                <span className="text-xs lg:text-sm font-bold text-primary">{transaction.initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs lg:text-sm font-medium truncate">{transaction.title}</p>
                <p className={`text-xs lg:text-sm ${transaction.color}`}>{transaction.amount}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Календарь — only on desktop */}
      {!isMobile && <CalendarNotes />}
    </div>
  );

  // ── Mobile section tabs ──
  const mobileSections: { key: MobileSection; label: string; icon: any }[] = [
    { key: "profile", label: "Профиль", icon: User },
    { key: "accounts", label: "Аккаунты", icon: LinkIcon },
    { key: "finance", label: "Финансы", icon: Wallet },
  ];

  return (
    <AppLayout>
      {/* Main Tab Navigation */}
      <div className="flex items-center gap-1 border-b border-border mb-4 lg:mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab("cabinet")}
          className={cn("px-4 lg:px-5 py-2.5 lg:py-3 text-sm font-medium transition-colors relative whitespace-nowrap", activeTab === "cabinet" ? "text-foreground" : "text-muted-foreground hover:text-foreground")}
        >
          Личный кабинет
          {activeTab === "cabinet" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t" />}
        </button>
        <button
          onClick={() => setActiveTab("referral")}
          className={cn("px-4 lg:px-5 py-2.5 lg:py-3 text-sm font-medium transition-colors relative whitespace-nowrap", activeTab === "referral" ? "text-foreground" : "text-muted-foreground hover:text-foreground")}
        >
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            Реферальная программа
          </span>
          {activeTab === "referral" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t" />}
        </button>
      </div>

      {activeTab === "referral" ? (
        <ReferralProgram />
      ) : (
        <>
          {/* Mobile: section switcher */}
          {isMobile && (
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
              {mobileSections.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setMobileSection(key)}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap border",
                    mobileSection === key
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-card text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Mobile: show selected section only */}
          {isMobile ? (
            <div className="pb-6">
              {mobileSection === "profile" && <ProfileSection />}
              {mobileSection === "accounts" && <AccountsSection />}
              {mobileSection === "finance" && <FinanceSection />}
            </div>
          ) : (
            /* Desktop: 12-col grid */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full overflow-auto pb-6">
              <div className="lg:col-span-3 space-y-6">
                <ProfileSection />
              </div>
              <div className="lg:col-span-5 space-y-6">
                <AccountsSection />
              </div>
              <div className="lg:col-span-4 space-y-6">
                <FinanceSection />
              </div>
            </div>
          )}
        </>
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
              <Plus className="h-4 w-4" />Добавить новую карту
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
                    <Input readOnly value={integrationCards[integrationModalIndex].link} className="bg-muted/50 border-border text-sm flex-1" />
                    <Button variant="outline" size="icon" className="flex-shrink-0" onClick={() => handleCopyLink(integrationModalIndex, integrationCards[integrationModalIndex].link)}>
                      {copiedLink === integrationModalIndex ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Преимущества:</h4>
                  <ul className="space-y-1.5">
                    {integrationCards[integrationModalIndex].advantages.map((adv, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span><span>{adv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <PaymentModal open={paymentModalOpen} onOpenChange={setPaymentModalOpen} plan={{ name: "Professional", price: "$89.99", period: "/ год", badge: "PRO" }} />
    </AppLayout>
  );
};

export default Cabinet;
