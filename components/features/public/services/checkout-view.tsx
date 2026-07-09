"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCreateOrderMutation } from "@/hooks/use-orders";
import { useCreateTransactionMutation } from "@/hooks/use-transactions";
import { getReceiptPresignedUrlAction } from "@/services/media";
import type { Service } from "@/schemas/dashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Check, Loader2, ArrowLeft, ShieldCheck, Clock, Sparkles } from "lucide-react";
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
  const initialAddons = React.useMemo(() => {
    const addonsParam = searchParams.get("addons");
    return addonsParam ? addonsParam.split(",").filter(Boolean) : [];
  }, [searchParams]);

  // Form states
  const [customerName, setCustomerName] = React.useState("");
  const [customerEmail, setCustomerEmail] = React.useState("");
  const [customerPhone, setCustomerPhone] = React.useState("");
  const [requirements, setRequirements] = React.useState("");
  const [selectedAddons, setSelectedAddons] = React.useState<string[]>(initialAddons);
  const [paymentMethod, setPaymentMethod] = React.useState<"gcash" | "maya" | "bpi" | "wise">("gcash");
  const [referenceNumber, setReferenceNumber] = React.useState("");
  const [receiptFile, setReceiptFile] = React.useState<File | null>(null);
  
  // States for flow
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [createdOrder, setCreatedOrder] = React.useState<any | null>(null);

  // Recalculate total amount
  const totalAmount = React.useMemo(() => {
    const base = service.price;
    const addonsTotal = selectedAddons.reduce((sum, id) => {
      const addon = service.addOns.find((a) => a.id === id);
      return sum + (addon?.price || 0);
    }, 0);
    return base + addonsTotal;
  }, [service, selectedAddons]);

  const toggleAddon = (id: string) => {
    setSelectedAddons((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id]
    );
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
        customerName,
        customerEmail,
        addOnsSelected: selectedAddons,
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

  if (!isSuccess) {
    return (
      <Section id="checkout-success" containerClassName="py-16 md:py-24 min-h-[90vh] flex flex-col justify-center" showTopLine={false} showBottomLine={true}>
        <div className="max-w-3xl mx-auto w-full space-y-8 animate-in fade-in zoom-in duration-500">
          
          {/* Header State */}
          <div className="text-center space-y-4">
            <div className="mx-auto size-14 rounded-full bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center border border-dashed border-emerald-500">
              <ShieldCheck className="size-7 text-emerald-500" />
            </div>
            <div className="space-y-1">
              <span className="font-mono text-[10px] text-emerald-500 uppercase tracking-widest font-bold">Transaction Recorded</span>
              <h1 className="font-sans text-3xl font-extrabold tracking-tight text-foreground uppercase">
                Order Received
              </h1>
            </div>
            <p className="text-neutral-500 font-sans text-xs md:text-sm max-w-lg mx-auto leading-relaxed">
              Thank you! Your order details and proof of payment are undergoing verification. We will get back to you via email in <strong className="text-foreground">less than 12 hours</strong>.
            </p>
          </div>

          {/* Details & Next Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {/* Left: Summary Panel */}
            <div className="border border-dashed border-neutral-350 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/10 p-6 space-y-4">
              <span className="block font-mono text-[9px] text-neutral-400 uppercase tracking-widest border-b border-dashed border-neutral-300 pb-2 dark:border-neutral-700">
                Order Reference Summary
              </span>
              
              <div className="space-y-3 font-mono text-xs text-neutral-500">
                <div className="flex justify-between items-center">
                  <span>Selected Package:</span>
                  <span className="font-sans font-bold text-foreground text-right">{service.name}</span>
                </div>
                {createdOrder && createdOrder.referenceNumber && (
                  <div className="flex justify-between items-center">
                    <span>Order Reference:</span>
                    <span className="font-bold text-foreground">{createdOrder.referenceNumber}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span>Amount Deposited:</span>
                  <span className="font-bold text-foreground text-sm">₱{totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center border-t border-dashed border-neutral-300 pt-3 dark:border-neutral-700">
                  <span>Account Setup:</span>
                  <span className="font-sans font-medium text-foreground text-right">{customerEmail}</span>
                </div>
              </div>
            </div>

            {/* Right: Next Steps Timeline */}
            <div className="border border-dashed border-neutral-350 dark:border-neutral-700 p-6 space-y-4 bg-background">
              <span className="block font-mono text-[9px] text-neutral-400 uppercase tracking-widest border-b border-dashed border-neutral-300 pb-2 dark:border-neutral-700">
                Workflow Delivery Steps
              </span>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="size-4 rounded-full bg-emerald-500 flex items-center justify-center text-[8px] font-bold text-white">✓</div>
                    <div className="w-[1px] h-full bg-neutral-200 dark:bg-neutral-800 min-h-[20px]" />
                  </div>
                  <div>
                    <h4 className="font-sans text-xs font-bold text-foreground">Order Staged</h4>
                    <p className="text-[10px] text-neutral-400 mt-0.5">Booking details & payment receipt uploaded successfully.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="size-4 rounded-full border border-dashed border-yellow-500 bg-yellow-500/10 flex items-center justify-center text-[8px] font-bold text-yellow-500">2</div>
                    <div className="w-[1px] h-full bg-neutral-200 dark:bg-neutral-800 min-h-[20px]" />
                  </div>
                  <div>
                    <h4 className="font-sans text-xs font-bold text-foreground">Manual Verification</h4>
                    <p className="text-[10px] text-neutral-400 mt-0.5">We will audit your payment proof shortly. Once verified, new clients will receive credentials via email to access the customer panel, while existing clients can log in to their dashboard to track progress.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="size-4 rounded-full border border-neutral-350 flex items-center justify-center text-[8px] font-bold text-neutral-400">3</div>
                  </div>
                  <div>
                    <h4 className="font-sans text-xs font-bold text-neutral-450 dark:text-neutral-500">Project Workspace Setup</h4>
                    <p className="text-[10px] text-neutral-450 mt-0.5">Once verified, we start working and setup your demo preview build.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="text-center pt-4">
            <Button onClick={() => router.push("/services")} className="h-10 px-8 rounded-none bg-foreground font-mono text-xs uppercase text-background hover:bg-foreground/90 transition-colors">
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
        <div className="border border-dashed border-neutral-300 p-6 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/10">
          <span className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest">Service Checkout</span>
          <h1 className="font-sans text-2xl font-bold tracking-tight text-foreground md:text-3xl mt-1">
            Complete Booking: {service.name}
          </h1>
        </div>

        <form onSubmit={handleSubmitCheckout} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column: Form Fields */}
          <div className="lg:col-span-2 space-y-8">
            {/* Step 1: Customer Details */}
            <div className="border border-dashed border-neutral-300 p-6 dark:border-neutral-700 space-y-6">
              <h3 className="font-sans text-sm font-bold tracking-wider text-foreground uppercase border-b border-dashed border-neutral-300 pb-3 dark:border-neutral-700">
                1. Contact Specifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="border border-dashed border-neutral-300 p-6 dark:border-neutral-700 space-y-6">
              <h3 className="font-sans text-sm font-bold tracking-wider text-foreground uppercase border-b border-dashed border-neutral-300 pb-3 dark:border-neutral-700">
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
                  className="w-full resize-y rounded-none border border-dashed border-neutral-300 bg-background/50 p-3 font-sans text-xs outline-none focus:border-solid focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-neutral-150 min-h-[160px]"
                />
              </Field>
            </div>

            {/* Step 3: Upgrades Selection */}
            {service.addOns.length > 0 && (
              <div className="border border-dashed border-neutral-300 p-6 dark:border-neutral-700 space-y-6">
                <h3 className="font-sans text-sm font-bold tracking-wider text-foreground uppercase border-b border-dashed border-neutral-300 pb-3 dark:border-neutral-700">
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
                          "cursor-pointer border border-dashed p-4 flex items-start gap-3 transition-colors bg-background/50 select-none",
                          selected
                            ? "border-neutral-900 bg-neutral-100/10 dark:border-neutral-100"
                            : "border-neutral-300 hover:border-neutral-500 dark:border-neutral-700"
                        )}
                      >
                        <button
                          type="button"
                          className={cn(
                            "mt-0.5 size-4 rounded-none border flex items-center justify-center transition-colors shrink-0",
                            selected ? "bg-neutral-900 border-neutral-900 text-white dark:bg-white dark:text-black" : "border-neutral-300 bg-transparent"
                          )}
                        >
                          {selected && <Check className="size-3" />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold font-sans text-xs text-foreground">{addon.name}</span>
                            <span className="font-mono text-xs font-bold text-foreground shrink-0">+₱{addon.price.toLocaleString()}</span>
                          </div>
                          {addon.description && (
                            <p className="text-[10px] text-neutral-500 mt-1 leading-relaxed font-sans">{addon.description}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 4: Payment Verification */}
            <div className="border border-dashed border-neutral-300 p-6 dark:border-neutral-700 space-y-6">
              <h3 className="font-sans text-sm font-bold tracking-wider text-foreground uppercase border-b border-dashed border-neutral-300 pb-3 dark:border-neutral-700">
                {service.addOns.length > 0 ? "4." : "3."} Payment & Verification
              </h3>

              <div className="space-y-4">
                <span className="block font-mono text-[9px] text-neutral-400 uppercase tracking-wider">Select Payment Channel</span>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { id: "gcash", label: "GCash" },
                    { id: "maya", label: "Maya" },
                    { id: "bpi", label: "BPI Bank" },
                    { id: "wise", label: "Wise" },
                  ] as const).map((method) => (
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
                <div className="border border-dashed border-neutral-300 bg-neutral-50/50 p-5 font-mono text-[11px] space-y-3 dark:border-neutral-700 leading-relaxed">
                  <span className="block font-bold uppercase tracking-wider text-foreground">Transfer Instructions:</span>
                  
                  {paymentMethod === "gcash" && (
                    <div className="space-y-1">
                      <p>GCash Account Number: <strong className="text-foreground">0917 123 4567</strong></p>
                      <p>Account Name: <strong className="text-foreground">Ariel Batoon</strong></p>
                      <p className="text-neutral-400 text-[10px] mt-2">Please send the exact amount of <strong>₱{totalAmount.toLocaleString()}</strong>, then copy the Reference Number and screenshot the receipt.</p>
                    </div>
                  )}
                  {paymentMethod === "maya" && (
                    <div className="space-y-1">
                      <p>Maya Account Number: <strong className="text-foreground">0917 123 4567</strong></p>
                      <p>Account Name: <strong className="text-foreground">Ariel Batoon</strong></p>
                      <p className="text-neutral-400 text-[10px] mt-2">Please transfer <strong>₱{totalAmount.toLocaleString()}</strong> and record your Maya receipt confirmation details.</p>
                    </div>
                  )}
                  {paymentMethod === "bpi" && (
                    <div className="space-y-1">
                      <p>BPI Account Number: <strong className="text-foreground">1234-5678-90</strong></p>
                      <p>Account Name: <strong className="text-foreground">Ariel Batoon</strong></p>
                      <p>Account Type: <strong className="text-foreground">Savings</strong></p>
                      <p className="text-neutral-400 text-[10px] mt-2">Please transfer BPI-to-BPI or via Instapay. Total: <strong>₱{totalAmount.toLocaleString()}</strong>.</p>
                    </div>
                  )}
                  {paymentMethod === "wise" && (
                    <div className="space-y-1">
                      <p>Wise Email: <strong className="text-foreground">arielbatoon09@gmail.com</strong></p>
                      <p>Account Name: <strong className="text-foreground">Ariel Batoon</strong></p>
                      <p className="text-neutral-400 text-[10px] mt-2">Internationals can send transfer through Wise directly to our local bank or email. Total: <strong>₱{totalAmount.toLocaleString()}</strong>.</p>
                    </div>
                  )}
                </div>

                {/* Ref & Receipt Upload */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
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
                    <div className="relative border border-dashed border-neutral-300 hover:border-neutral-500 bg-neutral-50/50 p-3 text-center cursor-pointer dark:border-neutral-700 min-h-[40px] flex flex-col justify-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {receiptFile ? (
                        <span className="block text-emerald-500 font-bold truncate text-[10px]">✓ {receiptFile.name} ({(receiptFile.size / 1024).toFixed(1)} KB)</span>
                      ) : (
                        <div className="space-y-0.5">
                          <span className="block text-neutral-500 text-[10px]">Click to Select Receipt Photo</span>
                          <span className="block text-[8px] text-neutral-450">PNG, JPG, WebP up to 5MB</span>
                        </div>
                      )}
                    </div>
                  </Field>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Summary Panel */}
          <div className="space-y-6 lg:sticky lg:top-24 h-fit">
            <div className="border border-dashed border-neutral-300 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-900/60 flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div className="border-b border-dashed border-neutral-300 pb-3 dark:border-neutral-700 font-mono text-[10px] uppercase text-neutral-450 flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-emerald-500 animate-pulse" /> Investment Summary
                </div>

                {/* Price & Delivery Specs */}
                <div className="grid grid-cols-2 gap-4 border-b border-dashed border-neutral-300 pb-4 dark:border-neutral-700 font-mono text-[11px] uppercase tracking-wider">
                  <div className="space-y-1">
                    <span className="text-neutral-450">Delivery</span>
                    <div className="font-bold text-foreground text-xs flex items-center gap-1.5">
                      <Clock className="size-3.5" />
                      {service.deliveryTime}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-neutral-450">Base Rate</span>
                    <div className="font-bold text-foreground text-xs">₱{service.price.toLocaleString()}</div>
                  </div>
                </div>

                {/* Selected upgrades list */}
                <div className="space-y-2">
                  <span className="block font-mono text-[9px] text-neutral-400 uppercase tracking-widest">Configured Upgrades</span>
                  {selectedAddons.length > 0 ? (
                    <div className="space-y-1.5">
                      {selectedAddons.map((id) => {
                        const addon = service.addOns.find((a) => a.id === id);
                        if (!addon) return null;
                        return (
                          <div key={id} className="flex justify-between items-center text-[10px] text-neutral-600 dark:text-neutral-400 font-sans">
                            <span className="truncate pr-2">✓ {addon.name}</span>
                            <span className="font-mono text-foreground font-semibold shrink-0">+₱{addon.price.toLocaleString()}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <span className="block font-mono text-[9px] text-neutral-400 italic uppercase">No upgrades selected</span>
                  )}
                </div>
              </div>

              {/* Checkout Pricing footer */}
              <div className="space-y-4 pt-4 border-t border-dashed border-neutral-300 dark:border-neutral-700">
                <div className="flex justify-between font-mono text-xs font-bold text-foreground">
                  <span>Investment Total:</span>
                  <span>₱{totalAmount.toLocaleString()}</span>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-10 w-full cursor-pointer rounded-none font-mono text-xs tracking-wider uppercase bg-foreground text-background hover:bg-foreground/90 transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-1.5 size-3.5 animate-spin" /> Booking...
                    </>
                  ) : (
                    <>
                      Submit Booking
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="border border-dashed border-neutral-300 p-4 dark:border-neutral-700 font-mono text-[9px] uppercase tracking-wider text-neutral-450 space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-3.5 text-emerald-500 shrink-0" />
                <span>Verified payments & invoice generation</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-3.5 text-emerald-500 shrink-0" />
                <span>Fully client-owned source code deliveries</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Section>
  );
}
