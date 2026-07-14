"use server";

import { getErrorMessage } from "@/lib/error-utils";
import { getCurrentSessionUser } from "@/data/auth";
import { getUserByAuthId } from "@/data/users";
import { getUserRoleByUserId } from "@/data/roles";
import { getOrdersQuery, getOrderByIdQuery, insertOrderQuery, updateOrderStatusQuery, deleteOrdersQuery } from "@/data/orders";
import { resend } from "@/lib/email";
import { orderConfirmationHtml, orderConfirmationText } from "@/lib/emails/order-confirmation";
import { db } from "@/drizzle";
import { transactions, orders } from "@/drizzle/schema";
import { eq, desc, or } from "drizzle-orm";
import { checkRateLimit } from "@/lib/rate-limit";

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
    return { success: false, error: getErrorMessage(err, "Failed to fetch orders.") };
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
    const emailMatches = order.customerEmail.toLowerCase() === currentUser.email?.toLowerCase();
    
    // Auto-link order if email matches but userId is null in database
    if (!order.userId && emailMatches) {
      await db.update(orders).set({ userId: dbUser.id, updatedAt: new Date() }).where(eq(orders.id, id));
      order.userId = dbUser.id.toString();
    }

    const isOwner = order.userId === dbUser.id.toString() || emailMatches;

    if (!isAdmin && !isOwner) {
      return { success: false, error: "Unauthorized: Access denied." };
    }

    const [transaction] = await db.select().from(transactions).where(eq(transactions.orderId, id)).limit(1);

    return {
      success: true,
      order,
      transaction: transaction ? {
        ...transaction,
        id: transaction.id.toString(),
        orderId: transaction.orderId.toString(),
        status: transaction.status as "successful" | "failed" | "pending",
        createdAt: transaction.createdAt.toISOString(),
      } : null,
    };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to fetch order details.") };
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
    // Check Rate Limit (max 3 checkouts per minute per IP)
    const rateLimit = await checkRateLimit("rate_limit:checkout", 3, 60);
    if (!rateLimit.success) {
      return {
        success: false,
        error: `Too many checkout attempts. Please wait ${rateLimit.reset} seconds before trying again.`,
      };
    }

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
    return { success: false, error: getErrorMessage(err, "Failed to create order.") };
  }
}

// 4. Update order status (Admin only)
export async function updateOrderStatusAction(id: string, status: "pending" | "in-progress" | "completed" | "cancelled" | "delivered" | "revision_requested") {
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
    return { success: false, error: getErrorMessage(err, "Failed to update order status.") };
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
    return { success: false, error: getErrorMessage(err, "Failed to delete orders.") };
  }
}

// 6. Get all orders for the logged-in customer (matched by user id or customerEmail)
export async function getCustomerOrdersAction() {
  try {
    const currentUser = await getCurrentSessionUser();
    if (!currentUser) {
      return { success: false, error: "Unauthorized: Please log in." };
    }

    const dbUser = await getUserByAuthId(currentUser.id);
    if (!dbUser) {
      return { success: false, error: "Unauthorized: Account not found." };
    }

    const customerEmail = currentUser.email || "";
    const dbUserId = dbUser.id;

    // Fetch matching orders
    const matchedOrders = await db
      .select()
      .from(orders)
      .where(
        or(
          eq(orders.userId, dbUserId),
          eq(orders.customerEmail, customerEmail)
        )
      )
      .orderBy(desc(orders.createdAt));

    // Map to frontend expectation
    const formattedOrders = matchedOrders.map((o) => ({
      ...o,
      id: o.id.toString(),
      userId: o.userId?.toString() || null,
      serviceId: o.serviceId.toString(),
      status: o.status as "pending" | "in-progress" | "completed" | "cancelled" | "delivered" | "revision_requested",
      createdAt: o.createdAt.toISOString(),
    }));

    return { success: true, orders: formattedOrders };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to load customer orders.") };
  }
}
