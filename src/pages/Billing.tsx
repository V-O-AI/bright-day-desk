import { AppLayout } from "@/components/layout/AppLayout";
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
import { Check, Search, Filter, Download, Eye, Tag, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import ReferralProgram from "@/components/billing/ReferralProgram";
import PaymentModal from "@/components/billing/PaymentModal";
import { toast } from "@/hooks/use-toast";

type ActiveTab = "billing" | "referral";

const Billing = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("billing");
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{
    name: string;
    price: string;
    period: string;
    badge: string;
  } | null>(null);
  const [appliedTickets, setAppliedTickets] = useState<Set<number>>(new Set());

  const plans = [
    {
      name: "Starter Plan",
      badge: "FREE",
      badgeColor: "bg-orange-100 text-orange-600",
      price: "$10.00",
      period: "/month",
      buttonText: "Current Plan",
      buttonVariant: "outline" as const,
      isHighlighted: false,
      features: [
        "Manage up to 1,000 contacts",
        "Basic customer management tools",
        "Task and workflow automation",
        "Integration with third-party apps (limited)",
        "Customizable dashboards",
      ],
    },
    {
      name: "Growth Plan",
      badge: "PRO",
      badgeColor: "bg-green-500 text-white",
      price: "$79.00",
      period: "/month",
      buttonText: "Upgrade Plan",
      buttonVariant: "outline" as const,
      isHighlighted: true,
      features: [
        "Manage up to 10,000 contacts",
        "Advanced customer management",
        "Full workflow automation",
        "Real-time reporting and analytics",
        "Collaborative team features",
      ],
    },
    {
      name: "Enterprise Plan",
      badge: "ADVANCE",
      badgeColor: "bg-orange-100 text-orange-600",
      price: "Custom",
      period: "/month",
      buttonText: "Contact Us",
      buttonVariant: "default" as const,
      isHighlighted: false,
      features: [
        "Unlimited contacts and data storage",
        "Custom workflow and automation setups",
        "Dedicated account manager",
        "Advanced analytics and reporting",
        "Full API access and custom integrations",
      ],
    },
  ];

  const tickets = [
    {
      name: "Скидка 10% на товары",
      discount: "-10%",
      validUntil: "2025-03-01",
      category: "Одежда",
      status: "Активен",
    },
    {
      name: "Бесплатная доставка",
      discount: "-$5.00",
      validUntil: "2025-02-15",
      category: "Все товары",
      status: "Активен",
    },
    {
      name: "Скидка 20% на обувь",
      discount: "-20%",
      validUntil: "2025-04-01",
      category: "Обувь",
      status: "Активен",
    },
    {
      name: "Кэшбэк 5%",
      discount: "-5%",
      validUntil: "2025-01-31",
      category: "Все товары",
      status: "Истёк",
    },
    {
      name: "Промо на детские товары",
      discount: "-15%",
      validUntil: "2025-05-01",
      category: "Детские",
      status: "Активен",
    },
  ];

  const filteredTickets = tickets.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePlanClick = (plan: typeof plans[0]) => {
    setSelectedPlan({
      name: plan.name,
      price: plan.price,
      period: plan.period,
      badge: plan.badge,
    });
    setPaymentModalOpen(true);
  };

  const handleApplyTicket = (index: number) => {
    if (appliedTickets.has(index)) return;
    const newSet = new Set(appliedTickets);
    newSet.add(index);
    setAppliedTickets(newSet);
    toast({
      title: "Тикет применён",
      description: `${tickets[index].name} успешно активирован`,
    });
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Tab Navigation */}
        <div className="flex items-center gap-1 border-b border-border">
          <button
            onClick={() => setActiveTab("billing")}
            className={cn(
              "px-5 py-3 text-sm font-medium transition-colors relative",
              activeTab === "billing"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Billing
            {activeTab === "billing" && (
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
            Реферальная программа
            {activeTab === "referral" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t" />
            )}
          </button>
        </div>

        {activeTab === "referral" ? (
          <ReferralProgram />
        ) : (
          <div className="space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Billing & Subscription</h1>
                <p className="text-muted-foreground mt-1">
                  Keep track of your subscription details, update your billing information, and control your account's payment
                </p>
              </div>
              <div className="flex items-center bg-muted rounded-lg p-1">
                <button
                  onClick={() => setBillingPeriod("monthly")}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                    billingPeriod === "monthly"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingPeriod("yearly")}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                    billingPeriod === "yearly"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Yearly
                </button>
              </div>
            </div>

            {/* Plan Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan, index) => (
                <Card
                  key={index}
                  onClick={() => handlePlanClick(plan)}
                  className={cn(
                    "relative border transition-all duration-200 cursor-pointer group",
                    plan.isHighlighted
                      ? "bg-zinc-900 text-white border-zinc-800 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 hover:border-primary/40"
                      : "bg-background border-border hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 hover:border-primary/40"
                  )}
                >
                  {/* Corner dots */}
                  <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-muted-foreground/20" />
                  <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-muted-foreground/20" />
                  <div className="absolute bottom-3 left-3 w-2 h-2 rounded-full bg-muted-foreground/20" />
                  <div className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-muted-foreground/20" />

                  <CardContent className="p-6 pt-8">
                    {/* Plan Header */}
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={cn(
                        "text-lg font-medium",
                        plan.isHighlighted ? "text-white" : "text-foreground"
                      )}>
                        {plan.name}
                      </h3>
                      <Badge className={cn("text-xs font-medium", plan.badgeColor)}>
                        {plan.badge}
                      </Badge>
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                      <span className={cn(
                        "text-4xl font-bold",
                        plan.isHighlighted ? "text-white" : "text-foreground"
                      )}>
                        {plan.price}
                      </span>
                      <span className={cn(
                        "text-sm",
                        plan.isHighlighted ? "text-zinc-400" : "text-muted-foreground"
                      )}>
                        {plan.period}
                      </span>
                    </div>

                    {/* Button */}
                    <Button
                      variant={plan.buttonVariant}
                      className={cn(
                        "w-full mb-6 transition-all duration-200",
                        plan.isHighlighted
                          ? "bg-white text-zinc-900 hover:bg-zinc-100 border-0 group-hover:bg-primary group-hover:text-white"
                          : plan.buttonVariant === "default"
                            ? "bg-zinc-900 text-white hover:bg-zinc-800 group-hover:bg-primary"
                            : "border-zinc-200 group-hover:border-primary group-hover:text-primary"
                      )}
                    >
                      {plan.buttonText}
                    </Button>

                    {/* Features */}
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <Check className={cn(
                            "h-4 w-4 mt-0.5 shrink-0",
                            plan.isHighlighted ? "text-white" : "text-foreground"
                          )} />
                          <span className={cn(
                            "text-sm",
                            plan.isHighlighted ? "text-zinc-300" : "text-muted-foreground"
                          )}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Ticket Journal */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">Журнал тикетов</h2>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Поиск..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 w-48 bg-background"
                    />
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Фильтр
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Экспорт
                  </Button>
                </div>
              </div>

              <Card className="border">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="font-medium text-foreground">Тикет</TableHead>
                      <TableHead className="font-medium text-foreground">Скидка</TableHead>
                      <TableHead className="font-medium text-foreground">Категория</TableHead>
                      <TableHead className="font-medium text-foreground">Действует до</TableHead>
                      <TableHead className="font-medium text-foreground">Статус</TableHead>
                      <TableHead className="font-medium text-foreground text-right">Действие</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTickets.map((item, index) => (
                      <TableRow key={index} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="font-semibold text-primary">{item.discount}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                        </TableCell>
                        <TableCell>{item.validUntil}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "w-2 h-2 rounded-full",
                                item.status === "Активен" ? "bg-green-500" : "bg-red-400"
                              )}
                            />
                            <span
                              className={cn(
                                "text-sm",
                                item.status === "Активен" ? "text-green-600" : "text-red-500"
                              )}
                            >
                              {item.status}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {item.status === "Активен" ? (
                              <Button
                                variant={appliedTickets.has(index) ? "ghost" : "outline"}
                                size="sm"
                                className={cn(
                                  "gap-1.5 text-xs",
                                  appliedTickets.has(index)
                                    ? "text-green-600"
                                    : "hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                                )}
                                onClick={() => handleApplyTicket(index)}
                                disabled={appliedTickets.has(index)}
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                {appliedTickets.has(index) ? "Применён" : "Применить"}
                              </Button>
                            ) : (
                              <span className="text-xs text-muted-foreground">Недоступен</span>
                            )}
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          </div>
        )}
      </div>

      <PaymentModal
        open={paymentModalOpen}
        onOpenChange={setPaymentModalOpen}
        plan={selectedPlan}
      />
    </AppLayout>
  );
};

export default Billing;
