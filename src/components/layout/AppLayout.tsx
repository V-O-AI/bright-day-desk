import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const isTabletOrSmaller = useIsMobile(1024);

  return (
    <SidebarProvider defaultOpen={!isTabletOrSmaller}>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Sidebar trigger — FAB on mobile & tablet, hidden on lg+ */}
          <div className="lg:hidden fixed bottom-4 left-4 z-50">
            <SidebarTrigger className="h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 [&_svg]:h-5 [&_svg]:w-5" />
          </div>
          <AppHeader />
          <main className="flex-1 p-3 md:p-4 lg:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
