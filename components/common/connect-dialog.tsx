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
            <Button
              variant={triggerVariant}
              size={triggerSize}
              className={triggerClassName}
            >
              {triggerText}
            </Button>
          )
        }
      />

      <DialogContent className="sm:max-w-[480px] p-6 rounded-none border border-neutral-200 dark:border-neutral-800 bg-background/95 backdrop-blur-md">
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl font-bold tracking-tight font-sans">
              How would you like to connect?
            </DialogTitle>
            <DialogDescription className="text-neutral-500 dark:text-neutral-450 text-xs md:text-sm">
              Choose the best way to discuss your project or opportunity.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4">
            {/* Option A: Book a Call */}
            <button
              onClick={handleBookCall}
              className="group/option text-left p-5 border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-neutral-100 bg-neutral-50 dark:bg-neutral-900/60 hover:bg-neutral-100 dark:hover:bg-neutral-900/90 transition-all duration-300 relative cursor-pointer"
            >
              <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 text-[10px] text-neutral-300 dark:text-neutral-700 group-hover/option:text-neutral-500 dark:group-hover/option:text-neutral-400 transition-colors">
                +
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 group-hover/option:bg-neutral-900 group-hover/option:text-white dark:group-hover/option:bg-white dark:group-hover/option:text-black transition-all duration-300">
                  <Calendar className="size-5" />
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="text-sm font-mono font-bold uppercase tracking-wider text-foreground">
                    Book a Discovery Call
                  </h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-450 leading-relaxed">
                    Select a time on my calendar for a focused, 30-minute discovery session. No fluff, just technical alignment.
                  </p>
                </div>
              </div>
            </button>

            {/* Option B: Direct Message */}
            <button
              onClick={handleSendMessage}
              className="group/option text-left p-5 border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-neutral-100 bg-neutral-50 dark:bg-neutral-900/60 hover:bg-neutral-100 dark:hover:bg-neutral-900/90 transition-all duration-300 relative cursor-pointer"
            >
              <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 text-[10px] text-neutral-300 dark:text-neutral-700 group-hover/option:text-neutral-500 dark:group-hover/option:text-neutral-400 transition-colors">
                +
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 group-hover/option:bg-neutral-900 group-hover/option:text-white dark:group-hover/option:bg-white dark:group-hover/option:text-black transition-all duration-300">
                  <Mail className="size-5" />
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="text-sm font-mono font-bold uppercase tracking-wider text-foreground">
                    Send a Message
                  </h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-450 leading-relaxed">
                    Prefer email? Fill out a quick form with your project details, budget, and timeline, and I'll reply within 24 hours.
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
