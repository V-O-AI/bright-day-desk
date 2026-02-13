import { cn } from "@/lib/utils";
import type { AIAgent } from "@/hooks/useAgentProcess";

interface AgentAvatarProps {
  agent: AIAgent;
  isActive: boolean;
}

export function AgentAvatar({ agent, isActive }: AgentAvatarProps) {
  return (
    <div className="flex flex-col items-center gap-1 animate-scale-in">
      <div
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all duration-300",
          isActive
            ? "border-primary/60 animate-[agent-pulse_2s_ease-in-out_infinite] bg-primary/10"
            : "border-border bg-muted"
        )}
      >
        {agent.emoji}
      </div>
      <span className="text-[10px] text-muted-foreground font-medium leading-tight text-center max-w-[72px] truncate">
        {agent.name}
      </span>
    </div>
  );
}
