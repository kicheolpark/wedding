import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const rsvpSubmissions = sqliteTable("rsvp_submissions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  attendance: text("attendance").notNull(),
  guestCount: integer("guest_count").notNull().default(1),
  mealPreference: text("meal_preference").notNull(),
  message: text("message").notNull().default(""),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const guestbookMessages = sqliteTable("guestbook_messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  author: text("author").notNull(),
  content: text("content").notNull(),
  colorIndex: integer("color_index").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
