import { z } from "zod";

export const CategorySchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Invalid slug format"),
  target: z.enum(["works", "articles", "both"]),
  disabled: z.boolean().optional(),
});

export const CaseStudyFeatureSchema = z.object({
  title: z.string().min(1, "Feature title is required"),
  description: z.string().min(1, "Feature description is required"),
});

export const CaseStudySchema = z.object({
  challenge: z.string().min(1, "Challenge is required"),
  solution: z.string().min(1, "Solution is required"),
  results: z.array(z.string()).min(1, "At least one result is required"),
  role: z.string().min(1, "Role is required"),
  timeline: z.string().min(1, "Timeline is required"),
  client: z.string().optional(),
  liveUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  githubUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  features: z.array(CaseStudyFeatureSchema).min(1, "At least one feature is required"),
});

export const SeoMetaSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  keywords: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().optional(),
  canonicalUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
});

export const ProjectSchema = z.object({
  id: z.string().min(1, "ID is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Invalid slug format"),
  tag: z.string().min(1, "Tag subtitle is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  imageSrc: z.string().min(1, "Image source is required"),
  gallery: z.array(z.string()).optional(),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  link: z.string().min(1, "Link path is required"),
  categories: z.array(z.enum(["web", "mobile", "ai-data", "open-source"])).min(1, "At least one category is required"),
  caseStudy: CaseStudySchema,
  disabled: z.boolean().optional(),
  seo: SeoMetaSchema.optional(),
  draft: z.any().nullable().optional(),
  isDraftSave: z.boolean().optional(),
  status: z.enum(["draft", "published", "unpublished"]).default("draft"),
});

export const ArticleSectionSchema = z.object({
  title: z.string().min(1, "Section title is required"),
  body: z.string().min(1, "Section body is required"),
});

export const ArticleSchema = z.object({
  id: z.string().min(1, "ID is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Invalid slug format"),
  tag: z.string().min(1, "Tag subtitle is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  imageSrc: z.string(),
  tags: z.array(z.string()).default([]),
  link: z.string().min(1, "Link path is required"),
  categories: z.array(z.string()).default([]),
  date: z.string().min(1, "Date is required"),
  readTime: z.string().min(1, "Read time is required"),
  author: z.string().min(1, "Author is required"),
  sections: z.array(ArticleSectionSchema).default([]),
  disabled: z.boolean().optional(),
  seo: SeoMetaSchema.optional(),
  draft: z.any().nullable().optional(),
  isDraftSave: z.boolean().optional(),
  status: z.enum(["draft", "published", "unpublished"]).default("draft"),
});

export const ServiceAddOnSchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be positive"),
});

export const ServiceSchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be positive"),
  deliveryTime: z.string().min(1, "Delivery time is required"),
  features: z.array(z.string()).min(1, "At least one feature is required"),
  addOns: z.array(ServiceAddOnSchema).default([]),
  imageSrc: z.string().optional().nullable(),
  disabled: z.boolean().optional(),
});

export const OrderSchema = z.object({
  id: z.string().min(1, "Order ID is required"),
  serviceId: z.string().min(1, "Service ID is required"),
  customerName: z.string().min(1, "Customer Name is required"),
  customerEmail: z.string().email("Must be a valid email address"),
  status: z.enum(["pending", "in-progress", "completed", "cancelled", "delivered", "revision_requested"]),
  addOnsSelected: z.array(z.string()).default([]),
  totalAmount: z.number().min(0, "Total amount must be positive"),
  createdAt: z.string().min(1, "Creation date is required"),
  referenceNumber: z.string().optional().nullable(),
  customerPhone: z.string().optional().nullable(),
  requirements: z.string().optional().nullable(),
});

export const TransactionSchema = z.object({
  id: z.string().min(1, "Transaction ID is required"),
  orderId: z.string().min(1, "Order ID is required"),
  amount: z.number().min(0, "Amount must be positive"),
  status: z.enum(["successful", "failed", "pending"]),
  paymentMethod: z.string().min(1, "Payment method is required"),
  date: z.string().min(1, "Transaction date is required"),
  referenceNumber: z.string().min(1, "Reference number is required"),
  screenshotUrl: z.string().min(1, "Screenshot is required"),
});

export const CustomerActivitySchema = z.object({
  id: z.string().min(1, "Activity ID is required"),
  action: z.string().min(1, "Action is required"),
  ipAddress: z.string().min(1, "IP Address is required"),
  timestamp: z.string().min(1, "Timestamp is required"),
});

export const CustomerSchema = z.object({
  id: z.string().min(1, "Customer ID is required"),
  name: z.string().min(1, "Customer Name is required"),
  email: z.string().email("Must be a valid email address"),
  role: z.enum(["admin", "customer"]),
  disabled: z.boolean().default(false),
  joinedAt: z.string().min(1, "Joined date is required"),
  activities: z.array(CustomerActivitySchema).default([]),
});

// Infer TS Types
export type Category = z.infer<typeof CategorySchema>;
export type SeoMeta = z.infer<typeof SeoMetaSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Article = z.infer<typeof ArticleSchema>;
export type Service = z.infer<typeof ServiceSchema>;
export type ServiceAddOn = z.infer<typeof ServiceAddOnSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type Transaction = z.infer<typeof TransactionSchema>;
export type CustomerActivity = z.infer<typeof CustomerActivitySchema>;
export type Customer = z.infer<typeof CustomerSchema>;
