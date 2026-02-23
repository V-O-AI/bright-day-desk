import { cn } from "@/lib/utils";

interface PreviewCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function PreviewCard({
  children,
  className,
  style,
  onClick,
}: PreviewCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-card cursor-pointer group",
        className
      )}
      style={style}
      onClick={onClick}
    >
      {/* Blurred content */}
      <div className="pointer-events-none select-none blur-[2px] opacity-40 grayscale">
        {children}
      </div>

      {/* Overlay with "Начать работу" */}
      <div className="absolute inset-0 flex items-center justify-center bg-background/30 backdrop-blur-[1px] transition-all group-hover:bg-background/40">
        <div className="rounded-xl bg-card/90 border border-primary/20 px-6 py-3 shadow-md transition-transform group-hover:scale-105">
          <p className="text-sm font-medium text-foreground text-center">
            Начать работу
          </p>
        </div>
      </div>
    </div>
  );
}
