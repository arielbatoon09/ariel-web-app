"use client";

import { useState, useMemo } from "react";
import { useMediaQuery, useDeleteMediaMutation, useUpdateMediaAltMutation } from "@/hooks/use-media";
import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { MediaHeader } from "@/components/features/dashboard/media/media-header";
import { MediaGrid } from "@/components/features/dashboard/media/media-grid";
import { MediaFilters } from "@/components/features/dashboard/media/media-filters";
import { ManagementDetailDialog } from "@/components/common/management-detail-dialog";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Copy, Check, Save, FileImage, Trash2 } from "lucide-react";
import { formatFileSize } from "@/lib/media-config";
import type { MediaAsset } from "@/data/media";

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <span className="text-neutral-450 uppercase">{label}</span>
      <span className="col-span-2 truncate font-mono text-neutral-500" title={value}>
        {value}
      </span>
    </div>
  );
}

export function MediaClient() {
  const { data: assets = [], isLoading } = useMediaQuery();
  const deleteMutation = useDeleteMediaMutation();
  const updateAltMutation = useUpdateMediaAltMutation();

  const search = useDashboardStore((s) => s.mediaSearch);
  const activeYear = useDashboardStore((s) => s.mediaActiveYear);

  const filteredAssets = useMemo(() => {
    let result = assets;
    if (activeYear) result = result.filter((a) => a.folder.includes(activeYear));
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((a) => a.filename.toLowerCase().includes(q));
    }
    return result;
  }, [assets, activeYear, search]);

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [activeAsset, setActiveAsset] = useState<MediaAsset | null>(null);

  // Detail panel state
  const [altText, setAltText] = useState("");
  const [copied, setCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);

  // Reset details panel state cleanly when activeAsset changes during render
  const [prevActiveAsset, setPrevActiveAsset] = useState(activeAsset);
  if (activeAsset !== prevActiveAsset) {
    setPrevActiveAsset(activeAsset);
    if (activeAsset) {
      setAltText(activeAsset.altText || "");
      setCopied(false);
    }
  }

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleBulkDeleteConfirm = () => {
    if (selectedIds.size === 0) return;
    deleteMutation.mutate(Array.from(selectedIds), {
      onSuccess: () => {
        setSelectedIds(new Set());
        if (activeAsset && selectedIds.has(activeAsset.id)) setActiveAsset(null);
        setShowBulkDeleteConfirm(false);
      },
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const handleCopy = () => {
    if (!activeAsset) return;
    navigator.clipboard.writeText(activeAsset.url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSaveAlt = () => {
    if (!activeAsset) return;
    updateAltMutation.mutate({ id: activeAsset.id, altText });
  };

  const handleDeleteConfirm = () => {
    if (!activeAsset) return;
    deleteMutation.mutate([activeAsset.id], {
      onSuccess: () => {
        setActiveAsset(null);
        setShowDeleteConfirm(false);
      },
    });
  };

  const isImage = activeAsset?.mimeType.startsWith("image/");
  const isSvg = activeAsset?.mimeType === "image/svg+xml";
  const uploadDate = activeAsset
    ? new Date(activeAsset.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : "";
  const canSaveAlt = altText !== (activeAsset?.altText || "");

  return (
    <div className="space-y-6">
      <MediaHeader />

      <MediaFilters />

      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between border border-dashed border-neutral-300 bg-neutral-50/50 px-4 py-2 dark:border-neutral-700 dark:bg-neutral-900/20">
          <span className="font-mono text-[10px] text-neutral-600 dark:text-neutral-400">
            {selectedIds.size} asset{selectedIds.size !== 1 ? "s" : ""} selected
          </span>
          <div className="flex gap-2">
            <button onClick={clearSelection} className="font-mono text-[9px] text-neutral-400 uppercase hover:text-foreground">
              Clear
            </button>
            <button
              onClick={() => setShowBulkDeleteConfirm(true)}
              disabled={deleteMutation.isPending}
              className="font-mono text-[9px] text-red-600 uppercase hover:text-red-700 disabled:opacity-50 dark:text-red-400"
            >
              Delete {selectedIds.size}
            </button>
          </div>
        </div>
      )}

      <MediaGrid
        assets={filteredAssets}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
        onSelectAsset={setActiveAsset}
        isLoading={isLoading}
      />

      {/* Asset Detail Dialog */}
      <ManagementDetailDialog
        open={!!activeAsset}
        onOpenChange={(open) => {
          if (!open) setActiveAsset(null);
        }}
        title="Asset Details"
        subtitle={activeAsset ? `ID: ${activeAsset.id} · ${activeAsset.filename}` : undefined}
        footerActions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={deleteMutation.isPending}
              className="rounded-none border-dashed border-red-300 font-mono text-[10px] text-red-600 uppercase hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/20"
            >
              <Trash2 className="mr-1 size-3" />
              Delete
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveAsset(null)}
              className="rounded-none border-dashed font-mono text-[10px] uppercase"
            >
              Close Panel
            </Button>
          </>
        }
      >
        {activeAsset && (
          <div className="space-y-5 font-mono text-xs text-foreground">
            {/* Image Preview */}
            <div className="border border-dashed border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900">
              <div className="relative aspect-video w-full overflow-hidden">
                {isImage && !isSvg ? (
                  <Image src={activeAsset.url} alt={activeAsset.altText || activeAsset.filename} fill className="object-contain" sizes="560px" />
                ) : isSvg ? (
                  <div className="flex h-full items-center justify-center p-8">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={activeAsset.url} alt={activeAsset.altText || activeAsset.filename} className="max-h-full max-w-full object-contain" />
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-2 text-neutral-400">
                    <FileImage className="size-10" />
                    <span className="font-mono text-[10px] uppercase">{activeAsset.mimeType}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Metadata */}
            <div className="space-y-3 border-b border-dashed border-neutral-200 pb-4 dark:border-neutral-800">
              <MetaRow label="Filename" value={activeAsset.filename} />
              <MetaRow label="Type" value={activeAsset.mimeType} />
              <MetaRow label="Size" value={formatFileSize(activeAsset.size)} />
              <MetaRow label="Folder" value={activeAsset.folder} />
              <MetaRow label="Uploaded" value={uploadDate} />
            </div>

            {/* Administrative Actions */}
            <div className="space-y-4">
              <span className="block text-[10px] font-bold tracking-widest text-neutral-400 uppercase">Administrative Actions</span>

              <div className="flex flex-col gap-3">
                {/* CDN URL */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-neutral-450 text-[10px] uppercase">CDN URL</span>
                  <div className="flex gap-1.5">
                    <Input value={activeAsset.url} readOnly className="h-7 flex-1 rounded-none border-dashed font-mono text-[9px] text-neutral-500" />
                    <Button size="sm" variant="outline" onClick={handleCopy} className="h-7 w-7 shrink-0 rounded-none border-dashed p-0">
                      {copied ? <Check className="size-3 text-green-600" /> : <Copy className="size-3" />}
                    </Button>
                  </div>
                </div>

                {/* Alt Text */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-neutral-450 text-[10px] uppercase">Alt Text</span>
                  <div className="flex gap-1.5">
                    <Input
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
                      placeholder="Describe this image..."
                      className="h-7 flex-1 rounded-none border-dashed border-neutral-300 bg-background/50 font-mono text-[10px] transition-all duration-200 focus-visible:border-solid focus-visible:border-neutral-900 focus-visible:ring-0 dark:border-neutral-700 dark:focus-visible:border-neutral-100"
                    />
                    <Button
                      size="sm"
                      onClick={handleSaveAlt}
                      disabled={updateAltMutation.isPending || !canSaveAlt}
                      className="h-7 w-7 shrink-0 rounded-none p-0"
                    >
                      <Save className="size-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </ManagementDetailDialog>

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={(open) => !open && setShowDeleteConfirm(false)}
        title="Delete Asset"
        description={`Are you sure you want to permanently delete "${activeAsset?.filename}"? This action cannot be undone.`}
        confirmText="Delete Asset"
        onConfirm={handleDeleteConfirm}
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />

      {/* Bulk Delete Confirm Dialog */}
      <ConfirmDialog
        open={showBulkDeleteConfirm}
        onOpenChange={(open) => !open && setShowBulkDeleteConfirm(false)}
        title="Delete Selected Assets"
        description={`Are you sure you want to permanently delete ${selectedIds.size} asset${selectedIds.size !== 1 ? "s" : ""}? This action cannot be undone.`}
        confirmText={`Delete ${selectedIds.size} Asset${selectedIds.size !== 1 ? "s" : ""}`}
        onConfirm={handleBulkDeleteConfirm}
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
