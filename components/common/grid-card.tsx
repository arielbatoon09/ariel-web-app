import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface GridCardProps extends React.HTMLAttributes<HTMLDivElement> {
  number?: string;
  tag?: string;
  icon?: React.ReactNode;
  title: string;
  description: string;
  imageSrc?: string;
  tags?: string[];
  link?: {
    href: string;
    label: string;
  };
  titleClassName?: string;
  price?: string;
  deliveryTime?: string;
  truncate?: boolean;
  showEmptyImageState?: boolean;
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
  price,
  deliveryTime,
  truncate,
  showEmptyImageState,
  ...props
}: GridCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between border-r border-b border-dashed border-neutral-300 bg-neutral-50 p-6 transition-colors duration-300 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900/60 dark:hover:bg-neutral-900/90",
        className
      )}
      {...props}
    >
      {/* Interactive Corner Plus (+) Markers */}
      <div className="pointer-events-none absolute top-0 right-0 z-20 translate-x-1/2 -translate-y-1/2 text-[10px] font-light text-neutral-300 transition-all duration-300 select-none group-hover:scale-150 group-hover:text-neutral-600 dark:text-neutral-700 dark:group-hover:text-neutral-400">
        +
      </div>
      <div className="pointer-events-none absolute right-0 bottom-0 z-20 translate-x-1/2 translate-y-1/2 text-[10px] font-light text-neutral-300 transition-all duration-300 select-none group-hover:scale-150 group-hover:text-neutral-600 dark:text-neutral-700 dark:group-hover:text-neutral-400">
        +
      </div>

      <div className="space-y-4">
        {/* Optional Visual Image Showcase */}
        {imageSrc ? (
          link ? (
            <Link href={link.href} className="block cursor-pointer">
              <div className="border-neutral-250 dark:border-neutral-850 relative mb-2 aspect-[16/10] w-full overflow-hidden rounded border border-dashed bg-neutral-100/50 dark:bg-neutral-900/80">
                <Image
                  src={imageSrc}
                  alt={title}
                  fill
                  sizes="(max-w-768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                />
              </div>
            </Link>
          ) : (
            <div className="border-neutral-250 dark:border-neutral-850 relative mb-2 aspect-[16/10] w-full overflow-hidden rounded border border-dashed bg-neutral-100/50 dark:bg-neutral-900/80">
              <Image
                src={imageSrc}
                alt={title}
                fill
                sizes="(max-w-768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              />
            </div>
          )
        ) : showEmptyImageState ? (
          link ? (
            <Link href={link.href} className="block cursor-pointer">
              <div className="border-neutral-250 dark:border-neutral-850 relative mb-2 aspect-[16/10] w-full overflow-hidden rounded border border-dashed bg-neutral-100/30 dark:bg-neutral-900/40 flex flex-col items-center justify-center text-neutral-400 dark:text-neutral-600 gap-1.5 select-none">
                <span className="font-mono text-[9px] tracking-wider uppercase">No Banner Image</span>
              </div>
            </Link>
          ) : (
            <div className="border-neutral-250 dark:border-neutral-850 relative mb-2 aspect-[16/10] w-full overflow-hidden rounded border border-dashed bg-neutral-100/30 dark:bg-neutral-900/40 flex flex-col items-center justify-center text-neutral-400 dark:text-neutral-600 gap-1.5 select-none">
              <span className="font-mono text-[9px] tracking-wider uppercase">No Banner Image</span>
            </div>
          )
        ) : null}

        {/* Optional Icon Block */}
        {icon && (
          <div className="flex size-8 items-center justify-center rounded border border-dashed border-neutral-300 text-neutral-500 transition-all duration-300 group-hover:border-neutral-400 group-hover:text-foreground dark:border-neutral-700 dark:text-neutral-400 dark:group-hover:border-neutral-600">
            {icon}
          </div>
        )}

        {/* Optional ID & Category Tag */}
        {(number || tag) && (
          <div className="flex items-center gap-2.5">
            {number && <span className="font-mono text-[10px] text-neutral-400 dark:text-neutral-500">{number}</span>}
            {number && tag && <div className="h-2.5 w-[1px] bg-neutral-300 dark:bg-neutral-800" />}
            {tag && <span className="font-mono text-[9px] tracking-wider text-neutral-500 uppercase dark:text-neutral-400">{tag}</span>}
          </div>
        )}

        {/* Title & Description */}
        <div className="space-y-2">
          <h3 className={cn("font-sans text-lg font-bold tracking-tight text-foreground", titleClassName)}>{title}</h3>

          {(price || deliveryTime) && (
            <div className="flex items-center gap-3 text-xs font-medium text-neutral-500 dark:text-neutral-400">
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

          <p className={cn("text-xs leading-relaxed text-neutral-500 dark:text-neutral-400", truncate && "line-clamp-4")}>{description}</p>
        </div>
      </div>

      {/* Footer Details (Tags & Actions) */}
      {(tags || link) && (
        <div className="mt-6 space-y-4 border-t border-dashed border-neutral-200 pt-4 dark:border-neutral-800">
          {/* Tag Badges */}
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

          {/* Action CTA Link */}
          {link && (
            <div className="pt-1">
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
  );
}
