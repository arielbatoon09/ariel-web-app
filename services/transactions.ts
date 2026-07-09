"use server";

import { getCurrentSessionUser } from "@/data/auth";
import { getUserByAuthId } from "@/data/users";
import { getUserRoleByUserId } from "@/data/roles";
import { getTransactionsQuery, insertTransactionQuery, updateTransactionStatusQuery } from "@/data/transactions";

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

// 1. Get all transactions (Admin only)
export async function getTransactionsAction() {
  const auth = await checkAdminAccess();
  if (!auth.authorized) {
    return { success: false, error: auth.error };
  }

  try {
    const transactionsList = await getTransactionsQuery();
    return {
      success: true,
      transactions: transactionsList,
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to fetch transactions." };
  }
}

// 2. Create transaction (Public/Client)
export async function createTransactionAction(data: {
  orderId: string;
  amount: number;
  paymentMethod: string;
  referenceNumber: string;
  screenshotUrl: string;
}) {
  try {
    const newTx = await insertTransactionQuery({
      orderId: data.orderId,
      amount: data.amount,
      status: "pending",
      paymentMethod: data.paymentMethod,
      referenceNumber: data.referenceNumber,
      screenshotUrl: data.screenshotUrl,
    });

    return {
      success: true,
      transaction: newTx,
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to submit transaction receipt." };
  }
}

// 3. Update transaction status (Admin only)
export async function updateTransactionStatusAction(id: string, status: "successful" | "failed" | "pending") {
  const auth = await checkAdminAccess();
  if (!auth.authorized) {
    return { success: false, error: auth.error };
  }

  try {
    const updated = await updateTransactionStatusQuery(id, status);
    if (!updated) {
      return { success: false, error: "Transaction not found." };
    }
    return {
      success: true,
      transaction: updated,
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to update transaction status." };
  }
}
