import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  label: string;
}

export function BackButton({ href, label, className, ...props }: BackButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-neutral-450 dark:text-neutral-500 hover:text-foreground transition-colors duration-350",
        className
      )}
      {...props}
    >
      <span className="flex items-center justify-center size-7 border border-dashed border-neutral-300 dark:border-neutral-700 group-hover:border-foreground group-hover:bg-neutral-900 dark:group-hover:bg-neutral-100 group-hover:text-background dark:group-hover:text-foreground transition-all duration-300">
        <ArrowLeft className="size-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
      </span>
      {label}
    </Link>
  );
}
