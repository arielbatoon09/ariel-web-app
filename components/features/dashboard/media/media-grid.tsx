"use client";

import * as React from "react";
import Image from "next/image";
import { Check, Copy, ImageIcon, FileImage } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatFileSize } from "@/lib/media-config";
import type { MediaAsset } from "@/data/media";

interface MediaGridProps {
  assets: MediaAsset[];
  selectedIds: Set<number>;
  onToggleSelect: (id: number) => void;
  onSelectAsset: (asset: MediaAsset) => void;
  isLoading?: boolean;
}

function MediaCard({
  asset,
  isSelected,
  onToggleSelect,
  onSelectAsset,
  index,
}: {
  asset: MediaAsset;
  isSelected: boolean;
  onToggleSelect: () => void;
  onSelectAsset: () => void;
  index: number;
}) {
  const isAboveFold = index < 6;
  const [copied, setCopied] = React.useState(false);
  const isImage = asset.mimeType.startsWith("image/");
  const isSvg = asset.mimeType === "image/svg+xml";

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(asset.url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      className={cn(
        "group relative cursor-pointer border transition-all duration-200",
        isSelected
          ? "border-neutral-800 dark:border-neutral-200"
          : "border-dashed border-neutral-300 hover:border-neutral-400 dark:border-neutral-700 dark:hover:border-neutral-500"
      )}
      onClick={onSelectAsset}
    >
      {/* Checkbox */}
      <button
        className={cn(
          "absolute left-2 top-2 z-10 flex size-4 items-center justify-center border transition-all duration-150",
          isSelected
            ? "border-neutral-800 bg-neutral-900 dark:border-neutral-200 dark:bg-neutral-100"
            : "border-neutral-300 bg-background/80 opacity-0 backdrop-blur-sm group-hover:opacity-100 dark:border-neutral-600 dark:bg-background/60"
        )}
        onClick={(e) => { e.stopPropagation(); onToggleSelect(); }}
        aria-label="Select asset"
      >
        {isSelected && <Check className="size-2.5 text-white dark:text-neutral-900" />}
      </button>

      {/* Thumbnail */}
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        {isImage && !isSvg ? (
          <Image
            src={asset.url}
            alt={asset.altText || asset.filename}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            loading={isAboveFold ? "eager" : "lazy"}
            priority={isAboveFold}
          />
        ) : isSvg ? (
          <div className="flex h-full items-center justify-center p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset.url} alt={asset.altText || asset.filename} className="max-h-full max-w-full object-contain" />
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-neutral-400">
            <FileImage className="size-8" />
            <span className="font-mono text-[9px] uppercase">{asset.mimeType.split("/")[1]}</span>
          </div>
        )}

        {/* Hover overlay actions */}
        <div className="absolute inset-0 flex items-end justify-end gap-1 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button
            onClick={handleCopy}
            className="flex size-6 items-center justify-center bg-white/90 text-neutral-900 backdrop-blur-sm hover:bg-white"
            aria-label="Copy URL"
            title="Copy URL"
          >
            {copied ? <Check className="size-3 text-green-600" /> : <Copy className="size-3" />}
          </button>
        </div>
      </div>

      {/* Metadata footer */}
      <div className="border-t border-dashed border-neutral-200 bg-neutral-50/80 px-2 py-1.5 dark:border-neutral-700 dark:bg-neutral-900/40">
        <p className="truncate font-mono text-[9px] text-foreground">{asset.filename}</p>
        <p className="font-mono text-[9px] text-neutral-400">{formatFileSize(asset.size)}</p>
      </div>
    </div>
  );
}

function MediaGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="border border-dashed border-neutral-200 dark:border-neutral-800">
          <div className="aspect-square animate-pulse bg-neutral-100 dark:bg-neutral-800" />
          <div className="border-t border-dashed border-neutral-200 p-2 dark:border-neutral-700">
            <div className="mb-1 h-2 w-3/4 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
            <div className="h-2 w-1/2 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function MediaGrid({ assets, selectedIds, onToggleSelect, onSelectAsset, isLoading }: MediaGridProps) {
  if (isLoading) return <MediaGridSkeleton />;

  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 border border-dashed border-neutral-300 py-20 dark:border-neutral-700">
        <div className="flex size-14 items-center justify-center border border-dashed border-neutral-300 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800">
          <ImageIcon className="size-6 text-neutral-400" />
        </div>
        <div className="text-center">
          <p className="font-mono text-sm font-medium text-foreground">No media yet</p>
          <p className="font-mono text-[10px] text-neutral-400">Upload images using the zone above</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {assets.map((asset, index) => (
        <MediaCard
          key={asset.id}
          asset={asset}
          isSelected={selectedIds.has(asset.id)}
          onToggleSelect={() => onToggleSelect(asset.id)}
          onSelectAsset={() => onSelectAsset(asset)}
          index={index}
        />
      ))}
    </div>
  );
}
