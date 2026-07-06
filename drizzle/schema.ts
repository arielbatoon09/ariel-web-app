import { pgEnum, pgTable, serial, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["admin", "client"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  authId: text("auth_id").unique(),
  fullName: text("full_name"),
  phone: varchar("phone", { length: 256 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const userRoles = pgTable("user_roles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  role: roleEnum("role").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
