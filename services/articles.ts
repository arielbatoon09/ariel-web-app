"use server";

import { getCurrentSessionUser } from "@/data/auth";
import { getUserByAuthId } from "@/data/users";
import { getUserRoleByUserId } from "@/data/roles";
import {
  getArticlesQuery,
  getArticleByIdQuery,
  getArticleBySlugQuery,
  insertArticleQuery,
  updateArticleQuery,
  deleteArticlesQuery,
} from "@/data/articles";
import { getErrorMessage } from "@/lib/error-utils";
import { revalidateArticlesPaths } from "@/lib/revalidate-cms";

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

// 1. Get all articles (Public)
export async function getArticlesAction() {
  try {
    const articlesList = await getArticlesQuery();
    return {
      success: true,
      articles: articlesList.map((a) => ({
        ...a,
        id: a.id.toString(),
      })),
    };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to fetch articles.") };
  }
}

// 2. Get single article by ID (Public)
export async function getArticleByIdAction(id: string) {
  try {
    const numericId = parseInt(id, 10);
    const article = await getArticleByIdQuery(numericId);
    if (!article) {
      return { success: false, error: "Article not found." };
    }
    return {
      success: true,
      article: { ...article, id: article.id.toString() },
    };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to fetch article details.") };
  }
}

// 3. Get single article by Slug (Public)
export async function getArticleBySlugAction(slug: string) {
  try {
    const article = await getArticleBySlugQuery(slug);
    if (!article) {
      return { success: false, error: "Article not found." };
    }
    return {
      success: true,
      article: { ...article, id: article.id.toString() },
    };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to fetch article by slug.") };
  }
}

// 4. Create article (Admin)
export async function createArticleAction(data: {
  slug: string;
  tag: string;
  title: string;
  description: string;
  imageSrc: string;
  tags: string[];
  link: string;
  categories: string[];
  date: string;
  readTime: string;
  author: string;
  sections: Array<{ title: string; body: string }>;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    canonicalUrl?: string;
  };
  status?: "draft" | "published" | "unpublished";
}) {
  try {
    const authCheck = await checkAdminAccess();
    if (!authCheck.authorized) return { success: false, error: authCheck.error };

    const inserted = await insertArticleQuery({
      slug: data.slug,
      tag: data.tag,
      title: data.title,
      description: data.description,
      imageSrc: data.imageSrc,
      tags: data.tags,
      link: data.link,
      categories: data.categories,
      date: data.date,
      readTime: data.readTime,
      author: data.author,
      sections: data.sections,
      seo: data.seo || null,
      status: data.status || "draft",
    });

    if (inserted.status === "published") {
      revalidateArticlesPaths(inserted.slug);
    }

    return { success: true, article: { ...inserted, id: inserted.id.toString() } };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to create article.") };
  }
}

// 5. Update article (Admin)
export async function updateArticleAction(
  id: string,
  data: Partial<{
    slug: string;
    tag: string;
    title: string;
    description: string;
    imageSrc: string;
    tags: string[];
    link: string;
    categories: string[];
    date: string;
    readTime: string;
    author: string;
    sections: Array<{ title: string; body: string }>;
    seo: NonNullable<Parameters<typeof insertArticleQuery>[0]["seo"]>;
    status: "draft" | "published" | "unpublished";
    isDraftSave?: boolean;
  }>
) {
  try {
    const authCheck = await checkAdminAccess();
    if (!authCheck.authorized) return { success: false, error: authCheck.error };

    const numericId = parseInt(id, 10);
    const existing = await getArticleByIdQuery(numericId);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    const { isDraftSave, id: _id, createdAt: _createdAt, updatedAt: _updatedAt, draft: _draft, ...fields } = data as any;

    // Look up exactly what the query function expects as a payload
    type UpdateQueryPayload = Parameters<typeof updateArticleQuery>[1];
    type DraftPayload = NonNullable<UpdateQueryPayload["draft"]>;

    let updatePayload: UpdateQueryPayload;

    if (isDraftSave) {
      // Stage changes to draft column only — public page remains unchanged
      updatePayload = {
        draft: {
          slug: fields.slug,
          tag: fields.tag,
          title: fields.title,
          description: fields.description,
          imageSrc: fields.imageSrc,
          tags: fields.tags,
          link: fields.link,
          categories: fields.categories,
          date: fields.date,
          readTime: fields.readTime,
          author: fields.author,
          sections: fields.sections,
          seo: fields.seo,
        } as DraftPayload,
      };
    } else {
      updatePayload = {
        ...fields,
        draft: null,
      };
    }

    const updated = await updateArticleQuery(numericId, updatePayload);
    if (!updated) return { success: false, error: "Article not found." };

    if (!isDraftSave) {
      revalidateArticlesPaths(updated.slug);
      if (existing?.slug && existing.slug !== updated.slug) {
        revalidateArticlesPaths(existing.slug);
      }
    }

    return { success: true, article: { ...updated, id: updated.id.toString() } };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to update article.") };
  }
}

// 6. Toggle article status (Admin)
export async function toggleArticleStatusAction(id: string) {
  try {
    const authCheck = await checkAdminAccess();
    if (!authCheck.authorized) return { success: false, error: authCheck.error };

    const numericId = parseInt(id, 10);
    const article = await getArticleByIdQuery(numericId);
    if (!article) return { success: false, error: "Article not found." };

    const newStatus = article.status === "published" ? "draft" : "published";
    const updated = await updateArticleQuery(numericId, { status: newStatus });

    revalidateArticlesPaths(article.slug);

    return { success: true, status: updated?.status };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to toggle status.") };
  }
}

// 7. Delete articles (Admin)
export async function deleteArticlesAction(ids: string[]) {
  try {
    const authCheck = await checkAdminAccess();
    if (!authCheck.authorized) return { success: false, error: authCheck.error };

    const numericIds = ids.map((id) => parseInt(id, 10));
    const deleted = await deleteArticlesQuery(numericIds);

    revalidateArticlesPaths();
    for (const article of deleted) {
      revalidateArticlesPaths(article.slug);
    }

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to delete articles.") };
  }
}
