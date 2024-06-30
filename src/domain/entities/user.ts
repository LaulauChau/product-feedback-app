import type { userTable } from "~/infrastructure/database/schemas";

export type User = typeof userTable.$inferSelect;

export type UserWithoutPassword = Omit<User, "password">;
