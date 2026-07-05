import { cn } from "@/lib/utils";

interface SectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string; // Optional for sub-section style
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  variant?: "main" | "sub"; // Defaults to "main"
}

export function SectionHeading({ label, title, description, action, icon, variant = "main", className, ...props }: SectionHeadingProps) {
  if (variant === "sub") {
    return (
      <div className={cn("flex items-center gap-3", className)} {...props}>
        {icon && <span className="flex shrink-0 items-center justify-center text-neutral-400">{icon}</span>}
        <h3 className="font-mono text-lg font-bold tracking-wider text-foreground uppercase">{title}</h3>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6 pb-0 sm:flex-row sm:items-end sm:justify-between", className)} {...props}>
      <div className="max-w-xl space-y-2">
        {label && <span className="block font-mono text-[10px] tracking-[0.2em] text-neutral-400 uppercase dark:text-neutral-500">{label}</span>}
        <h2 className="font-sans text-2xl leading-tight font-bold tracking-tight text-foreground md:text-3xl lg:text-4xl">{title}</h2>
        {description && <p className="font-mono text-xs leading-relaxed text-neutral-500 md:text-sm dark:text-neutral-400">{description}</p>}
      </div>
      {action && <div className="flex-shrink-0 sm:mb-0.5">{action}</div>}
    </div>
  );
}
