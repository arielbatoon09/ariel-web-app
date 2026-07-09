"use client";

import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { MediaUploadZone } from "@/components/features/dashboard/media/media-upload-zone";

export function MediaUploadSection() {
  const mediaShowUpload = useDashboardStore((s) => s.mediaShowUpload);
  const setMediaShowUpload = useDashboardStore((s) => s.setMediaShowUpload);

  if (!mediaShowUpload) return null;

  return (
    <div className="border border-dashed border-neutral-300 p-4 dark:border-neutral-700">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[10px] text-neutral-500 uppercase">Upload Media</span>
        <button onClick={() => setMediaShowUpload(false)} className="font-mono text-[9px] text-neutral-400 uppercase hover:text-foreground">
          Close ✕
        </button>
      </div>
      <MediaUploadZone />
    </div>
  );
}
