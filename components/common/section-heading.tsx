import { cn } from "@/lib/utils";

interface SectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string; // Optional for sub-section style
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  variant?: "main" | "sub"; // Defaults to "main"
}

export function SectionHeading({
  label,
  title,
  description,
  action,
  icon,
  variant = "main",
  className,
  ...props
}: SectionHeadingProps) {
  if (variant === "sub") {
    return (
      <div className={cn("flex items-center gap-3", className)} {...props}>
        {icon && (
          <span className="text-neutral-400 flex items-center justify-center shrink-0">
            {icon}
          </span>
        )}
        <h3 className="text-lg font-bold font-mono uppercase tracking-wider text-foreground">
          {title}
        </h3>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 pb-0",
        className
      )}
      {...props}
    >
      <div className="space-y-2 max-w-xl">
        {label && (
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500 block">
            {label}
          </span>
        )}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground font-sans leading-tight">
          {title}
        </h2>
        {description && (
          <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-mono">
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className="flex-shrink-0 sm:mb-0.5">
          {action}
        </div>
      )}
    </div>
  );
}
