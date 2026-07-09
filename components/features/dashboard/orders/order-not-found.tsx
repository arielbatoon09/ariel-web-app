import Link from "next/link";
import { ArrowLeft, FileX2 } from "lucide-react";
import { OrderDetailBrackets } from "@/components/features/dashboard/orders/order-detail-shared";

interface OrderNotFoundProps {
  backHref: string;
  backLabel: string;
}

export function OrderNotFound({ backHref, backLabel }: OrderNotFoundProps) {
  return (
    <div className="relative border border-neutral-300 bg-neutral-50/50 py-16 text-center backdrop-blur-md dark:border-neutral-700 dark:bg-neutral-900/40">
      <OrderDetailBrackets />
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-6">
        <div className="flex size-12 items-center justify-center border border-dashed border-neutral-300 dark:border-neutral-700">
          <FileX2 className="size-5 text-neutral-400" />
        </div>
        <div className="space-y-1">
          <p className="font-sans text-base font-bold text-foreground">Order Not Found</p>
          <p className="font-mono text-[10px] text-red-500 uppercase">Access denied or invalid reference</p>
        </div>
        <p className="font-sans text-xs text-neutral-500">
          This order may not exist, or you may not have permission to view it.
        </p>
        <Link
          href={backHref}
          className="inline-flex h-9 items-center gap-1.5 border border-dashed border-neutral-300 px-4 font-mono text-[10px] uppercase tracking-wider text-neutral-500 hover:border-neutral-500 hover:text-foreground dark:border-neutral-700"
        >
          <ArrowLeft className="size-3.5" /> {backLabel}
        </Link>
      </div>
    </div>
  );
}
