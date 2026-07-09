"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCreateOrderMutation } from "@/hooks/use-orders";
import { useCreateTransactionMutation } from "@/hooks/use-transactions";
import { getReceiptPresignedUrlAction } from "@/services/media";
import type { Service } from "@/schemas/dashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Check, Loader2, ShieldCheck, Clock, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Section } from "@/components/common/section";
import { BackButton } from "@/components/common/back-button";

interface CheckoutViewProps {
  service: Service;
}

export function CheckoutView({ service }: CheckoutViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const createOrder = useCreateOrderMutation();
  const createTransaction = useCreateTransactionMutation();

  // Load preselected addons from query params
  const initialAddons = useMemo(() => {
    const addonsParam = searchParams.get("addons");
    return addonsParam ? addonsParam.split(",").filter(Boolean) : [];
  }, [searchParams]);

  // Form states
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [requirements, setRequirements] = useState("");
  const [selectedAddons, setSelectedAddons] = useState<string[]>(initialAddons);
  const [paymentMethod, setPaymentMethod] = useState<"gcash" | "maya" | "bpi" | "wise">("gcash");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  // States for flow
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any | null>(null);

  // Recalculate total amount
  const totalAmount = useMemo(() => {
    const base = service.price;
    const addonsTotal = selectedAddons.reduce((sum, id) => {
      const addon = service.addOns.find((a) => a.id === id);
      return sum + (addon?.price || 0);
    }, 0);
    return base + addonsTotal;
  }, [service, selectedAddons]);

  const toggleAddon = (id: string) => {
    setSelectedAddons((current) => (current.includes(id) ? current.filter((x) => x !== id) : [...current, id]));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        toast.error("Only image files (PNG, JPEG, WebP) are allowed.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB limit.");
        return;
      }
      setReceiptFile(file);
    }
  };

  const handleSubmitCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !customerEmail.trim()) {
      toast.error("Please enter your name and email address.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(customerEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!referenceNumber.trim()) {
      toast.error("Please enter the transaction reference number.");
      return;
    }
    if (!receiptFile) {
      toast.error("Please upload your payment receipt screenshot.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Request presigned URL for upload
      const presignedRes = await getReceiptPresignedUrlAction(receiptFile.name, receiptFile.type);
      if (!presignedRes.success || !presignedRes.presignedUrl || !presignedRes.url) {
        throw new Error(presignedRes.error || "Failed to generate upload access.");
      }

      // 2. Upload file directly to S3/R2
      const uploadRes = await fetch(presignedRes.presignedUrl, {
        method: "PUT",
        body: receiptFile,
        headers: {
          "Content-Type": receiptFile.type,
        },
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload receipt screenshot.");
      }

      const screenshotUrl = presignedRes.url;

      // Generate a persistent Order Reference Code for user tracking
      const orderRefCode = `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      // 3. Save order to database
      const orderRes = await createOrder.mutateAsync({
        serviceId: service.id,
        serviceName: service.name,
        serviceBasePrice: service.price,
        customerName,
        customerEmail,
        addOnsSelected: selectedAddons,
        addOns: selectedAddons.map((id) => {
          const addon = service.addOns.find((a) => a.id === id);
          return { name: addon?.name ?? id, price: addon?.price ?? 0 };
        }),
        totalAmount,
        referenceNumber: orderRefCode,
        customerPhone: customerPhone || undefined,
        requirements: requirements || undefined,
      });

      // 4. Save transaction linked to order
      await createTransaction.mutateAsync({
        orderId: orderRes.id,
        amount: totalAmount,
        paymentMethod: paymentMethod.toUpperCase(),
        referenceNumber: referenceNumber.trim(),
        screenshotUrl,
      });

      setCreatedOrder(orderRes);
      setIsSuccess(true);
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong during checkout.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Section
        id="checkout-success"
        containerClassName="py-16 md:py-24 min-h-[90vh] flex flex-col justify-center"
        showTopLine={false}
        showBottomLine={true}
      >
        <div className="mx-auto w-full max-w-3xl animate-in space-y-8 duration-500 fade-in zoom-in">
          {/* Header State */}
          <div className="space-y-4 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-dashed border-emerald-500 bg-emerald-100 dark:bg-emerald-950/30">
              <ShieldCheck className="size-7 text-emerald-500" />
            </div>
            <div className="space-y-1">
              <span className="font-mono text-[10px] font-bold tracking-widest text-emerald-500 uppercase">Transaction Recorded</span>
              <h1 className="font-sans text-3xl font-extrabold tracking-tight text-foreground uppercase">Order Received</h1>
            </div>
            <p className="mx-auto max-w-lg font-sans text-xs leading-relaxed text-neutral-500 md:text-sm">
              Thank you! Your order details and proof of payment are undergoing verification. We will get back to you via email in{" "}
              <strong className="text-foreground">less than 12 hours</strong>.
            </p>
          </div>

          {/* Details & Next Steps Grid */}
          <div className="grid grid-cols-1 gap-6 pt-4 md:grid-cols-2">
            {/* Left: Summary Panel */}
            <div className="border-neutral-350 space-y-4 border border-dashed bg-neutral-50/50 p-6 dark:border-neutral-700 dark:bg-neutral-900/10">
              <span className="block border-b border-dashed border-neutral-300 pb-2 font-mono text-[9px] tracking-widest text-neutral-400 uppercase dark:border-neutral-700">
                Order Reference Summary
              </span>

              <div className="space-y-3 font-mono text-xs text-neutral-500">
                <div className="flex items-center justify-between">
                  <span>Selected Package:</span>
                  <span className="text-right font-sans font-bold text-foreground">{service.name}</span>
                </div>
                {createdOrder && createdOrder.referenceNumber && (
                  <div className="flex items-center justify-between">
                    <span>Order Reference:</span>
                    <span className="font-bold text-foreground">{createdOrder.referenceNumber}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span>Amount Deposited:</span>
                  <span className="text-sm font-bold text-foreground">₱{totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between border-t border-dashed border-neutral-300 pt-3 dark:border-neutral-700">
                  <span>Account Setup:</span>
                  <span className="text-right font-sans font-medium text-foreground">{customerEmail}</span>
                </div>
              </div>
            </div>

            {/* Right: Next Steps Timeline */}
            <div className="border-neutral-350 space-y-4 border border-dashed bg-background p-6 dark:border-neutral-700">
              <span className="block border-b border-dashed border-neutral-300 pb-2 font-mono text-[9px] tracking-widest text-neutral-400 uppercase dark:border-neutral-700">
                Workflow Delivery Steps
              </span>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="flex size-4 items-center justify-center rounded-full bg-emerald-500 text-[8px] font-bold text-white">✓</div>
                    <div className="h-full min-h-[20px] w-[1px] bg-neutral-200 dark:bg-neutral-800" />
                  </div>
                  <div>
                    <h4 className="font-sans text-xs font-bold text-foreground">Order Staged</h4>
                    <p className="mt-0.5 text-[10px] text-neutral-400">Booking details & payment receipt uploaded successfully.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="flex size-4 items-center justify-center rounded-full border border-dashed border-yellow-500 bg-yellow-500/10 text-[8px] font-bold text-yellow-500">
                      2
                    </div>
                    <div className="h-full min-h-[20px] w-[1px] bg-neutral-200 dark:bg-neutral-800" />
                  </div>
                  <div>
                    <h4 className="font-sans text-xs font-bold text-foreground">Manual Verification</h4>
                    <p className="mt-0.5 text-[10px] text-neutral-400">
                      We will audit your payment proof shortly. Once verified, new clients will receive credentials via email to access the customer
                      panel, while existing clients can log in to their dashboard to track progress.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="border-neutral-350 flex size-4 items-center justify-center rounded-full border text-[8px] font-bold text-neutral-400">
                      3
                    </div>
                  </div>
                  <div>
                    <h4 className="text-neutral-450 font-sans text-xs font-bold dark:text-neutral-500">Project Workspace Setup</h4>
                    <p className="text-neutral-450 mt-0.5 text-[10px]">Once verified, we start working and setup your demo preview build.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 text-center">
            <Button
              onClick={() => router.push("/services")}
              className="h-10 rounded-none bg-foreground px-8 font-mono text-xs text-background uppercase transition-colors hover:bg-foreground/90"
            >
              Return to Services
            </Button>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section id="service-checkout" containerClassName="pt-4 md:pt-6 pb-12 md:pb-20" showTopLine={false} showBottomLine={true}>
      <div className="space-y-8">
        {/* Back navigation */}
        <div>
          <BackButton href={`/service/${service.slug}`} label={`Back to ${service.name}`} />
        </div>

        {/* Title */}
        <div className="border border-dashed border-neutral-300 bg-neutral-50/50 p-6 dark:border-neutral-700 dark:bg-neutral-900/10">
          <span className="font-mono text-[9px] tracking-widest text-neutral-400 uppercase">Service Checkout</span>
          <h1 className="mt-1 font-sans text-2xl font-bold tracking-tight text-foreground md:text-3xl">Complete Booking: {service.name}</h1>
        </div>

        <form onSubmit={handleSubmitCheckout} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column: Form Fields */}
          <div className="space-y-8 lg:col-span-2">
            {/* Step 1: Customer Details */}
            <div className="space-y-6 border border-dashed border-neutral-300 p-6 dark:border-neutral-700">
              <h3 className="border-b border-dashed border-neutral-300 pb-3 font-sans text-sm font-bold tracking-wider text-foreground uppercase dark:border-neutral-700">
                1. Contact Specifications
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel className="text-[9px] tracking-wider text-neutral-400 uppercase">Your Name *</FieldLabel>
                  <Input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. John Doe"
                    required
                    className="h-10 rounded-none border-dashed border-neutral-300 focus-visible:border-solid dark:border-neutral-700"
                  />
                </Field>

                <Field>
                  <FieldLabel className="text-[9px] tracking-wider text-neutral-400 uppercase">Your Email *</FieldLabel>
                  <Input
                    value={customerEmail}
                    type="email"
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="e.g. john@company.com"
                    required
                    className="h-10 rounded-none border-dashed border-neutral-300 focus-visible:border-solid dark:border-neutral-700"
                  />
                </Field>

                <div className="md:col-span-2">
                  <Field>
                    <FieldLabel className="text-[9px] tracking-wider text-neutral-400 uppercase">Phone Number (Optional)</FieldLabel>
                    <Input
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g. +63 917 123 4567"
                      className="h-10 rounded-none border-dashed border-neutral-300 focus-visible:border-solid dark:border-neutral-700"
                    />
                  </Field>
                </div>
              </div>
            </div>

            {/* Step 2: Project Requirements & Pain Points */}
            <div className="space-y-6 border border-dashed border-neutral-300 p-6 dark:border-neutral-700">
              <h3 className="border-b border-dashed border-neutral-300 pb-3 font-sans text-sm font-bold tracking-wider text-foreground uppercase dark:border-neutral-700">
                2. Project Brief & Pain Points
              </h3>
              <Field>
                <FieldLabel className="text-[9px] tracking-wider text-neutral-400 uppercase">Project Notes, Pain Points & Requirements *</FieldLabel>
                <textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="Please write down your project description, main pain points, feature requirements, or any other details you want us to handle..."
                  rows={8}
                  required
                  className="dark:focus:border-neutral-150 min-h-[160px] w-full resize-y rounded-none border border-dashed border-neutral-300 bg-background/50 p-3 font-sans text-xs outline-none focus:border-solid focus:border-neutral-900 dark:border-neutral-700"
                />
              </Field>
            </div>

            {/* Step 3: Upgrades Selection */}
            {service.addOns.length > 0 && (
              <div className="space-y-6 border border-dashed border-neutral-300 p-6 dark:border-neutral-700">
                <h3 className="border-b border-dashed border-neutral-300 pb-3 font-sans text-sm font-bold tracking-wider text-foreground uppercase dark:border-neutral-700">
                  3. Select Optional Upgrades
                </h3>
                <div className="space-y-3">
                  {service.addOns.map((addon) => {
                    const selected = selectedAddons.includes(addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        className={cn(
                          "flex cursor-pointer items-start gap-3 border border-dashed bg-background/50 p-4 transition-colors select-none",
                          selected
                            ? "border-neutral-900 bg-neutral-100/10 dark:border-neutral-100"
                            : "border-neutral-300 hover:border-neutral-500 dark:border-neutral-700"
                        )}
                      >
                        <button
                          type="button"
                          className={cn(
                            "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-none border transition-colors",
                            selected
                              ? "border-neutral-900 bg-neutral-900 text-white dark:bg-white dark:text-black"
                              : "border-neutral-300 bg-transparent"
                          )}
                        >
                          {selected && <Check className="size-3" />}
                        </button>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-sans text-xs font-bold text-foreground">{addon.name}</span>
                            <span className="shrink-0 font-mono text-xs font-bold text-foreground">+₱{addon.price.toLocaleString()}</span>
                          </div>
                          {addon.description && <p className="mt-1 font-sans text-[10px] leading-relaxed text-neutral-500">{addon.description}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 4: Payment Verification */}
            <div className="space-y-6 border border-dashed border-neutral-300 p-6 dark:border-neutral-700">
              <h3 className="border-b border-dashed border-neutral-300 pb-3 font-sans text-sm font-bold tracking-wider text-foreground uppercase dark:border-neutral-700">
                {service.addOns.length > 0 ? "4." : "3."} Payment & Verification
              </h3>

              <div className="space-y-4">
                <span className="block font-mono text-[9px] tracking-wider text-neutral-400 uppercase">Select Payment Channel</span>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { id: "gcash", label: "GCash" },
                      { id: "maya", label: "Maya" },
                      { id: "bpi", label: "BPI Bank" },
                      { id: "wise", label: "Wise" },
                    ] as const
                  ).map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={cn(
                        "rounded-none border border-dashed py-3 font-mono text-[10px] tracking-wider uppercase transition-colors",
                        paymentMethod === method.id
                          ? "border-neutral-900 bg-neutral-100/10 dark:border-neutral-100"
                          : "border-neutral-300 hover:border-neutral-500 dark:border-neutral-700"
                      )}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>

                {/* Transfer Details */}
                <div className="space-y-3 border border-dashed border-neutral-300 bg-neutral-50/50 p-5 font-mono text-[11px] leading-relaxed dark:border-neutral-700">
                  <span className="block font-bold tracking-wider text-foreground uppercase">Transfer Instructions:</span>

                  {paymentMethod === "gcash" && (
                    <div className="space-y-1">
                      <p>
                        GCash Account Number: <strong className="text-foreground">0917 123 4567</strong>
                      </p>
                      <p>
                        Account Name: <strong className="text-foreground">Ariel Batoon</strong>
                      </p>
                      <p className="mt-2 text-[10px] text-neutral-400">
                        Please send the exact amount of <strong>₱{totalAmount.toLocaleString()}</strong>, then copy the Reference Number and
                        screenshot the receipt.
                      </p>
                    </div>
                  )}
                  {paymentMethod === "maya" && (
                    <div className="space-y-1">
                      <p>
                        Maya Account Number: <strong className="text-foreground">0917 123 4567</strong>
                      </p>
                      <p>
                        Account Name: <strong className="text-foreground">Ariel Batoon</strong>
                      </p>
                      <p className="mt-2 text-[10px] text-neutral-400">
                        Please transfer <strong>₱{totalAmount.toLocaleString()}</strong> and record your Maya receipt confirmation details.
                      </p>
                    </div>
                  )}
                  {paymentMethod === "bpi" && (
                    <div className="space-y-1">
                      <p>
                        BPI Account Number: <strong className="text-foreground">1234-5678-90</strong>
                      </p>
                      <p>
                        Account Name: <strong className="text-foreground">Ariel Batoon</strong>
                      </p>
                      <p>
                        Account Type: <strong className="text-foreground">Savings</strong>
                      </p>
                      <p className="mt-2 text-[10px] text-neutral-400">
                        Please transfer BPI-to-BPI or via Instapay. Total: <strong>₱{totalAmount.toLocaleString()}</strong>.
                      </p>
                    </div>
                  )}
                  {paymentMethod === "wise" && (
                    <div className="space-y-1">
                      <p>
                        Wise Email: <strong className="text-foreground">arielbatoon09@gmail.com</strong>
                      </p>
                      <p>
                        Account Name: <strong className="text-foreground">Ariel Batoon</strong>
                      </p>
                      <p className="mt-2 text-[10px] text-neutral-400">
                        Internationals can send transfer through Wise directly to our local bank or email. Total:{" "}
                        <strong>₱{totalAmount.toLocaleString()}</strong>.
                      </p>
                    </div>
                  )}
                </div>

                {/* Ref & Receipt Upload */}
                <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-2">
                  <Field>
                    <FieldLabel className="text-[9px] tracking-wider text-neutral-400 uppercase">Payment Reference Number *</FieldLabel>
                    <Input
                      value={referenceNumber}
                      onChange={(e) => setReferenceNumber(e.target.value)}
                      placeholder="e.g. 5013 8927 1224"
                      required
                      className="h-10 rounded-none border-dashed border-neutral-300 focus-visible:border-solid dark:border-neutral-700"
                    />
                  </Field>

                  <Field>
                    <FieldLabel className="text-[9px] tracking-wider text-neutral-400 uppercase">Upload Receipt Screenshot *</FieldLabel>
                    <div className="relative flex min-h-[40px] cursor-pointer flex-col justify-center border border-dashed border-neutral-300 bg-neutral-50/50 p-3 text-center hover:border-neutral-500 dark:border-neutral-700">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      />
                      {receiptFile ? (
                        <span className="block truncate text-[10px] font-bold text-emerald-500">
                          ✓ {receiptFile.name} ({(receiptFile.size / 1024).toFixed(1)} KB)
                        </span>
                      ) : (
                        <div className="space-y-0.5">
                          <span className="block text-[10px] text-neutral-500">Click to Select Receipt Photo</span>
                          <span className="text-neutral-450 block text-[8px]">PNG, JPG, WebP up to 5MB</span>
                        </div>
                      )}
                    </div>
                  </Field>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Summary Panel */}
          <div className="h-fit space-y-6 lg:sticky lg:top-24">
            <div className="flex flex-col justify-between space-y-6 border border-dashed border-neutral-300 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-900/60">
              <div className="space-y-5">
                <div className="text-neutral-450 flex items-center gap-1.5 border-b border-dashed border-neutral-300 pb-3 font-mono text-[10px] uppercase dark:border-neutral-700">
                  <Sparkles className="size-3.5 animate-pulse text-emerald-500" /> Investment Summary
                </div>

                {/* Price & Delivery Specs */}
                <div className="grid grid-cols-2 gap-4 border-b border-dashed border-neutral-300 pb-4 font-mono text-[11px] tracking-wider uppercase dark:border-neutral-700">
                  <div className="space-y-1">
                    <span className="text-neutral-450">Delivery</span>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                      <Clock className="size-3.5" />
                      {service.deliveryTime}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-neutral-450">Base Rate</span>
                    <div className="text-xs font-bold text-foreground">₱{service.price.toLocaleString()}</div>
                  </div>
                </div>

                {/* Selected upgrades list */}
                <div className="space-y-2">
                  <span className="block font-mono text-[9px] tracking-widest text-neutral-400 uppercase">Configured Upgrades</span>
                  {selectedAddons.length > 0 ? (
                    <div className="space-y-1.5">
                      {selectedAddons.map((id) => {
                        const addon = service.addOns.find((a) => a.id === id);
                        if (!addon) return null;
                        return (
                          <div key={id} className="flex items-center justify-between font-sans text-[10px] text-neutral-600 dark:text-neutral-400">
                            <span className="truncate pr-2">✓ {addon.name}</span>
                            <span className="shrink-0 font-mono font-semibold text-foreground">+₱{addon.price.toLocaleString()}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <span className="block font-mono text-[9px] text-neutral-400 uppercase italic">No upgrades selected</span>
                  )}
                </div>
              </div>

              {/* Checkout Pricing footer */}
              <div className="space-y-4 border-t border-dashed border-neutral-300 pt-4 dark:border-neutral-700">
                <div className="flex justify-between font-mono text-xs font-bold text-foreground">
                  <span>Investment Total:</span>
                  <span>₱{totalAmount.toLocaleString()}</span>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-10 w-full cursor-pointer rounded-none bg-foreground font-mono text-xs tracking-wider text-background uppercase transition-colors hover:bg-foreground/90"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-1.5 size-3.5 animate-spin" /> Booking...
                    </>
                  ) : (
                    <>Submit Booking</>
                  )}
                </Button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="text-neutral-450 space-y-2 border border-dashed border-neutral-300 p-4 font-mono text-[9px] tracking-wider uppercase dark:border-neutral-700">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-3.5 shrink-0 text-emerald-500" />
                <span>Verified payments & invoice generation</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-3.5 shrink-0 text-emerald-500" />
                <span>Fully client-owned source code deliveries</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Section>
  );
}
