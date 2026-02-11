import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Palette, 
  User, 
  Shield, 
  ChevronRight, 
  Check,
  Sun,
  Moon,
  Monitor
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type SettingsSection = "appearances" | "account" | "security";

const Settings = () => {
  const [activeSection, setActiveSection] = useState<SettingsSection>("account");
  const [profileCompletion] = useState(75);

  // Account settings state
  const [firstName, setFirstName] = useState("Александр");
  const [lastName, setLastName] = useState("Иванов");
  const [email] = useState("alex@email.com");
  const [notifications, setNotifications] = useState({
    withdrawActivity: true,
    weeklyReport: true,
    paymentSuccess: false,
    passwordChange: false,
    topUpSuccess: false,
    sendMoneySuccess: true,
  });

  // Appearance settings state
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium");

  // Security settings state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handlePasswordChange = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error("Новый пароль должен содержать минимум 6 символов");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Пароли не совпадают");
      return;
    }
    setIsUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success("Пароль успешно изменён");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message || "Не удалось изменить пароль");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const menuItems = [
    {
      id: "appearances" as SettingsSection,
      icon: Palette,
      title: "Внешний вид",
      description: "Тема, размер шрифта",
    },
    {
      id: "account" as SettingsSection,
      icon: User,
      title: "Уведомления",
      description: "Настройки уведомлений",
    },
    {
      id: "security" as SettingsSection,
      icon: Shield,
      title: "Безопасность",
      description: "Смена пароля, 2FA",
    },
  ];

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderAppearancesContent = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Внешний вид</h2>
        <p className="text-sm text-muted-foreground">Настройте внешний вид приложения</p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-base font-medium text-foreground mb-4">Тема оформления</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { id: "light", icon: Sun, label: "Светлая" },
              { id: "dark", icon: Moon, label: "Тёмная" },
              { id: "system", icon: Monitor, label: "Системная" },
            ].map((option) => (
              <Card
                key={option.id}
                className={cn(
                  "cursor-pointer border-2 transition-colors",
                  theme === option.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
                onClick={() => setTheme(option.id as typeof theme)}
              >
                <CardContent className="p-4 flex flex-col items-center gap-2">
                  <option.icon className={cn(
                    "h-6 w-6",
                    theme === option.id ? "text-primary" : "text-muted-foreground"
                  )} />
                  <span className={cn(
                    "text-sm font-medium",
                    theme === option.id ? "text-primary" : "text-muted-foreground"
                  )}>
                    {option.label}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-base font-medium text-foreground mb-4">Размер шрифта</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { id: "small", label: "Маленький", size: "text-xs" },
              { id: "medium", label: "Средний", size: "text-sm" },
              { id: "large", label: "Большой", size: "text-base" },
            ].map((option) => (
              <Card
                key={option.id}
                className={cn(
                  "cursor-pointer border-2 transition-colors",
                  fontSize === option.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
                onClick={() => setFontSize(option.id as typeof fontSize)}
              >
                <CardContent className="p-4 flex flex-col items-center gap-2">
                  <span className={cn(option.size, "font-medium")}>Aa</span>
                  <span className={cn(
                    "text-sm font-medium",
                    fontSize === option.id ? "text-primary" : "text-muted-foreground"
                  )}>
                    {option.label}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button variant="outline">Сбросить</Button>
        <Button>Сохранить изменения</Button>
      </div>
    </div>
  );

  const renderAccountContent = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Уведомления</h2>
        <p className="text-sm text-muted-foreground">Выберите типы уведомлений, которые хотите получать</p>
      </div>

      <div className="space-y-6">
        <div>
          
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: "withdrawActivity", label: "Активность вывода" },
              { key: "passwordChange", label: "Смена пароля" },
              { key: "weeklyReport", label: "Еженедельный отчёт" },
              { key: "topUpSuccess", label: "Успешное пополнение" },
              { key: "paymentSuccess", label: "Успешный платёж" },
              { key: "sendMoneySuccess", label: "Успешный перевод" },
            ].map((item) => (
              <div key={item.key} className="flex items-center space-x-3">
                <Checkbox 
                  id={item.key}
                  checked={notifications[item.key as keyof typeof notifications]}
                  onCheckedChange={() => handleNotificationChange(item.key as keyof typeof notifications)}
                />
                <Label 
                  htmlFor={item.key} 
                  className="text-sm font-normal cursor-pointer"
                >
                  {item.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button variant="outline">Отменить изменения</Button>
        <Button>Сохранить изменения</Button>
      </div>
    </div>
  );

  const renderSecurityContent = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Безопасность</h2>
        <p className="text-sm text-muted-foreground">Настройки безопасности вашего аккаунта</p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-base font-medium text-foreground mb-4">Смена пароля</h3>
          
          <div className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Текущий пароль</Label>
              <Input 
                id="currentPassword" 
                type="password"
                placeholder="••••••••"
                className="bg-muted/50"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Новый пароль</Label>
              <Input 
                id="newPassword" 
                type="password"
                placeholder="••••••••"
                className="bg-muted/50"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
              <Input 
                id="confirmPassword" 
                type="password"
                placeholder="••••••••"
                className="bg-muted/50"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button 
              onClick={handlePasswordChange} 
              disabled={isUpdatingPassword || !newPassword || !confirmPassword}
              className="mt-2"
            >
              {isUpdatingPassword ? "Сохранение..." : "Изменить пароль"}
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-base font-medium text-foreground mb-4">Двухфакторная аутентификация</h3>
          
          <Card className="border">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Включить 2FA</p>
                <p className="text-sm text-muted-foreground">
                  Добавьте дополнительный уровень защиты
                </p>
              </div>
              <Switch
                checked={twoFactorEnabled}
                onCheckedChange={setTwoFactorEnabled}
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <h3 className="text-base font-medium text-foreground mb-4">Активные сессии</h3>
          
          <Card className="border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Текущее устройство</p>
                  <p className="text-sm text-muted-foreground">Chrome на Windows • Москва</p>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Активна
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button variant="outline">Отменить</Button>
        <Button>Сохранить изменения</Button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "appearances":
        return renderAppearancesContent();
      case "account":
        return renderAccountContent();
      case "security":
        return renderSecurityContent();
      default:
        return renderAccountContent();
    }
  };

  // Calculate stroke dasharray for circular progress
  const circumference = 2 * Math.PI * 36;
  const strokeDasharray = `${(profileCompletion / 100) * circumference} ${circumference}`;

  return (
    <AppLayout>
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 h-full">
        {/* Left Sidebar */}
        <div className="space-y-6">
          {/* Profile Completion Card */}
          <Card className="border bg-primary text-primary-foreground overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="6"
                      className="opacity-20"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="6"
                      strokeDasharray={strokeDasharray}
                      strokeLinecap="round"
                      className="text-primary-foreground"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold">{profileCompletion}%</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">Информация профиля</h3>
                  <p className="text-sm opacity-80">
                    Заполните профиль для доступа ко всем функциям
                  </p>
                </div>
              </div>
              <Button 
                variant="secondary" 
                className="w-full mt-4 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                Заполнить профиль
              </Button>
            </CardContent>
          </Card>

          {/* Menu Items */}
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <Card
                  key={item.id}
                  className={cn(
                    "cursor-pointer border transition-colors",
                    isActive 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50"
                  )}
                  onClick={() => setActiveSection(item.id)}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      isActive ? "bg-primary/10" : "bg-muted"
                    )}>
                      <Icon className={cn(
                        "h-5 w-5",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )} />
                    </div>
                    <div className="flex-1">
                      <p className={cn(
                        "font-medium",
                        isActive ? "text-primary" : "text-foreground"
                      )}>
                        {item.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    <ChevronRight className={cn(
                      "h-5 w-5",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )} />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Right Content Area */}
        <Card className="border">
          <CardContent className="p-6">
            {renderContent()}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Settings;
