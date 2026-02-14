import type { AgentProcessState } from "@/hooks/useAgentProcess";

interface AgentIconChainProps {
  state: AgentProcessState;
}

export function AgentIconChain({ state }: AgentIconChainProps) {
  const { agents } = state;
  if (agents.length === 0) return null;

  const visibleAgents = agents.slice(0, 3);

  return (
    <div className="flex items-center gap-0 py-1.5 px-1 animate-fade-in">
      {visibleAgents.map((agent, i) => (
        <div key={agent.id} className="flex items-center animate-scale-in">
          {/* Connector line between icons */}
          {i > 0 && (
            <div className="flex items-center gap-[2px] mx-1">
              <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
              <span className="w-1 h-1 rounded-full bg-muted-foreground/20" />
              <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            </div>
          )}
          <div
            className="w-8 h-8 rounded-md bg-muted border-2 border-background flex items-center justify-center text-sm shadow-sm"
            style={{ zIndex: 10 - i }}
          >
            {agent.emoji}
          </div>
        </div>
      ))}
      <span className="text-muted-foreground/50 text-xs ml-2 select-none tracking-widest">•••</span>
    </div>
  );
}
