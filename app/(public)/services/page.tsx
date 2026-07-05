import { ServicesList } from "@/components/features/services/services-list";

export const metadata = {
  title: "Services & Pricing | Ariel Batoon",
  description: "View specialized software engineering services including Startup MVP launches, full-scale SaaS development, AI integration, and technical scoping. Pricing listed in Philippine Pesos (₱).",
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <ServicesList />
    </div>
  );
}
