/**
 * Media Library Configuration
 * Single source of truth for file validation rules used by both
 * the client upload zone and server-side media actions.
 */

export const MEDIA_ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"] as const;

export type MediaMimeType = (typeof MEDIA_ACCEPTED_TYPES)[number];

/** Human-readable label for the accept attribute and error messages */
export const MEDIA_ACCEPTED_EXTENSIONS = ".jpg, .jpeg, .png, .webp, .gif, .svg";

/** Max file size per upload: 10 MB */
export const MEDIA_MAX_SIZE_BYTES = 10 * 1024 * 1024;

/** Human-readable size label for error messages */
export const MEDIA_MAX_SIZE_LABEL = "10 MB";

/** Validate a single file against type and size constraints. Returns null if valid, error string if invalid. */
export function validateMediaFile(file: File): string | null {
  if (!MEDIA_ACCEPTED_TYPES.includes(file.type as MediaMimeType)) {
    return `"${file.name}" is not an accepted file type. Allowed: ${MEDIA_ACCEPTED_EXTENSIONS}`;
  }
  if (file.size > MEDIA_MAX_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return `"${file.name}" exceeds the ${MEDIA_MAX_SIZE_LABEL} limit (${sizeMb} MB).`;
  }
  return null;
}

/** Format bytes to a human-readable string */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
