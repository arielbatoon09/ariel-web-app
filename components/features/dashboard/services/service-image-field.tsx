"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MediaPickerDialog } from "@/components/common/media-picker-dialog";
import { cn } from "@/lib/utils";

interface ServiceImageFieldProps {
  label: string;
  hint?: string;
  value: string;
  onChange: (url: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled?: boolean;
  /** Preview frame aspect. */
  previewClassName?: string;
  emptyLabel?: string;
}

export function ServiceImageField({
  label,
  hint,
  value,
  onChange,
  open,
  onOpenChange,
  disabled,
  previewClassName = "aspect-square max-w-md",
  emptyLabel = "Select Image",
}: ServiceImageFieldProps) {
  return (
    <div className="space-y-2">
      <div className="space-y-0.5">
        <span className="block text-[10px] tracking-widest text-neutral-400 uppercase">{label}</span>
        {hint ? <span className="block font-mono text-[9px] text-neutral-500">{hint}</span> : null}
      </div>

      {value ? (
        <div className="relative border border-dashed border-neutral-300 bg-background/50 p-2 dark:border-neutral-700">
          <div className={cn("relative mx-auto w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900", previewClassName)}>
            <Image src={value} alt={label} className="object-contain" fill unoptimized />
          </div>
          <div className="mt-2 flex items-center gap-1.5 font-mono text-[10px] text-neutral-400">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(true)}
              disabled={disabled}
              className="h-7 rounded-none px-2 font-mono text-[9px] text-neutral-500 uppercase hover:bg-neutral-100 hover:text-foreground dark:hover:bg-neutral-800"
            >
              Change Image
            </Button>
            <span>|</span>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onChange("")}
              disabled={disabled}
              className="h-7 rounded-none px-2 font-mono text-[9px] text-red-500 uppercase hover:bg-red-500/10 hover:text-red-600"
            >
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !disabled && onOpenChange(true)}
          className="flex cursor-pointer flex-col items-center justify-center space-y-1.5 border border-dashed border-neutral-300 bg-background/50 py-6 text-center text-neutral-400 hover:border-neutral-500 dark:border-neutral-700"
        >
          <Plus className="size-4" />
          <span className="font-mono text-[9px] tracking-wider uppercase">{emptyLabel}</span>
        </div>
      )}

      <MediaPickerDialog
        open={open}
        onOpenChange={onOpenChange}
        selectedUrl={value || ""}
        onSelect={(url) => {
          onChange(url);
          onOpenChange(false);
        }}
      />
    </div>
  );
}
