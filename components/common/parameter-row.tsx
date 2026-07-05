import { cn } from "@/lib/utils";

interface ParameterRowProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

export function ParameterRow({ icon, label, value, className, ...props }: ParameterRowProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4", className)} {...props}>
      <span className="text-neutral-450 flex flex-shrink-0 items-center gap-1.5 dark:text-neutral-500">
        <span className="shrink-0 text-neutral-400 dark:text-neutral-500">{icon}</span>
        {label}
      </span>
      <span className="text-right text-foreground">{value}</span>
    </div>
  );
}
