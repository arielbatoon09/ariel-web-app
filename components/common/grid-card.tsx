import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
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
  ...props
}: GridCardProps) {
  return (
    <div
      className={cn(
        "group relative p-6 border-r border-b border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/60 hover:bg-neutral-100 dark:hover:bg-neutral-900/90 transition-colors duration-300 flex flex-col justify-between",
        className
      )}
      {...props}
    >
      {/* Interactive Corner Plus (+) Markers */}
      <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 select-none pointer-events-none text-[10px] font-light text-neutral-300 dark:text-neutral-700 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 group-hover:scale-150 transition-all duration-300 z-20">
        +
      </div>
      <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 select-none pointer-events-none text-[10px] font-light text-neutral-300 dark:text-neutral-700 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 group-hover:scale-150 transition-all duration-300 z-20">
        +
      </div>

      <div className="space-y-4">
        {/* Optional Visual Image Showcase */}
        {imageSrc && (
          link ? (
            <Link href={link.href} className="block cursor-pointer">
              <div className="relative w-full aspect-[16/10] overflow-hidden rounded border border-dashed border-neutral-250 dark:border-neutral-850 bg-neutral-100/50 dark:bg-neutral-900/80 mb-2">
                <Image
                  src={imageSrc}
                  alt={title}
                  fill
                  sizes="(max-w-768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                />
              </div>
            </Link>
          ) : (
            <div className="relative w-full aspect-[16/10] overflow-hidden rounded border border-dashed border-neutral-250 dark:border-neutral-850 bg-neutral-100/50 dark:bg-neutral-900/80 mb-2">
              <Image
                src={imageSrc}
                alt={title}
                fill
                sizes="(max-w-768px) 100vw, 33vw"
                className="object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
              />
            </div>
          )
        )}

        {/* Optional Icon Block */}
        {icon && (
          <div className="size-8 rounded border border-dashed border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-neutral-500 dark:text-neutral-400 group-hover:border-neutral-400 dark:group-hover:border-neutral-600 group-hover:text-foreground transition-all duration-300">
            {icon}
          </div>
        )}

        {/* Optional ID & Category Tag */}
        {(number || tag) && (
          <div className="flex items-center gap-2.5">
            {number && (
              <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500">
                {number}
              </span>
            )}
            {number && tag && (
              <div className="h-2.5 w-[1px] bg-neutral-300 dark:bg-neutral-800" />
            )}
            {tag && (
              <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                {tag}
              </span>
            )}
          </div>
        )}

        {/* Title & Description */}
        <div className="space-y-2">
          <h3 className={cn("text-lg font-bold text-foreground font-sans tracking-tight", titleClassName)}>
            {title}
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Footer Details (Tags & Actions) */}
      {(tags || link) && (
        <div className="space-y-4 pt-4 mt-6 border-t border-dashed border-neutral-200 dark:border-neutral-800">
          {/* Tag Badges */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <span
                  key={t}
                  className="text-[9px] font-mono px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 bg-background"
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
                className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400 hover:text-foreground transition-colors duration-200 group/link"
              >
                {link.label}
                <ArrowUpRight className="size-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-200" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
