import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatMessages } from "@/hooks/useChatMessages";
import { cn } from "@/lib/utils";

interface MiniChatProps {
  /** "compact" = mini-chat on Index, "full" = full area on StaffChat */
  variant?: "compact" | "full";
  /** Optional active chat session id for multi-chat support */
  activeChatId?: string | null;
}

export interface MiniChatHandle {
  setInputText: (text: string) => void;
}

function MiniChatInner(
  { variant = "compact", activeChatId }: MiniChatProps,
  ref: React.ForwardedRef<MiniChatHandle>
) {
  const { messages, loading, sendMessage } = useChatMessages();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    setInputText: (text: string) => {
      setInput(text);
    },
  }));

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, [messages]);

    const handleSend = async () => {
      if (!input.trim()) return;
      const text = input;
      setInput("");
      await sendMessage(text);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    };

    const isCompact = variant === "compact";

    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
            <span className="text-muted-foreground">👤</span>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold">Менеджер Улетс</h4>
            <p className="text-sm text-muted-foreground">
              Здравствуйте, команда агента готова к заботе о любой услуге!
            </p>
          </div>
        </div>

        {/* Messages area */}
        <div
          ref={scrollRef}
          className={cn(
            "flex-1 mt-4 overflow-y-auto space-y-3",
            isCompact ? "min-h-[120px]" : "min-h-[200px]"
          )}
        >
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <span className="text-sm text-muted-foreground">Загрузка...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <span className="text-sm text-muted-foreground">Нет сообщений</span>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3",
                  msg.sender_type === "user" ? "justify-end" : "justify-start"
                )}
              >
                {msg.sender_type === "ai" && (
                  <div className="w-8 h-8 rounded-lg bg-muted flex-shrink-0" />
                )}
                <div
                  className={cn(
                    "rounded-xl px-4 py-2 text-sm max-w-[80%]",
                    msg.sender_type === "user"
                      ? "bg-primary/10"
                      : "bg-muted"
                  )}
                >
                  <p className={msg.sender_type === "ai" ? "text-muted-foreground" : ""}>
                    {msg.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Action icons row */}
        {isCompact && (
          <div className="flex items-center gap-2 mt-4">
            <div className="w-8 h-8 rounded bg-muted" />
            <div className="w-8 h-8 rounded bg-muted" />
            <div className="w-8 h-8 rounded bg-muted" />
            <div className="w-8 h-8 rounded bg-muted" />
            <span className="text-muted-foreground">•••</span>
          </div>
        )}

        {/* Input with send button */}
        <div className="mt-4 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Добавь 5 футболок на склад..."
            className="w-full bg-muted rounded-xl px-4 py-3 pr-12 text-sm placeholder:text-muted-foreground transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:outline-none"
          />
          <Button
            size="icon"
            variant="ghost"
            onClick={handleSend}
            disabled={!input.trim()}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-primary"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
  );
}

export const MiniChat = forwardRef<MiniChatHandle, MiniChatProps>(MiniChatInner);
MiniChat.displayName = "MiniChat";
