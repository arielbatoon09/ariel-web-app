import { WorksArchive } from "@/components/features/public/works/works-archive";
import { getWorksQuery } from "@/data/works";
import { getCategoriesQuery } from "@/data/categories";
import type { Project } from "@/schemas/dashboard";

export const revalidate = 60;

export const metadata = {
  title: "Portfolio | Creative Works & Projects Cebu",
  description:
    "Browse software projects engineered by Ariel Batoon in Cebu. Custom SaaS dashboards, performance-driven web apps, and native mobile apps.",
  alternates: {
    canonical: "/works",
  },
};

export default async function WorksPage() {
  const projects = await getWorksQuery();
  const publishedProjects: Project[] = projects
    .filter((p) => p.status === "published")
    .map((p) => ({
      ...p,
      id: p.id.toString(),
      categories: p.categories as ("web" | "mobile" | "ai-data" | "open-source")[],
      seo: p.seo ?? undefined,
    }));

  const categoriesData = await getCategoriesQuery();
  const usedCategorySlugs = new Set<string>(publishedProjects.flatMap((p) => p.categories || []));

  const activeWorksCategories = categoriesData
    .filter((c) => (c.target === "works" || c.target === "both") && !c.disabled && usedCategorySlugs.has(c.slug))
    .map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
    }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: "Ariel Batoon Software Portfolio",
    author: {
      "@type": "Person",
      name: "Ariel Batoon",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Cebu City",
        addressRegion: "Cebu",
        addressCountry: "PH",
      },
    },
    description: "A collection of SaaS products, high-performance web systems, and mobile applications developed for clients globally.",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-background">
        <WorksArchive initialProjects={publishedProjects} categories={activeWorksCategories} />
      </div>
    </>
  );
}
