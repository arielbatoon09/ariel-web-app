import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getArticleByIdQuery } from "@/data/articles";
import { ArticleEditorClient } from "@/components/features/dashboard/articles/article-editor-client";
import type { Article } from "@/schemas/dashboard";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminArticleDetailPage({ params }: PageProps) {
  const { id } = await params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    return (
      <div className="py-12 text-center font-mono text-xs">
        <p className="text-red-500">INVALID ARTICLE ID</p>
        <Link href="/admin/articles" className="mt-4 inline-flex items-center gap-1 text-neutral-400 hover:text-foreground">
          <ArrowLeft className="size-3.5" /> Back to list
        </Link>
      </div>
    );
  }

  const rawArticle = await getArticleByIdQuery(numericId);

  if (!rawArticle) {
    return (
      <div className="py-12 text-center font-mono text-xs">
        <p className="text-red-500">ARTICLE NOT FOUND</p>
        <Link href="/admin/articles" className="mt-4 inline-flex items-center gap-1 text-neutral-400 hover:text-foreground">
          <ArrowLeft className="size-3.5" /> Back to list
        </Link>
      </div>
    );
  }

  // Merge draft over main fields so the editor starts with staged changes applied
  const article: Article = {
    ...rawArticle,
    ...(rawArticle.draft || {}),
    id: rawArticle.id.toString(),
    categories: ((rawArticle.draft as any)?.categories || rawArticle.categories) as string[],
    seo: (rawArticle.draft as any)?.seo || rawArticle.seo || undefined,
    draft: rawArticle.draft,
    status: rawArticle.status,
  };

  return <ArticleEditorClient articleId={id} initialData={article} />;
}
