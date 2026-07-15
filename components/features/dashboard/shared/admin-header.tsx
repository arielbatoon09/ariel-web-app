"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function AdminHeader() {
  const pathname = usePathname();
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format page path to breadcrumbs
  const pathParts = pathname.split("/").filter(Boolean);

  const isEditorOrOrdersPage =
    (pathParts[1] === "works" && pathParts.length > 2) || (pathParts[1] === "articles" && pathParts.length > 2) || pathParts[1] === "order";

  if (isEditorOrOrdersPage) return null;

  const breadcrumbs = pathParts
    .map((part) => {
      if (part === "admin") return "CONTROL PANEL";
      if (part === "customer") return "CLIENT PORTAL";
      return part.replace(/-/g, " ");
    })
    .join(" / ")
    .toUpperCase();

  return (
    <header className="relative flex flex-col justify-between gap-4 border-b border-neutral-300 bg-background/80 py-4.5 backdrop-blur-md md:flex-row md:items-center dark:border-neutral-700">
      {/* Dynamic Intersection Plus Markers */}
      <div className="pointer-events-none absolute bottom-0 left-0 z-10 -translate-x-1/2 translate-y-1/2 bg-background px-1 text-[10px] text-neutral-300 select-none dark:text-neutral-700">
        +
      </div>
      <div className="pointer-events-none absolute right-0 bottom-0 z-10 translate-x-1/2 translate-y-1/2 bg-background px-1 text-[10px] text-neutral-300 select-none dark:text-neutral-700">
        +
      </div>

      <div className="space-y-2.5">
        <span className="font-mono text-[10px] tracking-[0.2em] text-neutral-400 uppercase dark:text-neutral-500">
          {breadcrumbs || "CONTROL PANEL"}
        </span>
        <h2 className="font-sans text-lg font-bold tracking-tight text-foreground">System Console</h2>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {/* Dynamic local clock */}
        {time && (
          <div className="dark:text-neutral-450 flex items-center gap-2 border border-neutral-300 bg-neutral-50 px-3 py-1.5 font-mono text-[10px] text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900/60">
            <span className="bg-neutral-450 size-1.5 rounded-full dark:bg-neutral-500" />
            <span>CEBU: {time}</span>
          </div>
        )}

        {/* Operational Status Badging */}
        <div className="text-green-650 dark:text-green-405 flex items-center gap-1.5 border border-green-300 bg-green-50/20 px-3 py-1.5 font-mono text-[10px] dark:border-green-900/40 dark:bg-green-950/15">
          <span className="size-1.5 rounded-full bg-green-500" />
          <span>STATUS: ONLINE</span>
        </div>
      </div>
    </header>
  );
}
