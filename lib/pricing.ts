export type ServiceDiscountType = "percent" | "fixed" | null | undefined;

/** Normalize DB / form values so only exact percent|fixed apply. */
export function normalizeDiscountType(discountType: unknown): "percent" | "fixed" | null {
  if (typeof discountType !== "string") return null;
  const normalized = discountType.trim().toLowerCase();
  if (normalized === "percent" || normalized === "percentage") return "percent";
  if (normalized === "fixed" || normalized === "amount" || normalized === "flat") return "fixed";
  return null;
}

export function stripHtml(html: string) {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Package price after discount (add-ons are not discounted). */
export function getDiscountedBasePrice(price: number, discountType?: unknown, discountValue?: number | null) {
  const type = normalizeDiscountType(discountType);
  const value = Number(discountValue ?? 0);
  if (!type || !Number.isFinite(value) || value <= 0) return price;

  if (type === "percent") {
    const percent = Math.min(value, 100);
    return Math.max(0, Math.round(price * (1 - percent / 100)));
  }

  // fixed: discountValue is the final sale price (not amount off)
  const salePrice = Math.round(value);
  if (salePrice >= price) return price;
  return Math.max(0, salePrice);
}

export function hasActiveDiscount(price: number, discountType?: unknown, discountValue?: number | null) {
  return getDiscountedBasePrice(price, discountType, discountValue) < price;
}

export function formatPhp(amount: number) {
  return `₱${amount.toLocaleString()}`;
}

export function getServicePricing(service: {
  price: number;
  discountType?: unknown;
  discountValue?: number | null;
}) {
  const listPrice = service.price;
  const type = normalizeDiscountType(service.discountType);
  const basePrice = getDiscountedBasePrice(listPrice, type, service.discountValue);
  const discounted = basePrice < listPrice;
  const savings = Math.max(0, listPrice - basePrice);

  return {
    listPrice,
    basePrice,
    discounted,
    savings,
    discountType: type,
    discountLabel:
      !discounted || !type
        ? null
        : type === "percent"
          ? `${Math.min(Number(service.discountValue ?? 0), 100)}% OFF`
          : `${formatPhp(savings)} OFF`,
  };
}

export function getServiceOrderTotal(
  service: {
    price: number;
    discountType?: unknown;
    discountValue?: number | null;
    addOns?: Array<{ id: string; price: number }>;
  },
  selectedAddonIds: string[]
) {
  const { basePrice } = getServicePricing(service);
  const addonsTotal = selectedAddonIds.reduce((sum, id) => {
    const addon = service.addOns?.find((a) => a.id === id);
    return sum + (addon?.price || 0);
  }, 0);
  return basePrice + addonsTotal;
}

/** Server-trusted quote: discounted base + only known add-ons from the service record. */
export function buildServiceOrderQuote(
  service: {
    name: string;
    price: number;
    discountType?: unknown;
    discountValue?: number | null;
    addOns?: Array<{ id: string; name: string; price: number }>;
  },
  selectedAddonIds: string[]
) {
  const pricing = getServicePricing(service);
  const uniqueIds = [...new Set(selectedAddonIds.filter(Boolean))];
  const addOns: Array<{ id: string; name: string; price: number }> = [];

  for (const id of uniqueIds) {
    const addon = service.addOns?.find((a) => a.id === id);
    if (addon) {
      addOns.push({ id: addon.id, name: addon.name, price: addon.price });
    }
  }

  const addOnsTotal = addOns.reduce((sum, addon) => sum + addon.price, 0);

  return {
    serviceName: service.name,
    serviceBasePrice: pricing.basePrice,
    listPrice: pricing.listPrice,
    discountType: pricing.discountType,
    discountLabel: pricing.discountLabel,
    addOns,
    addOnsSelected: addOns.map((a) => a.id),
    totalAmount: pricing.basePrice + addOnsTotal,
  };
}
