import { ServicesList } from "@/components/features/public/services/services-list";
import { JsonLd } from "@/components/common/json-ld";
import { servicesJsonLd, absoluteCanonical, absoluteTitle } from "@/constants/seo";
import { getServicesQuery } from "@/data/services";

export const revalidate = 60;

export const metadata = {
  title: absoluteTitle("Services & Pricing by Ariel Batoon — Software Development"),
  description: "Transparent pricing for MVP builds, custom SaaS systems, mobile apps, and technical consulting with Ariel Batoon.",
  alternates: {
    canonical: absoluteCanonical("/services"),
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
