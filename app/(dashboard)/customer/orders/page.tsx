"use client";

export default function CustomerOrdersPage() {
  return (
    <div className="space-y-6 py-4">
      <div className="border border-neutral-300 bg-neutral-50/50 p-6 backdrop-blur-md dark:border-neutral-700 dark:bg-neutral-900/40">
        <h1 className="font-sans text-xl font-bold tracking-tight text-foreground md:text-2xl">My Orders</h1>
        <p className="mt-2 font-mono text-xs text-neutral-500 dark:text-neutral-400">
          Viewing development milestones, source repositories, and finalized deliverables for active agreements.
        </p>
      </div>
      <div className="border border-neutral-300 border-dashed p-12 text-center dark:border-neutral-800">
        <span className="font-mono text-xs text-neutral-400">No active invoices or orders under construction.</span>
      </div>
    </div>
  );
}
