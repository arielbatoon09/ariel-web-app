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
  const scrollRef = useRef<HTMLDivElement>(null);

  // Synchronize index on manual scroll/swipe
  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const cards = container.querySelectorAll(cardSelector);
    if (!cards || cards.length === 0) return;

    const cardWidth = (cards[0] as HTMLElement).clientWidth;
    const scrollPosition = container.scrollLeft;

    // Determine current index based on which card is closest to the left boundary
    const computedIndex = Math.round(scrollPosition / (cardWidth + gap));

    // Clamp values safety check
    const clampedIndex = Math.max(0, Math.min(computedIndex, itemCount - 1));

    if (clampedIndex !== activeIndex) {
      setActiveIndex(clampedIndex);
    }
  }, [activeIndex, gap, itemCount, cardSelector]);

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
    if (!autoPlay) return;

    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % itemCount;
      scrollToCard(nextIndex);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, activeIndex, itemCount, scrollToCard]);

  return {
    scrollRef,
    activeIndex,
    scrollToCard,
    handleScroll,
  };
}
