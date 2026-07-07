"use client";

import * as React from "react";
import { useMediaQuery, useDeleteMediaMutation } from "@/hooks/use-media";
import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { MediaGrid } from "@/components/features/dashboard/media/media-grid";
import { ManagementDetailDialog } from "@/components/common/management-detail-dialog";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Copy, Check, Save, FileImage, Trash2 } from "lucide-react";
import { formatFileSize } from "@/lib/media-config";
import { useUpdateMediaAltMutation } from "@/hooks/use-media";

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <span className="text-neutral-450 uppercase">{label}</span>
      <span className="col-span-2 truncate font-mono text-neutral-500" title={value}>{value}</span>
    </div>
  );
}

export function MediaContent() {
  const { data: assets = [], isLoading } = useMediaQuery();
  const deleteMutation = useDeleteMediaMutation();
  const updateAltMutation = useUpdateMediaAltMutation();

  const mediaSelectedIds = useDashboardStore((s) => s.mediaSelectedIds);
  const mediaActiveAsset = useDashboardStore((s) => s.mediaActiveAsset);
  const mediaSearch = useDashboardStore((s) => s.mediaSearch);
  const mediaActiveYear = useDashboardStore((s) => s.mediaActiveYear);
  const toggleMediaSelect = useDashboardStore((s) => s.toggleMediaSelect);
  const clearMediaSelection = useDashboardStore((s) => s.clearMediaSelection);
  const setMediaActiveAsset = useDashboardStore((s) => s.setMediaActiveAsset);

  const [altText, setAltText] = React.useState("");
  const [copied, setCopied] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = React.useState(false);

  React.useEffect(() => {
    if (mediaActiveAsset) {
      setAltText(mediaActiveAsset.altText || "");
      setCopied(false);
    }
  }, [mediaActiveAsset]);

  const filteredAssets = React.useMemo(() => {
    let result = assets;
    if (mediaActiveYear) result = result.filter((a) => a.folder.includes(mediaActiveYear));
    if (mediaSearch.trim()) {
      const q = mediaSearch.toLowerCase();
      result = result.filter((a) => a.filename.toLowerCase().includes(q));
    }
    return result;
  }, [assets, mediaActiveYear, mediaSearch]);

  const handleBulkDeleteConfirm = () => {
    if (mediaSelectedIds.size === 0) return;
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

  const handleCopy = () => {
    if (!mediaActiveAsset) return;
    navigator.clipboard.writeText(mediaActiveAsset.url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSaveAlt = () => {
    if (!mediaActiveAsset) return;
    updateAltMutation.mutate({ id: mediaActiveAsset.id, altText });
  };

  const handleDeleteConfirm = () => {
    if (!mediaActiveAsset) return;
    deleteMutation.mutate([mediaActiveAsset.id], {
      onSuccess: () => {
        setMediaActiveAsset(null);
        setShowDeleteConfirm(false);
      },
    });
  };

  const isImage = mediaActiveAsset?.mimeType.startsWith("image/");
  const isSvg = mediaActiveAsset?.mimeType === "image/svg+xml";
  const uploadDate = mediaActiveAsset
    ? new Date(mediaActiveAsset.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : "";
  const canSaveAlt = altText !== (mediaActiveAsset?.altText || "");

  return (
    <>
      {mediaSelectedIds.size > 0 && (
        <div className="mb-3 flex items-center justify-between border border-dashed border-neutral-300 bg-neutral-50/50 px-4 py-2 dark:border-neutral-700 dark:bg-neutral-900/20">
          <span className="font-mono text-[10px] text-neutral-600 dark:text-neutral-400">
            {mediaSelectedIds.size} asset{mediaSelectedIds.size !== 1 ? "s" : ""} selected
          </span>
          <div className="flex gap-2">
            <button onClick={clearMediaSelection} className="font-mono text-[9px] uppercase text-neutral-400 hover:text-foreground">
              Clear
            </button>
            <button
              onClick={() => setShowBulkDeleteConfirm(true)}
              disabled={deleteMutation.isPending}
              className="font-mono text-[9px] uppercase text-red-600 hover:text-red-700 dark:text-red-400 disabled:opacity-50"
            >
              Delete {mediaSelectedIds.size}
            </button>
          </div>
        </div>
      )}

      <MediaGrid
        assets={filteredAssets}
        selectedIds={mediaSelectedIds}
        onToggleSelect={toggleMediaSelect}
        onSelectAsset={setMediaActiveAsset}
        isLoading={isLoading}
      />

      {/* Asset Detail Dialog */}
      <ManagementDetailDialog
        open={!!mediaActiveAsset}
        onOpenChange={(open) => { if (!open) setMediaActiveAsset(null); }}
        title="Asset Details"
        subtitle={mediaActiveAsset ? `ID: ${mediaActiveAsset.id} · ${mediaActiveAsset.filename}` : undefined}
        footerActions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={deleteMutation.isPending}
              className="rounded-none border-dashed border-red-300 font-mono text-[10px] uppercase text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/20"
            >
              <Trash2 className="mr-1 size-3" />
              Delete
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMediaActiveAsset(null)}
              className="rounded-none border-dashed font-mono text-[10px] uppercase"
            >
              Close Panel
            </Button>
          </>
        }
      >
        {mediaActiveAsset && (
          <div className="space-y-5 font-mono text-xs text-foreground">
            {/* Image Preview */}
            <div className="border border-dashed border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900">
              <div className="relative aspect-video w-full overflow-hidden">
                {isImage && !isSvg ? (
                  <Image
                    src={mediaActiveAsset.url}
                    alt={mediaActiveAsset.altText || mediaActiveAsset.filename}
                    fill
                    className="object-contain"
                    sizes="560px"
                  />
                ) : isSvg ? (
                  <div className="flex h-full items-center justify-center p-8">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={mediaActiveAsset.url} alt={mediaActiveAsset.altText || mediaActiveAsset.filename} className="max-h-full max-w-full object-contain" />
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-2 text-neutral-400">
                    <FileImage className="size-10" />
                    <span className="font-mono text-[10px] uppercase">{mediaActiveAsset.mimeType}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Metadata */}
            <div className="space-y-3 border-b border-dashed border-neutral-200 pb-4 dark:border-neutral-800">
              <MetaRow label="Filename" value={mediaActiveAsset.filename} />
              <MetaRow label="Type" value={mediaActiveAsset.mimeType} />
              <MetaRow label="Size" value={formatFileSize(mediaActiveAsset.size)} />
              <MetaRow label="Folder" value={mediaActiveAsset.folder} />
              <MetaRow label="Uploaded" value={uploadDate} />
            </div>

            {/* Administrative Actions */}
            <div className="space-y-4">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                Administrative Actions
              </span>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-neutral-450 text-[10px] uppercase">CDN URL</span>
                  <div className="flex gap-1.5">
                    <Input
                      value={mediaActiveAsset.url}
                      readOnly
                      className="h-7 flex-1 rounded-none border-dashed font-mono text-[9px] text-neutral-500"
                    />
                    <Button size="sm" variant="outline" onClick={handleCopy} className="h-7 w-7 shrink-0 rounded-none border-dashed p-0">
                      {copied ? <Check className="size-3 text-green-600" /> : <Copy className="size-3" />}
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-neutral-450 text-[10px] uppercase">Alt Text</span>
                  <div className="flex gap-1.5">
                    <Input
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
                      placeholder="Describe this image..."
                      className="h-7 flex-1 rounded-none border-dashed border-neutral-300 bg-background/50 font-mono text-[10px] transition-all duration-200 focus-visible:border-solid focus-visible:border-neutral-900 focus-visible:ring-0 dark:border-neutral-700 dark:focus-visible:border-neutral-100"
                    />
                    <Button size="sm" onClick={handleSaveAlt} disabled={updateAltMutation.isPending || !canSaveAlt} className="h-7 w-7 shrink-0 rounded-none p-0">
                      <Save className="size-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </ManagementDetailDialog>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={(open) => !open && setShowDeleteConfirm(false)}
        title="Delete Asset"
        description={`Are you sure you want to permanently delete "${mediaActiveAsset?.filename}"? This action cannot be undone.`}
        confirmText="Delete Asset"
        onConfirm={handleDeleteConfirm}
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />

      {/* Bulk Delete Confirm */}
      <ConfirmDialog
        open={showBulkDeleteConfirm}
        onOpenChange={(open) => !open && setShowBulkDeleteConfirm(false)}
        title="Delete Selected Assets"
        description={`Are you sure you want to permanently delete ${mediaSelectedIds.size} asset${mediaSelectedIds.size !== 1 ? "s" : ""}? This action cannot be undone.`}
        confirmText={`Delete ${mediaSelectedIds.size} Asset${mediaSelectedIds.size !== 1 ? "s" : ""}`}
        onConfirm={handleBulkDeleteConfirm}
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
