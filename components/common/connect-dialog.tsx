"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Mail } from "lucide-react";

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
          React.isValidElement(children) ? (
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

      <DialogContent className="rounded-none border border-neutral-200 bg-background/95 p-6 backdrop-blur-md sm:max-w-[480px] dark:border-neutral-800">
        <div className="animate-in space-y-6 duration-200 zoom-in-95 fade-in">
          <DialogHeader className="space-y-2">
            <DialogTitle className="font-sans text-xl font-bold tracking-tight">How would you like to connect?</DialogTitle>
            <DialogDescription className="dark:text-neutral-450 text-xs text-neutral-500 md:text-sm">
              Choose the best way to discuss your project or opportunity.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4">
            {/* Option A: Book a Call */}
            <button
              onClick={handleBookCall}
              className="group/option relative cursor-pointer border border-dashed border-neutral-300 bg-neutral-50 p-5 text-left transition-all duration-300 hover:border-neutral-900 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900/60 dark:hover:border-neutral-100 dark:hover:bg-neutral-900/90"
            >
              <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 text-[10px] text-neutral-300 transition-colors group-hover/option:text-neutral-500 dark:text-neutral-700 dark:group-hover/option:text-neutral-400">
                +
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-neutral-100 p-2.5 text-neutral-600 transition-all duration-300 group-hover/option:bg-neutral-900 group-hover/option:text-white dark:bg-neutral-800 dark:text-neutral-300 dark:group-hover/option:bg-white dark:group-hover/option:text-black">
                  <Calendar className="size-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="font-mono text-sm font-bold tracking-wider text-foreground uppercase">Book a Discovery Call</h4>
                  <p className="dark:text-neutral-450 text-xs leading-relaxed text-neutral-500">
                    Select a time on my calendar for a focused, 30-minute discovery session. No fluff, just technical alignment.
                  </p>
                </div>
              </div>
            </button>

            {/* Option B: Direct Message */}
            <button
              onClick={handleSendMessage}
              className="group/option relative cursor-pointer border border-dashed border-neutral-300 bg-neutral-50 p-5 text-left transition-all duration-300 hover:border-neutral-900 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900/60 dark:hover:border-neutral-100 dark:hover:bg-neutral-900/90"
            >
              <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 text-[10px] text-neutral-300 transition-colors group-hover/option:text-neutral-500 dark:text-neutral-700 dark:group-hover/option:text-neutral-400">
                +
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-neutral-100 p-2.5 text-neutral-600 transition-all duration-300 group-hover/option:bg-neutral-900 group-hover/option:text-white dark:bg-neutral-800 dark:text-neutral-300 dark:group-hover/option:bg-white dark:group-hover/option:text-black">
                  <Mail className="size-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="font-mono text-sm font-bold tracking-wider text-foreground uppercase">Send a Message</h4>
                  <p className="dark:text-neutral-450 text-xs leading-relaxed text-neutral-500">
                    Prefer email? Fill out a quick form with your project details, budget, and timeline, and I&apos;ll reply within 24 hours.
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
