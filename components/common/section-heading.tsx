import { cn } from "@/lib/utils";

interface SectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  title: string;
  action?: React.ReactNode;
}

export function SectionHeading({
  label,
  title,
  action,
  className,
  ...props
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 pb-0",
        className
      )}
      {...props}
    >
      <div className="space-y-2 max-w-md">
        <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500 block">
          {label}
        </span>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground font-sans leading-tight">
          {title}
        </h2>
      </div>
      {action && (
        <div className="flex-shrink-0 sm:mb-0.5">
          {action}
        </div>
      )}
    </div>
  );
}
