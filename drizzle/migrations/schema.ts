// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { pgTable, pgEnum } from "drizzle-orm/pg-core"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { sql } from "drizzle-orm"

export const articleStatus = pgEnum("article_status", ['draft', 'published', 'unpublished'])
export const role = pgEnum("role", ['admin', 'client'])
export const workStatus = pgEnum("work_status", ['draft', 'published', 'unpublished'])



