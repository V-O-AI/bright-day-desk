import type { AgentProcessState } from "@/hooks/useAgentProcess";
import { cn } from "@/lib/utils";

interface AgentCollaborationBarProps {
  state: AgentProcessState;
}

export function AgentCollaborationBar({ state }: AgentCollaborationBarProps) {
  const { collaboration, agents, logs } = state;
  if (collaboration === "CLOSED" && agents.length === 0) return null;

  const isActive = collaboration !== "CLOSED";
  const iconCount = Math.min(agents.length, 3);

  return (
    <div className="flex flex-col items-start gap-1.5 py-2 px-3 animate-fade-in">
      {/* Thought-style log lines — above icons, only during processing */}
      {isActive && logs.length > 0 && (
        <div className="overflow-hidden max-h-[36px] space-y-0.5 pl-1">
          {logs.slice(-2).map((log, i) => (
            <p
              key={`${log}-${i}`}
              className="text-xs text-muted-foreground/40 italic animate-[log-fade-up_3s_ease-out_forwards] select-none"
            >
              {log}
            </p>
          ))}
        </div>
      )}

      {/* Icons row + completion text */}
      <div className="flex items-center gap-3">
        {/* Orbiting cluster */}
        <div
          className={cn(
            "relative flex items-center",
            isActive && "animate-[orbit-spin_3s_linear_infinite]"
          )}
          style={{ width: `${32 + Math.max(0, iconCount - 1) * 22}px`, height: 32 }}
        >
          {agents.slice(0, 3).map((agent, i) => (
            <div
              key={agent.id}
              className={cn(
                "absolute w-8 h-8 rounded-lg bg-muted border-2 border-background flex items-center justify-center text-sm shadow-sm transition-all duration-300 animate-scale-in",
                isActive && "animate-[agent-pulse_2s_ease-in-out_infinite]"
              )}
              style={{
                left: `${i * 22}px`,
                zIndex: 10 - i,
              }}
            >
              {agent.emoji}
            </div>
          ))}
        </div>

        {/* Completion: show response text instead of just checkmark */}
        {collaboration === "CLOSED" && (
          <p className="text-sm text-foreground animate-fade-in leading-snug">
            {logs[logs.length - 1] || "Задача выполнена"}
          </p>
        )}
      </div>
    </div>
  );
}
