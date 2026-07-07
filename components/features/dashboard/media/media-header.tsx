"use client";

import * as React from "react";
import { useMediaQuery, useDeleteMediaMutation } from "@/hooks/use-media";
import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MediaUploadZone } from "@/components/features/dashboard/media/media-upload-zone";
import { ConfirmDialog } from "@/components/common/confirm-dialog";

export function MediaHeader() {
  const { data: assets = [] } = useMediaQuery();
  const deleteMutation = useDeleteMediaMutation();

  const mediaSelectedIds = useDashboardStore((s) => s.mediaSelectedIds);
  const mediaShowUpload = useDashboardStore((s) => s.mediaShowUpload);
  const mediaActiveAsset = useDashboardStore((s) => s.mediaActiveAsset);
  const setMediaShowUpload = useDashboardStore((s) => s.setMediaShowUpload);
  const clearMediaSelection = useDashboardStore((s) => s.clearMediaSelection);
  const setMediaActiveAsset = useDashboardStore((s) => s.setMediaActiveAsset);

  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = React.useState(false);

  const selectedCount = mediaSelectedIds.size;

  const handleBulkDelete = () => {
    if (selectedCount === 0) return;
    setShowBulkDeleteConfirm(true);
  };

  const handleBulkDeleteConfirm = () => {
    deleteMutation.mutate(Array.from(mediaSelectedIds), {
      onSuccess: () => {
        clearMediaSelection();
        if (mediaActiveAsset && mediaSelectedIds.has(mediaActiveAsset.id)) {
          setMediaActiveAsset(null);
        }
        setShowBulkDeleteConfirm(false);
      },
    });
  };

  return (
    <>
      <div className="space-y-1">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="font-sans text-xl font-bold tracking-tight text-foreground md:text-2xl">
              Media Library
            </h1>
            <p className="font-mono text-xs uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
              Centralized asset management · {assets.length} file{assets.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {selectedCount > 0 && (
              <>
                <span className="font-mono text-[10px] text-neutral-500">{selectedCount} selected</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearMediaSelection}
                  className="h-8 rounded-none border-dashed font-mono text-[10px] uppercase"
                >
                  Clear
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={deleteMutation.isPending}
                  onClick={handleBulkDelete}
                  className="h-8 rounded-none border-dashed border-red-300 font-mono text-[10px] uppercase text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/20"
                >
                  <Trash2 className="mr-1 size-3" />
                  Delete {selectedCount}
                </Button>
              </>
            )}
            <Button
              size="sm"
              onClick={() => setMediaShowUpload(true)}
              className="h-8 rounded-none border border-neutral-900 font-mono text-[10px] uppercase dark:border-neutral-100"
            >
              <Upload className="mr-1.5 size-3" />
              Upload
            </Button>
          </div>
        </div>
      </div>

      {/* Upload Dialog */}
      <Dialog open={mediaShowUpload} onOpenChange={setMediaShowUpload}>
        <DialogContent className="rounded-none border border-neutral-300 bg-background/95 p-6 font-mono text-xs backdrop-blur-md sm:max-w-[520px] dark:border-neutral-700">
          {/* Corner brackets */}
          <div className="pointer-events-none absolute -left-px -top-px z-50 size-2.5 border-l-2 border-t-2 border-neutral-400 dark:border-neutral-500" />
          <div className="pointer-events-none absolute -right-px -top-px z-50 size-2.5 border-r-2 border-t-2 border-neutral-400 dark:border-neutral-500" />
          <div className="pointer-events-none absolute -bottom-px -left-px z-50 size-2.5 border-b-2 border-l-2 border-neutral-400 dark:border-neutral-500" />
          <div className="pointer-events-none absolute -bottom-px -right-px z-50 size-2.5 border-b-2 border-r-2 border-neutral-400 dark:border-neutral-500" />

          <div className="space-y-5">
            <DialogHeader className="space-y-1">
              <DialogTitle className="font-sans text-base font-bold text-foreground">Upload Media</DialogTitle>
              <DialogDescription className="text-[10px] uppercase text-neutral-400 dark:text-neutral-500">
                Drag & drop or browse files to upload to your media library
              </DialogDescription>
            </DialogHeader>

            <MediaUploadZone />

            <div className="flex justify-end border-t border-dashed border-neutral-200 pt-4 dark:border-neutral-800">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setMediaShowUpload(false)}
                className="h-8 rounded-none border-dashed font-mono text-[10px] uppercase"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Confirm Dialog */}
      <ConfirmDialog
        open={showBulkDeleteConfirm}
        onOpenChange={(open) => !open && setShowBulkDeleteConfirm(false)}
        title="Delete Selected Assets"
        description={`Are you sure you want to permanently delete ${selectedCount} asset${selectedCount !== 1 ? "s" : ""}? This action cannot be undone.`}
        confirmText={`Delete ${selectedCount} Asset${selectedCount !== 1 ? "s" : ""}`}
        onConfirm={handleBulkDeleteConfirm}
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
