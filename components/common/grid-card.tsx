import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface GridCardProps extends React.HTMLAttributes<HTMLDivElement> {
  number?: string;
  tag?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  imageSrc?: string;
  tags?: string[];
  link?: {
    href: string;
    label: string;
  };
  titleClassName?: string;
  descriptionClassName?: string;
  iconClassName?: string;
  price?: string;
  deliveryTime?: string;
  truncate?: boolean;
  showEmptyImageState?: boolean;
  watermark?: string;
  showHoverLine?: boolean;
  children?: React.ReactNode;
  priority?: boolean;
  /** `grid` = stacked card. `list` = horizontal row with image matching content height. */
  variant?: "grid" | "list";
}

function CardImage({
  imageSrc,
  title,
  link,
  isList,
  showEmptyImageState,
  priority,
}: {
  imageSrc?: string;
  title?: string;
  link?: { href: string; label: string };
  isList: boolean;
  showEmptyImageState?: boolean;
  priority: boolean;
}) {
  if (!imageSrc && !showEmptyImageState) return null;

  const shellClass = cn(
    "border-neutral-250 dark:border-neutral-850 relative overflow-hidden rounded border border-dashed",
    isList ? "h-full min-h-[7.5rem] w-24 sm:w-32 md:w-44 lg:w-52" : "mb-2 aspect-[16/10] w-full bg-neutral-100/50 dark:bg-neutral-900/80"
  );

  const media = imageSrc ? (
    <div className={cn(shellClass, isList && "bg-neutral-100/50 dark:bg-neutral-900/80")}>
      <Image
        src={imageSrc}
        alt={title || ""}
        fill
        sizes={isList ? "(max-width: 768px) 128px, 208px" : "(max-width: 768px) 100vw, 33vw"}
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
      />
    </div>
  ) : (
    <div
      className={cn(
        shellClass,
        "flex flex-col items-center justify-center gap-1.5 bg-neutral-100/30 text-neutral-400 select-none dark:bg-neutral-900/40 dark:text-neutral-600"
      )}
    >
      <span className="font-mono text-[9px] tracking-wider uppercase">No Banner</span>
    </div>
  );

  if (link) {
    return (
      <Link href={link.href} className={cn("block cursor-pointer", isList && "h-full min-h-[7.5rem] self-stretch")}>
        {media}
      </Link>
    );
  }

  return <div className={cn(isList && "h-full min-h-[7.5rem] self-stretch")}>{media}</div>;
}

export function GridCard({
  number,
  tag,
  icon,
  title,
  description,
  imageSrc,
  tags,
  link,
  className,
  titleClassName,
  descriptionClassName,
  iconClassName,
  price,
  deliveryTime,
  truncate,
  showEmptyImageState,
  watermark,
  showHoverLine,
  children,
  priority = false,
  variant = "grid",
  ...props
}: GridCardProps) {
  const isList = variant === "list";
  const showImageColumn = Boolean(imageSrc || showEmptyImageState);

  return (
    <div
      className={cn(
        "group relative border-r border-b border-dashed border-neutral-300 bg-neutral-50 p-4 transition-colors duration-300 hover:bg-neutral-100 sm:p-5 md:p-6 dark:border-neutral-700 dark:bg-neutral-900/60 dark:hover:bg-neutral-900/90",
        isList ? "flex flex-row items-stretch gap-3 sm:gap-4" : "flex flex-col justify-between",
        className
      )}
      {...props}
    >
      <div className="pointer-events-none absolute top-0 right-0 z-20 translate-x-1/2 -translate-y-1/2 text-[10px] font-light text-neutral-300 transition-all duration-300 select-none group-hover:scale-150 group-hover:text-neutral-600 dark:text-neutral-700 dark:group-hover:text-neutral-400">
        +
      </div>
      <div className="pointer-events-none absolute right-0 bottom-0 z-20 translate-x-1/2 translate-y-1/2 text-[10px] font-light text-neutral-300 transition-all duration-300 select-none group-hover:scale-150 group-hover:text-neutral-600 dark:text-neutral-700 dark:group-hover:text-neutral-400">
        +
      </div>

      {showHoverLine && (
        <div className="absolute top-0 left-0 z-10 h-[2px] w-0 bg-emerald-500/80 transition-all duration-500 ease-out group-hover:w-full dark:bg-emerald-400/80" />
      )}

      {watermark && (
        <div className="pointer-events-none absolute top-4 right-6 z-0 font-mono text-7xl font-black tracking-tighter text-neutral-100 transition-colors duration-300 select-none group-hover:text-neutral-200 md:text-8xl dark:text-neutral-900/30 dark:group-hover:text-neutral-800/40">
          {watermark}
        </div>
      )}

      {children ? (
        children
      ) : (
        <>
          {showImageColumn ? (
            <div className={cn(isList ? "shrink-0 self-stretch" : "w-full")}>
              <CardImage
                imageSrc={imageSrc}
                title={title}
                link={link}
                isList={isList}
                showEmptyImageState={showEmptyImageState}
                priority={priority}
              />
            </div>
          ) : null}

          <div className={cn("flex min-w-0 flex-1 flex-col justify-between", isList ? "gap-3" : "space-y-4")}>
            <div className="space-y-3 md:space-y-4">
              {icon && (
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded border border-dashed border-neutral-300 text-neutral-500 transition-all duration-300 group-hover:border-neutral-400 group-hover:text-foreground dark:border-neutral-700 dark:text-neutral-400 dark:group-hover:border-neutral-600",
                    iconClassName
                  )}
                >
                  {icon}
                </div>
              )}

              {(number || tag) && (
                <div className="flex flex-wrap items-center gap-2.5">
                  {number && <span className="font-mono text-[10px] text-neutral-400 dark:text-neutral-500">{number}</span>}
                  {number && tag && <div className="hidden h-2.5 w-[1px] bg-neutral-300 sm:block dark:bg-neutral-800" />}
                  {tag && <span className="font-mono text-[9px] tracking-wider text-neutral-500 uppercase dark:text-neutral-400">{tag}</span>}
                </div>
              )}

              {(title || description) && (
                <div className="space-y-2">
                  {title && (
                    <h3 className={cn("font-sans text-base font-bold tracking-tight text-foreground sm:text-lg", titleClassName)}>{title}</h3>
                  )}

                  {(price || deliveryTime) && (
                    <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                      {price && <span className="font-mono text-sm font-semibold text-neutral-900 dark:text-neutral-100">{price}</span>}
                      {price && deliveryTime && <span className="text-neutral-300 dark:text-neutral-700">|</span>}
                      {deliveryTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="size-3 text-neutral-400" />
                          {deliveryTime}
                        </span>
                      )}
                    </div>
                  )}

                  {description && (
                    <p
                      className={cn(
                        "text-xs leading-relaxed text-neutral-500 dark:text-neutral-400",
                        truncate && "line-clamp-4",
                        isList && !truncate && "line-clamp-3",
                        !isList && !truncate && "line-clamp-4",
                        descriptionClassName
                      )}
                    >
                      {description}
                    </p>
                  )}
                </div>
              )}
            </div>

            {(tags || link) && (
              <div className="mt-auto space-y-3 border-t border-dashed border-neutral-200 pt-3 md:space-y-4 md:pt-4 dark:border-neutral-800">
                {tags && tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((t) => (
                      <span
                        key={t}
                        className="rounded border border-neutral-200 bg-background px-2 py-0.5 font-mono text-[9px] text-neutral-500 dark:border-neutral-800 dark:text-neutral-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {link && (
                  <div className="pt-0.5">
                    <Link
                      href={link.href}
                      className="group/link inline-flex items-center gap-1 font-mono text-[11px] tracking-wider text-neutral-600 uppercase transition-colors duration-200 hover:text-foreground dark:text-neutral-400"
                    >
                      {link.label}
                      <ArrowUpRight className="size-3 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
