import { getServiceBySlugQuery } from "@/data/services";
import { CheckoutView } from "@/components/features/public/services/checkout-view";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { absoluteCanonical, absoluteTitle, clipMetaDescription } from "@/constants/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlugQuery(slug);

  if (!service) {
    return {
      title: absoluteTitle("Checkout Not Found | Ariel Batoon"),
      description: "The requested checkout page could not be found. Browse available software packages from Ariel Batoon.",
    };
  }

  const path = `/services/${slug}/checkout`;
  const title = `Checkout ${service.name} | Ariel Batoon`;
  const description = clipMetaDescription(
    `Complete your order for the ${service.name} package with Ariel Batoon. Secure checkout for software development services.`
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
    },
  };
}

export default async function PublicServiceCheckoutPage({ params }: PageProps) {
  const { slug } = await params;
  const service = await getServiceBySlugQuery(slug);

  if (!service) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <CheckoutView service={service} />
    </div>
  );
}
