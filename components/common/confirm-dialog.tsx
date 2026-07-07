"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  variant?: "default" | "destructive";
  isLoading?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  variant = "default",
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent size="sm" className="rounded-none border border-neutral-300 bg-background dark:border-neutral-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-mono text-sm tracking-wider text-foreground uppercase">{title}</AlertDialogTitle>
          <AlertDialogDescription className="font-sans text-xs text-neutral-500 dark:text-neutral-400">{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="-mx-0 -mb-0 flex justify-end gap-2 border-t-0 bg-transparent p-0 pt-2">
          <AlertDialogCancel
            disabled={isLoading}
            className="border-neutral-350 dark:border-neutral-750 rounded-none font-mono text-[10px] tracking-wider uppercase"
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            variant={variant === "destructive" ? "destructive" : "default"}
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isLoading}
            className="rounded-none font-mono text-[10px] tracking-wider uppercase"
          >
            {isLoading ? "Processing..." : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
