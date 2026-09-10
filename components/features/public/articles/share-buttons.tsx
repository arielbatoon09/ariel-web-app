"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Link2, Check } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  label?: string;
}

export function ShareButtons({ label = "Share this article:" }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
      <div className="flex flex-col gap-4 border-t border-dashed border-neutral-300 pt-8 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-700">
        <span className="text-neutral-450 font-mono text-[10px] tracking-wider uppercase dark:text-neutral-500">{label}</span>
        <div className="flex items-center gap-2">
          <div className="h-8 w-[100px] border border-dashed border-neutral-300 opacity-50 dark:border-neutral-700" />
          <div className="h-8 w-[100px] border border-dashed border-neutral-300 opacity-50 dark:border-neutral-700" />
          <div className="h-8 w-[96px] border border-dashed border-neutral-300 opacity-50 dark:border-neutral-700" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 border-t border-dashed border-neutral-300 pt-8 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-700">
      <span className="text-neutral-450 font-mono text-[10px] tracking-wider uppercase dark:text-neutral-500">{label}</span>
      <div className="flex items-center gap-2">
        <Link
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 border border-dashed border-neutral-300 bg-transparent px-3 py-1.5 font-mono text-[10px] tracking-wider text-foreground uppercase select-none hover:border-neutral-900 dark:border-neutral-700 dark:hover:border-neutral-100"
        >
          <Image src="/icons/facebook-icon.webp" alt="Facebook" width={14} height={14} className="size-3.5 object-contain" />
          Facebook
        </Link>
        <Link
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl())}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 border border-dashed border-neutral-300 bg-transparent px-3 py-1.5 font-mono text-[10px] tracking-wider text-foreground uppercase select-none hover:border-neutral-900 dark:border-neutral-700 dark:hover:border-neutral-100"
        >
          <Image src="/icons/linkedin-icon.webp" alt="LinkedIn" width={14} height={14} className="size-3.5 object-contain" />
          LinkedIn
        </Link>
        <button
          onClick={handleCopyLink}
          className="inline-flex h-8 min-w-[96px] cursor-pointer items-center justify-center gap-1.5 border border-dashed border-neutral-300 bg-transparent px-3 py-1.5 font-mono text-[10px] tracking-wider text-foreground uppercase select-none hover:border-neutral-900 dark:border-neutral-700 dark:hover:border-neutral-100"
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
