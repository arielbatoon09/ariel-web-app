"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ZoomIn, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface CaseStudyGalleryProps {
  images: string[];
  title: string;
}

export function CaseStudyGallery({ images, title }: CaseStudyGalleryProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (!api) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
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

  const activeImage = images[current];

  return (
    <div className="space-y-6">
      {/* Main Showcase Slider — fixed frame so every slide fills equally */}
      <div className="relative border border-dashed border-neutral-300 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900">
        <Carousel setApi={setApi} className="w-full" opts={{ align: "start", containScroll: "trimSnaps" }}>
          <CarouselContent className="-ml-0">
            {images.map((src, index) => {
              const isActive = index === current;
              return (
                <CarouselItem key={index} className="basis-full pl-0">
                  <button
                    type="button"
                    disabled={!isActive}
                    onClick={() => {
                      if (isActive) setLightboxOpen(true);
                    }}
                    className={cn(
                      "group relative block h-[240px] w-full overflow-hidden text-left sm:h-[340px] lg:h-[420px]",
                      isActive ? "cursor-zoom-in" : "cursor-default"
                    )}
                    aria-label={isActive ? `Expand gallery image ${index + 1}` : undefined}
                  >
                    <Image
                      src={src}
                      alt={`${title} Gallery Image ${index + 1}`}
                      fill
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.01]"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                      priority={index === 0}
                      loading={index === 0 ? "eager" : "lazy"}
                      fetchPriority={index === 0 ? "high" : "auto"}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/25 to-transparent" />

                    {isActive ? (
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-neutral-950/0 opacity-0 transition-all duration-300 group-hover:bg-neutral-950/35 group-hover:opacity-100">
                        <span className="flex size-11 items-center justify-center border border-dashed border-white/50 bg-background/90 text-foreground backdrop-blur-sm">
                          <ZoomIn className="size-4" strokeWidth={1.75} />
                        </span>
                      </div>
                    ) : null}
                  </button>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <div className="absolute right-4 bottom-4 z-10 flex gap-2 sm:right-12">
            <CarouselPrevious className="static h-8 w-8 translate-y-0 rounded-none border-dashed bg-background/80 backdrop-blur-sm hover:bg-background" />
            <CarouselNext className="static h-8 w-8 translate-y-0 rounded-none border-dashed bg-background/80 backdrop-blur-sm hover:bg-background" />
          </div>
        </Carousel>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex [scrollbar-width:none] gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {images.map((src, index) => (
            <button
              key={index}
              ref={(el) => {
                thumbnailRefs.current[index] = el;
              }}
              onClick={() => handleThumbnailClick(index)}
              className={cn(
                "relative h-16 w-28 flex-shrink-0 overflow-hidden border transition-all duration-300 ease-out focus:outline-none sm:h-20 sm:w-36",
                current === index
                  ? "border-neutral-800 ring-1 ring-neutral-800 dark:border-neutral-200 dark:ring-neutral-300"
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
                sizes="144px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Full image lightbox — scales every image to the same large viewport */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent
          showCloseButton={false}
          className="flex max-h-[90vh] w-[min(96vw,1400px)] max-w-none flex-col gap-0 overflow-hidden rounded-none border border-neutral-300 bg-background/95 p-0 backdrop-blur-md sm:max-w-[1400px] dark:border-neutral-700"
        >
          <DialogTitle className="sr-only">
            {title} — Gallery Image {current + 1}
          </DialogTitle>

          <div className="pointer-events-none absolute -top-px -left-px z-50 size-2.5 border-t-2 border-l-2 border-neutral-400 dark:border-neutral-500" />
          <div className="pointer-events-none absolute -top-px -right-px z-50 size-2.5 border-t-2 border-r-2 border-neutral-400 dark:border-neutral-500" />
          <div className="pointer-events-none absolute -bottom-px -left-px z-50 size-2.5 border-b-2 border-l-2 border-neutral-400 dark:border-neutral-500" />
          <div className="pointer-events-none absolute -right-px -bottom-px z-50 size-2.5 border-r-2 border-b-2 border-neutral-400 dark:border-neutral-500" />

          <div className="flex shrink-0 items-center justify-between border-b border-dashed border-neutral-300 px-4 py-2.5 dark:border-neutral-700">
            <p className="font-mono text-[10px] tracking-wider text-neutral-500 uppercase">
              {title} · {current + 1} / {images.length}
            </p>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="flex size-8 items-center justify-center border border-dashed border-neutral-300 text-neutral-500 transition-colors hover:border-neutral-500 hover:text-foreground dark:border-neutral-700"
              aria-label="Close image preview"
            >
              <X className="size-3.5" />
            </button>
          </div>

          <div className="relative h-[min(75vh,820px)] w-full bg-neutral-50 dark:bg-neutral-950">
            {activeImage ? (
              <Image
                src={activeImage}
                alt={`${title} Gallery Image ${current + 1} full view`}
                fill
                className="object-contain object-center p-3 sm:p-6"
                sizes="(max-width: 1400px) 96vw, 1400px"
                priority
              />
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
