"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Sun, Moon } from "lucide-react";
import { useCircularTheme } from "@/components/context/theme-provider";

export function ThemeToggle() {
  const { toggleTheme, resolvedTheme } = useCircularTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-[60px] h-8" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={(e) => toggleTheme(e)}
      className="relative w-[60px] h-8 rounded-none transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-500 border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 flex items-center"
      aria-label="Toggle theme"
    >
      {/* Sliding Active Backdrop */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
        className="absolute top-[2px] bottom-[2px] w-[26px] rounded-none bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs"
        style={{
          left: isDark ? "31px" : "3px",
        }}
      />

      {/* Sun Icon (Left Segment) */}
      <div className="relative z-10 w-[26px] h-[26px] flex items-center justify-center ml-[1px]">
        <Sun
          className={`size-3.5 transition-colors duration-300 ${
            !isDark ? "text-neutral-950" : "text-neutral-500 hover:text-neutral-300"
          }`}
        />
      </div>

      {/* Moon Icon (Right Segment) */}
      <div className="relative z-10 w-[26px] h-[26px] flex items-center justify-center ml-[2px]">
        <Moon
          className={`size-3.5 transition-colors duration-300 ${
            isDark ? "text-neutral-50" : "text-neutral-500 hover:text-neutral-700"
          }`}
        />
      </div>
    </button>
  );
}
