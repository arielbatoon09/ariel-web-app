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
        "relative w-full aspect-[16/6] overflow-hidden border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900",
        className
      )}
      {...props}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover object-center grayscale hover:grayscale-0 transition-all duration-700 ease-out"
        sizes="100vw"
        priority
      />
      {/* Soft scanline/grid overlay for premium look */}
      <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent pointer-events-none" />
    </div>
  );
}
