"use server";

import { r2Client } from "@/lib/r2/client";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getCurrentSessionUser } from "@/data/auth";
import { getUserByAuthId } from "@/data/users";
import { getUserRoleByUserId } from "@/data/roles";
import { getWorksQuery, getWorkByIdQuery, insertWorkQuery, updateWorkQuery, deleteWorksQuery, getFeaturedWorksQuery, getPublishedFeaturedWorksQuery } from "@/data/works";
import { getErrorMessage } from "@/lib/error-utils";
import { revalidateWorksPaths } from "@/lib/revalidate-cms";

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

// 1. Get all works (Public)
export async function getWorksAction() {
  try {
    const worksList = await getWorksQuery();
    return {
      success: true,
      works: worksList.map((w) => ({
        ...w,
        id: w.id.toString(),
      })),
    };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to load works.") };
  }
}

// Get single work by ID (Public)
export async function getWorkByIdAction(id: string) {
  try {
    const numericId = parseInt(id, 10);
    const work = await getWorkByIdQuery(numericId);
    if (!work) {
      return { success: false, error: "Work not found." };
    }
    return {
      success: true,
      work: {
        ...work,
        id: work.id.toString(),
      },
    };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to load work details.") };
  }
}

type CaseStudy = {
  role: string;
  timeline: string;
  challenge: string;
  solution: string;
  features: {
    title: string;
    description: string;
  }[];
  results: string[];
  client?: string;
  liveUrl?: string;
  githubUrl?: string;
};

type Seo = {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
};

type UpdateWorkInput = Partial<{
  slug: string;
  tag: string;
  title: string;
  description: string;
  imageSrc: string;
  gallery: string[];
  tags: string[];
  link: string;
  categories: string[];
  caseStudy: CaseStudy;
  seo: Seo;
  status: "draft" | "published" | "unpublished";
  isFeatured: boolean;
  isDraftSave: boolean;

  id: string;
  createdAt: Date;
  updatedAt: Date;
  draft: unknown;
}>;

// 2. Create work (Admin)
export async function createWorkAction(data: {
  slug: string;
  tag: string;
  title: string;
  description: string;
  imageSrc: string;
  gallery?: string[];
  tags: string[];
  link: string;
  categories: string[];
  caseStudy: CaseStudy;
  seo?: Seo;
  status?: "draft" | "published" | "unpublished";
}) {
  try {
    const authCheck = await checkAdminAccess();
    if (!authCheck.authorized) return { success: false, error: authCheck.error };

    const inserted = await insertWorkQuery({
      slug: data.slug,
      tag: data.tag,
      title: data.title,
      description: data.description,
      imageSrc: data.imageSrc,
      gallery: data.gallery || [],
      tags: data.tags,
      link: data.link,
      categories: data.categories,
      caseStudy: data.caseStudy,
      seo: data.seo || null,
      status: data.status || "draft",
    });

    if (inserted.status === "published") {
      revalidateWorksPaths(inserted.slug);
    }

    return { success: true, work: { ...inserted, id: inserted.id.toString() } };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to create work.") };
  }
}

// 3. Update work (Admin)
export async function updateWorkAction(
  id: string,
  data: Partial<{
    slug: string;
    tag: string;
    title: string;
    description: string;
    imageSrc: string;
    gallery: string[];
    tags: string[];
    link: string;
    categories: string[];
    caseStudy: Partial<CaseStudy>;
    seo: Partial<Seo>;
    status: "draft" | "published" | "unpublished";
    isFeatured: boolean;
    isDraftSave?: boolean;
  }>
) {
  try {
    const authCheck = await checkAdminAccess();
    if (!authCheck.authorized) return { success: false, error: authCheck.error };

    const numericId = parseInt(id, 10);
    const existing = await getWorkByIdQuery(numericId);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { isDraftSave, id: _id, createdAt: _createdAt, updatedAt: _updatedAt, draft: _draft, ...fields } = data as UpdateWorkInput;

    // Extract the exact payload type expected by the DB query
    type UpdateQueryPayload = Parameters<typeof updateWorkQuery>[1];

    // Extract the exact type expected by the 'draft' property specifically
    type DraftPayload = NonNullable<UpdateQueryPayload["draft"]>;

    let updatePayload: UpdateQueryPayload;

    if (isDraftSave) {
      updatePayload = {
        draft: {
          slug: fields.slug,
          tag: fields.tag,
          title: fields.title,
          description: fields.description,
          imageSrc: fields.imageSrc,
          gallery: fields.gallery,
          tags: fields.tags,
          link: fields.link,
          categories: fields.categories,
          caseStudy: fields.caseStudy,
          seo: fields.seo,
          isFeatured: fields.isFeatured,
        } as DraftPayload,
      };
    } else {
      updatePayload = {
        ...fields,
        draft: null,
      };
    }

    const updated = await updateWorkQuery(numericId, updatePayload);
    if (!updated) return { success: false, error: "Work not found." };

    if (!isDraftSave) {
      revalidateWorksPaths(updated.slug);
      if (existing?.slug && existing.slug !== updated.slug) {
        revalidateWorksPaths(existing.slug);
      }
    }

    return { success: true, work: { ...updated, id: updated.id.toString() } };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to update work.") };
  }
}

// 4. Toggle status (Admin)
export async function toggleWorkStatusAction(id: string) {
  try {
    const authCheck = await checkAdminAccess();
    if (!authCheck.authorized) return { success: false, error: authCheck.error };

    const numericId = parseInt(id, 10);
    const work = await getWorkByIdQuery(numericId);
    if (!work) return { success: false, error: "Work not found." };

    const newStatus = work.status === "published" ? "draft" : "published";
    const updated = await updateWorkQuery(numericId, { status: newStatus });

    revalidateWorksPaths(work.slug);

    return { success: true, status: updated?.status };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to toggle status.") };
  }
}

// 5. Delete works (Admin)
export async function deleteWorksAction(ids: string[]) {
  try {
    const authCheck = await checkAdminAccess();
    if (!authCheck.authorized) return { success: false, error: authCheck.error };

    const numericIds = ids.map((id) => parseInt(id, 10));
    const deleted = await deleteWorksQuery(numericIds);

    revalidateWorksPaths();
    for (const work of deleted) {
      revalidateWorksPaths(work.slug);
    }

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to delete works.") };
  }
}

// 6. Generate presigned URL for direct client uploads to R2 (Admin)
export async function getPresignedUploadUrlAction(filename: string, contentType: string, folder = "works") {
  try {
    const authCheck = await checkAdminAccess();
    if (!authCheck.authorized) return { success: false, error: authCheck.error };

    const bucketName = process.env.R2_BUCKET_NAME;
    if (!bucketName) {
      return { success: false, error: "Cloudflare R2 Bucket Name is not configured." };
    }

    const uniqueId = Math.random().toString(36).substring(2, 15) + "_" + Date.now();
    const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
    const key = `${folder}/${uniqueId}-${cleanFilename}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: contentType,
    });

    const presignedUrl = await getSignedUrl(r2Client, command, { expiresIn: 300 });

    const r2PublicUrl = process.env.R2_PUBLIC_URL || process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
    const cdnUrl = r2PublicUrl ? `${r2PublicUrl}/${bucketName}/${key}` : `https://pub-b7ccab85e4b540fcaab7ba577789da5d.r2.dev/${key}`;

    return { success: true, presignedUrl, key, url: cdnUrl };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to generate upload URL.") };
  }
}

// 7. Get featured works (Public)
export async function getFeaturedWorksAction() {
  try {
    const worksList = await getPublishedFeaturedWorksQuery();
    return {
      success: true,
      works: worksList.map((w) => ({
        ...w,
        id: w.id.toString(),
      })),
    };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to load featured works.") };
  }
}

// 8. Toggle featured status (Admin, limit 3)
export async function toggleWorkFeaturedAction(id: string, isFeatured: boolean) {
  try {
    const authCheck = await checkAdminAccess();
    if (!authCheck.authorized) return { success: false, error: authCheck.error };

    const numericId = parseInt(id, 10);
    const work = await getWorkByIdQuery(numericId);
    if (!work) return { success: false, error: "Work not found." };

    if (isFeatured) {
      const featuredWorks = await getFeaturedWorksQuery();
      if (featuredWorks.length >= 3) {
        return {
          success: false,
          error: "You can only feature up to 3 works. Please unfeature another project first.",
        };
      }
    }

    const updated = await updateWorkQuery(numericId, { isFeatured });
    if (!updated) return { success: false, error: "Failed to update featured status." };

    revalidateWorksPaths(updated.slug);

    return {
      success: true,
      work: {
        ...updated,
        id: updated.id.toString(),
      },
    };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to toggle featured status.") };
  }
}

