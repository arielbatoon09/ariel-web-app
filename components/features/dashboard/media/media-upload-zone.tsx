"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Upload, X, CheckCircle2, AlertCircle, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useUploadMedia, type UploadProgressItem } from "@/hooks/use-media";
import { MEDIA_ACCEPTED_EXTENSIONS, MEDIA_MAX_SIZE_LABEL, formatFileSize } from "@/lib/media-config";

function UploadFileCard({ item, onRemove }: { item: UploadProgressItem; onRemove: () => void }) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (item.file.type.startsWith("image/")) {
      const url = URL.createObjectURL(item.file);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [item.file]);

  return (
    <div className="flex items-center gap-3 border border-dashed border-neutral-300 bg-neutral-50/50 p-3 dark:border-neutral-700 dark:bg-neutral-900/20">
      {/* Thumbnail */}
      <div className="relative size-12 shrink-0 overflow-hidden border border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800">
        {preview ? (
          <Image src={preview} alt={item.file.name} className="object-cover" fill unoptimized />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageIcon className="size-4 text-neutral-400" />
          </div>
        )}
        {item.status === "done" && (
          <div className="absolute inset-0 flex items-center justify-center bg-green-500/80">
            <CheckCircle2 className="size-5 text-white" />
          </div>
        )}
        {item.status === "error" && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-500/80">
            <AlertCircle className="size-5 text-white" />
          </div>
        )}
      </div>

      {/* Info + Progress */}
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate font-mono text-[10px] text-foreground">{item.file.name}</p>
          <span className="shrink-0 font-mono text-[9px] text-neutral-400">{formatFileSize(item.file.size)}</span>
        </div>

        {/* Progress bar */}
        <div className="h-1 w-full overflow-hidden bg-neutral-200 dark:bg-neutral-700">
          <div
            className={cn(
              "h-full transition-all duration-300",
              item.status === "done" ? "bg-green-500" : item.status === "error" ? "bg-red-500" : "bg-neutral-900 dark:bg-neutral-100"
            )}
            style={{ width: `${item.progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <span
            className={cn(
              "font-mono text-[9px] uppercase",
              item.status === "done"
                ? "text-green-600 dark:text-green-400"
                : item.status === "error"
                  ? "text-red-600 dark:text-red-400"
                  : item.status === "uploading"
                    ? "text-neutral-600 dark:text-neutral-400"
                    : "text-neutral-400"
            )}
          >
            {item.status === "done"
              ? "✓ Done"
              : item.status === "error"
                ? `✗ ${item.error || "Failed"}`
                : item.status === "uploading"
                  ? `Uploading ${item.progress}%`
                  : "Queued"}
          </span>
          {(item.status === "done" || item.status === "error") && (
            <button onClick={onRemove} className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300">
              <X className="size-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function MediaUploadZone() {
  const { uploadFiles, uploads } = useUploadMedia();
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());

  const handleFiles = (files: File[]) => {
    uploadFiles(files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) handleFiles(files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) handleFiles(files);
    // Reset input so same files can be selected again
    e.target.value = "";
  };

  const visibleUploads = uploads.filter((u) => !removedIds.has(u.id));
  const hasCompleted = visibleUploads.some((u) => u.status === "done" || u.status === "error");

  return (
    <div className="space-y-3">
      {/* Drop Zone */}
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-3 border-2 border-dashed p-8 transition-colors",
          isDragging
            ? "border-neutral-600 bg-neutral-100 dark:border-neutral-400 dark:bg-neutral-800"
            : "cursor-pointer border-neutral-300 bg-neutral-50/50 hover:border-neutral-400 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900/20 dark:hover:border-neutral-600"
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <div
          className={cn(
            "flex size-12 items-center justify-center border border-dashed transition-colors",
            isDragging
              ? "border-neutral-600 bg-neutral-200 dark:border-neutral-400 dark:bg-neutral-700"
              : "border-neutral-300 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800"
          )}
        >
          <Upload className="size-5 text-neutral-500 dark:text-neutral-400" />
        </div>
        <div className="text-center">
          <p className="font-mono text-xs font-medium text-foreground">
            Drop images here or <span className="underline underline-offset-2">click to browse</span>
          </p>
          <p className="mt-1 font-mono text-[9px] text-neutral-400 uppercase">
            {MEDIA_ACCEPTED_EXTENSIONS} · Max {MEDIA_MAX_SIZE_LABEL} per file · Bulk upload supported
          </p>
        </div>
      </div>

      <input ref={inputRef} type="file" multiple accept={MEDIA_ACCEPTED_EXTENSIONS} className="hidden" onChange={handleChange} />

      {/* Upload progress cards */}
      {visibleUploads.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-neutral-500 uppercase">
              {visibleUploads.length} file{visibleUploads.length !== 1 ? "s" : ""}
            </span>
            {hasCompleted && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const completedIds = visibleUploads.filter((u) => u.status === "done" || u.status === "error").map((u) => u.id);
                  setRemovedIds((prev) => new Set([...prev, ...completedIds]));
                }}
                className="h-6 rounded-none px-2 font-mono text-[9px] uppercase"
              >
                Clear completed
              </Button>
            )}
          </div>
          {visibleUploads.map((item) => (
            <UploadFileCard key={item.id} item={item} onRemove={() => setRemovedIds((prev) => new Set([...prev, item.id]))} />
          ))}
        </div>
      )}
    </div>
  );
}
