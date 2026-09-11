"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import { ZoomIn, ZoomOut, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface CaseStudyGalleryProps {
  images: string[];
  title: string;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.25;

function clampZoom(value: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(value * 100) / 100));
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Renders the lightbox media as a CSS background (not an <img>) so the browser
 * never creates a native drag-ghost while panning.
 */
function LightboxZoomStage({ src, alt, label, onClose }: { src: string; alt: string; label: string; onClose: () => void }) {
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });

  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef(1);
  const offsetRef = useRef({ x: 0, y: 0 });
  const naturalSizeRef = useRef<{ w: number; h: number } | null>(null);
  const isDraggingRef = useRef(false);
  const dragRef = useRef<{ pointerId: number; startX: number; startY: number; originX: number; originY: number } | null>(null);
  const pinchRef = useRef<{ distance: number; scale: number } | null>(null);

  const paint = useCallback((x: number, y: number, nextScale: number) => {
    const el = contentRef.current;
    if (!el) return;
    el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${nextScale})`;
  }, []);

  // Measure intrinsic size without mounting a draggable <img>
  useEffect(() => {
    let cancelled = false;
    const probe = new window.Image();
    probe.onload = () => {
      if (cancelled) return;
      const size = { w: probe.naturalWidth, h: probe.naturalHeight };
      naturalSizeRef.current = size;
      setNaturalSize(size);
    };
    probe.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setViewportSize({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Lock page scroll while open
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prev = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      htmlOverscroll: html.style.overscrollBehavior,
      bodyOverscroll: body.style.overscrollBehavior,
    };

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";
    body.style.overscrollBehavior = "none";

    const blockOutside = (event: Event) => {
      const target = event.target as Node | null;
      if (target && viewportRef.current?.contains(target)) return;
      event.preventDefault();
    };

    document.addEventListener("wheel", blockOutside, { passive: false, capture: true });
    document.addEventListener("touchmove", blockOutside, { passive: false, capture: true });

    return () => {
      html.style.overflow = prev.htmlOverflow;
      body.style.overflow = prev.bodyOverflow;
      html.style.overscrollBehavior = prev.htmlOverscroll;
      body.style.overscrollBehavior = prev.bodyOverscroll;
      document.removeEventListener("wheel", blockOutside, true);
      document.removeEventListener("touchmove", blockOutside, true);
    };
  }, []);

  const getContentSize = useCallback((nextScale = scaleRef.current) => {
    const viewport = viewportRef.current;
    const natural = naturalSizeRef.current;
    if (!viewport || !natural || natural.w <= 0) {
      return { width: 0, height: 0, viewportWidth: viewport?.clientWidth ?? 0, viewportHeight: viewport?.clientHeight ?? 0 };
    }

    const viewportWidth = viewport.clientWidth;
    const viewportHeight = viewport.clientHeight;
    const width = viewportWidth * nextScale;
    const height = (natural.h / natural.w) * viewportWidth * nextScale;

    return { width, height, viewportWidth, viewportHeight };
  }, []);

  const clampOffset = useCallback(
    (x: number, y: number, nextScale = scaleRef.current) => {
      const { width, height, viewportWidth, viewportHeight } = getContentSize(nextScale);
      if (!width || !height) return { x, y };

      const minX = Math.min(0, viewportWidth - width) / 2;
      const maxX = Math.max(0, (width - viewportWidth) / 2);
      const minY = Math.min(0, viewportHeight - height);
      const maxY = 0;

      return { x: clamp(x, minX, maxX), y: clamp(y, minY, maxY) };
    },
    [getContentSize]
  );

  const applyZoom = useCallback(
    (next: number) => {
      const clamped = clampZoom(next);
      const nextOffset = clampOffset(offsetRef.current.x, offsetRef.current.y, clamped);
      scaleRef.current = clamped;
      offsetRef.current = nextOffset;
      setScale(clamped);
      paint(nextOffset.x, nextOffset.y, clamped);
    },
    [clampOffset, paint]
  );

  const panBy = useCallback(
    (deltaX: number, deltaY: number) => {
      const next = clampOffset(offsetRef.current.x + deltaX, offsetRef.current.y + deltaY);
      offsetRef.current = next;
      paint(next.x, next.y, scaleRef.current);
    },
    [clampOffset, paint]
  );

  useEffect(() => {
    if (!naturalSize) return;
    const next = clampOffset(offsetRef.current.x, offsetRef.current.y);
    offsetRef.current = next;
    paint(next.x, next.y, scaleRef.current);
  }, [naturalSize, clampOffset, paint]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();

      // Ctrl/Cmd + wheel zooms; plain wheel pans the preview.
      if (event.ctrlKey || event.metaKey) {
        applyZoom(scaleRef.current - event.deltaY * 0.0025);
        return;
      }

      const lineHeight = 16;
      const pageHeight = el.clientHeight;
      const scaleDelta = (delta: number, mode: number) => {
        if (mode === 1) return delta * lineHeight;
        if (mode === 2) return delta * pageHeight;
        return delta;
      };

      panBy(-scaleDelta(event.deltaX, event.deltaMode), -scaleDelta(event.deltaY, event.deltaMode));
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [applyZoom, panBy]);

  const canPan = useMemo(() => {
    if (!naturalSize || naturalSize.w <= 0 || viewportSize.width <= 0) return false;
    const width = viewportSize.width * scale;
    const height = (naturalSize.h / naturalSize.w) * viewportSize.width * scale;
    return height > viewportSize.height + 1 || width > viewportSize.width + 1;
  }, [naturalSize, viewportSize, scale]);

  const getTouchDistance = (touches: React.TouchList) => {
    const a = touches[0];
    const b = touches[1];
    if (!a || !b) return 0;
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  };

  const beginDrag = (clientX: number, clientY: number, pointerId: number) => {
    const size = getContentSize();
    const pannable = size.height > size.viewportHeight + 1 || size.width > size.viewportWidth + 1 || scaleRef.current > MIN_ZOOM;
    if (!pannable) return false;

    isDraggingRef.current = true;
    dragRef.current = {
      pointerId,
      startX: clientX,
      startY: clientY,
      originX: offsetRef.current.x,
      originY: offsetRef.current.y,
    };
    paint(offsetRef.current.x, offsetRef.current.y, scaleRef.current);
    setIsDragging(true);
    return true;
  };

  const moveDrag = (clientX: number, clientY: number) => {
    if (!dragRef.current) return;
    const next = clampOffset(
      dragRef.current.originX + (clientX - dragRef.current.startX),
      dragRef.current.originY + (clientY - dragRef.current.startY)
    );
    offsetRef.current = next;
    paint(next.x, next.y, scaleRef.current);
  };

  const endDrag = () => {
    if (!isDraggingRef.current && !dragRef.current) return;
    dragRef.current = null;
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    // Prevent browser text/image drag initiation (the translucent drag ghost).
    event.preventDefault();
    if (!beginDrag(event.clientX, event.clientY, event.pointerId)) return;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) return;
    event.preventDefault();
    moveDrag(event.clientX, event.clientY);
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) return;
    endDrag();
  };

  const onTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length === 2) {
      pinchRef.current = { distance: getTouchDistance(event.touches), scale: scaleRef.current };
      dragRef.current = null;
      isDraggingRef.current = false;
      setIsDragging(false);
      return;
    }
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      beginDrag(touch.clientX, touch.clientY, -1);
    }
  };

  const onTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length === 2 && pinchRef.current) {
      event.preventDefault();
      const distance = getTouchDistance(event.touches);
      if (distance <= 0 || pinchRef.current.distance <= 0) return;
      applyZoom(pinchRef.current.scale * (distance / pinchRef.current.distance));
      return;
    }
    if (event.touches.length === 1 && dragRef.current) {
      event.preventDefault();
      const touch = event.touches[0];
      moveDrag(touch.clientX, touch.clientY);
    }
  };

  const onTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length < 2) pinchRef.current = null;
    if (event.touches.length === 0) endDrag();
  };

  const zoomPercent = Math.round(scale * 100);
  const aspectRatio = naturalSize && naturalSize.w > 0 ? naturalSize.w / naturalSize.h : 16 / 10;

  return (
    <>
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-dashed border-neutral-300 bg-background px-4 py-2.5 dark:border-neutral-700">
        <p className="min-w-0 truncate font-mono text-[10px] tracking-wider text-neutral-500 uppercase">{label}</p>

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => applyZoom(scaleRef.current - ZOOM_STEP)}
            disabled={scale <= MIN_ZOOM}
            className="flex size-8 items-center justify-center border border-dashed border-neutral-300 text-neutral-500 transition-colors hover:border-neutral-500 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700"
            aria-label="Zoom out"
          >
            <ZoomOut className="size-3.5" strokeWidth={1.75} />
          </button>
          <span className="min-w-[3.25rem] text-center font-mono text-[10px] tracking-wider text-neutral-500 tabular-nums">{zoomPercent}%</span>
          <button
            type="button"
            onClick={() => applyZoom(scaleRef.current + ZOOM_STEP)}
            disabled={scale >= MAX_ZOOM}
            className="flex size-8 items-center justify-center border border-dashed border-neutral-300 text-neutral-500 transition-colors hover:border-neutral-500 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700"
            aria-label="Zoom in"
          >
            <ZoomIn className="size-3.5" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="ml-1 flex size-8 items-center justify-center border border-dashed border-neutral-300 text-neutral-500 transition-colors hover:border-neutral-500 hover:text-foreground dark:border-neutral-700"
            aria-label="Close image preview"
          >
            <X className="size-3.5" />
          </button>
        </div>
      </div>

      <div
        ref={viewportRef}
        className={cn(
          "relative isolate h-[min(75vh,820px)] w-full touch-none overflow-hidden overscroll-none bg-neutral-50 select-none dark:bg-neutral-950",
          canPan || scale > MIN_ZOOM ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-default"
        )}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
        onDragStart={(event) => event.preventDefault()}
        onDoubleClick={() => applyZoom(scale >= 2 ? MIN_ZOOM : 2)}
        role="img"
        aria-label={`${alt}. Scroll or drag to pan. Pinch or Ctrl+scroll to zoom.`}
      >
        <div
          ref={contentRef}
          className="absolute top-0 left-0 w-full origin-top will-change-transform"
          style={{
            aspectRatio: `${aspectRatio}`,
            backgroundImage: `url("${src}")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "top center",
            backgroundSize: "100% auto",
          }}
        />
      </div>
    </>
  );
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
    <div className={cn("space-y-6", lightboxOpen && "[&_img]:invisible")}>
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

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent
          showCloseButton={false}
          overlayClassName="bg-neutral-950/70 supports-backdrop-filter:backdrop-blur-sm"
          className="flex max-h-[90vh] w-[min(96vw,1400px)] max-w-none flex-col gap-0 overflow-hidden overscroll-none rounded-none border border-neutral-300 bg-background p-0 sm:max-w-[1400px] dark:border-neutral-700"
        >
          <DialogTitle className="sr-only">
            {title} — Gallery Image {current + 1}
          </DialogTitle>

          <div className="pointer-events-none absolute -top-px -left-px z-50 size-2.5 border-t-2 border-l-2 border-neutral-400 dark:border-neutral-500" />
          <div className="pointer-events-none absolute -top-px -right-px z-50 size-2.5 border-t-2 border-r-2 border-neutral-400 dark:border-neutral-500" />
          <div className="pointer-events-none absolute -bottom-px -left-px z-50 size-2.5 border-b-2 border-l-2 border-neutral-400 dark:border-neutral-500" />
          <div className="pointer-events-none absolute -right-px -bottom-px z-50 size-2.5 border-r-2 border-b-2 border-neutral-400 dark:border-neutral-500" />

          {activeImage ? (
            <LightboxZoomStage
              key={`${activeImage}-${lightboxOpen}`}
              src={activeImage}
              alt={`${title} Gallery Image ${current + 1} full view`}
              label={`${title} · ${current + 1} / ${images.length}`}
              onClose={() => setLightboxOpen(false)}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
