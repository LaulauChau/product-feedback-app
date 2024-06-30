import { and, eq } from "drizzle-orm";
import type { UserRepository } from "~/domain/repositories/user";
import { db as database } from "~/infrastructure/database";
import { userTable } from "~/infrastructure/database/schemas";

export const userRepository = (db = database): UserRepository => ({
  async create(data) {
    const [existingUser] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.username, data.username));

    if (existingUser) {
      throw new Error("Username already exists");
    }

    const [newUser] = await db
      .insert(userTable)
      .values(data)
      .onConflictDoNothing()
      .returning({
        id: userTable.id,
        name: userTable.name,
        username: userTable.username,
      });

    if (!newUser) {
      throw new Error("Failed to create user");
    }

    return newUser;
  },

  async findOne({ id, username }) {
    const [user] = await db
      .select()
      .from(userTable)
      .where(
        and(
          id ? eq(userTable.id, id) : undefined,
          username ? eq(userTable.username, username) : undefined,
        ),
      );

    return user ?? null;
  },
});
