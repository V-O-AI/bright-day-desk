import { useState } from "react";
import { Home, User, MessageCircle, MessagesSquare, UserCircle, CreditCard, Settings, HelpCircle, Send, Sparkles, ExternalLink, X } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const mainNavItems = [
  { title: "Главная", url: "/", icon: Home },
  { title: "Личный кабинет", url: "/cabinet", icon: User },
  { title: "Чат с сотрудниками", url: "/staff-chat", icon: MessageCircle },
  { title: "Чаты клиентов", url: "/client-chats", icon: MessagesSquare, badge: 2 },
  { title: "Мои данные", url: "/my-data", icon: UserCircle },
];

const bottomNavItems = [
  { title: "Billing", url: "/billing", icon: CreditCard },
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Help Center", url: "/help", icon: HelpCircle },
];

export function AppSidebar() {
  const [showTgModal, setShowTgModal] = useState(false);

  return (
    <>
      <Sidebar className="border-r border-sidebar-border">
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-sidebar-foreground">▲index</span>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-2">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        end={item.url === "/"} 
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                        activeClassName="bg-sidebar-accent text-sidebar-primary-foreground"
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                        {item.badge && (
                          <span className="ml-auto bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <div className="my-4 border-t border-sidebar-border" />

          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {bottomNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
                        activeClassName="bg-sidebar-accent text-sidebar-primary-foreground"
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4">
          <button
            onClick={() => setShowTgModal(true)}
            className="group relative w-full overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
          >
            {/* Glassmorphism card */}
            <div className="relative rounded-2xl border border-sidebar-border bg-sidebar-accent/50 backdrop-blur-md p-4 overflow-hidden">
              {/* Subtle animated gradient orb */}
              <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-primary/15 blur-2xl animate-pulse" />
              <div className="absolute -bottom-4 -left-4 w-14 h-14 rounded-full bg-[hsl(200,100%,55%)]/10 blur-xl animate-pulse" style={{ animationDelay: "1s" }} />

              <div className="relative flex items-center gap-3 mb-3">
                <div className="h-9 w-9 rounded-xl bg-[hsl(200,100%,55%)]/15 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                  <Send className="h-4 w-4 text-[hsl(200,100%,55%)]" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-sidebar-foreground leading-tight">
                    Telegram
                  </p>
                  <p className="text-[10px] text-sidebar-muted">
                    Virtual Office AI
                  </p>
                </div>
              </div>

              <div className="relative flex items-center justify-center gap-2 w-full py-2 rounded-xl border border-sidebar-border bg-sidebar-background/60 text-sidebar-foreground text-xs font-medium transition-all duration-200 group-hover:bg-[hsl(200,100%,55%)]/10 group-hover:border-[hsl(200,100%,55%)]/30 group-hover:text-[hsl(200,100%,55%)]">
                <Sparkles className="h-3 w-3" />
                Подписаться
              </div>
            </div>
          </button>
        </SidebarFooter>
      </Sidebar>

      {/* Telegram Modal */}
      <Dialog open={showTgModal} onOpenChange={setShowTgModal}>
        <DialogContent className="sm:max-w-sm rounded-2xl border-border p-0 overflow-hidden">
          {/* Minimal top accent */}
          <div className="relative h-24 bg-sidebar-accent/30 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,hsl(200_100%_55%/0.12),transparent)]" />
            <div className="h-14 w-14 rounded-2xl border border-border bg-card flex items-center justify-center shadow-sm">
              <Send className="h-6 w-6 text-[hsl(200,100%,55%)]" />
            </div>
          </div>

          <div className="p-6 pt-4 text-center">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-foreground">
                Virtual Office AI
              </DialogTitle>
            </DialogHeader>
            <p className="text-muted-foreground text-sm mt-2 mb-5 leading-relaxed">
              Новости, обновления и эксклюзивный контент о платформе в нашем Telegram канале.
            </p>

            <div className="flex flex-col gap-2.5">
              <a
                href="https://t.me/VirtualOfficeAI"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-[hsl(200,100%,55%)]/30 bg-[hsl(200,100%,55%)]/10 text-[hsl(200,100%,55%)] font-medium text-sm transition-all duration-200 hover:bg-[hsl(200,100%,55%)]/20 hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <ExternalLink className="h-4 w-4" />
                Открыть в Telegram
              </a>
              <button
                onClick={() => setShowTgModal(false)}
                className="w-full py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-muted transition-colors"
              >
                Закрыть
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
