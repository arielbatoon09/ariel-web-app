import { ServiceEditForm } from "@/components/features/dashboard/services/service-edit-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Edit Service Package | Admin",
  description: "Modify scope pricing package and update optional upgrades.",
};

export default async function AdminEditServicePage({ params }: PageProps) {
  const { id } = await params;
  return <ServiceEditForm id={id} />;
}
