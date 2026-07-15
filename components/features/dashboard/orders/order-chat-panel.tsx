"use client";

import { useRef } from "react";
import { Send, Paperclip, Download, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { OrderDetailBrackets } from "@/components/features/dashboard/orders/order-detail-shared";

export interface ChatMessage {
  id: number;
  senderRole: string;
  senderName: string;
  message: string;
  createdAt: string;
  attachmentUrl?: string | null;
  attachmentName?: string | null;
}

const isImageFile = (url?: string | null, name?: string | null) => {
  if (!url) return false;
  const target = (name || url).toLowerCase();
  return (
    target.endsWith(".png") ||
    target.endsWith(".jpg") ||
    target.endsWith(".jpeg") ||
    target.endsWith(".webp") ||
    target.endsWith(".gif") ||
    target.endsWith(".svg")
  );
};

interface OrderChatPanelProps {
  messages: ChatMessage[];
  isLoading: boolean;
  isUploading: boolean;
  messageText: string;
  onMessageTextChange: (value: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  chatBottomRef: React.RefObject<HTMLDivElement | null>;
  viewerRole: "admin" | "client";
  placeholder?: string;
  locked?: boolean;
  lockedMessage?: string;
  className?: string;
}

export function OrderChatPanel({
  messages,
  isLoading,
  isUploading,
  messageText,
  onMessageTextChange,
  onSendMessage,
  onFileUpload,
  chatBottomRef,
  viewerRole,
  placeholder = "Type a message...",
  locked = false,
  lockedMessage,
  className,
}: OrderChatPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={cn("relative flex min-h-0 flex-1 flex-col border border-neutral-300 bg-background dark:border-neutral-700", className)}>
      <OrderDetailBrackets />

      <div className="flex min-h-0 flex-1 flex-col space-y-4 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="size-5 animate-spin text-neutral-400" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <p className="font-mono text-xs text-neutral-400">No messages yet. Start the conversation below.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isSystem = msg.senderRole === "system";
            const isAdmin = msg.senderRole === "admin";
            const isOwnMessage = viewerRole === "admin" ? isAdmin : msg.senderRole === "client";

            if (isSystem) {
              return (
                <div
                  key={msg.id}
                  className="mx-auto max-w-md border border-neutral-200 bg-neutral-50 px-4 py-3 text-center dark:border-neutral-800 dark:bg-neutral-900/30"
                >
                  <p className="font-mono text-[10px] leading-relaxed text-neutral-600 dark:text-neutral-400">{msg.message}</p>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={cn(
                  "flex max-w-[85%] flex-col border p-3.5 transition-all duration-200",
                  isOwnMessage
                    ? "self-end border-neutral-300 bg-neutral-100/70 dark:border-neutral-800 dark:bg-neutral-900/50"
                    : "self-start border-purple-200 bg-purple-50/40 dark:border-purple-900/30 dark:bg-purple-950/10"
                )}
              >
                <div className="flex items-center justify-between gap-6 font-mono text-[9px] text-neutral-400">
                  <span className="font-bold tracking-wider text-neutral-500 uppercase">
                    {msg.senderName} ({isAdmin ? "Admin" : "Client"})
                  </span>
                  <span>{msg.createdAt.split(" ")[1] || msg.createdAt.split("T")[1]?.slice(0, 5) || msg.createdAt}</span>
                </div>
                <div className="mt-2 font-sans text-xs leading-relaxed whitespace-pre-wrap text-foreground">{msg.message}</div>

                {msg.attachmentUrl &&
                  (isImageFile(msg.attachmentUrl, msg.attachmentName) ? (
                    <div className="border-neutral-250 mt-3 max-w-[280px] overflow-hidden border bg-background dark:border-neutral-800">
                      <a
                        href={msg.attachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative block aspect-video w-full bg-neutral-100 dark:bg-neutral-900"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={msg.attachmentUrl} alt={msg.attachmentName || "attachment"} className="h-full w-full object-cover" />
                      </a>
                      <div className="flex items-center justify-between border-t border-neutral-200 bg-neutral-50/50 px-2 py-1.5 dark:border-neutral-800 dark:bg-neutral-950/20">
                        <span className="max-w-[200px] truncate font-mono text-[9px] text-neutral-500">{msg.attachmentName}</span>
                        <a href={msg.attachmentUrl} download className="text-neutral-500 hover:text-foreground">
                          <Download className="size-3" />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 flex items-center justify-between border border-dashed border-neutral-300 bg-background p-2 dark:border-neutral-700">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <Paperclip className="size-3.5 shrink-0 text-neutral-400" />
                        <span className="truncate font-mono text-[10px] text-neutral-500">{msg.attachmentName || "attachment"}</span>
                      </div>
                      <a
                        href={msg.attachmentUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex size-7 items-center justify-center border border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                      >
                        <Download className="size-3.5 text-neutral-500" />
                      </a>
                    </div>
                  ))}
              </div>
            );
          })
        )}
        <div ref={chatBottomRef} />
      </div>

      {isUploading && (
        <div className="flex items-center gap-2 border-t border-neutral-200 bg-neutral-50/50 px-4 py-2 dark:border-neutral-800">
          <Loader2 className="size-3.5 animate-spin text-neutral-400" />
          <span className="font-mono text-[10px] text-neutral-400 uppercase">Uploading attachment...</span>
        </div>
      )}

      {locked ? (
        <div className="border-t border-neutral-200 bg-neutral-50/50 p-4 text-center dark:border-neutral-800 dark:bg-neutral-900/10">
          <p className="font-mono text-[10px] leading-relaxed tracking-widest text-neutral-500 uppercase">
            {lockedMessage || "Chat is locked until payment is verified."}
          </p>
        </div>
      ) : (
        <form onSubmit={onSendMessage} className="flex items-center gap-2 border-t border-neutral-200 p-3 dark:border-neutral-800">
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileUpload}
            className="hidden"
            accept=".pdf,.zip,.png,.jpg,.jpeg,.json,.docx,.txt"
            disabled={isUploading}
          />
          <Button
            type="button"
            variant="outline"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="size-9 rounded-none border-dashed border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700"
          >
            <Paperclip className="size-4 text-neutral-500" />
          </Button>
          <input
            type="text"
            value={messageText}
            onChange={(e) => onMessageTextChange(e.target.value)}
            placeholder={placeholder}
            className="h-9 flex-1 border border-dashed border-neutral-300 bg-background/50 px-3 font-mono text-xs outline-none focus-visible:border-solid focus-visible:border-neutral-900 focus-visible:ring-0 dark:border-neutral-700 dark:focus-visible:border-neutral-100"
            disabled={isUploading}
          />
          <Button
            type="submit"
            disabled={!messageText.trim() || isUploading}
            className="size-9 rounded-none bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200"
          >
            <Send className="size-3.5 text-white dark:text-neutral-900" />
          </Button>
        </form>
      )}
    </div>
  );
}
