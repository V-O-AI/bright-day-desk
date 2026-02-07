import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Landmark, Smartphone, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: {
    name: string;
    price: string;
    period: string;
    badge: string;
  } | null;
}

const paymentMethods = [
  {
    id: "card",
    label: "Банковская карта",
    description: "Visa, Mastercard, МИР",
    icon: CreditCard,
  },
  {
    id: "bank",
    label: "Банковский перевод",
    description: "Расчётный счёт организации",
    icon: Landmark,
  },
  {
    id: "mobile",
    label: "Мобильный платёж",
    description: "Apple Pay, Google Pay",
    icon: Smartphone,
  },
];

const PaymentModal = ({ open, onOpenChange, plan }: PaymentModalProps) => {
  const [selected, setSelected] = useState<string | null>(null);

  if (!plan) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Оплата плана</DialogTitle>
          <DialogDescription>
            Выберите удобный способ оплаты
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-muted/50 border mb-4">
          <div>
            <p className="font-semibold text-foreground">{plan.name}</p>
            <p className="text-sm text-muted-foreground">
              {plan.price}{plan.period}
            </p>
          </div>
          <Badge variant="secondary" className="text-xs">{plan.badge}</Badge>
        </div>

        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelected(method.id)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-lg border transition-all duration-200 text-left",
                selected === method.id
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                  : "border-border hover:border-muted-foreground/30 hover:bg-muted/30"
              )}
            >
              <div
                className={cn(
                  "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                  selected === method.id ? "bg-primary/10" : "bg-muted"
                )}
              >
                <method.icon
                  className={cn(
                    "h-5 w-5",
                    selected === method.id ? "text-primary" : "text-muted-foreground"
                  )}
                />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground text-sm">{method.label}</p>
                <p className="text-xs text-muted-foreground">{method.description}</p>
              </div>
              {selected === method.id && (
                <Check className="h-5 w-5 text-primary shrink-0" />
              )}
            </button>
          ))}
        </div>

        <Button
          className="w-full mt-4"
          disabled={!selected}
        >
          Перейти к оплате
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
