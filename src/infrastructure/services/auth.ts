import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";

import { db } from "~/infrastructure/database";
import { sessionTable, userTable } from "~/infrastructure/database/schemas";

const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
  getUserAttributes: ({ id, username }) => ({ id, username }),
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
    expires: false,
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  id: string;
  username: string;
}
