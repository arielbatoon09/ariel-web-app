"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Cookie, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CookiesBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
      return null;
    };

    // Show banner if consent cookie hasn't been set yet
    const consent = getCookie("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    // Set cookie to expire in 365 days (31536000 seconds)
    document.cookie = "cookie-consent=accepted; max-age=31536000; path=/; SameSite=Lax";
    setIsVisible(false);
  };

  const handleDecline = () => {
    // Set cookie to expire in 365 days (31536000 seconds)
    document.cookie = "cookie-consent=declined; max-age=31536000; path=/; SameSite=Lax";
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-6 left-6 z-50 max-w-sm border border-dashed border-neutral-300 bg-background/90 p-5 shadow-lg backdrop-blur-md md:max-w-md lg:bottom-8 lg:left-8 dark:border-neutral-700"
        >
          {/* Plus decorations at the corners to match the architectural aesthetic */}
          <span className="absolute -top-1.5 -left-1.5 text-[10px] text-neutral-400 select-none dark:text-neutral-600">+</span>
          <span className="absolute -top-1.5 -right-1.5 text-[10px] text-neutral-400 select-none dark:text-neutral-600">+</span>
          <span className="absolute -bottom-1.5 -left-1.5 text-[10px] text-neutral-400 select-none dark:text-neutral-600">+</span>
          <span className="absolute -right-1.5 -bottom-1.5 text-[10px] text-neutral-400 select-none dark:text-neutral-600">+</span>

          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <Cookie className="size-4 text-neutral-500 dark:text-neutral-400" />
                <h3 className="font-mono text-[11px] font-bold tracking-wider text-foreground uppercase">Cookie Preferences</h3>
              </div>
              <button
                onClick={handleDecline}
                className="text-neutral-400 transition-colors hover:text-foreground dark:text-neutral-500"
                aria-label="Close cookie banner"
              >
                <X className="size-4" />
              </button>
            </div>

            <p className="font-sans text-xs leading-relaxed text-muted-foreground">
              I use cookies to understand website traffic and improve your experience. Read our{" "}
              <Link href="/privacy" className="text-foreground underline underline-offset-4 hover:text-neutral-400">
                Privacy Policy
              </Link>
              ,{" "}
              <Link href="/cookies" className="text-foreground underline underline-offset-4 hover:text-neutral-400">
                Cookies Policy
              </Link>
              , and{" "}
              <Link href="/terms" className="text-foreground underline underline-offset-4 hover:text-neutral-400">
                Terms
              </Link>
              .
            </p>

            <div className="flex items-center justify-end gap-2 border-t border-dashed border-neutral-200 pt-3 dark:border-neutral-800">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDecline}
                className="h-8 cursor-pointer rounded-none px-4 font-mono text-[10px] tracking-wider uppercase hover:border-neutral-900 dark:border-neutral-700 dark:hover:border-neutral-100"
              >
                Decline
              </Button>
              <Button
                size="sm"
                onClick={handleAccept}
                className="h-8 cursor-pointer rounded-none px-4 font-mono text-[10px] tracking-wider uppercase"
              >
                Accept
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
