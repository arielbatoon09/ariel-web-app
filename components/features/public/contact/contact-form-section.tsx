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
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
        {/* Direct Message Form Column */}
        <div className="lg:col-span-7">
          <div className="relative border border-dashed border-neutral-300 bg-neutral-50 p-6 md:p-8 dark:border-neutral-700 dark:bg-neutral-900/60">
            <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 text-[10px] text-neutral-300 dark:text-neutral-700">+</div>
            <div className="absolute right-0 bottom-0 translate-x-1/2 translate-y-1/2 text-[10px] text-neutral-300 dark:text-neutral-700">+</div>

            {view === "form" ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] tracking-wider text-neutral-400 uppercase dark:text-neutral-500">Your Name</label>
                  <Input
                    required
                    placeholder="e.g. John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11 rounded-none border-dashed border-neutral-300 bg-transparent focus-visible:border-neutral-900 dark:border-neutral-700 dark:focus-visible:border-neutral-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] tracking-wider text-neutral-400 uppercase dark:text-neutral-500">Email Address</label>
                  <Input
                    required
                    type="email"
                    placeholder="e.g. john@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 rounded-none border-dashed border-neutral-300 bg-transparent focus-visible:border-neutral-900 dark:border-neutral-700 dark:focus-visible:border-neutral-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] tracking-wider text-neutral-400 uppercase dark:text-neutral-500">
                    Project Details & Message
                  </label>
                  <Textarea
                    required
                    placeholder="Describe your project, goals, estimated budget, and timeline..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[180px] rounded-none border-dashed border-neutral-300 bg-transparent focus-visible:border-neutral-900 dark:border-neutral-700 dark:focus-visible:border-neutral-100"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="flex h-12 w-full cursor-pointer items-center justify-center rounded-none font-mono text-xs tracking-wider uppercase transition-all duration-300 hover:-translate-y-0.5"
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
              <div className="animate-in space-y-4 py-12 text-center duration-200 zoom-in-95 fade-in">
                <div className="inline-flex rounded-full bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
                  <CheckCircle2 className="size-12" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-sans text-xl font-bold tracking-tight text-foreground">Message Sent Successfully</h3>
                  <p className="dark:text-neutral-455 mx-auto max-w-sm text-xs leading-relaxed text-neutral-500 md:text-sm">
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
                  className="h-11 cursor-pointer rounded-none px-6 font-mono text-xs tracking-wider uppercase"
                >
                  Send Another Message
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Navigation/Alternative Column */}
        <div className="space-y-8 lg:col-span-5 lg:pl-6">
          <div className="space-y-4">
            <span className="text-neutral-450 block font-mono text-[10px] tracking-[0.2em] uppercase dark:text-neutral-500">
              PREFER A VOICE CALL?
            </span>
            <h2 className="font-sans text-xl font-bold tracking-tight text-foreground">Book a Discovery Call</h2>
            <p className="dark:text-neutral-455 text-xs leading-relaxed text-neutral-500 md:text-sm">
              If you would rather schedule a live scoping call to discuss details interactively, feel free to book a slot directly.
            </p>
            <Link href="/book" className="inline-block pt-2">
              <Button
                variant="outline"
                className="flex h-11 cursor-pointer items-center gap-2 rounded-none px-5 font-mono text-xs tracking-wider uppercase transition-all duration-300 hover:-translate-y-0.5"
              >
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
