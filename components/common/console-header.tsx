"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConsoleHeaderProps {
  title: string;
  description: string;
  actionButton?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    disabled?: boolean;
  };
  className?: string;
}

export function ConsoleHeader({ title, description, actionButton, className }: ConsoleHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", className)}>
      <div className="space-y-1">
        <h1 className="font-sans text-xl font-bold tracking-tight text-foreground md:text-2xl">{title}</h1>
        <p className="font-mono text-xs tracking-wide text-neutral-400 uppercase dark:text-neutral-500">{description}</p>
      </div>
      {actionButton && (
        <Button
          onClick={actionButton.onClick}
          disabled={actionButton.disabled}
          className="w-full rounded-none border border-neutral-900 py-2.5 font-mono text-xs tracking-widest uppercase sm:w-auto dark:border-neutral-100"
        >
          {actionButton.icon || <Plus className="mr-1 size-3.5" />}
          {actionButton.label}
        </Button>
      )}
    </div>
  );
}
