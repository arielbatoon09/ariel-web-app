"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Copy, Check, Trash2, Save, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatFileSize } from "@/lib/media-config";
import { useUpdateMediaAltMutation, useDeleteMediaMutation } from "@/hooks/use-media";
import type { MediaAsset } from "@/data/media";
import { cn } from "@/lib/utils";

interface MediaDetailPanelProps {
  asset: MediaAsset | null;
  onClose: () => void;
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-dashed border-neutral-200 py-1.5 last:border-0 dark:border-neutral-800">
      <span className="shrink-0 font-mono text-[10px] text-neutral-400 uppercase">{label}</span>
      <span className="truncate text-right font-mono text-[10px] text-foreground" title={value}>
        {value}
      </span>
    </div>
  );
}

export function MediaDetailPanel({ asset, onClose }: MediaDetailPanelProps) {
  const [altText, setAltText] = useState("");
  const [copied, setCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const updateAltMutation = useUpdateMediaAltMutation();
  const deleteMutation = useDeleteMediaMutation();

  useEffect(() => {
    if (asset) {
      setAltText(asset.altText || "");
      setConfirmDelete(false);
    }
  }, [asset]);

  if (!asset) return null;

  const isImage = asset.mimeType.startsWith("image/");
  const isSvg = asset.mimeType === "image/svg+xml";

  const handleCopy = () => {
    navigator.clipboard.writeText(asset.url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSaveAlt = () => {
    updateAltMutation.mutate({ id: asset.id, altText });
  };

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    deleteMutation.mutate([asset.id], {
      onSuccess: () => onClose(),
    });
  };

  const uploadDate = new Date(asset.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-0">
      {/* Image Preview */}
      <div className="border-b border-dashed border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900">
        <div className="relative aspect-video w-full overflow-hidden">
          {isImage && !isSvg ? (
            <Image src={asset.url} alt={asset.altText || asset.filename} fill className="object-contain" sizes="600px" />
          ) : isSvg ? (
            <div className="flex h-full items-center justify-center p-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset.url} alt={asset.altText || asset.filename} className="max-h-full max-w-full object-contain" />
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-neutral-400">
              <FileImage className="size-10" />
              <span className="font-mono text-[10px] uppercase">{asset.mimeType}</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4 p-5">
        {/* Metadata */}
        <div className="space-y-0">
          <MetaRow label="Filename" value={asset.filename} />
          <MetaRow label="Type" value={asset.mimeType} />
          <MetaRow label="Size" value={formatFileSize(asset.size)} />
          <MetaRow label="Folder" value={asset.folder} />
          <MetaRow label="Uploaded" value={uploadDate} />
        </div>

        {/* CDN URL */}
        <div className="space-y-1.5">
          <label className="font-mono text-[10px] text-neutral-500 uppercase">CDN URL</label>
          <div className="flex gap-1.5">
            <Input value={asset.url} readOnly className="h-7 flex-1 rounded-none border-dashed font-mono text-[9px] text-neutral-500" />
            <Button size="sm" variant="outline" onClick={handleCopy} className="h-7 w-7 shrink-0 rounded-none border-dashed p-0">
              {copied ? <Check className="size-3 text-green-600" /> : <Copy className="size-3" />}
            </Button>
          </div>
        </div>

        {/* Alt Text */}
        <div className="space-y-1.5">
          <label className="font-mono text-[10px] text-neutral-500 uppercase">Alt Text</label>
          <div className="flex gap-1.5">
            <Input
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Describe this image..."
              className="h-7 flex-1 rounded-none border-dashed font-mono text-[10px]"
            />
            <Button
              size="sm"
              onClick={handleSaveAlt}
              disabled={updateAltMutation.isPending || altText === (asset.altText || "")}
              className="h-7 w-7 shrink-0 rounded-none p-0"
            >
              <Save className="size-3" />
            </Button>
          </div>
        </div>

        {/* Delete action */}
        <div className="pt-1">
          <Button
            variant={confirmDelete ? "destructive" : "outline"}
            size="sm"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className={cn(
              "w-full rounded-none font-mono text-[10px] uppercase",
              !confirmDelete &&
                "border-dashed border-red-300 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/20"
            )}
          >
            <Trash2 className="mr-1.5 size-3" />
            {confirmDelete ? "Confirm Delete" : "Delete Asset"}
          </Button>
          {confirmDelete && (
            <button
              onClick={() => setConfirmDelete(false)}
              className="mt-2 w-full font-mono text-[9px] text-neutral-400 uppercase hover:text-foreground"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
