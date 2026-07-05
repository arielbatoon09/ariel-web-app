import { cn } from "@/lib/utils";
import { MotionSection } from "@/components/common/motion-section";

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
        <div className="pointer-events-none absolute top-0 right-0 left-0 h-0 border-t border-dashed border-neutral-300 dark:border-neutral-700" />
      )}

      {/* Bottom Horizontal Line (Full Width, Dashed) */}
      {showBottomLine && (
        <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-0 border-t border-dashed border-neutral-300 dark:border-neutral-700" />
      )}

      <div className={cn("relative px-6 pt-8 pb-12 md:px-8 md:pt-12 md:pb-16", fullWidth ? "w-full" : "mx-auto max-w-7xl", containerClassName)}>
        {/* Left Vertical Line (extends up and down, Dashed) */}
        {showLeftLine && (
          <div className="pointer-events-none absolute top-[-20px] bottom-[-20px] left-6 w-0 border-l border-dashed border-neutral-300 md:left-8 dark:border-neutral-700" />
        )}

        {/* Right Vertical Line (extends up and down, Dashed) */}
        {showRightLine && (
          <div className="pointer-events-none absolute top-[-20px] right-6 bottom-[-20px] w-0 border-l border-dashed border-neutral-300 md:right-8 dark:border-neutral-700" />
        )}

        {/* Intersecting Plus (+) symbols */}
        {showTopLine && showLeftLine && (
          <div className="pointer-events-none absolute top-0 left-6 -translate-x-1/2 -translate-y-1/2 bg-background px-1 text-xs font-light text-neutral-400/80 select-none md:left-8 dark:text-neutral-600/80">
            +
          </div>
        )}

        {showTopLine && showRightLine && (
          <div className="pointer-events-none absolute top-0 right-6 translate-x-1/2 -translate-y-1/2 bg-background px-1 text-xs font-light text-neutral-400/80 select-none md:right-8 dark:text-neutral-600/80">
            +
          </div>
        )}

        {showBottomLine && showLeftLine && (
          <div className="pointer-events-none absolute bottom-0 left-6 -translate-x-1/2 translate-y-1/2 bg-background px-1 text-xs font-light text-neutral-400/80 select-none md:left-8 dark:text-neutral-600/80">
            +
          </div>
        )}

        {showBottomLine && showRightLine && (
          <div className="pointer-events-none absolute right-6 bottom-0 translate-x-1/2 translate-y-1/2 bg-background px-1 text-xs font-light text-neutral-400/80 select-none md:right-8 dark:text-neutral-600/80">
            +
          </div>
        )}

        {/* Content area padded inside the vertical lines */}
        <div className="px-4 pt-2 pb-6 md:px-8">
          <MotionSection>{children}</MotionSection>
        </div>
      </div>
    </section>
  );
}
