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
  const prevCollabRef = useRef(agentState.collaboration);
  const [agentResponses, setAgentResponses] = useState<Array<{id: string; content: string; agents: typeof agentState.agents}>>([]);

  useImperativeHandle(ref, () => ({
    setInputText: (text: string) => {
      setInput(text);
    },
  }));

  // When agent finishes, add result to local chat history
  useEffect(() => {
    if (prevCollabRef.current !== "CLOSED" && agentState.collaboration === "CLOSED" && agentState.agents.length > 0) {
      const resultText = agentState.logs[agentState.logs.length - 1] || "Задача выполнена";
      setAgentResponses(prev => [...prev, {
        id: `agent-${Date.now()}`,
        content: resultText,
        agents: [...agentState.agents],
      }]);
    }
    prevCollabRef.current = agentState.collaboration;
  }, [agentState.collaboration, agentState.agents, agentState.logs]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, agentState, agentResponses]);

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;
    const text = input;
    setInput("");
    await sendMessage(text);
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
        ) : messages.length === 0 && agentResponses.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <span className="text-sm text-muted-foreground">Нет сообщений</span>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3",
                  msg.sender_type === "user" ? "justify-end" : "justify-start"
                )}
              >
                {msg.sender_type === "ai" && (
                  <div className="relative w-10 h-8 flex-shrink-0">
                    <div className="absolute left-0 top-0 w-6 h-6 rounded-md bg-muted border-2 border-background" style={{zIndex:2}} />
                    <div className="absolute left-3 top-1 w-6 h-6 rounded-md bg-muted border-2 border-background" style={{zIndex:1}} />
                  </div>
                )}
                <div
                  className={cn(
                    "rounded-xl px-4 py-2 text-sm max-w-[80%]",
                    msg.sender_type === "user" ? "bg-primary/10" : ""
                  )}
                >
                  <p className={msg.sender_type === "ai" ? "text-muted-foreground" : ""}>
                    {msg.content}
                  </p>
                </div>
              </div>
            ))}

            {/* Agent completion responses rendered as chat messages */}
            {agentResponses.map((resp) => {
              const count = Math.min(resp.agents.length, 3);
              const clusterOffsets = count === 1
                ? [{ x: 0, y: 0 }]
                : count === 2
                ? [{ x: -6, y: -4 }, { x: 6, y: 4 }]
                : [{ x: 0, y: -8 }, { x: -9, y: 6 }, { x: 9, y: 6 }];
              return (
                <div key={resp.id} className="flex gap-3 items-start justify-start animate-fade-in">
                  <div className="relative flex-shrink-0" style={{ width: 44, height: 44 }}>
                    {resp.agents.slice(0, 3).map((agent, i) => {
                      const pos = clusterOffsets[i];
                      return (
                        <div
                          key={agent.id}
                          className="absolute w-7 h-7 rounded-lg bg-muted border-2 border-background flex items-center justify-center text-xs shadow-sm"
                          style={{
                            left: `calc(50% + ${pos.x}px - 14px)`,
                            top: `calc(50% + ${pos.y}px - 14px)`,
                            zIndex: 10 - i,
                          }}
                        >
                          {agent.emoji}
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-sm max-w-[75%] pt-2">
                    <p className="text-muted-foreground leading-relaxed">{resp.content}</p>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* Orbiting animation — centered in dialog area */}
        {isProcessing && (
          <div className="flex justify-start py-4 pl-2">
            <AgentCollaborationBar state={agentState} />
          </div>
        )}
      </div>

      {/* Icon chain — directly above input, only during processing */}
      {isProcessing && (
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
