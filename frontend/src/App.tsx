import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Cabinet from "./pages/Cabinet";
import StaffChat from "./pages/StaffChat";
import ClientChats from "./pages/ClientChats";
import MyData from "./pages/MyData";
import MyDataFinances from "./pages/MyDataFinances";
import MyDataWarehouse from "./pages/MyDataWarehouse";
import MyDataClientAnalytics from "./pages/MyDataClientAnalytics";
import Billing from "./pages/Billing";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/cabinet" element={<Cabinet />} />
          <Route path="/staff-chat" element={<StaffChat />} />
          <Route path="/client-chats" element={<ClientChats />} />
          <Route path="/my-data" element={<MyData />} />
          <Route path="/my-data/finances" element={<MyDataFinances />} />
          <Route path="/my-data/warehouse" element={<MyDataWarehouse />} />
          <Route path="/my-data/client-analytics" element={<MyDataClientAnalytics />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Help />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
