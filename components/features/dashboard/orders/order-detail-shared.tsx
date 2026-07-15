"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardCopy,
  Clock,
  Copy,
  FileText,
  Info,
  Loader2,
  Maximize2,
  RefreshCw,
  X,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { Order, Service } from "@/schemas/dashboard";

const COLLAPSE_CHAR_THRESHOLD = 320;

export const ORDER_WORKFLOW_STEPS = [
  { key: "pending", label: "Pending Verification", hint: "Payment & order review" },
  { key: "in-progress", label: "In Progress", hint: "Active development" },
  { key: "delivered", label: "Delivered", hint: "Awaiting your review" },
  { key: "completed", label: "Completed", hint: "Project finalized" },
] as const;

export function getTimelineStepStatus(stepIndex: number, currentStatus: Order["status"]) {
  const statuses = ["pending", "in-progress", "delivered", "completed"];
  const normalized = currentStatus === "revision_requested" ? "in-progress" : currentStatus;

  if (normalized === "completed") return "completed";

  const currentIdx = statuses.indexOf(normalized);

  if (currentIdx > stepIndex) return "completed";
  if (currentIdx === stepIndex) return "active";
  return "upcoming";
}

export function formatOrderDate(dateStr: string) {
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function OrderDetailBrackets({ accent = "neutral" }: { accent?: "neutral" | "purple" | "green" }) {
  const borderClass =
    accent === "purple"
      ? "border-purple-500 dark:border-purple-400"
      : accent === "green"
        ? "border-green-500 dark:border-green-400"
        : "border-neutral-400 dark:border-neutral-500";

  return (
    <>
      <div className={cn("pointer-events-none absolute -top-px -left-px z-10 size-2.5 border-t-2 border-l-2", borderClass)} />
      <div className={cn("pointer-events-none absolute -top-px -right-px z-10 size-2.5 border-t-2 border-r-2", borderClass)} />
      <div className={cn("pointer-events-none absolute -bottom-px -left-px z-10 size-2.5 border-b-2 border-l-2", borderClass)} />
      <div className={cn("pointer-events-none absolute -right-px -bottom-px z-10 size-2.5 border-r-2 border-b-2", borderClass)} />
    </>
  );
}

export function OrderStatusBadge({ status }: { status: Order["status"] }) {
  switch (status) {
    case "pending":
      return (
        <span className="inline-flex items-center gap-1.5 border border-amber-400/60 bg-amber-50/80 px-2 py-0.5 font-mono text-[10px] text-amber-600 uppercase dark:border-amber-500/40 dark:bg-amber-950/30 dark:text-amber-400">
          <Clock className="size-3" /> Pending Verification
        </span>
      );
    case "in-progress":
      return (
        <span className="inline-flex items-center gap-1.5 border border-blue-400/60 bg-blue-50/80 px-2 py-0.5 font-mono text-[10px] text-blue-600 uppercase dark:border-blue-500/40 dark:bg-blue-950/30 dark:text-blue-400">
          <Loader2 className="size-3 animate-spin" /> In Progress
        </span>
      );
    case "revision_requested":
      return (
        <span className="inline-flex items-center gap-1.5 border border-rose-400/60 bg-rose-50/80 px-2 py-0.5 font-mono text-[10px] text-rose-600 uppercase dark:border-rose-500/40 dark:bg-rose-950/30 dark:text-rose-400">
          <AlertCircle className="size-3" /> Revision Requested
        </span>
      );
    case "delivered":
      return (
        <span className="inline-flex items-center gap-1.5 border border-green-500/60 bg-green-50/80 px-2 py-0.5 font-mono text-[10px] font-bold text-green-600 uppercase dark:border-green-500/40 dark:bg-green-950/30 dark:text-green-400">
          <AlertCircle className="size-3" /> Delivered — Action Required
        </span>
      );
    case "completed":
      return (
        <span className="inline-flex items-center gap-1.5 border border-green-500/60 bg-green-50/80 px-2 py-0.5 font-mono text-[10px] text-green-600 uppercase dark:border-green-500/40 dark:bg-green-950/30 dark:text-green-400">
          <CheckCircle2 className="size-3" /> Completed
        </span>
      );
    case "cancelled":
      return (
        <span className="inline-flex items-center gap-1.5 border border-neutral-400/60 bg-neutral-100 px-2 py-0.5 font-mono text-[10px] text-neutral-500 uppercase dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-400">
          Cancelled
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 border border-neutral-300 px-2 py-0.5 font-mono text-[10px] text-neutral-500 uppercase">
          {status}
        </span>
      );
  }
}

export function OrderHorizontalTimeline({ status, embedded = false }: { status: Order["status"]; embedded?: boolean }) {
  return (
    <div className={cn("relative bg-background", embedded ? "p-0" : "border border-neutral-300 p-4 md:p-5 dark:border-neutral-700")}>
      {!embedded && <OrderDetailBrackets />}
      {!embedded && <p className="text-neutral-450 font-mono text-[9px] tracking-widest uppercase">Order Progress</p>}
      <div className={cn("overflow-x-auto pb-1", !embedded && "mt-4")}>
        <div className="flex min-w-[520px] items-start justify-between gap-2">
          {ORDER_WORKFLOW_STEPS.map((step, index) => {
            const stepStatus = getTimelineStepStatus(index, status);
            const isLast = index === ORDER_WORKFLOW_STEPS.length - 1;

            return (
              <div key={step.key} className="relative flex flex-1 flex-col items-center text-center">
                {!isLast && (
                  <div
                    className={cn(
                      "absolute top-3.5 left-[calc(50%+14px)] h-0.5 w-[calc(100%-28px)]",
                      stepStatus === "completed" ? "bg-green-500/70" : "bg-neutral-200 dark:bg-neutral-800"
                    )}
                  />
                )}
                <div
                  className={cn(
                    "relative z-10 flex size-7 items-center justify-center border bg-background font-mono text-[10px] transition-all",
                    stepStatus === "completed" && "border-green-600 text-green-600",
                    stepStatus === "active" && "border-foreground font-bold text-foreground",
                    stepStatus === "upcoming" && "border-neutral-300 text-neutral-400 dark:border-neutral-700"
                  )}
                >
                  {stepStatus === "completed" ? (
                    <CheckCircle2 className="size-3.5" />
                  ) : stepStatus === "active" && step.key === "in-progress" ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    String(index + 1).padStart(2, "0")
                  )}
                </div>
                <p
                  className={cn(
                    "mt-2 font-sans text-[11px] leading-tight font-bold",
                    stepStatus === "active" ? "text-foreground" : "text-neutral-500"
                  )}
                >
                  {step.label}
                </p>
                <p className="text-neutral-450 mt-0.5 font-mono text-[8px] uppercase">{step.hint}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function OrderWorkflowPipeline({ status }: { status: Order["status"] }) {
  return (
    <div className="relative border border-neutral-300 bg-background p-6 dark:border-neutral-700">
      <OrderDetailBrackets />
      <h3 className="border-b border-neutral-200 pb-3 font-sans text-xs font-bold tracking-widest text-foreground uppercase dark:border-neutral-800">
        Workflow Pipeline
      </h3>
      <div className="relative mt-5 flex flex-col gap-6 pl-1.5">
        <div className="absolute top-2.5 bottom-2.5 left-[13.5px] w-0.5 bg-neutral-200 dark:bg-neutral-800" />

        {ORDER_WORKFLOW_STEPS.map((step, index) => {
          const stepStatus = getTimelineStepStatus(index, status);
          const activeColors = ["amber", "blue", "purple", "green"] as const;
          const activeColor = activeColors[index];

          return (
            <div key={step.key} className="relative z-10 flex items-start gap-3">
              <div
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full border bg-background font-mono text-[10px] transition-all duration-300",
                  stepStatus === "completed" && "border-green-600 bg-green-50/50 text-green-600 dark:bg-green-950/10",
                  stepStatus === "active" && activeColor === "amber" && "border-amber-500 font-bold text-amber-500",
                  stepStatus === "active" && activeColor === "blue" && "border-blue-500 font-bold text-blue-500",
                  stepStatus === "active" && activeColor === "purple" && "border-purple-500 font-bold text-purple-500",
                  stepStatus === "active" && activeColor === "green" && "border-green-650 text-green-650 bg-green-50 dark:bg-green-950/20",
                  stepStatus === "upcoming" && "border-neutral-250 text-neutral-400"
                )}
              >
                {stepStatus === "completed" ? (
                  <CheckCircle2 className="size-3.5" />
                ) : stepStatus === "active" && step.key === "in-progress" ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  String(index + 1).padStart(2, "0")
                )}
              </div>
              <div>
                <p className="font-sans text-xs font-bold text-foreground">{step.label}</p>
                <p className="text-neutral-450 font-mono text-[9px]">{step.hint}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface OrderRequirementsBriefProps {
  requirements?: string | null;
  className?: string;
  /** When true, renders only the inner content (for use inside dialogs). */
  embedded?: boolean;
}

export function OrderRequirementsBrief({ requirements, className, embedded = false }: OrderRequirementsBriefProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const content = requirements?.trim() || "";
  const isEmpty = !content;
  const isLong = content.length > COLLAPSE_CHAR_THRESHOLD;
  const lineCount = useMemo(() => (content ? content.split("\n").length : 0), [content]);
  const wordCount = useMemo(() => (content ? content.trim().split(/\s+/).length : 0), [content]);

  const handleCopy = async () => {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const briefContent = (
    <>
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center gap-2 border border-dashed border-neutral-300 py-8 text-center dark:border-neutral-700">
          <FileText className="text-neutral-350 size-5" />
          <p className="text-neutral-450 font-mono text-[10px] uppercase">No requirements provided</p>
          <p className="max-w-sm font-sans text-xs text-neutral-500">
            No written brief was submitted at checkout. Use the project chat to gather scope details.
          </p>
        </div>
      ) : (
        <>
          <div
            className={cn(
              "relative overflow-y-auto border border-dashed border-neutral-300 bg-neutral-50/50 p-4 dark:border-neutral-700 dark:bg-neutral-900/20",
              embedded ? "max-h-[50vh]" : !isExpanded && isLong ? "max-h-40" : "max-h-72"
            )}
          >
            <p className="font-sans text-xs leading-relaxed whitespace-pre-wrap text-foreground">{content}</p>
            {!embedded && !isExpanded && isLong && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-neutral-50 to-transparent dark:from-neutral-900/80" />
            )}
          </div>
          {!embedded && isLong && (
            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="mt-3 inline-flex items-center gap-1 font-mono text-[10px] tracking-wider text-neutral-500 uppercase hover:text-foreground"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="size-3" /> Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="size-3" /> Show More
                </>
              )}
            </button>
          )}
        </>
      )}
    </>
  );

  if (embedded) {
    return (
      <>
        {!isEmpty && (
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="text-neutral-450 font-mono text-[9px] uppercase">
              {wordCount} words · {lineCount} lines
            </span>
            <Button
              type="button"
              variant="outline"
              onClick={handleCopy}
              className="h-7 rounded-none border-dashed px-2 font-mono text-[9px] uppercase"
            >
              {copied ? (
                <>
                  <ClipboardCopy className="mr-1 size-3" /> Copied
                </>
              ) : (
                <>
                  <Copy className="mr-1 size-3" /> Copy
                </>
              )}
            </Button>
          </div>
        )}
        {briefContent}
      </>
    );
  }

  return (
    <>
      <div className={cn("relative border border-neutral-300 bg-background dark:border-neutral-700", className)}>
        <OrderDetailBrackets />
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-neutral-200 p-4 md:p-5 dark:border-neutral-800">
          <div className="flex items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center border border-dashed border-neutral-300 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900/40">
              <FileText className="size-3.5 text-neutral-500" />
            </div>
            <div>
              <h3 className="font-sans text-sm font-bold text-foreground">Initial Requirements</h3>
              <p className="text-neutral-450 font-mono text-[10px] uppercase">Project brief submitted at checkout</p>
            </div>
          </div>
          {!isEmpty && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-neutral-450 font-mono text-[9px] uppercase">
                {wordCount} words · {lineCount} lines
              </span>
              <Button
                type="button"
                variant="outline"
                onClick={handleCopy}
                className="h-7 rounded-none border-dashed px-2 font-mono text-[9px] uppercase"
              >
                {copied ? (
                  <>
                    <ClipboardCopy className="mr-1 size-3" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-1 size-3" /> Copy
                  </>
                )}
              </Button>
              {isLong && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(true)}
                  className="h-7 rounded-none border-dashed px-2 font-mono text-[9px] uppercase"
                >
                  <Maximize2 className="mr-1 size-3" /> Full Brief
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="p-4 md:p-5">{briefContent}</div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[85vh] overflow-hidden rounded-none border border-neutral-300 bg-background/95 p-0 font-mono text-xs backdrop-blur-md sm:max-w-2xl dark:border-neutral-700">
          <OrderDetailBrackets />
          <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
            <DialogHeader className="space-y-1 text-left">
              <DialogTitle className="font-sans text-base font-bold text-foreground">Full Project Brief</DialogTitle>
              <DialogDescription className="text-neutral-450 text-[10px] uppercase">Initial requirements · {wordCount} words</DialogDescription>
            </DialogHeader>
            <button type="button" onClick={() => setIsDialogOpen(false)} className="text-neutral-400 hover:text-foreground" aria-label="Close">
              <X className="size-4" />
            </button>
          </div>
          <div className="max-h-[calc(85vh-120px)] overflow-y-auto px-6 py-4">
            <p className="font-sans text-sm leading-relaxed whitespace-pre-wrap text-foreground">{content}</p>
          </div>
          <div className="flex justify-end gap-2 border-t border-dashed border-neutral-200 px-6 py-4 dark:border-neutral-800">
            <Button type="button" variant="outline" onClick={handleCopy} className="h-8 rounded-none border-dashed font-mono text-[10px] uppercase">
              {copied ? "Copied" : "Copy Brief"}
            </Button>
            <Button
              type="button"
              onClick={() => setIsDialogOpen(false)}
              className="h-8 rounded-none bg-neutral-900 font-mono text-[10px] text-white uppercase dark:bg-neutral-100 dark:text-neutral-900"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface OrderAgreementInfoProps {
  order: Order;
  variant: "admin" | "customer";
  service?: Service | null;
  paymentMethod?: string | null;
}

export function OrderAgreementInfo({ order, variant, service, paymentMethod }: OrderAgreementInfoProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2 font-mono text-xs">
        <span className="text-neutral-450 uppercase">Package Price:</span>
        <span className="col-span-2 font-sans font-bold text-foreground">₱{order.totalAmount.toLocaleString()}</span>
      </div>
      <div className="grid grid-cols-3 gap-2 font-mono text-xs">
        <span className="text-neutral-450 uppercase">Order Date:</span>
        <span className="col-span-2 font-sans font-bold text-foreground">{formatOrderDate(order.createdAt)}</span>
      </div>
      <div className="grid grid-cols-3 gap-2 font-mono text-xs">
        <span className="text-neutral-450 uppercase">Reference:</span>
        <span className="col-span-2">
          <code className="border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 text-[10px] dark:border-neutral-800 dark:bg-neutral-900">
            {order.referenceNumber || order.id}
          </code>
        </span>
      </div>
      {variant === "admin" ? (
        <div className="grid grid-cols-3 gap-2 font-mono text-xs">
          <span className="text-neutral-450 uppercase">Client:</span>
          <span className="col-span-2 font-sans font-bold text-foreground">
            {order.customerName}
            <span className="mt-0.5 block text-[11px] font-normal text-neutral-500">{order.customerEmail}</span>
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2 font-mono text-xs">
          <span className="text-neutral-450 uppercase">Payment:</span>
          <span className="col-span-2 font-sans font-bold text-foreground uppercase">{paymentMethod || "Manual GCash / Maya"}</span>
        </div>
      )}
      {order.addOnsSelected.length > 0 && (
        <div className="border-t border-dashed border-neutral-200 pt-4 dark:border-neutral-800">
          <span className="text-neutral-450 font-mono text-[9px] uppercase">Add-ons Selected</span>
          <ul className="mt-2 space-y-1">
            {order.addOnsSelected.map((addonId) => {
              const addon = service?.addOns.find((a) => a.id === addonId);
              return (
                <li key={addonId} className="flex justify-between font-mono text-[10px] text-neutral-600 dark:text-neutral-400">
                  <span>• {addon?.name || addonId}</span>
                  {addon && <span>+₱{addon.price.toLocaleString()}</span>}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

interface OrderCompactBarProps {
  order: Order;
  serviceName: string;
  backHref: string;
  backLabel: string;
  onRefresh: () => void;
  onOpenDetails: () => void;
  actions?: React.ReactNode;
}

export function OrderCompactBar({ order, serviceName, backHref, backLabel, onRefresh, onOpenDetails, actions }: OrderCompactBarProps) {
  return (
    <div className="relative shrink-0 border border-neutral-300 bg-neutral-50/50 px-3 py-2.5 backdrop-blur-md md:px-4 dark:border-neutral-700 dark:bg-neutral-900/40">
      <OrderDetailBrackets />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2 md:gap-3">
          <Link
            href={backHref}
            title={backLabel}
            className="flex size-8 shrink-0 items-center justify-center border border-dashed border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900/60"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate font-sans text-sm font-bold text-foreground md:text-base">{serviceName}</h1>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="text-neutral-450 truncate font-mono text-[10px]">
              REF #{order.referenceNumber || order.id} · ₱{order.totalAmount.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex size-8 items-center justify-center border border-dashed border-neutral-300 text-neutral-500 hover:text-foreground dark:border-neutral-700"
            title="Sync chat"
          >
            <RefreshCw className="size-3.5" />
          </button>
          <Button
            type="button"
            variant="outline"
            onClick={onOpenDetails}
            className="h-8 rounded-none border-dashed px-2.5 font-mono text-[10px] uppercase md:px-3"
          >
            <Info className="mr-1 size-3" />
            <span className="hidden sm:inline">Order Info</span>
            <span className="sm:hidden">Info</span>
          </Button>
          {actions}
        </div>
      </div>
    </div>
  );
}

interface OrderDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order;
  service?: Service | null;
  variant: "admin" | "customer";
  paymentMethod?: string | null;
}

export function OrderDetailsDialog({ open, onOpenChange, order, service, variant, paymentMethod }: OrderDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-hidden rounded-none border border-neutral-300 bg-background/95 p-0 font-mono text-xs backdrop-blur-md sm:max-w-lg dark:border-neutral-700">
        <OrderDetailBrackets />
        <div className="border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="font-sans text-base font-bold text-foreground">Order Information</DialogTitle>
            <DialogDescription className="text-neutral-450 text-[10px] uppercase">Progress, details, and project brief</DialogDescription>
          </DialogHeader>
        </div>

        <div className="max-h-[calc(90vh-140px)] space-y-6 overflow-y-auto px-6 py-5">
          <section>
            <h4 className="mb-3 font-sans text-xs font-bold tracking-widest text-foreground uppercase">Progress</h4>
            <OrderHorizontalTimeline status={order.status} embedded />
          </section>

          <section>
            <h4 className="mb-3 font-sans text-xs font-bold tracking-widest text-foreground uppercase">Order Details</h4>
            <OrderAgreementInfo order={order} variant={variant} service={service} paymentMethod={paymentMethod} />
          </section>

          <section>
            <h4 className="mb-3 font-sans text-xs font-bold tracking-widest text-foreground uppercase">Initial Requirements</h4>
            <OrderRequirementsBrief requirements={order.requirements} embedded />
          </section>
        </div>

        <div className="flex justify-end border-t border-dashed border-neutral-200 px-6 py-4 dark:border-neutral-800">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-8 rounded-none bg-neutral-900 font-mono text-[10px] text-white uppercase dark:bg-neutral-100 dark:text-neutral-900"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
