"use server";

import { r2Client } from "@/lib/r2/client";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getCurrentSessionUser } from "@/data/auth";
import { getUserByAuthId } from "@/data/users";
import { getUserRoleByUserId } from "@/data/roles";
import {
  getAllMediaQuery,
  insertMediaQuery,
  deleteMediaByIdsQuery,
  getMediaByIdQuery,
  updateMediaAltQuery,
  type MediaAsset,
} from "@/data/media";
import {
  MEDIA_ACCEPTED_TYPES,
  MEDIA_MAX_SIZE_BYTES,
  MEDIA_MAX_SIZE_LABEL,
  type MediaMimeType,
} from "@/lib/media-config";

// Helper to check admin access
async function checkAdminAccess() {
  const currentUser = await getCurrentSessionUser();
  if (!currentUser) {
    return { authorized: false, error: "Unauthorized: Please log in." };
  }
  const dbUser = await getUserByAuthId(currentUser.id);
  if (!dbUser) {
    return { authorized: false, error: "Unauthorized: Account not found." };
  }
  const role = await getUserRoleByUserId(dbUser.id);
  if (role !== "admin") {
    return { authorized: false, error: "Unauthorized: Admin privileges required." };
  }
  return { authorized: true };
}

/** Get all media assets, optionally filtered by folder/year */
export async function getMediaAction(folder?: string) {
  try {
    const authCheck = await checkAdminAccess();
    if (!authCheck.authorized) return { success: false, error: authCheck.error };

    const assets = await getAllMediaQuery(folder);
    return { success: true, assets };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to load media." };
  }
}

/** Generate a presigned PUT URL for uploading directly to R2 from the browser */
export async function getMediaPresignedUrlAction(filename: string, contentType: string) {
  try {
    const authCheck = await checkAdminAccess();
    if (!authCheck.authorized) return { success: false, error: authCheck.error };

    // Server-side MIME type validation
    if (!MEDIA_ACCEPTED_TYPES.includes(contentType as MediaMimeType)) {
      return { success: false, error: `File type "${contentType}" is not allowed.` };
    }

    const bucketName = process.env.R2_BUCKET_NAME;
    if (!bucketName) {
      return { success: false, error: "Cloudflare R2 Bucket Name is not configured." };
    }

    // Year-based folder structure: media/2026/
    const year = new Date().getFullYear();
    const folder = `media/${year}`;
    const uniqueId = Math.random().toString(36).substring(2, 15) + "_" + Date.now();
    const cleanFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = `${folder}/${uniqueId}-${cleanFilename}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: contentType,
    });

    const presignedUrl = await getSignedUrl(r2Client, command, { expiresIn: 300 });

    const r2PublicUrl = process.env.R2_PUBLIC_URL || process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
    const cdnUrl = r2PublicUrl
      ? `${r2PublicUrl}/${bucketName}/${key}`
      : `https://pub-placeholder.r2.dev/${key}`;

    return { success: true, presignedUrl, key, url: cdnUrl, folder };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to generate upload URL." };
  }
}

/** Insert a media record after a successful R2 upload */
export async function insertMediaRecordAction(data: {
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  folder: string;
  altText?: string;
}) {
  try {
    const authCheck = await checkAdminAccess();
    if (!authCheck.authorized) return { success: false, error: authCheck.error };

    // Server-side size validation
    if (data.size > MEDIA_MAX_SIZE_BYTES) {
      return { success: false, error: `File size exceeds the ${MEDIA_MAX_SIZE_LABEL} limit.` };
    }

    const asset = await insertMediaQuery(data);
    return { success: true, asset };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to save media record." };
  }
}

/** Delete media assets from DB (and optionally attempt R2 object deletion) */
export async function deleteMediaAction(ids: number[]) {
  try {
    const authCheck = await checkAdminAccess();
    if (!authCheck.authorized) return { success: false, error: authCheck.error };

    const bucketName = process.env.R2_BUCKET_NAME;

    // Attempt to delete from R2 (best-effort, don't fail if R2 deletion fails)
    if (bucketName) {
      const assets = await Promise.all(ids.map((id) => getMediaByIdQuery(id)));
      await Promise.allSettled(
        assets
          .filter((a): a is MediaAsset => !!a)
          .map((asset) => {
            // Extract key from URL — key is everything after the bucketName segment
            const urlParts = asset.url.split(`/${bucketName}/`);
            const key = urlParts[1];
            if (!key) return Promise.resolve();
            return r2Client.send(
              new DeleteObjectCommand({ Bucket: bucketName, Key: key })
            );
          })
      );
    }

    await deleteMediaByIdsQuery(ids);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to delete media." };
  }
}

/** Update alt text metadata for a media asset */
export async function updateMediaAltAction(id: number, altText: string) {
  try {
    const authCheck = await checkAdminAccess();
    if (!authCheck.authorized) return { success: false, error: authCheck.error };

    const updated = await updateMediaAltQuery(id, altText);
    if (!updated) return { success: false, error: "Media asset not found." };

    return { success: true, asset: updated };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to update alt text." };
  }
}
