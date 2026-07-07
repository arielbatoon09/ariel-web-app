"use client";

import * as React from "react";
import Image from "next/image";
import { ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaPickerDialog } from "@/components/common/media-picker-dialog";
import { cn } from "@/lib/utils";

interface MediaPickerButtonProps {
  value?: string;
  onChange: (url: string) => void;
  onClear?: () => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * Reusable drop-in button for forms that need a media/image field.
 * Shows the selected image as a thumbnail preview or a placeholder.
 * Opens the Media Library picker dialog on click.
 *
 * Usage:
 *   <MediaPickerButton
 *     value={form.watch("imageSrc")}
 *     onChange={(url) => form.setValue("imageSrc", url)}
 *   />
 */
export function MediaPickerButton({
  value,
  onChange,
  onClear,
  label = "Select from Media Library",
  className,
  disabled,
}: MediaPickerButtonProps) {
  const [open, setOpen] = React.useState(false);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClear) {
      onClear();
    } else {
      onChange("");
    }
  };

  return (
    <>
      <div
        className={cn(
          "group relative w-full cursor-pointer border border-dashed border-neutral-300 transition-colors hover:border-neutral-400 dark:border-neutral-700 dark:hover:border-neutral-600",
          disabled && "pointer-events-none opacity-50",
          className
        )}
        onClick={() => !disabled && setOpen(true)}
      >
        {value ? (
          // Show selected image preview
          <div className="relative">
            <div className="relative aspect-video w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
              <Image
                src={value}
                alt="Selected media"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
                <span className="font-mono text-[10px] uppercase text-white opacity-0 transition-opacity group-hover:opacity-100">
                  Change Image
                </span>
              </div>
            </div>
            {/* Clear button */}
            {!disabled && (
              <button
                onClick={handleClear}
                className="absolute right-2 top-2 z-10 flex size-6 items-center justify-center bg-black/60 text-white backdrop-blur-sm transition-opacity hover:bg-black/80"
                title="Remove image"
              >
                <X className="size-3" />
              </button>
            )}
          </div>
        ) : (
          // Empty state placeholder
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
            <div className="flex size-10 items-center justify-center border border-dashed border-neutral-300 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900">
              <ImageIcon className="size-4 text-neutral-400" />
            </div>
            <div>
              <p className="font-mono text-[10px] font-medium text-neutral-600 dark:text-neutral-400">
                {label}
              </p>
              <p className="font-mono text-[9px] text-neutral-400 uppercase">
                Click to open Media Library
              </p>
            </div>
          </div>
        )}
      </div>

      <MediaPickerDialog
        open={open}
        onOpenChange={setOpen}
        onSelect={onChange}
        selectedUrl={value}
      />
    </>
  );
}
