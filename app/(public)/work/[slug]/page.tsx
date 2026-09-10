import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getWorkBySlugQuery, getWorksQuery } from "@/data/works";
import { getCategoriesQuery } from "@/data/categories";
import { CaseStudyView } from "@/components/features/public/works/case-study-view";
import { JsonLd } from "@/components/common/json-ld";
import { workJsonLd } from "@/constants/seo";
import type { Project } from "@/constants/projects";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const projects = await getWorksQuery();
  return projects
    .filter((p) => p.status === "published")
    .map((project) => ({
      slug: project.slug,
    }));
}

export const dynamicParams = true;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const project = await getWorkBySlugQuery(resolvedParams.slug);
  if (!project || project.status !== "published") return {};

  const metadata: Metadata = {
    title: project.seo?.title || `${project.title} | Case Study`,
    description: project.seo?.description || project.description,
    alternates: {
      canonical: project.seo?.canonicalUrl || `/work/${resolvedParams.slug}`,
    },
  };

  if (project.seo?.keywords) {
    metadata.keywords = project.seo.keywords.split(",").map((k) => k.trim());
  }

  const ogTitle = project.seo?.ogTitle || project.seo?.title || `${project.title} | Case Study`;
  const ogDesc = project.seo?.ogDescription || project.seo?.description || project.description;
  const ogImg = project.seo?.ogImage || project.imageSrc;

  metadata.openGraph = {
    title: ogTitle,
    description: ogDesc,
    type: "article",
    images: ogImg ? [{ url: ogImg }] : [],
  };

  if (project.seo?.canonicalUrl) {
    metadata.openGraph.url = project.seo.canonicalUrl;
  }

  return metadata;
}

export default async function ProjectCaseStudyPage({ params }: PageProps) {
  const resolvedParams = await params;
  const project = await getWorkBySlugQuery(resolvedParams.slug);

  if (!project || project.status !== "published") {
    notFound();
  }

  const mappedProject: Project = {
    ...project,
    id: project.id.toString(),
    categories: project.categories as ("web" | "mobile" | "ai-data" | "open-source")[],
  };

  const categoriesData = await getCategoriesQuery();
  const categoryNames = mappedProject.categories
    .map((slug) => categoriesData.find((c) => c.slug === slug))
    .filter((match) => !!match && !match.disabled)
    .map((match) => match!.name)
    .join(" • ");

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={workJsonLd({ ...mappedProject, seo: project.seo })} />
      <CaseStudyView project={mappedProject} categoryNames={categoryNames} />
    </div>
  );
}
