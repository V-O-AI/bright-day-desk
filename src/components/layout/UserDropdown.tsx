import {
  User,
  Users,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut,
  Plus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

export function UserDropdown() {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center transition-transform duration-150 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2">
          <span className="text-white text-sm font-medium">U</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-64 p-0 bg-card border border-border rounded-2xl shadow-xl animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200"
      >
        {/* User info header */}
        <div className="flex items-center gap-3 p-4 pb-3">
          <div className="flex-1">
            <p className="font-semibold text-foreground">Александр Иванов</p>
            <p className="text-sm text-muted-foreground">alex@email.com</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-medium">А</span>
          </div>
        </div>

        {/* Main menu items */}
        <div className="px-2 pb-2">
          <DropdownMenuItem
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors hover:bg-muted"
            onClick={() => navigate("/cabinet")}
          >
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="flex-1">Профиль</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors hover:bg-muted"
            onClick={() => navigate("/settings")}
          >
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="flex-1">Сообщество</span>
            <div className="h-5 w-5 rounded-md bg-muted flex items-center justify-center">
              <Plus className="h-3 w-3 text-muted-foreground" />
            </div>
          </DropdownMenuItem>
          
          <DropdownMenuItem
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors hover:bg-muted"
            onClick={() => navigate("/billing")}
          >
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="flex-1">Подписка</span>
            <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-600 text-xs font-medium">
              ✦ PRO
            </span>
          </DropdownMenuItem>
          
          <DropdownMenuItem
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors hover:bg-muted"
            onClick={() => navigate("/settings")}
          >
            <Settings className="h-4 w-4 text-muted-foreground" />
            <span className="flex-1">Настройки</span>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="bg-border mx-3" />

        {/* Secondary menu items */}
        <div className="px-2 py-2">
          <DropdownMenuItem
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors hover:bg-muted"
            onClick={() => navigate("/help")}
          >
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
            <span className="flex-1">Центр помощи</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors hover:bg-muted text-destructive focus:text-destructive">
            <LogOut className="h-4 w-4" />
            <span className="flex-1">Выйти</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
