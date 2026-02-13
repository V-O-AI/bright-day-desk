import { MoreHorizontal, CheckCircle } from "lucide-react";
import { AgentAvatar } from "./AgentAvatar";
import type { AgentProcessState } from "@/hooks/useAgentProcess";
import { cn } from "@/lib/utils";

interface AgentCollaborationBarProps {
  state: AgentProcessState;
}

const MAX_VISIBLE = 3;

export function AgentCollaborationBar({ state }: AgentCollaborationBarProps) {
  const { collaboration, agents, logs } = state;
  if (collaboration === "CLOSED" && agents.length === 0) return null;

  const isActive = collaboration !== "CLOSED";
  const visibleAgents = agents.slice(0, collaboration === "TEAM" && agents.length > MAX_VISIBLE ? 2 : MAX_VISIBLE);
  const extraCount = agents.length > MAX_VISIBLE ? agents.length - 2 : 0;

  return (
    <div className="flex flex-col items-start gap-3 py-3 px-4 rounded-xl bg-muted/40 border border-border/50 animate-fade-in">
      {/* Agents row */}
      <div className="flex items-center gap-4">
        {visibleAgents.map((agent, i) => (
          <div key={agent.id} className="flex items-center gap-3">
            {i > 0 && (
              <div className={cn(
                "w-6 border-t border-dashed transition-colors duration-300",
                isActive ? "border-primary/40" : "border-border"
              )} />
            )}
            <AgentAvatar agent={agent} isActive={isActive} />
          </div>
        ))}

        {extraCount > 0 && (
          <>
            <div className="w-6 border-t border-dashed border-primary/40" />
            <div className="w-10 h-10 rounded-full bg-muted border-2 border-border flex items-center justify-center animate-scale-in">
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </div>
          </>
        )}

        {collaboration === "CLOSED" && (
          <CheckCircle className="h-5 w-5 text-primary ml-2 animate-scale-in" />
        )}
      </div>

      {/* Log lines */}
      {logs.length > 0 && (
        <div className="w-full overflow-hidden max-h-[60px] space-y-0.5">
          {logs.slice(-3).map((log, i) => (
            <p
              key={`${log}-${i}`}
              className="text-xs text-muted-foreground animate-[log-fade-up_3s_ease-out_forwards]"
            >
              {log}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
