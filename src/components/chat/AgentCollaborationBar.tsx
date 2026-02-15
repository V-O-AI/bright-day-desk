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

  // Position icons in a tight triangular cluster around center
  // Each icon is offset from center so they overlap like a stack
  const getPosition = (index: number, total: number) => {
    if (total === 1) return { x: 0, y: 0 };
    if (total === 2) {
      const offsets = [
        { x: -10, y: 0 },
        { x: 10, y: 0 },
      ];
      return offsets[index];
    }
    // 3 icons: triangle, slightly touching
    const offsets = [
      { x: 0, y: -11 },   // top center
      { x: -12, y: 8 },   // bottom left
      { x: 12, y: 8 },    // bottom right
    ];
    return offsets[index];
  };

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
        {/* Orbiting cluster — icons positioned around a shared center */}
        <div
          className={cn(
            "relative",
            isActive && "animate-[orbit-spin_3s_linear_infinite]"
          )}
          style={{ width: 48, height: 48 }}
        >
          {agents.slice(0, 3).map((agent, i) => {
            const pos = getPosition(i, iconCount);
            return (
              <div
                key={agent.id}
                className={cn(
                  "absolute w-8 h-8 rounded-lg bg-muted border-2 border-background flex items-center justify-center text-sm shadow-sm transition-all duration-300 animate-scale-in",
                  isActive && "animate-[agent-pulse_2s_ease-in-out_infinite]"
                )}
                style={{
                  left: `calc(50% + ${pos.x}px - 16px)`,
                  top: `calc(50% + ${pos.y}px - 16px)`,
                  zIndex: 10 - i,
                }}
              >
                {agent.emoji}
              </div>
            );
          })}
        </div>

        {/* Completion: show response text */}
        {collaboration === "CLOSED" && (
          <p className="text-sm text-foreground animate-fade-in leading-snug">
            {logs[logs.length - 1] || "Задача выполнена"}
          </p>
        )}
      </div>
    </div>
  );
}
