import { getServiceBySlugQuery } from "@/data/services";
import { CheckoutView } from "@/components/features/public/services/checkout-view";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlugQuery(slug);

  if (!service) {
    return {
      title: "Service Package Not Found | Software Engineering Cebu",
      description: "The requested software design pricing package does not exist.",
    };
  }

  return {
    title: `Checkout - ${service.name} | Software Engineering Cebu`,
    description: `Complete your orders for the ${service.name} package.`,
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
