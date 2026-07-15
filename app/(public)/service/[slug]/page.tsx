import { getServiceBySlugQuery } from "@/data/services";
import { ServiceDetailView } from "@/components/features/public/services/service-detail-view";
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
      title: "Service Package Not Found | Software Engineering Cebu",
      description: "The requested software design pricing package does not exist.",
    };
  }

  const cleanDesc = service.description.length > 150 ? `${service.description.substring(0, 150)}...` : service.description;

  return {
    title: `${service.name} Package Cebu | Software Development & MVP`,
    description: `Explore details for the ${service.name} package. Base Price: ₱${service.price.toLocaleString()} with ${service.deliveryTime} delivery. ${cleanDesc}`,
    alternates: {
      canonical: `/service/${slug}`,
    },
    openGraph: {
      title: `${service.name} Package Cebu | Software Development & MVP`,
      description: cleanDesc,
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
      <ServiceDetailView service={service} />
    </div>
  );
}
