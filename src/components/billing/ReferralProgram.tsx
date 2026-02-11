import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Copy, Users, Gift, TrendingUp, Link2, Share2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const ReferralProgram = () => {
  const [copied, setCopied] = useState(false);

  const referralCode = "REF-AB8K2M";
  const referralLink = "https://app.example.com/ref/AB8K2M";

  const stats = [
    { label: "Приглашено", value: "12", icon: Users, description: "пользователей" },
    { label: "Активных", value: "8", icon: TrendingUp, description: "рефералов" },
    { label: "Заработано", value: "$240", icon: Gift, description: "бонусов" },
  ];

  const referrals = [
    { name: "Иван П.", email: "ivan.p@mail.com", date: "2024-12-15", status: "Активен", bonus: "$20" },
    { name: "Мария С.", email: "maria.s@mail.com", date: "2024-11-28", status: "Активен", bonus: "$20" },
    { name: "Алексей К.", email: "alexey.k@mail.com", date: "2024-11-10", status: "Активен", bonus: "$20" },
    { name: "Елена В.", email: "elena.v@mail.com", date: "2024-10-22", status: "Ожидание", bonus: "—" },
    { name: "Дмитрий Н.", email: "dmitry.n@mail.com", date: "2024-10-05", status: "Активен", bonus: "$20" },
    { name: "Ольга Т.", email: "olga.t@mail.com", date: "2024-09-18", status: "Активен", bonus: "$20" },
  ];

  const tiers = [
    { level: "Бронза", requirement: "1–5 рефералов", reward: "$20 за каждого", isCurrent: true },
    { level: "Серебро", requirement: "6–15 рефералов", reward: "$30 за каждого", isCurrent: false },
    { level: "Золото", requirement: "16+ рефералов", reward: "$50 за каждого", isCurrent: false },
  ];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: "Скопировано!", description: "Ссылка скопирована в буфер обмена" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Реферальная программа</h1>
        <p className="text-muted-foreground mt-1">
          Приглашайте друзей и получайте бонусы за каждого активного реферала
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Referral Link */}
      <Card className="border">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Link2 className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Ваша реферальная ссылка</h3>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Input
                readOnly
                value={referralLink}
                className="pr-24 bg-muted/50 font-mono text-sm"
              />
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-1 top-1/2 -translate-y-1/2 gap-1.5 text-xs"
                onClick={() => handleCopy(referralLink)}
              >
                <Copy className="h-3.5 w-3.5" />
                {copied ? "Скопировано" : "Копировать"}
              </Button>
            </div>
            <Button variant="outline" className="gap-2 shrink-0">
              <Share2 className="h-4 w-4" />
              Поделиться
            </Button>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Ваш код:</span>
            <Badge variant="secondary" className="font-mono tracking-wider">
              {referralCode}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Tier System */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Уровни вознаграждений</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tiers.map((tier, index) => (
            <Card
              key={index}
              className={cn(
                "border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
                tier.isCurrent && "ring-2 ring-primary/30 border-primary/40"
              )}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-foreground">{tier.level}</h4>
                  {tier.isCurrent && (
                    <Badge className="bg-primary/10 text-primary text-xs">Текущий</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{tier.requirement}</p>
                <p className="text-lg font-bold text-foreground mt-2">{tier.reward}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Referrals Table */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Ваши рефералы</h2>
        <Card className="border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-medium text-foreground">Имя</TableHead>
                <TableHead className="font-medium text-foreground">Email</TableHead>
                <TableHead className="font-medium text-foreground">Дата регистрации</TableHead>
                <TableHead className="font-medium text-foreground">Статус</TableHead>
                <TableHead className="font-medium text-foreground text-right">Бонус</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referrals.map((ref, index) => (
                <TableRow key={index} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{ref.name}</TableCell>
                  <TableCell className="text-muted-foreground">{ref.email}</TableCell>
                  <TableCell>{ref.date}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "w-2 h-2 rounded-full",
                          ref.status === "Активен" ? "bg-green-500" : "bg-orange-500"
                        )}
                      />
                      <span
                        className={cn(
                          "text-sm",
                          ref.status === "Активен" ? "text-green-600" : "text-orange-600"
                        )}
                      >
                        {ref.status}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">{ref.bonus}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default ReferralProgram;
