import { CheckCircle } from "lucide-react";
import type { AgentProcessState } from "@/hooks/useAgentProcess";
import { cn } from "@/lib/utils";

interface AgentCollaborationBarProps {
  state: AgentProcessState;
}

export function AgentCollaborationBar({ state }: AgentCollaborationBarProps) {
  const { collaboration, agents, logs } = state;
  if (collaboration === "CLOSED" && agents.length === 0) return null;

  const isActive = collaboration !== "CLOSED";
  const iconCount = agents.length;

  // Calculate overlap offset based on icon count
  const getOffset = (index: number) => {
    return index * -10; // each icon overlaps by 10px
  };

  return (
    <div className="flex flex-col items-start gap-2 py-2 px-3 animate-fade-in">
      {/* Orbiting icons cluster + logs row */}
      <div className="flex items-center gap-3">
        {/* Orbiting cluster */}
        <div
          className={cn(
            "relative flex items-center",
            isActive && "animate-[orbit-spin_3s_linear_infinite]"
          )}
          style={{ width: `${40 + Math.max(0, iconCount - 1) * 30}px`, height: 40 }}
        >
          {agents.slice(0, 3).map((agent, i) => (
            <div
              key={agent.id}
              className={cn(
                "absolute w-10 h-10 rounded-xl bg-muted border-2 border-background flex items-center justify-center text-lg shadow-sm transition-all duration-300 animate-scale-in",
                isActive && "animate-[agent-pulse_2s_ease-in-out_infinite]"
              )}
              style={{
                left: `${i * 30}px`,
                zIndex: 10 - i,
              }}
            >
              {agent.emoji}
            </div>
          ))}
        </div>

        {/* Completion indicator */}
        {collaboration === "CLOSED" && (
          <CheckCircle className="h-4 w-4 text-primary animate-scale-in" />
        )}

        {/* Thought-style log lines (only during processing) */}
        {isActive && logs.length > 0 && (
          <div className="overflow-hidden max-h-[40px] space-y-0.5">
            {logs.slice(-2).map((log, i) => (
              <p
                key={`${log}-${i}`}
                className="text-xs text-muted-foreground/50 italic animate-[log-fade-up_3s_ease-out_forwards] select-none"
              >
                {log}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
