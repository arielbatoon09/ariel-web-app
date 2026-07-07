"use client";

import * as React from "react";
import Image from "next/image";
import { X, Search, Upload, Check, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMediaQuery, useUploadMedia } from "@/hooks/use-media";
import { MediaUploadZone } from "@/components/features/dashboard/media/media-upload-zone";
import { formatFileSize } from "@/lib/media-config";
import { cn } from "@/lib/utils";
import type { MediaAsset } from "@/data/media";

interface MediaPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
  selectedUrl?: string;
}

function MediaPickerGrid({
  assets,
  selectedUrl,
  onSelect,
}: {
  assets: MediaAsset[];
  selectedUrl?: string;
  onSelect: (url: string) => void;
}) {
  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16">
        <ImageIcon className="size-10 text-neutral-300 dark:text-neutral-600" />
        <p className="font-mono text-[10px] uppercase text-neutral-400">No media found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
      {assets.map((asset) => {
        const isSelected = asset.url === selectedUrl;
        const isImage = asset.mimeType.startsWith("image/");
        const isSvg = asset.mimeType === "image/svg+xml";

        return (
          <button
            key={asset.id}
            onClick={() => onSelect(asset.url)}
            className={cn(
              "group relative border transition-all duration-200",
              isSelected
                ? "border-neutral-800 ring-1 ring-neutral-800 dark:border-neutral-200 dark:ring-neutral-200"
                : "border-dashed border-neutral-300 hover:border-neutral-500 dark:border-neutral-700 dark:hover:border-neutral-400"
            )}
          >
            <div className="relative aspect-square w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
              {isImage && !isSvg ? (
                <Image
                  src={asset.url}
                  alt={asset.altText || asset.filename}
                  fill
                  className="object-cover"
                  sizes="120px"
                />
              ) : isSvg ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={asset.url} alt={asset.altText || asset.filename} className="h-full w-full object-contain p-3" />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <ImageIcon className="size-5 text-neutral-400" />
                </div>
              )}

              {isSelected && (
                <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/40">
                  <div className="flex size-6 items-center justify-center bg-white">
                    <Check className="size-3.5 text-neutral-900" />
                  </div>
                </div>
              )}
            </div>
            <div className="border-t border-dashed border-neutral-200 bg-neutral-50/80 px-1.5 py-1 dark:border-neutral-700 dark:bg-neutral-900/40">
              <p className="truncate text-left font-mono text-[8px] text-neutral-500">{asset.filename}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export function MediaPickerDialog({ open, onOpenChange, onSelect, selectedUrl }: MediaPickerDialogProps) {
  const { data: assets = [], isLoading } = useMediaQuery();
  const [tab, setTab] = React.useState<"browse" | "upload">("browse");
  const [search, setSearch] = React.useState("");

  const filteredAssets = React.useMemo(() => {
    if (!search.trim()) return assets;
    return assets.filter((a) => a.filename.toLowerCase().includes(search.toLowerCase()));
  }, [assets, search]);

  const handleSelect = (url: string) => {
    onSelect(url);
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      {/* Dialog */}
      <div className="relative z-10 flex max-h-[85vh] w-full max-w-3xl flex-col border border-neutral-300 bg-background shadow-2xl dark:border-neutral-700">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-dashed border-neutral-300 px-4 py-3 dark:border-neutral-700">
          <div className="flex items-center gap-3">
            <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-foreground">
              Media Library
            </h2>
            <div className="flex gap-1">
              <button
                onClick={() => setTab("browse")}
                className={cn(
                  "border px-2.5 py-1 font-mono text-[9px] uppercase transition-colors",
                  tab === "browse"
                    ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
                    : "border-dashed border-neutral-300 text-neutral-500 hover:border-neutral-400 dark:border-neutral-700"
                )}
              >
                Browse
              </button>
              <button
                onClick={() => setTab("upload")}
                className={cn(
                  "border px-2.5 py-1 font-mono text-[9px] uppercase transition-colors",
                  tab === "upload"
                    ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
                    : "border-dashed border-neutral-300 text-neutral-500 hover:border-neutral-400 dark:border-neutral-700"
                )}
              >
                <Upload className="mr-1 inline size-2.5" />
                Upload
              </button>
            </div>
          </div>
          <button onClick={() => onOpenChange(false)} className="text-neutral-400 hover:text-foreground">
            <X className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">
          {tab === "browse" ? (
            <div className="space-y-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 size-3 -translate-y-1/2 text-neutral-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by filename..."
                  className="h-8 rounded-none border-dashed pl-7 font-mono text-[10px]"
                />
              </div>

              {isLoading ? (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="aspect-square animate-pulse bg-neutral-100 dark:bg-neutral-800" />
                  ))}
                </div>
              ) : (
                <MediaPickerGrid
                  assets={filteredAssets}
                  selectedUrl={selectedUrl}
                  onSelect={handleSelect}
                />
              )}
            </div>
          ) : (
            <MediaUploadZone />
          )}
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-between border-t border-dashed border-neutral-300 px-4 py-3 dark:border-neutral-700">
          <span className="font-mono text-[9px] text-neutral-400 uppercase">
            {assets.length} file{assets.length !== 1 ? "s" : ""} in library
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-7 rounded-none border-dashed font-mono text-[9px] uppercase"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
