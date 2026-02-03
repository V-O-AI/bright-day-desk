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
import { Check, Search, Filter, Download, Eye } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const Billing = () => {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [searchQuery, setSearchQuery] = useState("");

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

  const billingHistory = [
    {
      planName: "Starter Plan - Jun 2024",
      amount: "$ 10.00",
      purchaseDate: "2024-06-01",
      endDate: "2024-06-31",
      status: "Processing",
    },
    {
      planName: "Growth Plan - May 2024",
      amount: "$ 79.00",
      purchaseDate: "2024-05-01",
      endDate: "2024-05-31",
      status: "Success",
    },
    {
      planName: "Starter Plan - Apr 2024",
      amount: "$ 10.00",
      purchaseDate: "2024-04-01",
      endDate: "2024-04-30",
      status: "Success",
    },
    {
      planName: "Starter Plan - Mar 2024",
      amount: "$ 10.00",
      purchaseDate: "2024-03-01",
      endDate: "2024-03-31",
      status: "Success",
    },
  ];

  const filteredHistory = billingHistory.filter((item) =>
    item.planName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
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
              className={cn(
                "relative border transition-all",
                plan.isHighlighted
                  ? "bg-zinc-900 text-white border-zinc-800"
                  : "bg-background border-border"
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
                    "w-full mb-6",
                    plan.isHighlighted
                      ? "bg-white text-zinc-900 hover:bg-zinc-100 border-0"
                      : plan.buttonVariant === "default"
                        ? "bg-zinc-900 text-white hover:bg-zinc-800"
                        : "border-zinc-200"
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

        {/* Billing History */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Billing History</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-48 bg-background"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <Card className="border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-medium text-foreground">Plan Name</TableHead>
                  <TableHead className="font-medium text-foreground">Amounts</TableHead>
                  <TableHead className="font-medium text-foreground">Purchase Date</TableHead>
                  <TableHead className="font-medium text-foreground">End Date</TableHead>
                  <TableHead className="font-medium text-foreground">Status</TableHead>
                  <TableHead className="font-medium text-foreground text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((item, index) => (
                  <TableRow key={index} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{item.planName}</TableCell>
                    <TableCell>{item.amount}</TableCell>
                    <TableCell>{item.purchaseDate}</TableCell>
                    <TableCell>{item.endDate}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "w-2 h-2 rounded-full",
                            item.status === "Success" ? "bg-green-500" : "bg-orange-500"
                          )}
                        />
                        <span
                          className={cn(
                            "text-sm",
                            item.status === "Success" ? "text-green-600" : "text-orange-600"
                          )}
                        >
                          {item.status}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
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
    </AppLayout>
  );
};

export default Billing;
