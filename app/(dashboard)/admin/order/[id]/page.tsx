import { getOrderByIdAction } from "@/services/orders";
import { getServicesQuery } from "@/data/services";
import { AdminOrderDetailClient } from "@/components/features/dashboard/orders/admin-order-detail-client";
import { OrderNotFound } from "@/components/features/dashboard/orders/order-not-found";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { id } = await params;

  const orderRes = await getOrderByIdAction(id);
  const initialServices = await getServicesQuery();

  if (!orderRes.success || !orderRes.order) {
    return <OrderNotFound backHref="/admin/orders" backLabel="Back to registry" />;
  }

  return (
    <AdminOrderDetailClient
      orderIdStr={id}
      initialOrder={orderRes.order}
      initialServices={initialServices}
    />
  );
}
