import type { AgentProcessState } from "@/hooks/useAgentProcess";

interface AgentIconChainProps {
  state: AgentProcessState;
}

export function AgentIconChain({ state }: AgentIconChainProps) {
  const { agents } = state;
  if (agents.length === 0) return null;

  return (
    <div className="flex items-center gap-0 py-1.5 px-1 animate-fade-in">
      {agents.slice(0, 3).map((agent, i) => (
        <div
          key={agent.id}
          className="w-7 h-7 rounded-md bg-muted border-2 border-background flex items-center justify-center text-xs shadow-sm animate-scale-in -ml-1.5 first:ml-0"
          style={{ zIndex: 10 - i }}
        >
          {agent.emoji}
        </div>
      ))}
      <span className="text-muted-foreground/50 text-xs ml-1 select-none tracking-widest">•••</span>
    </div>
  );
}
