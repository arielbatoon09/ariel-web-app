interface CustomerOverviewHeaderProps {
  displayName: string;
}

export function CustomerOverviewHeader({ displayName }: CustomerOverviewHeaderProps) {
  return (
    <div className="relative overflow-hidden border border-neutral-300 bg-neutral-50/50 p-6 backdrop-blur-md dark:border-neutral-700 dark:bg-neutral-900/40">
      <div className="pointer-events-none absolute top-0 right-0 p-2 font-mono text-[9px] text-neutral-300 dark:text-neutral-700">SYS_SEC_OK</div>
      <div className="max-w-2xl space-y-2">
        <span className="font-mono text-[10px] tracking-widest text-neutral-450 uppercase">Active Session</span>
        <h1 className="font-sans text-xl font-bold tracking-tight text-foreground md:text-2xl">
          Welcome, {displayName}
        </h1>
        <p className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
          Authorized client dashboard. Monitor development streams, view active order statuses, and access your delivery files.
        </p>
      </div>
    </div>
  );
}
