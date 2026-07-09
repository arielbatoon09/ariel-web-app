import { getPresignedUploadUrlAction } from "@/services/works";

/**
 * Uploads a file directly to Cloudflare R2 bucket using a secure presigned PUT URL.
 *
 * @param file The file object to upload.
 * @param folder Optional bucket folder directory prefix (e.g. 'works', 'articles').
 * @returns The public URL of the uploaded asset.
 */
export async function uploadToR2(file: File, folder = "works"): Promise<string> {
  // 1. Request presigned upload URL from the server action
  const res = await getPresignedUploadUrlAction(file.name, file.type, folder);

  if (!res.success || !res.presignedUrl || !res.url) {
    throw new Error(res.error || "Failed to generate presigned upload URL.");
  }

  // 2. Perform direct PUT upload to Cloudflare R2
  const uploadRes = await fetch(res.presignedUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });

  if (!uploadRes.ok) {
    throw new Error(`Direct R2 upload failed: ${uploadRes.statusText} (${uploadRes.status})`);
  }

  // 3. Return the public CDN URL to save in the database
  return res.url;
}
