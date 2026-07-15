"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useOrderDetailQuery, useUpdateOrderStatusMutation } from "@/hooks/use-orders";
import { useServicesQuery } from "@/hooks/use-services";
import { useUpdateTransactionStatusMutation } from "@/hooks/use-transactions";
import { useOrderChatQuery, useSendOrderMessageMutation, useDeliverOrderMutation } from "@/hooks/use-order-chat";
import { getChatAttachmentPresignedUrlAction } from "@/services/media";
import { Gift, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { Order, Service } from "@/schemas/dashboard";
import { OrderCompactBar, OrderDetailBrackets, OrderDetailsDialog } from "@/components/features/dashboard/orders/order-detail-shared";
import { OrderChatPanel } from "@/components/features/dashboard/orders/order-chat-panel";

interface AdminOrderDetailClientProps {
  orderIdStr: string;
  initialOrder: Order;
  initialServices: Service[];
}

export function AdminOrderDetailClient({ orderIdStr, initialOrder, initialServices }: AdminOrderDetailClientProps) {
  const orderId = orderIdStr;

  const { data, error: orderError } = useOrderDetailQuery(orderIdStr);
  const order = data?.order || initialOrder;
  const transaction = data?.transaction || null;
  const { data: services = initialServices } = useServicesQuery();
  const { data: messages = [], isLoading: isChatLoading, refetch: refetchChat } = useOrderChatQuery(orderId);

  const updateStatusMutation = useUpdateOrderStatusMutation(orderIdStr);
  const updateTxStatusMutation = useUpdateTransactionStatusMutation();
  const sendMessageMutation = useSendOrderMessageMutation(orderId);
  const deliverOrderMutation = useDeliverOrderMutation(orderId);

  const handleApprovePayment = async () => {
    if (!transaction) return;
    try {
      await updateTxStatusMutation.mutateAsync({ id: transaction.id, status: "successful" });
      await updateStatusMutation.mutateAsync({ id: order.id, status: "in-progress" });
      setIsPaymentModalOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRejectPayment = async () => {
    if (!transaction) return;
    try {
      await updateTxStatusMutation.mutateAsync({ id: transaction.id, status: "failed" });
      await updateStatusMutation.mutateAsync({ id: order.id, status: "pending" });
      setIsPaymentModalOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleVerifyOrder = async () => {
    if (transaction && transaction.status === "pending") {
      await handleApprovePayment();
    } else {
      await updateStatusMutation.mutateAsync({ id: order.id, status: "in-progress" });
    }
  };

  const [messageText, setMessageText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [deliveryAttachment, setDeliveryAttachment] = useState<{ url: string; name: string } | null>(null);
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(false);
  const [isDelivering, setIsDelivering] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const deliveryFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getServiceName = (serviceId: string) => {
    const s = services.find((srv) => srv.id === serviceId);
    return s ? s.name : "Custom Development Service";
  };

  const matchedService = services.find((srv) => srv.id === order.serviceId) ?? null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    await sendMessageMutation.mutateAsync({ message: messageText });
    setMessageText("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isForDelivery = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (isForDelivery) setIsDelivering(true);
      else setIsUploading(true);

      const res = await getChatAttachmentPresignedUrlAction(file.name, file.type, orderId);
      if (!res.success || !res.presignedUrl || !res.url) {
        throw new Error(res.error || "Failed to generate upload URL.");
      }

      const uploadRes = await fetch(res.presignedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!uploadRes.ok) throw new Error("Failed to upload file to R2.");

      if (isForDelivery) {
        setDeliveryAttachment({ url: res.url, name: file.name });
      } else {
        await sendMessageMutation.mutateAsync({
          message: `📎 Sent an attachment: ${file.name}`,
          attachment: { url: res.url, name: file.name },
        });
      }
    } catch (err: unknown) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Failed to upload file.");
    } finally {
      setIsUploading(false);
      setIsDelivering(false);
      if (deliveryFileInputRef.current) deliveryFileInputRef.current.value = "";
    }
  };

  const handleDeliverSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryMessage.trim()) return;

    try {
      setIsDelivering(true);
      await deliverOrderMutation.mutateAsync({
        deliveryMessage,
        attachment: deliveryAttachment || undefined,
      });
      setDeliveryMessage("");
      setDeliveryAttachment(null);
      setIsDeliveryOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDelivering(false);
    }
  };

  if (orderError) {
    return (
      <div className="space-y-6 py-4">
        <div className="border border-red-300 bg-red-50/50 p-6 dark:border-red-900/50 dark:bg-red-950/20">
          <p className="font-mono text-xs text-red-500">ERROR: {orderError.message || "Order not found or access denied."}</p>
        </div>
      </div>
    );
  }

  const headerActions = (
    <>
      {transaction && (
        <Button
          variant="outline"
          onClick={() => setIsPaymentModalOpen(true)}
          className="h-8 rounded-none border-dashed font-mono text-[10px] uppercase"
        >
          Payment
        </Button>
      )}
      {order.status === "pending" && (
        <Button
          disabled={updateStatusMutation.isPending || updateTxStatusMutation.isPending}
          onClick={handleVerifyOrder}
          className="h-8 rounded-none bg-neutral-900 font-mono text-[10px] text-white uppercase dark:bg-neutral-100 dark:text-neutral-900"
        >
          {updateStatusMutation.isPending || updateTxStatusMutation.isPending ? "..." : "Verify"}
        </Button>
      )}
      {(order.status === "in-progress" || order.status === "revision_requested") && (
        <Button
          className="h-8 rounded-none bg-green-600 font-mono text-[10px] text-white uppercase hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
          onClick={() => setIsDeliveryOpen(true)}
        >
          <Gift className="mr-1 size-3" />
          Deliver
        </Button>
      )}
    </>
  );

  return (
    <div className="flex h-[calc(100dvh-7rem)] flex-col gap-3 pt-4 pb-2 md:h-[calc(100dvh-6rem)]">
      <OrderCompactBar
        order={order}
        serviceName={getServiceName(order.serviceId)}
        backHref="/admin/orders"
        backLabel="Back to Orders Registry"
        onRefresh={() => refetchChat()}
        onOpenDetails={() => setIsDetailsOpen(true)}
        actions={headerActions}
      />

      <OrderChatPanel
        messages={messages}
        isLoading={isChatLoading}
        isUploading={isUploading}
        messageText={messageText}
        onMessageTextChange={setMessageText}
        onSendMessage={handleSendMessage}
        onFileUpload={(e) => handleFileUpload(e, false)}
        chatBottomRef={chatBottomRef}
        viewerRole="admin"
        placeholder="Post a query or message for client..."
      />

      <OrderDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        order={order}
        service={matchedService}
        variant="admin"
        paymentMethod={transaction?.paymentMethod}
      />

      <Dialog open={isDeliveryOpen} onOpenChange={setIsDeliveryOpen}>
        <DialogContent className="max-h-[90vh] overflow-hidden rounded-none border border-neutral-300 bg-background/95 p-0 font-mono text-xs backdrop-blur-md sm:max-w-md dark:border-neutral-700">
          <OrderDetailBrackets />
          <div className="border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
            <DialogHeader className="space-y-1 text-left">
              <DialogTitle className="font-sans text-base font-bold text-foreground">Submit Project Deliverables</DialogTitle>
              <DialogDescription className="text-neutral-450 text-[10px] uppercase">
                Submit final outputs and files for client approval
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="max-h-[calc(90vh-140px)] space-y-6 overflow-y-auto px-6 py-5">
            <form onSubmit={handleDeliverSubmit} className="space-y-4">
              <textarea
                value={deliveryMessage}
                onChange={(e) => setDeliveryMessage(e.target.value)}
                placeholder="Write a message explaining what files are delivered, instructions to run, or next steps..."
                className="min-h-[120px] w-full border border-dashed border-neutral-300 p-3 font-mono text-xs transition-all duration-200 outline-none focus:border-solid focus:border-neutral-900 focus:ring-0 dark:border-neutral-700 dark:focus:border-neutral-100"
                required
              />

              <div className="space-y-2">
                <input
                  type="file"
                  ref={deliveryFileInputRef}
                  onChange={(e) => handleFileUpload(e, true)}
                  className="hidden"
                  accept=".pdf,.zip,.png,.jpg,.jpeg,.json"
                />

                {deliveryAttachment ? (
                  <div className="flex items-center justify-between border border-dashed border-green-500 bg-green-500/5 p-3 dark:border-green-500/30">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="font-bold text-green-600 dark:text-green-400">✓</span>
                      <span className="truncate font-mono text-[10px] font-bold text-foreground">{deliveryAttachment.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDeliveryAttachment(null)}
                      className="text-neutral-450 font-mono text-[10px] uppercase hover:text-foreground"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isDelivering}
                    onClick={() => deliveryFileInputRef.current?.click()}
                    className="h-9 w-full rounded-none border border-dashed border-neutral-300 font-mono text-[10px] uppercase hover:bg-neutral-50 dark:border-neutral-700"
                  >
                    <Paperclip className="mr-1.5 size-3.5" />
                    Attach Project Archive
                  </Button>
                )}
              </div>

              <div className="dark:border-neutral-850 flex justify-end gap-2 border-t border-dashed border-neutral-200 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="h-8 rounded-none border-dashed font-mono text-[10px] uppercase"
                  onClick={() => {
                    setIsDeliveryOpen(false);
                    setDeliveryMessage("");
                    setDeliveryAttachment(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!deliveryMessage.trim() || isDelivering}
                  className="h-8 rounded-none bg-green-600 font-mono text-[10px] text-white uppercase hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                >
                  {isDelivering ? "Uploading..." : "Deliver Project"}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        {transaction && (
          <DialogContent className="max-h-[90vh] overflow-hidden rounded-none border border-neutral-300 bg-background/95 p-0 font-mono text-xs backdrop-blur-md sm:max-w-md dark:border-neutral-700">
            <OrderDetailBrackets />
            <div className="border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
              <DialogHeader className="space-y-1 text-left">
                <DialogTitle className="font-sans text-base font-bold text-foreground">Review Payment</DialogTitle>
                <DialogDescription className="text-neutral-450 text-[10px] uppercase">Verify transaction details and receipt</DialogDescription>
              </DialogHeader>
            </div>

            <div className="max-h-[calc(90vh-140px)] space-y-6 overflow-y-auto px-6 py-5">
              <div className="space-y-4 font-mono text-[11px]">
                <div className="grid grid-cols-2 gap-2 border-b border-dashed border-neutral-100 pb-3 dark:border-neutral-800">
                  <div>
                    <span className="text-neutral-450 block text-[9px] uppercase">Reference</span>
                    <span className="font-bold text-foreground">{transaction.referenceNumber || "-"}</span>
                  </div>
                  <div>
                    <span className="text-neutral-450 block text-[9px] uppercase">Amount</span>
                    <span className="font-bold text-foreground">₱{transaction.amount.toLocaleString()}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 border-b border-dashed border-neutral-100 pb-3 dark:border-neutral-800">
                  <div>
                    <span className="text-neutral-450 block text-[9px] uppercase">Method</span>
                    <span className="font-bold text-foreground uppercase">{transaction.paymentMethod}</span>
                  </div>
                  <div>
                    <span className="text-neutral-450 block text-[9px] uppercase">Submitted</span>
                    <span className="font-bold text-foreground">{transaction.createdAt ? transaction.createdAt.split("T")[0] : "-"}</span>
                  </div>
                </div>

                {transaction.screenshotUrl && (
                  <div>
                    <span className="text-neutral-450 mb-2 block text-[9px] uppercase">Receipt Screenshot</span>
                    <div className="relative mx-auto h-full w-full overflow-hidden border border-dashed border-neutral-300 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900">
                      <Image height={500} width={500} src={transaction.screenshotUrl} alt="Receipt" className="h-full w-full object-contain" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-dashed border-neutral-200 px-6 py-4 dark:border-neutral-800">
              {transaction.status === "pending" ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={updateTxStatusMutation.isPending || updateStatusMutation.isPending}
                    className="h-8 rounded-none border-dashed font-mono text-[10px] text-rose-500 uppercase hover:bg-rose-50 dark:border-rose-800"
                    onClick={handleRejectPayment}
                  >
                    Reject Payment
                  </Button>
                  <Button
                    type="button"
                    disabled={updateTxStatusMutation.isPending || updateStatusMutation.isPending}
                    className="h-8 rounded-none bg-green-600 font-mono text-[10px] text-white uppercase hover:bg-green-700"
                    onClick={handleApprovePayment}
                  >
                    Approve Payment
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  className="h-8 rounded-none bg-neutral-900 font-mono text-[10px] text-white uppercase dark:bg-neutral-100 dark:text-neutral-900"
                  onClick={() => setIsPaymentModalOpen(false)}
                >
                  Close
                </Button>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
