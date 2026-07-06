"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ManagementDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footerActions?: React.ReactNode;
  className?: string;
}

export function ManagementDetailDialog({ open, onOpenChange, title, subtitle, children, footerActions, className }: ManagementDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "rounded-none border border-neutral-200 bg-background/95 p-6 font-mono text-xs backdrop-blur-md sm:max-w-[500px] dark:border-neutral-800",
          className
        )}
      >
        {/* Plus signs on card corners for branding accent */}
        <div className="pointer-events-none absolute -top-1.5 -left-1.5 z-10 bg-background px-0.5 text-[9px] text-neutral-300 select-none dark:text-neutral-700">
          +
        </div>
        <div className="pointer-events-none absolute -top-1.5 -right-1.5 z-10 bg-background px-0.5 text-[9px] text-neutral-300 select-none dark:text-neutral-700">
          +
        </div>
        <div className="pointer-events-none absolute -bottom-1.5 -left-1.5 z-10 bg-background px-0.5 text-[9px] text-neutral-300 select-none dark:text-neutral-700">
          +
        </div>
        <div className="pointer-events-none absolute -right-1.5 -bottom-1.5 z-10 bg-background px-0.5 text-[9px] text-neutral-300 select-none dark:text-neutral-700">
          +
        </div>

        <div className="space-y-6">
          <DialogHeader className="space-y-1">
            <DialogTitle className="font-sans text-base font-bold text-foreground">{title}</DialogTitle>
            {subtitle && <DialogDescription className="text-[10px] text-neutral-400 uppercase">{subtitle}</DialogDescription>}
          </DialogHeader>

          {/* Main Content */}
          <div className="space-y-4">{children}</div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-2 border-t border-dashed border-neutral-200 pt-4 dark:border-neutral-800">
            {footerActions || (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="rounded-none border-dashed font-mono text-[10px] uppercase"
              >
                Close Panel
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
