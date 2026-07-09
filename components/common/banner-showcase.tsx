import Image from "next/image";
import { cn } from "@/lib/utils";

interface BannerShowcaseProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
}

export function BannerShowcase({ src, alt, className, ...props }: BannerShowcaseProps) {
  return (
    <div
      className={cn(
        "relative aspect-[16/6] w-full overflow-hidden border border-dashed border-neutral-300 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900",
        className
      )}
      {...props}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover object-center"
        sizes="100vw"
        priority
      />
      {/* Soft scanline/grid overlay for premium look */}
      <div className="bg-grid-white/[0.02] pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
    </div>
  );
}
