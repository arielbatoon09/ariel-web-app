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
        "group text-neutral-450 inline-flex items-center gap-2 font-mono text-[10px] tracking-wider uppercase transition-colors duration-350 hover:text-foreground dark:text-neutral-500",
        className
      )}
      {...props}
    >
      <span className="flex size-7 items-center justify-center border border-dashed border-neutral-300 transition-all duration-300 group-hover:border-foreground group-hover:bg-neutral-900 group-hover:text-background dark:border-neutral-700 dark:group-hover:bg-neutral-100 dark:group-hover:text-foreground">
        <ArrowLeft className="size-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
      </span>
      {label}
    </Link>
  );
}
