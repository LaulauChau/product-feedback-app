import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { generateIdFromEntropySize } from "lucia";

export const userTable = pgTable("user", {
  id: text("id")
    .$defaultFn(() => generateIdFromEntropySize(10))
    .primaryKey(),
  name: text("name").notNull(),
  username: text("username").notNull(),
  password: text("password").notNull(),
});

export const userRelations = relations(userTable, ({ many }) => ({
  sessions: many(sessionTable),
}));

export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
});

export const sessionRelations = relations(sessionTable, ({ one }) => ({
  user: one(userTable, {
    fields: [sessionTable.userId],
    references: [userTable.id],
  }),
}));
