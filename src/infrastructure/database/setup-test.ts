import { join } from "node:path";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

import * as schema from "./schemas";

export const setupTest = async () => {
  const config = {
    POSTGRES_DB: "test",
    POSTGRES_PASSWORD: "test",
    POSTGRES_USER: "test",
  };

  const container = await new PostgreSqlContainer("postgres:16-alpine")
    .withEnvironment(config)
    .withExposedPorts(5432)
    .start();

  const connectionString = `postgresql://${config.POSTGRES_USER}:${config.POSTGRES_PASSWORD}@${container.getHost()}:${container.getFirstMappedPort()}/${config.POSTGRES_DB}`;
  const client = postgres(connectionString);
  const db = drizzle(client, { schema });

  const migrationsPath = join(
    process.cwd(),
    "src/infrastructure/database/migrations",
  );
  await migrate(db, { migrationsFolder: migrationsPath });

  return {
    client,
    container,
    db,
  };
};
