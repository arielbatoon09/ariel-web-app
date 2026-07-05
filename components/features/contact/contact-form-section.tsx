"use client";

import { useState } from "react";
import { Section } from "@/components/common/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Loader2, Calendar } from "lucide-react";
import Link from "next/link";

export function ContactFormSection() {
  const [view, setView] = useState<"form" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setLoading(true);
    // Simulate API submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    setView("success");
  };

  return (
    <Section containerClassName="py-12 md:py-16" showTopLine={false} showBottomLine={true}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Direct Message Form Column */}
        <div className="lg:col-span-7">
          <div className="p-6 md:p-8 border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/60 relative">
            <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 text-[10px] text-neutral-300 dark:text-neutral-700">
              +
            </div>
            <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 text-[10px] text-neutral-300 dark:text-neutral-700">
              +
            </div>

            {view === "form" ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                    Your Name
                  </label>
                  <Input
                    required
                    placeholder="e.g. John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-none border-dashed border-neutral-300 dark:border-neutral-700 focus-visible:border-neutral-900 dark:focus-visible:border-neutral-100 bg-transparent h-11"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                    Email Address
                  </label>
                  <Input
                    required
                    type="email"
                    placeholder="e.g. john@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-none border-dashed border-neutral-300 dark:border-neutral-700 focus-visible:border-neutral-900 dark:focus-visible:border-neutral-100 bg-transparent h-11"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                    Project Details & Message
                  </label>
                  <Textarea
                    required
                    placeholder="Describe your project, goals, estimated budget, and timeline..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="rounded-none border-dashed border-neutral-300 dark:border-neutral-700 focus-visible:border-neutral-900 dark:focus-visible:border-neutral-100 bg-transparent min-h-[180px]"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-none h-12 text-xs font-mono uppercase tracking-wider flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            ) : (
              <div className="py-12 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="inline-flex p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-full">
                  <CheckCircle2 className="size-12" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold tracking-tight text-foreground font-sans">
                    Message Sent Successfully
                  </h3>
                  <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-455 leading-relaxed max-w-sm mx-auto">
                    Thank you for reaching out, {name}. I have received your message and will review it. Expect a response within 24 hours.
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setView("form");
                    setName("");
                    setEmail("");
                    setMessage("");
                  }}
                  variant="outline"
                  className="rounded-none px-6 h-11 text-xs font-mono uppercase tracking-wider cursor-pointer"
                >
                  Send Another Message
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Navigation/Alternative Column */}
        <div className="lg:col-span-5 space-y-8 lg:pl-6">
          <div className="space-y-4">
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-neutral-450 dark:text-neutral-500 block">
              PREFER A VOICE CALL?
            </span>
            <h2 className="text-xl font-bold tracking-tight text-foreground font-sans">
              Book a Discovery Call
            </h2>
            <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-455 leading-relaxed">
              If you would rather schedule a live scoping call to discuss details interactively, feel free to book a slot directly.
            </p>
            <Link href="/book" className="inline-block pt-2">
              <Button variant="outline" className="rounded-none h-11 px-5 text-xs font-mono uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all duration-300 hover:-translate-y-0.5">
                <Calendar className="size-4" />
                Schedule a Call
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
