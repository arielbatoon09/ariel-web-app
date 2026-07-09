import { ArticlesArchive } from "@/components/features/public/articles/articles-archive";
import { getArticlesQuery } from "@/data/articles";
import { getCategoriesQuery } from "@/data/categories";
import type { Article } from "@/schemas/dashboard";

export const metadata = {
  title: "Articles & Insights | Web Engineering Blog Cebu",
  description:
    "Read technical articles on React Performance, Next.js optimization, and API architecture written by Ariel Batoon, software engineer in Cebu City.",
};

export default async function ArticlesPage() {
  const rawArticles = await getArticlesQuery();
  const publishedArticles: Article[] = rawArticles
    .filter((a) => a.status === "published")
    .map((a) => ({
      ...a,
      id: a.id.toString(),
      categories: a.categories as string[],
      seo: a.seo ?? undefined,
    }));

  const categoriesData = await getCategoriesQuery();
  const activeArticleCategories = categoriesData
    .filter((c) => (c.target === "articles" || c.target === "both") && !c.disabled)
    .map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
    }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Ariel Batoon Engineering Insights",
    description: "Technical insights on Next.js, database designs, and frontend rendering performance.",
    publisher: {
      "@type": "Person",
      name: "Ariel Batoon",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Cebu City",
        addressRegion: "Cebu",
        addressCountry: "PH",
      },
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-background">
        <ArticlesArchive initialArticles={publishedArticles} categories={activeArticleCategories} />
      </div>
    </>
  );
}
