import { Package, MessageCircle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ConnectionOption {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const connectionOptions: ConnectionOption[] = [
  {
    id: "inventory",
    icon: <Package className="h-6 w-6" />,
    title: "Склад",
    description: "Подключите данные склада для отслеживания товаров и остатков",
  },
  {
    id: "telegram",
    icon: <MessageCircle className="h-6 w-6" />,
    title: "Telegram",
    description: "Свяжите аккаунты Telegram для общения с клиентами",
  },
  {
    id: "financial",
    icon: <TrendingUp className="h-6 w-6" />,
    title: "Финансы",
    description: "Подключите финансовые данные для аналитики доходов и расходов",
  },
];

interface GettingStartedCardProps {
  onConnect?: (optionId: string) => void;
}

export function GettingStartedCard({ onConnect }: GettingStartedCardProps) {
  return (
    <Card className="animate-fade-in border-2 border-dashed border-primary/30 bg-gradient-to-br from-card to-primary/5">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-xl">Начните работу</CardTitle>
        <CardDescription className="text-base">
          Подключите источники данных, чтобы увидеть аналитику и управлять бизнесом
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid gap-4 sm:grid-cols-3">
          {connectionOptions.map((option) => (
            <div
              key={option.id}
              className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-5 text-center transition-all duration-200 hover:border-primary/50 hover:shadow-md hover:shadow-primary/10"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                {option.icon}
              </div>
              <div>
                <h4 className="font-semibold">{option.title}</h4>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {option.description}
                </p>
              </div>
              <Button
                size="sm"
                className="mt-auto w-full"
                onClick={() => onConnect?.(option.id)}
              >
                Подключить
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
