import type { Config } from "drizzle-kit";

import { env } from "~/env";

const config = {
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  dialect: "postgresql",
  out: "./src/infrastructure/database/migrations",
  schema: "./src/infrastructure/database/schemas.ts",
} satisfies Config;

export default config;
