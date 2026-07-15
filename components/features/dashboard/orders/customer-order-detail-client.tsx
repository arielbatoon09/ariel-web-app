"use client";

import { useState, useRef, useEffect } from "react";
import { useOrderDetailQuery } from "@/hooks/use-orders";
import { useServicesQuery } from "@/hooks/use-services";
import {
  useOrderChatQuery,
  useSendOrderMessageMutation,
  useApproveOrderDeliveryMutation,
  useRequestOrderRevisionMutation,
} from "@/hooks/use-order-chat";
import { getChatAttachmentPresignedUrlAction } from "@/services/media";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Order, Service } from "@/schemas/dashboard";
import { OrderCompactBar, OrderDetailBrackets, OrderDetailsDialog } from "@/components/features/dashboard/orders/order-detail-shared";
import { OrderChatPanel } from "@/components/features/dashboard/orders/order-chat-panel";
import { ConfirmDialog } from "@/components/common/confirm-dialog";

interface CustomerOrderDetailClientProps {
  orderIdStr: string;
  initialOrder: Order;
  initialServices: Service[];
}

export function CustomerOrderDetailClient({ orderIdStr, initialOrder, initialServices }: CustomerOrderDetailClientProps) {
  const orderId = orderIdStr;

  const { data, error: orderError } = useOrderDetailQuery(orderIdStr);
  const order = data?.order || initialOrder;
  const transaction = data?.transaction || null;
  const { data: services = initialServices } = useServicesQuery();
  const { data: messages = [], isLoading: isChatLoading, refetch: refetchChat } = useOrderChatQuery(orderId);

  const sendMessageMutation = useSendOrderMessageMutation(orderId);
  const approveDeliveryMutation = useApproveOrderDeliveryMutation(orderId);
  const requestRevisionMutation = useRequestOrderRevisionMutation(orderId);

  const [messageText, setMessageText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [revisionFeedback, setRevisionFeedback] = useState("");
  const [isRevisionOpen, setIsRevisionOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isApproveConfirmOpen, setIsApproveConfirmOpen] = useState(false);

  const chatBottomRef = useRef<HTMLDivElement>(null);

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const res = await getChatAttachmentPresignedUrlAction(file.name, file.type, orderId);
      if (!res.success || !res.presignedUrl || !res.url) {
        throw new Error(res.error || "Failed to generate upload URL.");
      }

      const uploadRes = await fetch(res.presignedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!uploadRes.ok) throw new Error("Failed to upload file to storage server.");

      await sendMessageMutation.mutateAsync({
        message: `📎 Sent an attachment: ${file.name}`,
        attachment: { url: res.url, name: file.name },
      });
    } catch (err: unknown) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Failed to upload file.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleApproveDelivery = () => {
    setIsApproveConfirmOpen(true);
  };

  const handleSubmitRevision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionFeedback.trim()) return;
    await requestRevisionMutation.mutateAsync(revisionFeedback);
    setRevisionFeedback("");
    setIsRevisionOpen(false);
  };

  if (orderError) {
    return (
      <div className="space-y-6 py-4">
        <div className="border border-red-300 bg-red-50/50 p-6 dark:border-red-900/50 dark:bg-red-950/20">
          <p className="font-mono text-xs text-red-500">ERROR: {orderError.message || "Access denied or order not found."}</p>
        </div>
      </div>
    );
  }

  const deliveryActions =
    order.status === "delivered" ? (
      <>
        <Button
          variant="outline"
          className="h-8 rounded-none border-dashed border-rose-400 font-mono text-[10px] text-rose-500 uppercase hover:bg-rose-50 dark:border-rose-800"
          onClick={() => setIsRevisionOpen(true)}
        >
          Revise
        </Button>
        <Button
          className="h-8 rounded-none bg-green-600 font-mono text-[10px] text-white uppercase hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
          onClick={handleApproveDelivery}
        >
          Approve
        </Button>
      </>
    ) : null;

  return (
    <div className="flex h-[calc(100dvh-7rem)] flex-col gap-3 py-4 pb-2 md:h-[calc(100dvh-6rem)]">
      <OrderCompactBar
        order={order}
        serviceName={getServiceName(order.serviceId)}
        backHref="/customer/orders"
        backLabel="Back to Agreements"
        onRefresh={() => refetchChat()}
        onOpenDetails={() => setIsDetailsOpen(true)}
        actions={deliveryActions}
      />

      {order.status === "delivered" && (
        <div className="relative shrink-0 border border-green-500 bg-green-50/10 px-4 py-2.5 dark:border-green-500 dark:bg-green-950/10">
          <OrderDetailBrackets accent="green" />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="size-3.5 shrink-0 text-green-600 dark:text-green-400" />
              <p className="font-mono text-[10px] text-neutral-600 uppercase dark:text-neutral-400">
                Deliverables ready — review in chat, then approve or request revisions
              </p>
            </div>
          </div>
        </div>
      )}

      <OrderChatPanel
        messages={messages}
        isLoading={isChatLoading}
        isUploading={isUploading}
        messageText={messageText}
        onMessageTextChange={setMessageText}
        onSendMessage={handleSendMessage}
        onFileUpload={handleFileUpload}
        chatBottomRef={chatBottomRef}
        viewerRole="client"
        placeholder="Post an update or query..."
        locked={order.status === "pending" || order.status === "completed" || order.status === "cancelled"}
        lockedMessage={
          order.status === "completed"
            ? "The order is officially completed. Thank you! Contact info.arielbatoon@gmail.com if you have any questions."
            : order.status === "cancelled"
              ? "This order has been cancelled."
              : "Chat unlocks once your payment reference is verified by our engineer."
        }
      />

      <OrderDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        order={order}
        service={matchedService}
        variant="customer"
        paymentMethod={transaction?.paymentMethod}
      />

      <ConfirmDialog
        open={isApproveConfirmOpen}
        onOpenChange={setIsApproveConfirmOpen}
        title="Approve Project Delivery"
        description="Are you sure you want to approve this delivery? The project status will be marked as Completed and finalized."
        confirmText="Approve"
        cancelText="Cancel"
        onConfirm={async () => {
          setIsApproveConfirmOpen(false);
          await approveDeliveryMutation.mutateAsync();
        }}
      />

      {isRevisionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-sm">
          <div className="relative w-full max-w-md border border-neutral-300 bg-background p-6 shadow-2xl dark:border-neutral-700">
            <OrderDetailBrackets />
            <h3 className="font-sans text-base font-bold text-foreground">Request Project Revision</h3>
            <p className="mt-2 font-mono text-[10px] text-neutral-500 uppercase">Provide feedback for required changes</p>

            <form onSubmit={handleSubmitRevision} className="mt-4 space-y-4">
              <textarea
                value={revisionFeedback}
                onChange={(e) => setRevisionFeedback(e.target.value)}
                placeholder="Detail what updates, adjustments, or fixes are required..."
                className="min-h-[120px] w-full border border-dashed border-neutral-300 p-3 font-mono text-xs outline-none focus-visible:border-solid focus-visible:border-neutral-900 dark:border-neutral-700"
                required
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-none font-mono text-[10px] uppercase"
                  onClick={() => {
                    setIsRevisionOpen(false);
                    setRevisionFeedback("");
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="rounded-none bg-rose-600 font-mono text-[10px] text-white uppercase hover:bg-rose-700">
                  Submit Request
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
