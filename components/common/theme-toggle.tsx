"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Sun, Moon } from "lucide-react";
import { useCircularTheme } from "@/components/context/theme-provider";

export function ThemeToggle() {
  const { toggleTheme, resolvedTheme } = useCircularTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-8 w-[60px]" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={(e) => toggleTheme(e)}
      className="relative flex h-8 w-[60px] items-center rounded-none border border-dashed border-neutral-300 bg-neutral-50 transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:outline-none dark:border-neutral-700 dark:bg-neutral-950 dark:focus-visible:ring-neutral-500"
      aria-label="Toggle theme"
    >
      {/* Sliding Active Backdrop */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
        className="absolute top-[2px] bottom-[2px] w-[26px] rounded-none border border-neutral-200 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900"
        style={{
          left: isDark ? "31px" : "3px",
        }}
      />

      {/* Sun Icon (Left Segment) */}
      <div className="relative z-10 ml-[1px] flex h-[26px] w-[26px] items-center justify-center">
        <Sun className={`size-3.5 transition-colors duration-300 ${!isDark ? "text-neutral-950" : "text-neutral-500 hover:text-neutral-300"}`} />
      </div>

      {/* Moon Icon (Right Segment) */}
      <div className="relative z-10 ml-[2px] flex h-[26px] w-[26px] items-center justify-center">
        <Moon className={`size-3.5 transition-colors duration-300 ${isDark ? "text-neutral-50" : "text-neutral-500 hover:text-neutral-700"}`} />
      </div>
    </button>
  );
}
