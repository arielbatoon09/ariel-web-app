import { ServiceNewForm } from "@/components/features/dashboard/services/service-new-form";

export const metadata = {
  title: "Create Service Package | Admin",
  description: "Define a new scope pricing package and configure add-on choices.",
};

export default function AdminNewServicePage() {
  return <ServiceNewForm />;
}
