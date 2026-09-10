import { ServicesList } from "@/components/features/public/services/services-list";
import { JsonLd } from "@/components/common/json-ld";
import { servicesJsonLd } from "@/constants/seo";
import { getServicesQuery } from "@/data/services";

export const revalidate = 60;

export const metadata = {
  title: "Services & Pricing | Web Design & Software Dev Cebu",
  description:
    "Explore professional software development pricing in Cebu. Packages for high-performance MVPs, custom SaaS dashboard systems, mobile apps, and technical scoping.",
  alternates: {
    canonical: "/services",
  },
};

export default async function ServicesPage() {
  const dbServices = await getServicesQuery();

  return (
    <>
      <JsonLd data={servicesJsonLd(dbServices)} />
      <div className="min-h-screen bg-background">
        <ServicesList initialServices={dbServices} />
      </div>
    </>
  );
}
