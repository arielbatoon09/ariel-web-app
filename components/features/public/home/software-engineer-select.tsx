"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MousePointer2 } from "lucide-react";

type Phase = "idle" | "approach" | "selecting" | "tooltip" | "clear";

/**
 * Loops: cursor approaches → selects "Software Engineer" → tooltip → clear → repeat.
 */
export function SoftwareEngineerSelect() {
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    let cancelled = false;

    const run = () => {
      if (cancelled) return;
      setPhase("idle");
      timers.push(
        setTimeout(() => {
          if (cancelled) return;
          setPhase("approach");
          timers.push(
            setTimeout(() => {
              if (cancelled) return;
              setPhase("selecting");
              timers.push(
                setTimeout(() => {
                  if (cancelled) return;
                  setPhase("tooltip");
                  timers.push(
                    setTimeout(() => {
                      if (cancelled) return;
                      setPhase("clear");
                      timers.push(
                        setTimeout(() => {
                          if (cancelled) return;
                          run();
                        }, 700)
                      );
                    }, 2200)
                  );
                }, 650)
              );
            }, 900)
          );
        }, 900)
      );
    };

    run();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  const selected = phase === "selecting" || phase === "tooltip";
  const showCursor = phase === "approach" || phase === "selecting" || phase === "tooltip";
  const showTooltip = phase === "tooltip";

  return (
    <span className="relative inline-block whitespace-nowrap">
      <span className="relative z-0 inline-block px-0.5">
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-0 bg-sky-500/25 dark:bg-sky-400/30"
          initial={{ width: "0%" }}
          animate={{ width: selected ? "100%" : "0%" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        />
        <span className="relative z-10">Software Engineer</span>

        <AnimatePresence>
          {showCursor && (
            <motion.span
              aria-hidden
              className="pointer-events-none absolute z-40 text-foreground drop-shadow-sm"
              initial={{ opacity: 0, left: "108%", top: "120%" }}
              animate={phase === "approach" ? { opacity: 1, left: "42%", top: "78%" } : { opacity: 1, left: "96%", top: "55%" }}
              exit={{ opacity: 0, left: "120%", top: "130%" }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            >
              <MousePointer2 className="size-5 fill-foreground/10" strokeWidth={1.75} />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      .
      <AnimatePresence>
        {showTooltip && (
          <motion.span
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="pointer-events-none absolute -top-11 left-1/2 z-30 -translate-x-1/2 border border-neutral-800 bg-foreground px-3 py-1.5 font-mono text-[10px] tracking-wide whitespace-nowrap text-background uppercase shadow-sm dark:border-neutral-200"
          >
            Let&apos;s work together
            <span className="absolute top-full left-1/2 -mt-px -translate-x-1/2 border-4 border-transparent border-t-foreground" />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
