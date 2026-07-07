import { pgEnum, pgTable, serial, text, varchar, timestamp, integer, boolean, index } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["admin", "client"]);

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
  (table) => [
    index("users_auth_id_idx").on(table.authId),
  ]
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
  (table) => [
    index("user_roles_user_id_idx").on(table.userId),
    index("user_roles_role_idx").on(table.role),
  ]
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