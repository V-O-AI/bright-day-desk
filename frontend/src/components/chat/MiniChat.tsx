import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatMessages } from "@/hooks/useChatMessages";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

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
        {/* Header - Responsive */}
        <div className="flex items-start gap-2 xs:gap-3 md:gap-4">
          <div className="w-10 h-10 xs:w-11 xs:h-11 md:w-12 md:h-12 rounded-lg xs:rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
            <span className="text-muted-foreground text-sm xs:text-base">👤</span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm xs:text-base">Менеджер Улетс</h4>
            <p className="text-xs xs:text-sm text-muted-foreground line-clamp-2 xs:line-clamp-none">
              {isMobile ? "Готов помочь с любым вопросом!" : "Здравствуйте, команда агента готова к заботе о любой услуге!"}
            </p>
          </div>
        </div>

        {/* Messages area - Responsive height */}
        <div
          ref={scrollRef}
          className={cn(
            "flex-1 mt-3 xs:mt-4 overflow-y-auto space-y-2 xs:space-y-3",
            isCompact 
              ? "min-h-[80px] xs:min-h-[100px] md:min-h-[120px]" 
              : "min-h-[150px] xs:min-h-[180px] md:min-h-[200px]"
          )}
        >
          {loading ? (
            <div className="flex items-center justify-center py-6 xs:py-8">
              <span className="text-xs xs:text-sm text-muted-foreground">Загрузка...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center py-6 xs:py-8">
              <span className="text-xs xs:text-sm text-muted-foreground">Нет сообщений</span>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-2 xs:gap-3",
                  msg.sender_type === "user" ? "justify-end" : "justify-start"
                )}
              >
                {msg.sender_type === "ai" && (
                  <div className="w-6 h-6 xs:w-7 xs:h-7 md:w-8 md:h-8 rounded-md xs:rounded-lg bg-muted flex-shrink-0" />
                )}
                <div
                  className={cn(
                    "rounded-lg xs:rounded-xl px-3 xs:px-4 py-1.5 xs:py-2 text-xs xs:text-sm max-w-[85%] xs:max-w-[80%]",
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

        {/* Action icons row - Responsive */}
        {isCompact && (
          <div className="flex items-center gap-1.5 xs:gap-2 mt-3 xs:mt-4">
            <div className="w-6 h-6 xs:w-7 xs:h-7 md:w-8 md:h-8 rounded bg-muted" />
            <div className="w-6 h-6 xs:w-7 xs:h-7 md:w-8 md:h-8 rounded bg-muted" />
            <div className="w-6 h-6 xs:w-7 xs:h-7 md:w-8 md:h-8 rounded bg-muted hidden xs:block" />
            <div className="w-6 h-6 xs:w-7 xs:h-7 md:w-8 md:h-8 rounded bg-muted hidden xs:block" />
            <span className="text-muted-foreground text-xs xs:text-sm">•••</span>
          </div>
        )}

        {/* Input with send button - Responsive */}
        <div className="mt-3 xs:mt-4 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isMobile ? "Введите сообщение..." : "Добавь 5 футболок на склад..."}
            className="w-full bg-muted rounded-lg xs:rounded-xl px-3 xs:px-4 py-2.5 xs:py-3 pr-10 xs:pr-12 text-xs xs:text-sm placeholder:text-muted-foreground transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:outline-none"
          />
          <Button
            size="icon"
            variant="ghost"
            onClick={handleSend}
            disabled={!input.trim()}
            className="absolute right-0.5 xs:right-1 top-1/2 -translate-y-1/2 h-7 w-7 xs:h-8 xs:w-8 text-muted-foreground hover:text-primary"
          >
            <Send className="h-3.5 w-3.5 xs:h-4 xs:w-4" />
          </Button>
        </div>
      </div>
  );
}

export const MiniChat = forwardRef<MiniChatHandle, MiniChatProps>(MiniChatInner);
MiniChat.displayName = "MiniChat";
