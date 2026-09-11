/**
 * R2 object keys are stored under a project root prefix so the bucket layout
 * matches public URLs like:
 *   https://pub-….r2.dev/ariel-web-app/media/2026/…
 */

export function getR2BucketName() {
  return process.env.R2_BUCKET_NAME || "ariel-web-app";
}

/** Folder prefix inside the bucket (defaults to the bucket/project name). */
export function getR2RootPrefix() {
  return (process.env.R2_ROOT_PREFIX || getR2BucketName()).replace(/^\/+|\/+$/g, "");
}

export function buildR2ObjectKey(...segments: (string | number)[]) {
  const parts = [getR2RootPrefix(), ...segments].map((segment) => String(segment).replace(/^\/+|\/+$/g, "")).filter(Boolean);
  return parts.join("/");
}

export function buildR2PublicUrl(key: string) {
  const base = (process.env.R2_PUBLIC_URL || process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "").replace(/\/$/, "");
  const normalizedKey = key.replace(/^\//, "");
  if (!base) {
    return `https://pub-placeholder.r2.dev/${normalizedKey}`;
  }
  return `${base}/${normalizedKey}`;
}

/** Recover the object key from a stored CDN URL. */
export function extractR2ObjectKeyFromUrl(url: string): string | null {
  const base = (process.env.R2_PUBLIC_URL || process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "").replace(/\/$/, "");
  if (base && url.startsWith(`${base}/`)) {
    return url.slice(base.length + 1) || null;
  }

  const bucket = getR2BucketName();
  const marker = `/${bucket}/`;
  const idx = url.indexOf(marker);
  if (idx !== -1) {
    // Prefer full key including project prefix when URL contains it
    const after = url.slice(idx + 1); // "ariel-web-app/media/..."
    return after || null;
  }

  try {
    return new URL(url).pathname.replace(/^\//, "") || null;
  } catch {
    return null;
  }
}
