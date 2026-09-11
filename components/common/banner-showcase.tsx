import Image from "next/image";
import { cn } from "@/lib/utils";

interface BannerShowcaseProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
  /** How the image fills the frame. Use `contain` to show the full image without cropping. */
  fit?: "cover" | "contain";
}

export function BannerShowcase({ src, alt, className, fit = "cover", ...props }: BannerShowcaseProps) {
  const isContain = fit === "contain";

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden border border-dashed border-neutral-300 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900",
        isContain ? "aspect-square max-h-[min(72vw,560px)] w-full sm:aspect-[4/3] sm:max-h-[520px]" : "aspect-[16/6]",
        className
      )}
      {...props}
    >
      <div className={cn("absolute inset-0", isContain && "inset-3 sm:inset-4")}>
        <Image
          src={src}
          alt={alt}
          fill
          className={cn("object-center", isContain ? "object-contain" : "object-cover")}
          sizes="100vw"
          priority
        />
      </div>
      {!isContain ? (
        <>
          <div className="bg-grid-white/[0.02] pointer-events-none absolute inset-0" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
        </>
      ) : null}
    </div>
  );
}
