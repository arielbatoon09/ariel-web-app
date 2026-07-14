import { useState, useEffect, useRef, useCallback } from "react";

interface ScrollCarouselOptions {
  itemCount: number;
  gap?: number;
  cardSelector: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export function useScrollCarousel({ itemCount, gap = 24, cardSelector, autoPlay = false, autoPlayInterval = 8000 }: ScrollCarouselOptions) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dotsCount, setDotsCount] = useState(itemCount);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Calculate dynamic dots count based on viewport scroll capacity
  const updateDots = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const cards = container.querySelectorAll(cardSelector);
    if (!cards || cards.length === 0) return;

    const cardWidth = (cards[0] as HTMLElement).clientWidth;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;

    if (maxScrollLeft <= 0) {
      setDotsCount(1);
    } else {
      const steps = Math.round(maxScrollLeft / (cardWidth + gap));
      setDotsCount(steps + 1);
    }
  }, [cardSelector, gap]);

  useEffect(() => {
    updateDots();
    window.addEventListener("resize", updateDots);
    return () => window.removeEventListener("resize", updateDots);
  }, [updateDots]);

  // Synchronize index on manual scroll/swipe
  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const cards = container.querySelectorAll(cardSelector);
    if (!cards || cards.length === 0) return;

    const cardWidth = (cards[0] as HTMLElement).clientWidth;
    const scrollPosition = container.scrollLeft;

    const computedIndex = Math.round(scrollPosition / (cardWidth + gap));
    const clampedIndex = Math.max(0, Math.min(computedIndex, dotsCount - 1));

    if (clampedIndex !== activeIndex) {
      setActiveIndex(clampedIndex);
    }
  }, [activeIndex, gap, dotsCount, cardSelector]);

  const scrollToCard = useCallback(
    (index: number) => {
      const container = scrollRef.current;
      if (!container) return;

      const cards = container.querySelectorAll(cardSelector);
      if (!cards || cards.length === 0) return;

      const cardWidth = (cards[0] as HTMLElement).clientWidth;
      const targetScrollLeft = index * (cardWidth + gap);

      container.scrollTo({
        left: targetScrollLeft,
        behavior: "smooth",
      });

      setActiveIndex(index);
    },
    [gap, cardSelector]
  );

  // Hook up autoplay side effect
  useEffect(() => {
    if (!autoPlay || dotsCount <= 1) return;

    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % dotsCount;
      scrollToCard(nextIndex);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, activeIndex, dotsCount, scrollToCard]);

  return {
    scrollRef,
    activeIndex,
    dotsCount,
    scrollToCard,
    handleScroll,
  };
}
