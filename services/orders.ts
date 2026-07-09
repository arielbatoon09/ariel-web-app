"use server";

import { getErrorMessage } from "@/lib/error-utils";
import { getCurrentSessionUser } from "@/data/auth";
import { getUserByAuthId } from "@/data/users";
import { getUserRoleByUserId } from "@/data/roles";
import { getOrdersQuery, getOrderByIdQuery, insertOrderQuery, updateOrderStatusQuery, deleteOrdersQuery } from "@/data/orders";
import { resend } from "@/lib/email";
import { orderConfirmationHtml, orderConfirmationText } from "@/lib/emails/order-confirmation";

async function checkAdminAccess() {
  const currentUser = await getCurrentSessionUser();
  if (!currentUser) {
    return { authorized: false, error: "Unauthorized: Please log in." };
  }

  const dbUser = await getUserByAuthId(currentUser.id);
  if (!dbUser) {
    return { authorized: false, error: "Unauthorized: Account not found." };
  }

  const role = await getUserRoleByUserId(dbUser.id);
  if (role !== "admin") {
    return { authorized: false, error: "Unauthorized: Admin privileges required." };
  }

  return { authorized: true };
}

// 1. Get all orders (Admin only)
export async function getOrdersAction() {
  const auth = await checkAdminAccess();
  if (!auth.authorized) {
    return { success: false, error: auth.error };
  }

  try {
    const ordersList = await getOrdersQuery();
    return {
      success: true,
      orders: ordersList,
    };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to fetch orders.")};
  }
}

// 2. Get single order by ID (Admin or the owner client)
export async function getOrderByIdAction(id: string) {
  try {
    const order = await getOrderByIdQuery(id);
    if (!order) {
      return { success: false, error: "Order not found." };
    }

    // Check auth access: admin can view any order, client can only view their own
    const currentUser = await getCurrentSessionUser();
    if (!currentUser) {
      return { success: false, error: "Unauthorized: Access denied." };
    }
    const dbUser = await getUserByAuthId(currentUser.id);
    if (!dbUser) {
      return { success: false, error: "Unauthorized: Access denied." };
    }
    const role = await getUserRoleByUserId(dbUser.id);
    const isAdmin = role === "admin";
    const isOwner = order.userId === dbUser.id.toString();

    if (!isAdmin && !isOwner) {
      return { success: false, error: "Unauthorized: Access denied." };
    }

    return {
      success: true,
      order,
    };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to fetch order details.")};
  }
}

// 3. Create order (Public - guest or logged-in user checkout)
export async function createOrderAction(data: {
  serviceId: string;
  serviceName: string;
  serviceBasePrice: number;
  customerName: string;
  customerEmail: string;
  addOnsSelected: string[];
  addOns: Array<{ name: string; price: number }>;
  totalAmount: number;
  referenceNumber?: string;
  customerPhone?: string;
  requirements?: string;
}) {
  try {
    let userId: string | null = null;
    const currentUser = await getCurrentSessionUser();
    if (currentUser) {
      const dbUser = await getUserByAuthId(currentUser.id);
      if (dbUser) {
        userId = dbUser.id.toString();
      }
    }

    const newOrder = await insertOrderQuery({
      userId,
      serviceId: data.serviceId,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      status: "pending",
      addOnsSelected: data.addOnsSelected,
      totalAmount: data.totalAmount,
      referenceNumber: data.referenceNumber,
      customerPhone: data.customerPhone,
      requirements: data.requirements,
    });

    // Send confirmation email (non-blocking — failure won't break checkout)
    try {
      const emailPayload = {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        serviceName: data.serviceName,
        serviceBasePrice: data.serviceBasePrice,
        referenceNumber: newOrder.referenceNumber ?? "",
        totalAmount: data.totalAmount,
        addOns: data.addOns,
        requirements: data.requirements,
        isNewClient: !userId, // treat logged-out users as new clients
      };

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev",
        to: [data.customerEmail],
        subject: `Order Received — ${newOrder.referenceNumber ?? "Your Order"}`,
        html: orderConfirmationHtml(emailPayload),
        text: orderConfirmationText(emailPayload),
      });
    } catch (emailErr) {
      console.warn("[Email] Failed to send order confirmation:", emailErr);
    }

    return {
      success: true,
      order: newOrder,
    };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to create order.")};
  }
}

// 4. Update order status (Admin only)
export async function updateOrderStatusAction(id: string, status: "pending" | "in-progress" | "completed" | "cancelled") {
  const auth = await checkAdminAccess();
  if (!auth.authorized) {
    return { success: false, error: auth.error };
  }

  try {
    const updated = await updateOrderStatusQuery(id, status);
    if (!updated) {
      return { success: false, error: "Order not found." };
    }
    return {
      success: true,
      order: updated,
    };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to update order status.")};
  }
}

// 5. Delete orders (Admin only)
export async function deleteOrdersAction(ids: string[]) {
  const auth = await checkAdminAccess();
  if (!auth.authorized) {
    return { success: false, error: auth.error };
  }

  try {
    const deleted = await deleteOrdersQuery(ids);
    return {
      success: true,
      orders: deleted,
    };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to delete orders." )};
  }
}
