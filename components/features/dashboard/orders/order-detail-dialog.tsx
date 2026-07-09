"use client";

import Image from "next/image";
import { useMemo } from "react";
import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { useOrderDetailQuery, useUpdateOrderStatusMutation } from "@/hooks/use-orders";
import { useServicesQuery } from "@/hooks/use-services";
import { useTransactionsQuery, useUpdateTransactionStatusMutation } from "@/hooks/use-transactions";
import type { Order } from "@/schemas/dashboard";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function OrderDetailDialog() {
  const { selectedOrderId, isOrderDetailsOpen, setIsOrderDetailsOpen, setSelectedOrderId } = useDashboardStore();

  const handleOpenChange = (open: boolean) => {
    setIsOrderDetailsOpen(open);
    if (!open) setSelectedOrderId(null);
  };

  return <OrderDetailDialogContent id={selectedOrderId || ""} open={isOrderDetailsOpen} onOpenChange={handleOpenChange} />;
}

function OrderDetailDialogContent({ id, open, onOpenChange }: { id: string; open: boolean; onOpenChange: (open: boolean) => void }) {
  const { data: order, isLoading } = useOrderDetailQuery(id);
  const { data: services = [] } = useServicesQuery();
  const { data: transactions = [] } = useTransactionsQuery();
  const updateStatusMutation = useUpdateOrderStatusMutation(id);
  const updateTxStatusMutation = useUpdateTransactionStatusMutation();

  const matchedService = useMemo(() => {
    if (!order) return null;
    return services.find((s) => s.id === order.serviceId);
  }, [order, services]);

  const matchedTransaction = useMemo(() => {
    if (!order) return null;
    return transactions.find((t) => t.orderId === order.id);
  }, [order, transactions]);

  if (!open) return null;
  if (isLoading || !order) return null;

  const handleStatusChange = (newStatus: Order["status"]) => {
    updateStatusMutation.mutate({ id: order.id, status: newStatus });
  };

  const handleApprovePayment = async (txId: string) => {
    try {
      await updateTxStatusMutation.mutateAsync({ id: txId, status: "successful" });
      await updateStatusMutation.mutateAsync({ id: order.id, status: "in-progress" });
    } catch (e) {
      console.error(e);
    }
  };

  const handleRejectPayment = async (txId: string) => {
    try {
      await updateTxStatusMutation.mutateAsync({ id: txId, status: "failed" });
      await updateStatusMutation.mutateAsync({ id: order.id, status: "pending" });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] [scrollbar-width:none] overflow-x-hidden overflow-y-auto rounded-none border border-neutral-300 bg-background/95 p-6 font-mono text-xs backdrop-blur-md [-ms-overflow-style:none] sm:max-w-[520px] dark:border-neutral-700 [&::-webkit-scrollbar]:hidden">
        <div className="pointer-events-none absolute -top-px -left-px z-50 size-2.5 border-t-2 border-l-2 border-neutral-400 dark:border-neutral-500" />
        <div className="pointer-events-none absolute -top-px -right-px z-50 size-2.5 border-t-2 border-r-2 border-neutral-400 dark:border-neutral-500" />
        <div className="pointer-events-none absolute -bottom-px -left-px z-50 size-2.5 border-b-2 border-l-2 border-neutral-400 dark:border-neutral-500" />
        <div className="pointer-events-none absolute -right-px -bottom-px z-50 size-2.5 border-r-2 border-b-2 border-neutral-400 dark:border-neutral-500" />

        <DialogHeader className="space-y-2">
          <DialogTitle className="font-sans text-sm font-bold tracking-widest text-foreground uppercase">Order Detail Registry</DialogTitle>
          <DialogDescription className="font-mono text-[10px] text-neutral-400 uppercase">
            Audit specifications, workflow stage, and payment confirmation.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-5">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4 border-b border-dashed border-neutral-200 pb-4 dark:border-neutral-800">
            <div>
              <span className="block text-[9px] font-bold tracking-wider text-neutral-400 uppercase">Order ID</span>
              <code className="text-xs font-bold text-foreground">{order.id}</code>
            </div>
            <div>
              <span className="block text-[9px] font-bold tracking-wider text-neutral-400 uppercase">Order Date</span>
              <span className="text-xs text-foreground">
                {new Date(order.createdAt).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>

          {/* Client Details */}
          <div className="space-y-2 border-b border-dashed border-neutral-200 pb-4 dark:border-neutral-800">
            <span className="block text-[9px] font-bold tracking-wider text-neutral-400 uppercase">Client Contact Info</span>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-500">Name:</span>
                <span className="font-bold text-foreground">{order.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Email:</span>
                <span className="text-foreground">{order.customerEmail}</span>
              </div>
            </div>
          </div>

          {/* Service & Add-ons */}
          <div className="space-y-3 border-b border-dashed border-neutral-200 pb-4 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold tracking-wider text-neutral-400 uppercase">Service Scope</span>
              <span className="font-bold text-foreground">{matchedService?.name || "Unknown Package"}</span>
            </div>

            <div className="space-y-1 text-[10px]">
              <div className="flex justify-between text-neutral-500">
                <span>Base Price:</span>
                <span>₱{matchedService?.price.toLocaleString() || "0"}</span>
              </div>

              {/* Addons Selection Details */}
              {order.addOnsSelected.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <span className="block text-[8px] font-bold tracking-widest text-neutral-400 uppercase">Add-ons Selected:</span>
                  {order.addOnsSelected.map((addonId) => {
                    const addon = matchedService?.addOns.find((a) => a.id === addonId);
                    return (
                      <div key={addonId} className="flex justify-between pl-2 text-neutral-600 dark:text-neutral-400">
                        <span>• {addon?.name || addonId}</span>
                        <span>+₱{addon?.price.toLocaleString() || "0"}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex justify-between border-t border-dashed border-neutral-300 pt-2 text-xs font-bold text-foreground">
                <span>Total Amount Paid/Due:</span>
                <span>₱{order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Linked Payment Transaction Receipt */}
          {matchedTransaction && (
            <div className="space-y-3 border-b border-dashed border-neutral-200 pb-4 dark:border-neutral-800">
              <span className="block text-[9px] font-bold tracking-wider text-neutral-400 uppercase">Proof of Payment</span>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Method:</span>
                  <span className="font-bold text-foreground uppercase">{matchedTransaction.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Reference #:</span>
                  <code className="font-bold text-foreground">{matchedTransaction.referenceNumber}</code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Verification Status:</span>
                  <span
                    className={cn(
                      "text-[10px] font-bold tracking-wider uppercase",
                      matchedTransaction.status === "successful" && "text-green-500",
                      matchedTransaction.status === "pending" && "text-yellow-500",
                      matchedTransaction.status === "failed" && "text-red-500"
                    )}
                  >
                    {matchedTransaction.status}
                  </span>
                </div>

                {matchedTransaction.status !== "successful" && (
                  <div className="flex gap-2 pt-1">
                    <Button
                      type="button"
                      onClick={() => handleApprovePayment(matchedTransaction.id)}
                      disabled={updateTxStatusMutation.isPending || updateStatusMutation.isPending}
                      className="h-7 flex-1 rounded-none bg-emerald-600 font-mono text-[9px] text-white uppercase hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800"
                    >
                      {updateTxStatusMutation.isPending ? "Approving..." : "Approve Payment"}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleRejectPayment(matchedTransaction.id)}
                      disabled={updateTxStatusMutation.isPending || updateStatusMutation.isPending}
                      className="bg-red-650 h-7 flex-1 rounded-none font-mono text-[9px] text-white uppercase hover:bg-red-700"
                    >
                      Reject Proof
                    </Button>
                  </div>
                )}

                {/* Screenshot URL Preview */}
                {matchedTransaction.screenshotUrl && (
                  <div className="pt-2">
                    <span className="mb-1.5 block font-mono text-[9px] text-neutral-400 uppercase">Payment Receipt Screenshot:</span>
                    <div className="relative aspect-[4/3] w-full border border-dashed border-neutral-300 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900">
                      <Image src={matchedTransaction.screenshotUrl} alt="Receipt Screenshot" fill className="object-contain" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Workflow Status Selection */}
          <div className="space-y-2.5">
            <span className="block text-[9px] font-bold tracking-wider text-neutral-400 uppercase">Workflow Delivery Stage</span>
            <div className="flex gap-2">
              {(["pending", "in-progress", "completed", "cancelled"] as Order["status"][]).map((status) => {
                const isLocked = (status === "in-progress" || status === "completed") && matchedTransaction?.status !== "successful";
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handleStatusChange(status)}
                    disabled={updateStatusMutation.isPending || isLocked}
                    title={isLocked ? "Verify payment screenshot to unlock this stage" : ""}
                    className={cn(
                      "flex-1 rounded border px-2.5 py-1.5 font-mono text-[9px] tracking-wider uppercase transition-all duration-200",
                      order.status === status
                        ? "border-neutral-900 bg-neutral-900 font-bold text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
                        : isLocked
                          ? "text-neutral-350 cursor-not-allowed border-neutral-200 bg-neutral-100 opacity-40 dark:border-neutral-900 dark:bg-neutral-950 dark:text-neutral-700"
                          : "text-neutral-450 border-neutral-300 bg-transparent hover:border-neutral-500 dark:border-neutral-700"
                    )}
                  >
                    {status}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Close button */}
          <div className="flex justify-end border-t border-dashed border-neutral-200 pt-4 dark:border-neutral-800">
            <Button
              type="button"
              onClick={() => onOpenChange(false)}
              className="h-9 rounded-none bg-foreground font-mono text-[10px] text-background uppercase hover:bg-foreground/90"
            >
              Close Record
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
