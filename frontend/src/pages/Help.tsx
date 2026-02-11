import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, 
  Plus, 
  Filter, 
  ChevronRight, 
  MoreHorizontal,
  Paperclip,
  MessageSquare,
  Grid3X3,
  List,
  Ticket
} from "lucide-react";
import { cn } from "@/lib/utils";

type TabType = "all" | "started" | "snoozed" | "drafts" | "deleted";

interface TicketItem {
  id: string;
  title: string;
  description: string;
  author: string;
  authorAvatar: string;
  tags: string[];
  attachments: number;
  comments: number;
  time: string;
  color: string;
}

const Help = () => {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [expandedFaq, setExpandedFaq] = useState("getting-started");

  const tabs: { id: TabType; label: string }[] = [
    { id: "all", label: "All Tickets" },
    { id: "started", label: "Started" },
    { id: "snoozed", label: "Snoozed" },
    { id: "drafts", label: "Drafts" },
    { id: "deleted", label: "Deleted" },
  ];

  const faqCategories = [
    {
      id: "getting-started",
      title: "Getting started",
      questions: [
        "Account with Card",
        "Withdraw to Bank",
        "Bank Accounts",
        "How Do I Reset My Password?",
        "How to get paid with Payoneer",
      ],
    },
  ];

  const tickets: TicketItem[] = [
    {
      id: "#2020-3454",
      title: "How To Write Better Advertising Copy",
      description: "I hate peeping Toms. For one thing they usually step all over the hedges and plants on the side of someone's house killing them and setting back the vegetation's gardener countless time.",
      author: "Syamsir Alam",
      authorAvatar: "SA",
      tags: ["Design", "Help", "UI", "Installation"],
      attachments: 4,
      comments: 1,
      time: "11:52AM",
      color: "bg-violet-500",
    },
    {
      id: "#2020-3452",
      title: "Cleaning And Organizing",
      description: "To a general advertiser outdoor advertising is worthy of consideration. Outdoor advertising is considered as the oldest form of advertising. Posting bills on wooden boards in the late 19th.",
      author: "Syifa Hadju",
      authorAvatar: "SH",
      tags: ["Design", "Help", "UI", "Figmajam"],
      attachments: 7,
      comments: 10,
      time: "08:01PM",
      color: "bg-amber-400",
    },
    {
      id: "#2020-0032",
      title: "Baby Monitor Technology",
      description: "Technology has advanced significantly over the years, making baby monitors more sophisticated and reliable for parents monitoring their children.",
      author: "John Doe",
      authorAvatar: "JD",
      tags: ["Technology", "Help", "Support"],
      attachments: 2,
      comments: 5,
      time: "09:50AM",
      color: "bg-blue-500",
    },
  ];

  const filteredTickets = tickets.filter(ticket => {
    if (searchQuery) {
      return ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <AppLayout>
      <div className="h-full flex flex-col">
        {/* Top Tabs */}
        <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
          <div className="flex items-center gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-1 py-2 text-sm font-medium transition-colors relative",
                  activeTab === tab.id
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.id === "all" && <Ticket className="h-4 w-4" />}
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {/* Left Sidebar */}
          <div className="space-y-6">
            {/* Search Section */}
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Search for a question</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Type your question or search keyword
                </p>
              </div>
              <div className="relative">
                <Input
                  placeholder="Start typing..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            {/* FAQ Categories */}
            <div className="space-y-2">
              {faqCategories.map((category) => (
                <div key={category.id}>
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === category.id ? "" : category.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                      expandedFaq === category.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 text-foreground hover:bg-muted"
                    )}
                  >
                    {category.title}
                    <ChevronRight className={cn(
                      "h-4 w-4 transition-transform",
                      expandedFaq === category.id && "rotate-90"
                    )} />
                  </button>
                  {expandedFaq === category.id && (
                    <div className="mt-2 space-y-1 pl-2">
                      {category.questions.map((question, index) => (
                        <button
                          key={index}
                          className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Contact Card */}
            <Card className="bg-primary p-5 border-0 mt-auto">
              <h3 className="text-base font-semibold text-primary-foreground">
                Do you still need our help?
              </h3>
              <p className="text-sm text-primary-foreground/70 mt-1">
                Send your request via email
              </p>
              <Button 
                variant="secondary" 
                className="mt-4 bg-white text-foreground hover:bg-white/90"
              >
                Contact Us
              </Button>
            </Card>
          </div>

          {/* Right Content - Tickets List */}
          <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                NEW TICKET
              </Button>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                  <Filter className="h-4 w-4" />
                  SORT: A-Z
                </Button>
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="icon"
                    className="h-9 w-9 rounded-none"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="icon"
                    className="h-9 w-9 rounded-none"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Tickets */}
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="space-y-4 pr-4">
                {filteredTickets.map((ticket) => (
                  <Card key={ticket.id} className="p-5 border border-border hover:shadow-sm transition-shadow">
                    {/* Ticket Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-3 h-3 rounded", ticket.color)} />
                        <span className="text-sm font-medium text-muted-foreground">
                          Ticket {ticket.id}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{ticket.time}</span>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Ticket Title & Description */}
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {ticket.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {ticket.description}
                    </p>

                    {/* Ticket Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* Author */}
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                            {ticket.authorAvatar}
                          </div>
                          <span className="text-sm font-medium">{ticket.author}</span>
                        </div>
                        {/* Tags */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted-foreground">◇</span>
                          {ticket.tags.map((tag, index) => (
                            <span key={index} className="text-xs text-muted-foreground">
                              {tag}{index < ticket.tags.length - 1 ? ", " : ""}
                            </span>
                          ))}
                        </div>
                      </div>
                      {/* Stats */}
                      <div className="flex items-center gap-4 text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Paperclip className="h-4 w-4" />
                          <span className="text-sm">{ticket.attachments}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span className="text-sm">{ticket.comments}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Help;
