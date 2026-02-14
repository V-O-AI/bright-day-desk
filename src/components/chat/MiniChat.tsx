import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from "react";
import { Send, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useAgentProcess } from "@/hooks/useAgentProcess";
import { AgentCollaborationBar } from "./AgentCollaborationBar";
import { AgentIconChain } from "./AgentIconChain";
import { cn } from "@/lib/utils";

interface MiniChatProps {
  variant?: "compact" | "full";
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
  const { state: agentState, startProcessing, stopProcessing } = useAgentProcess();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const isProcessing = agentState.inputState === "PROCESSING";

  useImperativeHandle(ref, () => ({
    setInputText: (text: string) => {
      setInput(text);
    },
  }));

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, agentState]);

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;
    const text = input;
    setInput("");
    await sendMessage(text);
    // Start agent simulation after sending
    startProcessing();
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

        {/* Orbiting animation — centered in dialog area */}
        {(isProcessing || (agentState.collaboration === "CLOSED" && agentState.agents.length > 0)) && (
          <div className="flex justify-center py-4">
            <AgentCollaborationBar state={agentState} />
          </div>
        )}
      </div>

      {/* Icon chain — directly above input, only during processing */}
      {(isProcessing || (agentState.collaboration === "CLOSED" && agentState.agents.length > 0)) && (
        <AgentIconChain state={agentState} />
      )}

      {/* Action icons row */}
      {isCompact && !isProcessing && agentState.agents.length === 0 && (
        <div className="flex items-center gap-2 mt-4">
          <div className="w-8 h-8 rounded bg-muted" />
          <div className="w-8 h-8 rounded bg-muted" />
          <div className="w-8 h-8 rounded bg-muted" />
          <div className="w-8 h-8 rounded bg-muted" />
          <span className="text-muted-foreground">•••</span>
        </div>
      )}

      {/* Input with send/stop button */}
      <div className="mt-4 relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isProcessing ? "Агенты работают..." : "Добавь 5 футболок на склад..."}
          className="w-full bg-muted rounded-xl px-4 py-3 pr-12 text-sm placeholder:text-muted-foreground transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:outline-none"
        />

        {isProcessing ? (
          <Button
            size="icon"
            variant="ghost"
            onClick={stopProcessing}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-destructive hover:text-destructive/80"
            title="Остановить процесс"
          >
            <Square className="h-4 w-4" />
          </Button>
        ) : (
          input.trim() && (
            <Button
              size="icon"
              variant="ghost"
              onClick={handleSend}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-primary"
            >
              <Send className="h-4 w-4" />
            </Button>
          )
        )}
      </div>
    </div>
  );
}

export const MiniChat = forwardRef<MiniChatHandle, MiniChatProps>(MiniChatInner);
MiniChat.displayName = "MiniChat";
