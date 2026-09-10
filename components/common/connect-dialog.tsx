"use client";

import { isValidElement } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Mail } from "lucide-react";

interface ConnectDialogProps {
  children?: React.ReactNode;
  triggerText?: string;
  triggerClassName?: string;
  triggerVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  triggerSize?: "default" | "sm" | "lg" | "icon";
}

export function ConnectDialog({
  children,
  triggerText = "Let's talk",
  triggerClassName,
  triggerVariant = "default",
  triggerSize = "lg",
}: ConnectDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleBookCall = () => {
    setOpen(false);
    router.push("/book");
  };

  const handleSendMessage = () => {
    setOpen(false);
    router.push("/contact");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          isValidElement(children) ? (
            children
          ) : children ? (
            <span>{children}</span>
          ) : (
            <Button variant={triggerVariant} size={triggerSize} className={triggerClassName}>
              {triggerText}
            </Button>
          )
        }
      />

      <DialogContent
        showCloseButton={false}
        className="rounded-none border border-neutral-300 bg-background/95 p-6 font-mono text-xs backdrop-blur-md sm:max-w-[480px] dark:border-neutral-700"
      >
        <div className="pointer-events-none absolute -top-px -left-px z-50 size-2.5 border-t-2 border-l-2 border-neutral-400 dark:border-neutral-500" />
        <div className="pointer-events-none absolute -top-px -right-px z-50 size-2.5 border-t-2 border-r-2 border-neutral-400 dark:border-neutral-500" />
        <div className="pointer-events-none absolute -bottom-px -left-px z-50 size-2.5 border-b-2 border-l-2 border-neutral-400 dark:border-neutral-500" />
        <div className="pointer-events-none absolute -right-px -bottom-px z-50 size-2.5 border-r-2 border-b-2 border-neutral-400 dark:border-neutral-500" />

        <DialogHeader className="space-y-1 pr-8 text-left">
          <DialogTitle className="font-sans text-base font-bold text-foreground">How would you like to connect?</DialogTitle>
          <DialogDescription className="text-neutral-450 text-[10px] uppercase dark:text-neutral-500">
            Choose a path to discuss your project or opportunity
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 grid grid-cols-1 gap-3">
          <button
            type="button"
            onClick={handleBookCall}
            className="group/option relative cursor-pointer border border-dashed border-neutral-300 bg-neutral-50/80 p-4 text-left transition-colors duration-200 hover:border-neutral-500 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900/50 dark:hover:border-neutral-500 dark:hover:bg-neutral-900/80"
          >
            <div className="pointer-events-none absolute -top-px -left-px size-2 border-t border-l border-neutral-400 opacity-0 transition-opacity group-hover/option:opacity-100 dark:border-neutral-500" />
            <div className="pointer-events-none absolute -top-px -right-px size-2 border-t border-r border-neutral-400 opacity-0 transition-opacity group-hover/option:opacity-100 dark:border-neutral-500" />
            <div className="pointer-events-none absolute -bottom-px -left-px size-2 border-b border-l border-neutral-400 opacity-0 transition-opacity group-hover/option:opacity-100 dark:border-neutral-500" />
            <div className="pointer-events-none absolute -right-px -bottom-px size-2 border-r border-b border-neutral-400 opacity-0 transition-opacity group-hover/option:opacity-100 dark:border-neutral-500" />

            <div className="flex items-start gap-3.5">
              <div className="flex size-9 shrink-0 items-center justify-center border border-dashed border-neutral-300 text-neutral-600 transition-colors group-hover/option:border-neutral-900 group-hover/option:bg-neutral-900 group-hover/option:text-white dark:border-neutral-700 dark:text-neutral-300 dark:group-hover/option:border-white dark:group-hover/option:bg-white dark:group-hover/option:text-black">
                <Calendar className="size-4" />
              </div>
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-mono text-[10px] font-bold tracking-wider text-foreground uppercase">Book a Discovery Call</h4>
                  <ArrowRight className="size-3.5 shrink-0 text-neutral-400 transition-transform group-hover/option:translate-x-0.5 group-hover/option:text-foreground" />
                </div>
                <p className="font-sans text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                  Select a time for a focused 30-minute discovery session. Technical alignment, no fluff.
                </p>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={handleSendMessage}
            className="group/option relative cursor-pointer border border-dashed border-neutral-300 bg-neutral-50/80 p-4 text-left transition-colors duration-200 hover:border-neutral-500 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900/50 dark:hover:border-neutral-500 dark:hover:bg-neutral-900/80"
          >
            <div className="pointer-events-none absolute -top-px -left-px size-2 border-t border-l border-neutral-400 opacity-0 transition-opacity group-hover/option:opacity-100 dark:border-neutral-500" />
            <div className="pointer-events-none absolute -top-px -right-px size-2 border-t border-r border-neutral-400 opacity-0 transition-opacity group-hover/option:opacity-100 dark:border-neutral-500" />
            <div className="pointer-events-none absolute -bottom-px -left-px size-2 border-b border-l border-neutral-400 opacity-0 transition-opacity group-hover/option:opacity-100 dark:border-neutral-500" />
            <div className="pointer-events-none absolute -right-px -bottom-px size-2 border-r border-b border-neutral-400 opacity-0 transition-opacity group-hover/option:opacity-100 dark:border-neutral-500" />

            <div className="flex items-start gap-3.5">
              <div className="flex size-9 shrink-0 items-center justify-center border border-dashed border-neutral-300 text-neutral-600 transition-colors group-hover/option:border-neutral-900 group-hover/option:bg-neutral-900 group-hover/option:text-white dark:border-neutral-700 dark:text-neutral-300 dark:group-hover/option:border-white dark:group-hover/option:bg-white dark:group-hover/option:text-black">
                <Mail className="size-4" />
              </div>
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-mono text-[10px] font-bold tracking-wider text-foreground uppercase">Send a Message</h4>
                  <ArrowRight className="size-3.5 shrink-0 text-neutral-400 transition-transform group-hover/option:translate-x-0.5 group-hover/option:text-foreground" />
                </div>
                <p className="font-sans text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                  Share project details, budget, and timeline. I typically reply within 24 hours.
                </p>
              </div>
            </div>
          </button>
        </div>

        <div className="mt-4 flex justify-end border-t border-dashed border-neutral-300 pt-4 dark:border-neutral-700">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            className="h-8 rounded-none border-dashed px-3 font-mono text-[10px] uppercase"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
