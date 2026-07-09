import { getOrderByIdAction } from "@/services/orders";
import { getServicesQuery } from "@/data/services";
import { CustomerOrderDetailClient } from "@/components/features/dashboard/orders/customer-order-detail-client";
import { OrderNotFound } from "@/components/features/dashboard/orders/order-not-found";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerOrderDetailPage({ params }: PageProps) {
  const { id } = await params;

  const orderRes = await getOrderByIdAction(id);
  const initialServices = await getServicesQuery();

  if (!orderRes.success || !orderRes.order) {
    return <OrderNotFound backHref="/customer/orders" backLabel="Back to list" />;
  }

  return (
    <CustomerOrderDetailClient
      orderIdStr={id}
      initialOrder={orderRes.order}
      initialServices={initialServices}
    />
  );
}
