"use server";

import { db } from "@/drizzle";
import { orderMessages, orders, users } from "@/drizzle/schema";
import { eq, asc } from "drizzle-orm";
import { getCurrentSessionUser } from "@/data/auth";
import { getUserByAuthId } from "@/data/users";
import { getUserRoleByUserId } from "@/data/roles";
import { getErrorMessage } from "@/lib/error-utils";

// Interface for messages returned to the UI
export interface ChatMessage {
  id: number;
  orderId: string;
  senderId: number | null;
  senderName: string;
  senderRole: "admin" | "client" | "system";
  message: string;
  attachmentUrl: string | null;
  attachmentName: string | null;
  createdAt: string;
}

/**
 * Automatically link an order to a logged-in user if the email matches
 * but the order's userId is not yet set.
 */
export async function linkOrderToUserIfMatched(orderId: string, userEmail: string, dbUserId: number) {
  try {
    const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    if (order && !order.userId && order.customerEmail.toLowerCase() === userEmail.toLowerCase()) {
      await db.update(orders).set({ userId: dbUserId }).where(eq(orders.id, orderId));
    }
  } catch (err) {
    console.error("Failed to automatically link order to user:", err);
  }
}

/**
 * Retrieve all messages for a specific order.
 */
export async function getOrderMessagesAction(orderId: string) {
  try {
    const currentUser = await getCurrentSessionUser();
    if (!currentUser) {
      return { success: false, error: "Unauthorized: Please log in." };
    }

    const dbUser = await getUserByAuthId(currentUser.id);
    if (!dbUser) {
      return { success: false, error: "Unauthorized: Account not found in database." };
    }

    // Auto-link order if matches customer email
    await linkOrderToUserIfMatched(orderId, currentUser.email || "", dbUser.id);

    // Fetch order to verify access permission
    const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    if (!order) {
      return { success: false, error: "Order not found." };
    }

    const role = await getUserRoleByUserId(dbUser.id);
    const isOwner = order.userId === dbUser.id || order.customerEmail.toLowerCase() === currentUser.email?.toLowerCase();
    const isAdmin = role === "admin";

    if (!isAdmin && !isOwner) {
      return { success: false, error: "Unauthorized: You do not have access to this order." };
    }

    const messages = await db
      .select({
        id: orderMessages.id,
        orderId: orderMessages.orderId,
        senderId: orderMessages.senderId,
        senderName: users.fullName,
        senderRole: orderMessages.senderRole,
        message: orderMessages.message,
        attachmentUrl: orderMessages.attachmentUrl,
        attachmentName: orderMessages.attachmentName,
        createdAt: orderMessages.createdAt,
      })
      .from(orderMessages)
      .leftJoin(users, eq(orderMessages.senderId, users.id))
      .where(eq(orderMessages.orderId, orderId))
      .orderBy(asc(orderMessages.createdAt));

    const formattedMessages: ChatMessage[] = messages.map((m) => ({
      id: m.id,
      orderId: m.orderId,
      senderId: m.senderId,
      senderName: m.senderRole === "system" ? "System Notification" : m.senderName || "Unknown User",
      senderRole: m.senderRole as "admin" | "client" | "system",
      message: m.message,
      attachmentUrl: m.attachmentUrl,
      attachmentName: m.attachmentName,
      createdAt: m.createdAt.toISOString(),
    }));

    return { success: true, messages: formattedMessages };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to load messages.") };
  }
}

/**
 * Post a new text/file message in the order chat.
 */
export async function sendOrderMessageAction(
  orderId: string,
  message: string,
  attachment?: { url: string; name: string }
) {
  try {
    const currentUser = await getCurrentSessionUser();
    if (!currentUser) {
      return { success: false, error: "Unauthorized: Please log in." };
    }

    const dbUser = await getUserByAuthId(currentUser.id);
    if (!dbUser) {
      return { success: false, error: "Unauthorized: Account not found." };
    }

    // Verify order access
    const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    if (!order) {
      return { success: false, error: "Order not found." };
    }

    const role = await getUserRoleByUserId(dbUser.id);
    const isOwner = order.userId === dbUser.id || order.customerEmail.toLowerCase() === currentUser.email?.toLowerCase();
    const isAdmin = role === "admin";

    if (!isAdmin && !isOwner) {
      return { success: false, error: "Unauthorized: You do not have access to this order." };
    }

    const senderRole = isAdmin ? "admin" : "client";

    const [inserted] = await db
      .insert(orderMessages)
      .values({
        orderId,
        senderId: dbUser.id,
        senderRole,
        message,
        attachmentUrl: attachment?.url || null,
        attachmentName: attachment?.name || null,
      })
      .returning();

    return {
      success: true,
      message: {
        id: inserted.id,
        orderId: inserted.orderId,
        senderId: inserted.senderId,
        senderName: dbUser.fullName || "Unknown",
        senderRole: inserted.senderRole as "admin" | "client" | "system",
        message: inserted.message,
        attachmentUrl: inserted.attachmentUrl,
        attachmentName: inserted.attachmentName,
        createdAt: inserted.createdAt.toISOString(),
      } as ChatMessage,
    };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to send message.") };
  }
}

/**
 * Admin action to mark order as delivered and attach deliverables.
 */
export async function deliverOrderAction(
  orderId: string,
  deliveryMessage: string,
  attachment?: { url: string; name: string }
) {
  try {
    const currentUser = await getCurrentSessionUser();
    if (!currentUser) {
      return { success: false, error: "Unauthorized: Please log in." };
    }

    const dbUser = await getUserByAuthId(currentUser.id);
    if (!dbUser) {
      return { success: false, error: "Unauthorized: Account not found." };
    }

    const role = await getUserRoleByUserId(dbUser.id);
    if (role !== "admin") {
      return { success: false, error: "Unauthorized: Only administrators can deliver orders." };
    }

    // 1. Update order status to "delivered"
    await db.update(orders).set({ status: "delivered", updatedAt: new Date() }).where(eq(orders.id, orderId));

    // 2. Post a system message for the delivery notice
    await db.insert(orderMessages).values({
      orderId,
      senderId: null,
      senderRole: "system",
      message: "📢 PROJECT DELIVERED: The administrator has submitted final deliverables. Order status is now 'Delivered'. Waiting for client approval.",
    });

    // 3. Post the delivery message with the actual deliverables
    const [insertedDeliveryMsg] = await db
      .insert(orderMessages)
      .values({
        orderId,
        senderId: dbUser.id,
        senderRole: "admin",
        message: `📦 FINAL DELIVERABLES:\n\n${deliveryMessage}`,
        attachmentUrl: attachment?.url || null,
        attachmentName: attachment?.name || null,
      })
      .returning();

    return {
      success: true,
      message: {
        id: insertedDeliveryMsg.id,
        orderId: insertedDeliveryMsg.orderId,
        senderId: insertedDeliveryMsg.senderId,
        senderName: dbUser.fullName || "Admin",
        senderRole: "admin" as const,
        message: insertedDeliveryMsg.message,
        attachmentUrl: insertedDeliveryMsg.attachmentUrl,
        attachmentName: insertedDeliveryMsg.attachmentName,
        createdAt: insertedDeliveryMsg.createdAt.toISOString(),
      } as ChatMessage,
    };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to deliver order.") };
  }
}

/**
 * Client action to approve the delivery (marks order as completed).
 */
export async function approveOrderDeliveryAction(orderId: string) {
  try {
    const currentUser = await getCurrentSessionUser();
    if (!currentUser) {
      return { success: false, error: "Unauthorized: Please log in." };
    }

    const dbUser = await getUserByAuthId(currentUser.id);
    if (!dbUser) {
      return { success: false, error: "Unauthorized: Account not found." };
    }

    const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    if (!order) {
      return { success: false, error: "Order not found." };
    }

    const isOwner = order.userId === dbUser.id || order.customerEmail.toLowerCase() === currentUser.email?.toLowerCase();
    if (!isOwner) {
      return { success: false, error: "Unauthorized: Only the client can approve this delivery." };
    }

    // 1. Update order status to "completed"
    await db.update(orders).set({ status: "completed", updatedAt: new Date() }).where(eq(orders.id, orderId));

    // 2. Post a system message
    await db.insert(orderMessages).values({
      orderId,
      senderId: null,
      senderRole: "system",
      message: "✅ DELIVERY APPROVED: The client has approved the final delivery. The order is officially completed. Thank you!",
    });

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to approve delivery.") };
  }
}

/**
 * Client action to request changes/revision (sets status back to in-progress).
 */
export async function requestOrderRevisionAction(orderId: string, revisionFeedback: string) {
  try {
    const currentUser = await getCurrentSessionUser();
    if (!currentUser) {
      return { success: false, error: "Unauthorized: Please log in." };
    }

    const dbUser = await getUserByAuthId(currentUser.id);
    if (!dbUser) {
      return { success: false, error: "Unauthorized: Account not found." };
    }

    const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    if (!order) {
      return { success: false, error: "Order not found." };
    }

    const isOwner = order.userId === dbUser.id || order.customerEmail.toLowerCase() === currentUser.email?.toLowerCase();
    if (!isOwner) {
      return { success: false, error: "Unauthorized: Only the client can request revisions." };
    }

    // 1. Update order status to "revision_requested" or back to "in-progress"
    await db.update(orders).set({ status: "revision_requested", updatedAt: new Date() }).where(eq(orders.id, orderId));

    // 2. Post a system notification
    await db.insert(orderMessages).values({
      orderId,
      senderId: null,
      senderRole: "system",
      message: "🔄 REVISION REQUESTED: The client has requested changes/revisions to the submitted work.",
    });

    // 3. Post the client's revision feedback
    await db.insert(orderMessages).values({
      orderId,
      senderId: dbUser.id,
      senderRole: "client",
      message: `🛠️ REVISION FEEDBACK:\n\n${revisionFeedback}`,
    });

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to request revision.") };
  }
}
