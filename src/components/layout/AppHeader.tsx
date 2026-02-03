import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppHeader() {
  const today = new Date();
  const weekday = today.toLocaleDateString('ru-RU', { weekday: 'long' });
  const dateStr = today.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <div>
        <h1 className="text-xl">
          <span className="font-bold">Добрый день,</span>{" "}
          <span className="text-muted-foreground">чем сегодня могу помочь?</span>
        </h1>
        <p className="text-sm text-muted-foreground capitalize">{weekday} / {dateStr}</p>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" className="rounded-full">Кнопка:</Button>
        <Button variant="outline" className="rounded-full">Кнопка:</Button>
        <Button variant="outline" className="rounded-full">Кнопка:</Button>
        
        <button className="relative p-2 hover:bg-muted rounded-full transition-colors">
          <Bell className="h-5 w-5 text-muted-foreground" />
        </button>
        
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center">
          <span className="text-white text-sm font-medium">U</span>
        </div>
      </div>
    </header>
  );
}
