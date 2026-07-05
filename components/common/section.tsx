import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  showTopLine?: boolean;
  showBottomLine?: boolean;
  showLeftLine?: boolean;
  showRightLine?: boolean;
  fullWidth?: boolean;
}

export function Section({
  children,
  className,
  containerClassName,
  showTopLine = true,
  showBottomLine = false,
  showLeftLine = true,
  showRightLine = true,
  fullWidth = false,
  ...props
}: SectionProps) {
  return (
    <section className={cn("relative w-full", className)} {...props}>
      {/* Top Horizontal Line (Full Width, Dashed) */}
      {showTopLine && (
        <div className="absolute top-0 left-0 right-0 h-0 border-t border-dashed border-neutral-300 dark:border-neutral-700 pointer-events-none" />
      )}

      {/* Bottom Horizontal Line (Full Width, Dashed) */}
      {showBottomLine && (
        <div className="absolute bottom-0 left-0 right-0 h-0 border-t border-dashed border-neutral-300 dark:border-neutral-700 pointer-events-none" />
      )}

      <div
        className={cn(
          "relative px-6 md:px-8 py-12 md:py-16",
          fullWidth ? "w-full" : "max-w-7xl mx-auto",
          containerClassName
        )}
      >
        {/* Left Vertical Line (extends up and down, Dashed) */}
        {showLeftLine && (
          <div className="absolute top-[-20px] bottom-[-20px] left-6 md:left-8 w-0 border-l border-dashed border-neutral-300 dark:border-neutral-700 pointer-events-none" />
        )}

        {/* Right Vertical Line (extends up and down, Dashed) */}
        {showRightLine && (
          <div className="absolute top-[-20px] bottom-[-20px] right-6 md:right-8 w-0 border-l border-dashed border-neutral-300 dark:border-neutral-700 pointer-events-none" />
        )}

        {/* Intersecting Plus (+) symbols */}
        {showTopLine && showLeftLine && (
          <div className="absolute top-0 left-6 md:left-8 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none text-xs font-light text-neutral-400/80 dark:text-neutral-600/80 bg-background px-1">
            +
          </div>
        )}

        {showTopLine && showRightLine && (
          <div className="absolute top-0 right-6 md:right-8 translate-x-1/2 -translate-y-1/2 select-none pointer-events-none text-xs font-light text-neutral-400/80 dark:text-neutral-600/80 bg-background px-1">
            +
          </div>
        )}

        {showBottomLine && showLeftLine && (
          <div className="absolute bottom-0 left-6 md:left-8 -translate-x-1/2 translate-y-1/2 select-none pointer-events-none text-xs font-light text-neutral-400/80 dark:text-neutral-600/80 bg-background px-1">
            +
          </div>
        )}

        {showBottomLine && showRightLine && (
          <div className="absolute bottom-0 right-6 md:right-8 translate-x-1/2 translate-y-1/2 select-none pointer-events-none text-xs font-light text-neutral-400/80 dark:text-neutral-600/80 bg-background px-1">
            +
          </div>
        )}

        {/* Content area padded inside the vertical lines */}
        <div className="px-4 md:px-8 pt-2 pb-6">
          {children}
        </div>
      </div>
    </section>
  );
}
