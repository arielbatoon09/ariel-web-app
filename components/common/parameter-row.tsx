import { cn } from "@/lib/utils";

interface ParameterRowProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

export function ParameterRow({ icon, label, value, className, ...props }: ParameterRowProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4", className)} {...props}>
      <span className="text-neutral-450 dark:text-neutral-500 flex items-center gap-1.5 flex-shrink-0">
        <span className="text-neutral-400 dark:text-neutral-500 shrink-0">
          {icon}
        </span>
        {label}
      </span>
      <span className="text-foreground text-right">{value}</span>
    </div>
  );
}
