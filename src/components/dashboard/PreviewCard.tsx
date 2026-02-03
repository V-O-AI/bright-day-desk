import { cn } from "@/lib/utils";

interface PreviewCardProps {
  children: React.ReactNode;
  message?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function PreviewCard({
  children,
  message = "Данные появятся здесь после подключения",
  className,
  style,
}: PreviewCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-card",
        className
      )}
      style={style}
    >
      {/* Blurred content */}
      <div className="pointer-events-none select-none blur-[2px] opacity-40 grayscale">
        {children}
      </div>
      
      {/* Overlay with message */}
      <div className="absolute inset-0 flex items-center justify-center bg-background/30 backdrop-blur-[1px]">
        <div className="rounded-lg bg-card/90 border border-border px-4 py-2 shadow-sm">
          <p className="text-sm text-muted-foreground text-center">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
