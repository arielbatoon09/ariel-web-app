"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Clock, CalendarDays, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ReCaptchaV2 } from "@/components/common/recaptcha-v2";
import { useAvailableSlotsQuery, useBookableDatesQuery, useCreateBookingMutation } from "@/hooks/use-bookings";
import { formatDateKeyInZone } from "@/lib/booking-slots";
import { DEFAULT_BOOKING_TIMEZONE, BOOKING_INQUIRY_MAX_LENGTH, BOOKING_INQUIRY_MIN_LENGTH } from "@/constants/booking";

type Step = "pick" | "form" | "done";

function monthKeyFromDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function buildMonthGrid(year: number, monthIndex: number) {
  const first = new Date(year, monthIndex, 1);
  const startPad = first.getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells: Array<{ day: number | null; dateKey: string | null }> = [];

  for (let i = 0; i < startPad; i++) cells.push({ day: null, dateKey: null });
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({
      day,
      dateKey: `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    });
  }
  while (cells.length % 7 !== 0) cells.push({ day: null, dateKey: null });
  return cells;
}

export function DiscoveryBookingWidget({ compact = false }: { compact?: boolean }) {
  const [viewMonth, setViewMonth] = useState(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ startIso: string; endIso: string; label: string } | null>(null);
  const [step, setStep] = useState<Step>("pick");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [inquiry, setInquiry] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const monthKey = monthKeyFromDate(viewMonth);
  const { data: datesData, isLoading: datesLoading } = useBookableDatesQuery(monthKey);
  const { data: slotsData, isLoading: slotsLoading } = useAvailableSlotsQuery(selectedDate);
  const createMutation = useCreateBookingMutation();

  const timezone = datesData?.settings?.timezone || DEFAULT_BOOKING_TIMEZONE;
  const duration = datesData?.settings?.slotDurationMinutes || 30;
  const bookableSet = useMemo(() => new Set(datesData?.dates || []), [datesData?.dates]);
  const cells = useMemo(() => buildMonthGrid(viewMonth.getFullYear(), viewMonth.getMonth()), [viewMonth]);

  const selectedDateLabel = selectedDate
    ? new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }).format(new Date(`${selectedDate}T12:00:00`))
    : null;

  const canSubmit =
    guestName.trim().length >= 2 &&
    guestEmail.includes("@") &&
    inquiry.trim().length >= BOOKING_INQUIRY_MIN_LENGTH &&
    inquiry.trim().length <= BOOKING_INQUIRY_MAX_LENGTH &&
    !!selectedSlot &&
    !!recaptchaToken &&
    !createMutation.isPending;

  const handlePrevMonth = () => {
    setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));
  };

  const handleSelectDate = (dateKey: string) => {
    setSelectedDate(dateKey);
    setSelectedSlot(null);
    setStep("pick");
  };

  const handleSelectSlot = (slot: { startIso: string; endIso: string; label: string }) => {
    setSelectedSlot(slot);
    setStep("form");
  };

  const handleSubmit = async () => {
    if (!selectedSlot || !recaptchaToken) return;
    try {
      await createMutation.mutateAsync({
        guestName: guestName.trim(),
        guestEmail: guestEmail.trim(),
        guestPhone: guestPhone.trim() || undefined,
        inquiry: inquiry.trim(),
        scheduledStartIso: selectedSlot.startIso,
        recaptchaToken,
      });
      setStep("done");
    } catch {
      // toast handled in mutation
    }
  };

  if (step === "done") {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center gap-4 border border-dashed border-neutral-300 bg-background p-8 text-center dark:border-neutral-700">
        <CheckCircle2 className="size-10 text-foreground" />
        <div className="space-y-2">
          <h3 className="font-sans text-xl font-bold">Request received</h3>
          <p className="max-w-md font-mono text-xs text-neutral-500 uppercase">Pending confirmation · Check your email shortly</p>
          <p className="mx-auto max-w-sm text-sm text-neutral-500">
            I&apos;ll review your Discovery Call request and confirm the time. You&apos;ll get an email once it&apos;s confirmed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group relative z-10 w-full border border-dashed border-neutral-300 bg-background transition-colors dark:border-neutral-700",
        compact ? "min-h-[560px]" : "min-h-[640px]"
      )}
    >
      <div className="pointer-events-none absolute top-0 right-0 z-20 translate-x-1/2 -translate-y-1/2 text-[10px] text-neutral-300 dark:text-neutral-700">
        +
      </div>
      <div className="pointer-events-none absolute right-0 bottom-0 z-20 translate-x-1/2 translate-y-1/2 text-[10px] text-neutral-300 dark:text-neutral-700">
        +
      </div>

      <div className="grid lg:grid-cols-[240px_1fr_240px]">
        {/* Event info */}
        <aside className="space-y-4 border-b border-dashed border-neutral-200 bg-neutral-50 p-5 lg:border-r lg:border-b-0 dark:border-neutral-800 dark:bg-neutral-900/80">
          <div className="inline-flex items-center justify-center border border-dashed border-neutral-700 bg-neutral-950 px-3 py-2 dark:border-neutral-300 dark:bg-white">
            <div className="relative flex h-10 items-center bg-black dark:bg-white">
              <Image
                src="/icons/ab-logo-text-white.png"
                className="block h-12 w-auto object-contain dark:hidden"
                alt="Ariel Batoon logo"
                width={80}
                height={48}
                style={{ width: "auto" }}
                priority
              />
              <Image
                src="/icons/ab-logo-text-dark.png"
                className="hidden h-12 w-auto object-contain dark:block"
                alt="Ariel Batoon logo"
                width={80}
                height={48}
                style={{ width: "auto" }}
                priority
              />
            </div>
          </div>
          <span className="text-neutral-450 mb-1 block font-mono text-[10px] tracking-widest uppercase">Discovery Call</span>
          <h3 className="font-sans text-lg leading-tight font-bold">Free consultation</h3>
          <div className="space-y-2 font-mono text-[11px] text-neutral-500">
            <p className="flex items-center gap-2">
              <Clock className="size-3.5" /> {duration} minutes
            </p>
            <p className="flex items-center gap-2">
              <CalendarDays className="size-3.5" /> {timezone.replace(/_/g, " ")}
            </p>
          </div>
          <p className="text-xs leading-relaxed text-neutral-500">
            Pick a day and time. New requests start as <span className="font-medium text-foreground">pending</span> until I confirm.
          </p>
          {selectedDateLabel && selectedSlot && (
            <div className="border border-dashed border-neutral-300 p-3 dark:border-neutral-700">
              <p className="font-mono text-[9px] tracking-wider text-neutral-400 uppercase">Selected</p>
              <p className="mt-1 font-sans text-sm font-bold">{selectedDateLabel}</p>
              <p className="font-mono text-xs text-neutral-500">{selectedSlot.label}</p>
            </div>
          )}
        </aside>

        {/* Calendar / Form */}
        <div className="border-b border-dashed border-neutral-200 p-5 lg:border-b-0 dark:border-neutral-800">
          {step === "form" && selectedSlot ? (
            <div className="mx-auto max-w-md space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h4 className="font-sans text-base font-bold">Your details</h4>
                  <p className="font-mono text-[10px] text-neutral-400 uppercase">
                    {selectedDateLabel} · {selectedSlot.label}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-none font-mono text-[10px] uppercase"
                  onClick={() => setStep("pick")}
                >
                  Back
                </Button>
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-neutral-400 uppercase">Name *</label>
                <Input
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="h-9 rounded-none border-dashed"
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-neutral-400 uppercase">Email *</label>
                <Input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="h-9 rounded-none border-dashed"
                  placeholder="you@company.com"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-neutral-400 uppercase">Phone (optional)</label>
                <Input
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="h-9 rounded-none border-dashed"
                  placeholder="+63…"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <label className="font-mono text-[10px] text-neutral-400 uppercase">Inquiry *</label>
                  <span
                    className={cn(
                      "font-mono text-[10px] tabular-nums",
                      inquiry.length >= BOOKING_INQUIRY_MAX_LENGTH
                        ? "text-red-500"
                        : inquiry.trim().length < BOOKING_INQUIRY_MIN_LENGTH
                          ? "text-neutral-400"
                          : "text-neutral-500"
                    )}
                  >
                    {inquiry.length} / {BOOKING_INQUIRY_MAX_LENGTH}
                  </span>
                </div>
                <Textarea
                  value={inquiry}
                  onChange={(e) => setInquiry(e.target.value.slice(0, BOOKING_INQUIRY_MAX_LENGTH))}
                  maxLength={BOOKING_INQUIRY_MAX_LENGTH}
                  className="min-h-24 rounded-none border-dashed"
                  placeholder="What are you looking to build or discuss?"
                />
              </div>
              <ReCaptchaV2 onChange={setRecaptchaToken} />
              <Button type="button" disabled={!canSubmit} onClick={handleSubmit} className="h-9 w-full rounded-none font-mono text-[10px] uppercase">
                {createMutation.isPending ? "Submitting…" : "Request booking"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-sans text-base font-bold">{viewMonth.toLocaleString("en-US", { month: "long", year: "numeric" })}</h4>
                <div className="flex gap-1">
                  <Button type="button" variant="outline" size="icon-sm" className="rounded-none" onClick={handlePrevMonth}>
                    <ChevronLeft className="size-4" />
                  </Button>
                  <Button type="button" variant="outline" size="icon-sm" className="rounded-none" onClick={handleNextMonth}>
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px] text-neutral-400 uppercase">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <div key={d} className="py-1">
                    {d}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {cells.map((cell, idx) => {
                  if (!cell.dateKey || cell.day === null) {
                    return <div key={`empty-${idx}`} className="aspect-square" />;
                  }
                  const enabled = bookableSet.has(cell.dateKey);
                  const isSelected = selectedDate === cell.dateKey;
                  const todayKey = formatDateKeyInZone(new Date(), timezone);
                  const isToday = cell.dateKey === todayKey;

                  return (
                    <button
                      key={cell.dateKey}
                      type="button"
                      disabled={!enabled || datesLoading}
                      onClick={() => handleSelectDate(cell.dateKey!)}
                      className={cn(
                        "aspect-square rounded-none border border-transparent font-sans text-sm transition-colors",
                        enabled
                          ? "hover:border-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                          : "cursor-not-allowed text-neutral-300 dark:text-neutral-700",
                        isSelected && "border-foreground bg-foreground text-background hover:bg-foreground",
                        isToday && !isSelected && enabled && "border-dashed border-neutral-400"
                      )}
                    >
                      {cell.day}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Time slots */}
        <aside className="max-h-[640px] overflow-y-auto p-5">
          <p className="mb-3 font-mono text-[10px] tracking-wider text-neutral-400 uppercase">{selectedDate ? selectedDateLabel : "Select a date"}</p>
          {!selectedDate ? (
            <p className="text-xs text-neutral-500">Choose an available day to see open times.</p>
          ) : slotsLoading ? (
            <p className="font-mono text-[10px] text-neutral-400 uppercase">Loading slots…</p>
          ) : (slotsData?.slots?.length || 0) === 0 ? (
            <p className="text-xs text-neutral-500">No open times left for this day.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {slotsData!.slots!.map((slot) => {
                const active = selectedSlot?.startIso === slot.startIso;
                return (
                  <button
                    key={slot.startIso}
                    type="button"
                    onClick={() => handleSelectSlot(slot)}
                    className={cn(
                      "h-9 border border-dashed border-neutral-300 px-3 text-left font-mono text-xs transition-colors dark:border-neutral-700",
                      active ? "border-solid border-foreground bg-foreground text-background" : "hover:bg-neutral-100 dark:hover:bg-neutral-900"
                    )}
                  >
                    {slot.label}
                  </button>
                );
              })}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
