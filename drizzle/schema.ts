import { pgEnum, pgTable, serial, text, varchar, timestamp, integer, boolean, index, jsonb, uuid } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["admin", "client"]);
export const workStatusEnum = pgEnum("work_status", ["draft", "published", "unpublished"]);
export const articleStatusEnum = pgEnum("article_status", ["draft", "published", "unpublished"]);

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    authId: text("auth_id").unique(),
    fullName: text("full_name"),
    phone: varchar("phone", { length: 256 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("users_auth_id_idx").on(table.authId)]
);

export const userRoles = pgTable(
  "user_roles",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    role: roleEnum("role").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("user_roles_user_id_idx").on(table.userId), index("user_roles_role_idx").on(table.role)]
);

export const categories = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").unique().notNull(),
    target: text("target").notNull(),
    disabled: boolean("disabled").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("categories_name_idx").on(table.name),
    index("categories_slug_idx").on(table.slug),
    index("categories_target_idx").on(table.target),
  ]
);

export const works = pgTable(
  "works",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").unique().notNull(),
    tag: text("tag").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    imageSrc: text("image_src").notNull(),
    gallery: jsonb("gallery").$type<string[]>().default([]).notNull(),
    tags: jsonb("tags").$type<string[]>().default([]).notNull(),
    link: text("link").notNull(),
    categories: jsonb("categories").$type<string[]>().default([]).notNull(),
    caseStudy: jsonb("case_study")
      .$type<{
        role: string;
        timeline: string;
        challenge: string;
        solution: string;
        features: Array<{ title: string; description: string }>;
        results: string[];
        client?: string;
        liveUrl?: string;
        githubUrl?: string;
      }>()
      .notNull(),
    seo: jsonb("seo").$type<{
      title?: string;
      description?: string;
      keywords?: string;
      ogTitle?: string;
      ogDescription?: string;
      ogImage?: string;
      canonicalUrl?: string;
    }>(),
    draft: jsonb("draft").$type<{
      slug: string;
      tag: string;
      title: string;
      description: string;
      imageSrc: string;
      gallery: string[];
      tags: string[];
      link: string;
      categories: string[];
      caseStudy: {
        role: string;
        timeline: string;
        challenge: string;
        solution: string;
        features: Array<{ title: string; description: string }>;
        results: string[];
        client?: string;
        liveUrl?: string;
        githubUrl?: string;
      };
      seo?: {
        title?: string;
        description?: string;
        keywords?: string;
        ogTitle?: string;
        ogDescription?: string;
        ogImage?: string;
        canonicalUrl?: string;
      };
      isFeatured?: boolean;
    }>(),
    status: workStatusEnum("status").default("draft").notNull(),
    isFeatured: boolean("is_featured").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("works_slug_idx").on(table.slug), index("works_title_idx").on(table.title)]
);

export const mediaAssets = pgTable(
  "media_assets",
  {
    id: serial("id").primaryKey(),
    filename: text("filename").notNull(),
    url: text("url").notNull(),
    mimeType: text("mime_type").notNull(),
    size: integer("size").notNull(), // in bytes
    folder: text("folder").notNull(), // e.g. "ariel-web-app/media/2026"
    altText: text("alt_text"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("media_assets_folder_idx").on(table.folder),
    index("media_assets_mime_type_idx").on(table.mimeType),
    index("media_assets_created_at_idx").on(table.createdAt),
  ]
);

export const articles = pgTable(
  "articles",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").unique().notNull(),
    tag: text("tag").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    imageSrc: text("image_src").notNull(),
    tags: jsonb("tags").$type<string[]>().default([]).notNull(),
    link: text("link").notNull(),
    categories: jsonb("categories").$type<string[]>().default([]).notNull(),
    date: text("date").notNull(),
    readTime: text("read_time").notNull(),
    author: text("author").notNull(),
    sections: jsonb("sections").$type<Array<{ title: string; body: string }>>().default([]).notNull(),
    seo: jsonb("seo").$type<{
      title?: string;
      description?: string;
      keywords?: string;
      ogTitle?: string;
      ogDescription?: string;
      ogImage?: string;
      canonicalUrl?: string;
    }>(),
    draft: jsonb("draft").$type<{
      slug: string;
      tag: string;
      title: string;
      description: string;
      imageSrc: string;
      tags: string[];
      link: string;
      categories: string[];
      date: string;
      readTime: string;
      author: string;
      sections: Array<{ title: string; body: string }>;
      seo?: {
        title?: string;
        description?: string;
        keywords?: string;
        ogTitle?: string;
        ogDescription?: string;
        ogImage?: string;
        canonicalUrl?: string;
      };
    }>(),
    status: articleStatusEnum("status").default("draft").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("articles_slug_idx").on(table.slug), index("articles_title_idx").on(table.title)]
);

export const services = pgTable(
  "services",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    slug: text("slug").unique().notNull(),
    price: integer("price").notNull(),
    discountType: text("discount_type").$type<"percent" | "fixed" | null>(),
    discountValue: integer("discount_value").default(0).notNull(),
    deliveryTime: text("delivery_time").notNull(),
    features: jsonb("features").$type<string[]>().default([]).notNull(),
    addOns: jsonb("add_ons").$type<Array<{ id: string; name: string; price: number; description: string }>>().default([]).notNull(),
    imageSrc: text("image_src"),
    cardImageSrc: text("card_image_src"),
    disabled: boolean("disabled").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("services_name_idx").on(table.name), index("services_slug_idx").on(table.slug)]
);

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
    serviceId: integer("service_id")
      .references(() => services.id, { onDelete: "restrict" })
      .notNull(),
    customerName: text("customer_name").notNull(),
    customerEmail: text("customer_email").notNull(),
    status: text("status").default("pending").notNull(), // pending, in-progress, completed, cancelled, delivered, revision_requested
    addOnsSelected: jsonb("add_ons_selected").$type<string[]>().default([]).notNull(),
    totalAmount: integer("total_amount").notNull(),
    referenceNumber: text("reference_number").unique(),
    customerPhone: text("customer_phone"),
    requirements: text("requirements"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("orders_user_id_idx").on(table.userId), index("orders_service_id_idx").on(table.serviceId)]
);

export const transactions = pgTable(
  "transactions",
  {
    id: serial("id").primaryKey(),
    orderId: uuid("order_id")
      .references(() => orders.id, { onDelete: "cascade" })
      .notNull(),
    amount: integer("amount").notNull(),
    status: text("status").default("pending").notNull(), // pending, successful, failed
    paymentMethod: text("payment_method").notNull(), // GCash, Maya, BPI, Wise
    referenceNumber: text("reference_number").notNull(),
    screenshotUrl: text("screenshot_url").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("transactions_order_id_idx").on(table.orderId), index("transactions_reference_number_idx").on(table.referenceNumber)]
);

export const orderMessages = pgTable(
  "order_messages",
  {
    id: serial("id").primaryKey(),
    orderId: uuid("order_id")
      .references(() => orders.id, { onDelete: "cascade" })
      .notNull(),
    senderId: integer("sender_id").references(() => users.id, { onDelete: "set null" }),
    senderRole: text("sender_role").notNull(), // 'admin', 'client', or 'system'
    message: text("message").notNull(),
    attachmentUrl: text("attachment_url"),
    attachmentName: text("attachment_name"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("order_messages_order_id_idx").on(table.orderId)]
);

export type BookingWeeklyHour = {
  dayOfWeek: number; // 0 = Sunday … 6 = Saturday
  enabled: boolean;
  startTime: string; // "09:00"
  endTime: string; // "17:30"
};

/** Singleton calendar config (id = 1). Controls allowed days, daily hours, and slot length. */
export const bookingSettings = pgTable("booking_settings", {
  id: serial("id").primaryKey(),
  slotDurationMinutes: integer("slot_duration_minutes").default(30).notNull(), // 15 | 30 | 60
  timezone: text("timezone").default("Asia/Manila").notNull(),
  weeklyHours: jsonb("weekly_hours").$type<BookingWeeklyHour[]>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const discoveryBookings = pgTable(
  "discovery_bookings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
    guestName: text("guest_name").notNull(),
    guestEmail: text("guest_email").notNull(),
    guestPhone: text("guest_phone"),
    inquiry: text("inquiry").notNull(),
    scheduledStart: timestamp("scheduled_start", { withTimezone: true }).notNull(),
    scheduledEnd: timestamp("scheduled_end", { withTimezone: true }).notNull(),
    timezone: text("timezone").notNull(),
    status: text("status").default("pending").notNull(), // pending, confirmed, cancelled, completed, no_show
    adminNotes: text("admin_notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("discovery_bookings_status_idx").on(table.status),
    index("discovery_bookings_scheduled_start_idx").on(table.scheduledStart),
    index("discovery_bookings_guest_email_idx").on(table.guestEmail),
    index("discovery_bookings_user_id_idx").on(table.userId),
  ]
);
