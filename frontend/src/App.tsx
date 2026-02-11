import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
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
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/cabinet" element={<ProtectedRoute><Cabinet /></ProtectedRoute>} />
            <Route path="/staff-chat" element={<ProtectedRoute><StaffChat /></ProtectedRoute>} />
            <Route path="/client-chats" element={<ProtectedRoute><ClientChats /></ProtectedRoute>} />
            <Route path="/my-data" element={<ProtectedRoute><MyData /></ProtectedRoute>} />
            <Route path="/my-data/finances" element={<ProtectedRoute><MyDataFinances /></ProtectedRoute>} />
            <Route path="/my-data/warehouse" element={<ProtectedRoute><MyDataWarehouse /></ProtectedRoute>} />
            <Route path="/my-data/client-analytics" element={<ProtectedRoute><MyDataClientAnalytics /></ProtectedRoute>} />
            <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/help" element={<ProtectedRoute><Help /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
