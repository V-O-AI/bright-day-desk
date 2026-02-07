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
            className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[hsl(258,90%,66%)] via-[hsl(280,80%,60%)] to-[hsl(330,80%,65%)] p-[1px] transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 active:scale-[0.98]"
          >
            <div className="relative rounded-[15px] bg-sidebar-background/90 backdrop-blur-sm p-4 overflow-hidden">
              {/* Animated sparkle dots */}
              <div className="absolute top-2 right-3 opacity-60">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              </div>
              <div className="absolute bottom-3 left-3 w-8 h-8 rounded-full bg-primary/10 blur-lg animate-pulse" style={{ animationDelay: "500ms" }} />

              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[hsl(200,100%,55%)] to-[hsl(210,100%,45%)] flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
                  <Send className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-sidebar-foreground">
                    Virtual Office AI
                  </p>
                  <p className="text-[11px] text-sidebar-muted">
                    Telegram канал
                  </p>
                </div>
              </div>

              <p className="text-xs text-sidebar-muted mb-3 leading-relaxed">
                Новости, обновления и эксклюзивный контент ✨
              </p>

              <div className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-gradient-to-r from-[hsl(200,100%,55%)] to-[hsl(210,100%,45%)] text-white text-sm font-medium transition-all duration-200 group-hover:shadow-md group-hover:shadow-blue-500/20">
                <Send className="h-3.5 w-3.5" />
                Подписаться
              </div>
            </div>
          </button>
        </SidebarFooter>
      </Sidebar>

      {/* Telegram Modal */}
      <Dialog open={showTgModal} onOpenChange={setShowTgModal}>
        <DialogContent className="sm:max-w-md rounded-2xl border-border p-0 overflow-hidden">
          {/* Top gradient banner */}
          <div className="relative h-32 bg-gradient-to-br from-[hsl(200,100%,55%)] via-[hsl(210,100%,50%)] to-[hsl(258,90%,66%)] flex items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent)]" />
            <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl">
              <Send className="h-8 w-8 text-white" />
            </div>
          </div>

          <div className="p-6 text-center">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-foreground">
                Virtual Office AI
              </DialogTitle>
            </DialogHeader>
            <p className="text-muted-foreground text-sm mt-2 mb-6">
              Присоединяйтесь к нашему Telegram каналу для получения последних новостей, обновлений и эксклюзивного контента о платформе.
            </p>

            <div className="flex flex-col gap-3">
              <a
                href="https://t.me/VirtualOfficeAI"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-[hsl(200,100%,55%)] to-[hsl(210,100%,45%)] text-white font-medium transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <ExternalLink className="h-4 w-4" />
                Открыть в Telegram
              </a>
              <button
                onClick={() => setShowTgModal(false)}
                className="w-full py-3 rounded-xl text-sm text-muted-foreground hover:bg-muted transition-colors"
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
