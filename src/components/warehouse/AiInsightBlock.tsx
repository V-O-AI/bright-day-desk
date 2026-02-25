import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AiInsightBlockProps {
  text: string;
  blockTitle: string;
}

export function AiInsightBlock({ text, blockTitle }: AiInsightBlockProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "ai" | "user"; text: string }[]>([]);
  const [input, setInput] = useState("");

  const handleOpen = () => {
    setMessages([{ role: "ai", text }]);
    setOpen(true);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [
      ...prev,
      { role: "user", text: input.trim() },
      { role: "ai", text: "Анализирую данные по «" + blockTitle + "»… Рекомендую обратить внимание на товары с наибольшим риском дефицита и оптимизировать закупки в ближайшие 3-5 дней." },
    ]);
    setInput("");
  };

  return (
    <>
      <div
        onClick={handleOpen}
        className="mt-3 p-3 bg-primary/5 rounded-xl border border-primary/10 cursor-pointer hover:bg-primary/10 transition-colors group"
      >
        <div className="flex items-start gap-2">
          <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">AI Рекомендация:</span> {text}
            </p>
            <p className="text-[10px] text-primary mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
              Нажмите, чтобы обсудить с ИИ →
            </p>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              {blockTitle}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-3 py-3 min-h-[200px] max-h-[400px]">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[85%] rounded-2xl px-3 py-2 text-sm",
                  m.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-muted text-foreground rounded-bl-md"
                )}>
                  {m.role === "ai" && <Sparkles className="h-3 w-3 text-primary inline mr-1" />}
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 pt-2 border-t border-border">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              placeholder="Задать вопрос ИИ..."
              className="flex-1 bg-muted rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
            />
            <button onClick={handleSend} className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
