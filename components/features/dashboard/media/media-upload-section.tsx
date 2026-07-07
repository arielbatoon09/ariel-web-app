"use client";

import * as React from "react";
import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { useMediaQuery } from "@/hooks/use-media";
import { MediaUploadZone } from "@/components/features/dashboard/media/media-upload-zone";

export function MediaUploadSection() {
  const mediaShowUpload = useDashboardStore((s) => s.mediaShowUpload);
  const setMediaShowUpload = useDashboardStore((s) => s.setMediaShowUpload);

  if (!mediaShowUpload) return null;

  return (
    <div className="border border-dashed border-neutral-300 p-4 dark:border-neutral-700">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase text-neutral-500">Upload Media</span>
        <button
          onClick={() => setMediaShowUpload(false)}
          className="font-mono text-[9px] uppercase text-neutral-400 hover:text-foreground"
        >
          Close ✕
        </button>
      </div>
      <MediaUploadZone />
    </div>
  );
}
