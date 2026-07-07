"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getMediaAction,
  insertMediaRecordAction,
  deleteMediaAction,
  updateMediaAltAction,
  getMediaPresignedUrlAction,
} from "@/services/media";
import { validateMediaFile, MEDIA_MAX_SIZE_BYTES } from "@/lib/media-config";
import type { MediaAsset } from "@/data/media";

export const MEDIA_QUERY_KEY = ["media"];

export function useMediaQuery(folder?: string) {
  return useQuery({
    queryKey: folder ? [...MEDIA_QUERY_KEY, folder] : MEDIA_QUERY_KEY,
    queryFn: async () => {
      const res = await getMediaAction(folder);
      if (!res.success || !res.assets) {
        throw new Error(res.error || "Failed to load media.");
      }
      return res.assets as MediaAsset[];
    },
  });
}

export type UploadProgressItem = {
  file: File;
  id: string; // local temp id for tracking
  progress: number; // 0-100
  status: "queued" | "uploading" | "done" | "error";
  error?: string;
  url?: string;
};

/**
 * Upload a single file to R2 using XMLHttpRequest for real progress tracking.
 * Returns the inserted asset record.
 */
async function uploadFileWithProgress(
  file: File,
  onProgress: (progress: number) => void
): Promise<MediaAsset> {
  // 1. Get presigned URL from server action
  const presignedRes = await getMediaPresignedUrlAction(file.name, file.type);
  if (!presignedRes.success || !presignedRes.presignedUrl || !presignedRes.url || !presignedRes.folder) {
    throw new Error(presignedRes.error || "Failed to get upload URL.");
  }

  // 2. Upload directly to R2 via XHR for real progress
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`R2 upload failed: ${xhr.statusText} (${xhr.status})`));
      }
    };
    xhr.onerror = () => reject(new Error("Network error during upload."));
    xhr.open("PUT", presignedRes.presignedUrl!);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.send(file);
  });

  onProgress(100);

  // 3. Insert DB record
  const insertRes = await insertMediaRecordAction({
    filename: file.name,
    url: presignedRes.url!,
    mimeType: file.type,
    size: file.size,
    folder: presignedRes.folder!,
  });

  if (!insertRes.success || !insertRes.asset) {
    throw new Error(insertRes.error || "Failed to save media record.");
  }

  return insertRes.asset as MediaAsset;
}

/**
 * Returns a function to upload multiple files at once.
 * Each file is tracked individually with real progress.
 */
export function useUploadMedia() {
  const queryClient = useQueryClient();
  const [uploads, setUploads] = React.useState<UploadProgressItem[]>([]);

  const uploadFiles = React.useCallback(
    async (files: File[]) => {
      // Validate all files first
      const validFiles: File[] = [];
      const errors: string[] = [];

      files.forEach((file) => {
        const error = validateMediaFile(file);
        if (error) {
          errors.push(error);
        } else {
          validFiles.push(file);
        }
      });

      if (errors.length > 0) {
        errors.forEach((e) => toast.error(e));
      }

      if (validFiles.length === 0) return;

      // Init progress items
      const initialItems: UploadProgressItem[] = validFiles.map((file) => ({
        file,
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        progress: 0,
        status: "queued",
      }));

      setUploads((prev) => [...initialItems, ...prev]);

      // Upload in parallel
      await Promise.allSettled(
        initialItems.map(async (item) => {
          setUploads((prev) =>
            prev.map((u) => (u.id === item.id ? { ...u, status: "uploading" } : u))
          );

          try {
            const asset = await uploadFileWithProgress(item.file, (progress) => {
              setUploads((prev) =>
                prev.map((u) => (u.id === item.id ? { ...u, progress } : u))
              );
            });

            setUploads((prev) =>
              prev.map((u) =>
                u.id === item.id ? { ...u, status: "done", progress: 100, url: asset.url } : u
              )
            );
          } catch (err: any) {
            setUploads((prev) =>
              prev.map((u) =>
                u.id === item.id ? { ...u, status: "error", error: err.message } : u
              )
            );
          }
        })
      );

      // Refresh media list once all complete
      queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEY });
    },
    [queryClient]
  );

  const clearCompleted = React.useCallback(() => {
    setUploads((prev) => prev.filter((u) => u.status === "uploading" || u.status === "queued"));
  }, []);

  return { uploadFiles, uploads, clearCompleted };
}

export function useDeleteMediaMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: number[]) => {
      const res = await deleteMediaAction(ids);
      if (!res.success) throw new Error(res.error || "Failed to delete media.");
    },
    onSuccess: () => {
      toast.success("Media deleted successfully.");
      queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEY });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to delete media.");
    },
  });
}

export function useUpdateMediaAltMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, altText }: { id: number; altText: string }) => {
      const res = await updateMediaAltAction(id, altText);
      if (!res.success) throw new Error(res.error || "Failed to update alt text.");
      return res.asset;
    },
    onSuccess: () => {
      toast.success("Alt text updated.");
      queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEY });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update alt text.");
    },
  });
}
