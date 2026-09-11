import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArticleBySlugQuery } from "@/data/articles";
import { getCategoriesQuery } from "@/data/categories";
import { ArticleHero } from "@/components/features/public/articles/article-hero";
import { ArticleContent } from "@/components/features/public/articles/article-content";
import { JsonLd } from "@/components/common/json-ld";
import { articleJsonLd, absoluteCanonical, absoluteTitle, clipMetaDescription } from "@/constants/seo";
import type { Article } from "@/schemas/dashboard";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  // Same as work pages: avoid 60s SSG timeouts against the Supabase pooler.
  return [];
}

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const article = await getArticleBySlugQuery(resolvedParams.slug);
  if (!article || article.status !== "published") return {};

  const path = `/article/${resolvedParams.slug}`;
  const title = article.seo?.title || `${article.title} | Ariel Batoon`;
  const description = clipMetaDescription(article.seo?.description || article.description);

  const metadata: Metadata = {
    title: absoluteTitle(title),
    description,
    alternates: {
      canonical: absoluteCanonical(article.seo?.canonicalUrl || path),
    },
  };

  if (article.seo?.keywords) {
    metadata.keywords = article.seo.keywords.split(",").map((k) => k.trim());
  }

  const ogTitle = article.seo?.ogTitle || title;
  const ogDesc = clipMetaDescription(article.seo?.ogDescription || description);
  const ogImg = article.seo?.ogImage || article.imageSrc;

  metadata.openGraph = {
    title: ogTitle,
    description: ogDesc,
    type: "article",
    url: absoluteCanonical(article.seo?.canonicalUrl || path),
    images: ogImg ? [{ url: ogImg }] : [],
  };

  return metadata;
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const rawArticle = await getArticleBySlugQuery(resolvedParams.slug);

  if (!rawArticle || rawArticle.status !== "published") {
    notFound();
  }

  const article: Article = {
    ...rawArticle,
    id: rawArticle.id.toString(),
    categories: rawArticle.categories as string[],
    seo: rawArticle.seo || undefined,
  };

  const allCategories = await getCategoriesQuery();
  const categoryNames = (article.categories as string[])
    .map((slug) => allCategories.find((c) => c.slug === slug))
    .filter((match) => !!match && !match.disabled)
    .map((match) => match!.name.toUpperCase())
    .join(" • ");

  return (
    <>
      <JsonLd data={articleJsonLd(article)} />
      <ArticleHero article={article} categoryNames={categoryNames} />
      <ArticleContent article={article} />
    </>
  );
}
