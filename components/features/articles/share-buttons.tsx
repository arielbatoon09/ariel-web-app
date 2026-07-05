"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Link2, Check } from "lucide-react";

interface ShareButtonsProps {
  title: string;
}

export function ShareButtons({ title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return "";
  };

  const handleCopyLink = () => {
    const url = getShareUrl();
    if (url) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!mounted) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-8 border-t border-dashed border-neutral-300 dark:border-neutral-700">
        <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-450 dark:text-neutral-500">
          Share this article:
        </span>
        <div className="flex items-center gap-2">
          {/* Skeleton placeholders with exact dimensions during SSR */}
          <div className="w-[100px] h-8 border border-dashed border-neutral-300 dark:border-neutral-700 opacity-50" />
          <div className="w-[100px] h-8 border border-dashed border-neutral-300 dark:border-neutral-700 opacity-50" />
          <div className="w-[96px] h-8 border border-dashed border-neutral-300 dark:border-neutral-700 opacity-50" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-8 border-t border-dashed border-neutral-300 dark:border-neutral-700">
      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-450 dark:text-neutral-500">
        Share this article:
      </span>
      <div className="flex items-center gap-2">
        <Link
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-neutral-100 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider h-8 cursor-pointer gap-1.5 select-none text-foreground bg-transparent"
        >
          <Image
            src="/icons/facebook-icon.webp"
            alt="Facebook"
            width={14}
            height={14}
            className="size-3.5 object-contain"
          />
          Facebook
        </Link>
        <Link
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl())}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-neutral-100 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider h-8 cursor-pointer gap-1.5 select-none text-foreground bg-transparent"
        >
          <Image
            src="/icons/linkedin-icon.webp"
            alt="LinkedIn"
            width={14}
            height={14}
            className="size-3.5 object-contain"
          />
          LinkedIn
        </Link>
        <button
          onClick={handleCopyLink}
          className="inline-flex items-center justify-center border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-neutral-100 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider h-8 cursor-pointer gap-1.5 select-none text-foreground bg-transparent min-w-[96px]"
        >
          {copied ? (
            <>
              <Check className="size-3.5 text-emerald-500" />
              Copied!
            </>
          ) : (
            <>
              <Link2 className="size-3.5" />
              Copy Link
            </>
          )}
        </button>
      </div>
    </div>
  );
}
