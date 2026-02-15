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
            <div className="relative rounded-2xl p-4 overflow-hidden bg-gradient-to-br from-[hsl(260,70%,50%)] via-[hsl(240,60%,35%)] to-[hsl(220,80%,20%)]">
              {/* Animated glow orbs */}
              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-[hsl(260,80%,65%)]/30 blur-2xl animate-pulse" />
              <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-[hsl(220,90%,50%)]/20 blur-2xl animate-pulse" style={{ animationDelay: "1.5s" }} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/5 blur-xl" />

              <div className="relative flex items-center gap-3 mb-3">
                <div className="h-9 w-9 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 border border-white/10">
                  <Send className="h-4 w-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-white leading-tight">
                    Telegram
                  </p>
                  <p className="text-[10px] text-white/60">
                    Virtual Office AI
                  </p>
                </div>
              </div>

              <div className="relative flex items-center justify-center gap-2 w-full py-2 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm text-white text-xs font-medium transition-all duration-200 group-hover:bg-white/20 group-hover:border-white/30">
                <Sparkles className="h-3 w-3" />
                Подписаться
              </div>
            </div>
          </button>
        </SidebarFooter>
      </Sidebar>

      {/* Telegram Modal */}
      <Dialog open={showTgModal} onOpenChange={setShowTgModal}>
        <DialogContent className="sm:max-w-sm rounded-2xl border-0 p-0 overflow-hidden shadow-2xl">
          {/* Gradient header */}
          <div className="relative h-32 bg-gradient-to-br from-[hsl(260,70%,50%)] via-[hsl(240,60%,35%)] to-[hsl(220,80%,20%)] flex items-center justify-center overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-[hsl(260,80%,65%)]/25 blur-3xl" />
            <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-[hsl(220,90%,50%)]/20 blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,white/8,transparent_70%)]" />
            <div className="relative h-16 w-16 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg animate-scale-in">
              <Send className="h-7 w-7 text-white" />
            </div>
          </div>

          <div className="p-6 pt-5 text-center">
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
                href="https://t.me/+ZPnevpUhBBVmZjIy"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-medium text-sm text-white transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] bg-gradient-to-r from-[hsl(260,70%,50%)] to-[hsl(220,80%,40%)] hover:shadow-lg hover:shadow-[hsl(260,70%,50%)]/25"
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
