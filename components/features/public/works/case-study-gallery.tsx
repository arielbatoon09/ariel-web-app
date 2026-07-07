"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";

interface CaseStudyGalleryProps {
  images: string[];
  title: string;
}

export function CaseStudyGallery({ images, title }: CaseStudyGalleryProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const thumbnailRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  React.useEffect(() => {
    if (!api) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  React.useEffect(() => {
    const activeThumbnail = thumbnailRefs.current[current];
    if (activeThumbnail) {
      activeThumbnail.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [current]);

  const handleThumbnailClick = (index: number) => {
    api?.scrollTo(index);
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="space-y-6">
      {/* Main Showcase Slider */}
      <div className="relative border border-dashed border-neutral-300 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900">
        <Carousel setApi={setApi} className="w-full">
          <CarouselContent>
            {images.map((src, index) => (
              <CarouselItem key={index}>
                <div className="relative aspect-[16/6] w-full overflow-hidden">
                  <Image
                    src={src}
                    alt={`${title} Gallery Image ${index + 1}`}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                    priority={index === 0}
                  />
                  {/* Premium overlays */}
                  <div className="bg-grid-white/[0.02] pointer-events-none absolute inset-0" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute right-12 bottom-4 flex gap-2">
            <CarouselPrevious className="static h-8 w-8 translate-y-0 rounded-none border-dashed bg-background/80 backdrop-blur-sm hover:bg-background" />
            <CarouselNext className="static h-8 w-8 translate-y-0 rounded-none border-dashed bg-background/80 backdrop-blur-sm hover:bg-background" />
          </div>
        </Carousel>
      </div>

      {/* Thumbnails Control Strip */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {images.map((src, index) => (
            <button
              key={index}
              ref={(el) => {
                thumbnailRefs.current[index] = el;
              }}
              onClick={() => handleThumbnailClick(index)}
              className={cn(
                "relative aspect-[16/6] w-24 flex-shrink-0 overflow-hidden border transition-all duration-300 ease-out focus:outline-none md:w-32",
                current === index
                  ? "ring-neutral-850 border-neutral-800 ring-1 dark:border-neutral-200 dark:ring-neutral-300"
                  : "hover:border-neutral-450 border-dashed border-neutral-300 dark:border-neutral-700 dark:hover:border-neutral-500"
              )}
              aria-label={`Go to slide ${index + 1}`}
            >
              <Image
                src={src}
                alt={`${title} Thumbnail ${index + 1}`}
                fill
                className={cn(
                  "object-cover object-center transition-all duration-500",
                  current === index ? "scale-105 opacity-100" : "opacity-60 hover:opacity-100"
                )}
                sizes="(max-width: 768px) 96px, 128px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
