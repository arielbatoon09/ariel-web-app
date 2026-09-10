import { getServiceBySlugQuery } from "@/data/services";
import { ServiceDetailView } from "@/components/features/public/services/service-detail-view";
import { JsonLd } from "@/components/common/json-ld";
import { serviceDetailJsonLd, absoluteCanonical, absoluteTitle, clipMetaDescription } from "@/constants/seo";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Dynamic SEO metadata generation by slug
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlugQuery(slug);

  if (!service) {
    return {
      title: absoluteTitle("Service Not Found | Ariel Batoon"),
      description: "The requested software package could not be found. Browse available services from Ariel Batoon instead.",
    };
  }

  const path = `/service/${slug}`;
  const title = `${service.name} | Software Package by Ariel Batoon`;
  const description = clipMetaDescription(
    `${service.name} by Ariel Batoon — ₱${service.price.toLocaleString()} with ${service.deliveryTime} delivery. ${service.description}`
  );

  return {
    title: absoluteTitle(title),
    description,
    alternates: {
      canonical: absoluteCanonical(path),
    },
    openGraph: {
      title,
      description,
      url: absoluteCanonical(path),
      type: "website",
    },
  };
}

export default async function PublicServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = await getServiceBySlugQuery(slug);

  if (!service) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={serviceDetailJsonLd(service)} />
      <ServiceDetailView service={service} />
    </div>
  );
}
