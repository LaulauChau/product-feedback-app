import type { StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import type postgres from "postgres";

import type { db as database } from "~/infrastructure/database";
import { setupTest } from "~/infrastructure/database/setup-test";
import { userRepository } from "~/infrastructure/repositories/user";

describe("UserRepository", () => {
  let client: postgres.Sql;
  let container: StartedPostgreSqlContainer;
  let db: typeof database;
  let repository: ReturnType<typeof userRepository>;

  beforeAll(async () => {
    const setup = await setupTest();

    client = setup.client;
    container = setup.container;
    db = setup.db;

    repository = userRepository(db);
  }, 60000);

  afterAll(async () => {
    await client.end();
    await container.stop();
  });

  describe("create", async () => {
    const mockUser = {
      name: "John Doe",
      username: "johndoe",
      password: "123456",
    };

    it("should create a new user", async () => {
      const user = await repository.create({
        name: mockUser.name,
        username: mockUser.username,
        password: mockUser.password,
      });

      expect(user).toEqual({
        id: expect.any(String),
        name: mockUser.name,
        username: mockUser.username,
      });
    });

    it("should not create a user if the username already exists", async () => {
      await expect(
        repository.create({
          name: mockUser.name,
          username: mockUser.username,
          password: mockUser.password,
        }),
      ).rejects.toThrow("Username already exists");
    });
  });

  describe("findOne", async () => {
    let createdUser: Awaited<ReturnType<typeof repository.create>>;

    beforeEach(async () => {
      createdUser = await repository.create({
        name: "Test User",
        username: `testuser-${Date.now()}`,
        password: "123456",
      });
    });

    it("should find a user by id", async () => {
      const user = await repository.findOne({ id: createdUser.id });

      expect(user).toEqual({
        id: createdUser.id,
        name: createdUser.name,
        username: createdUser.username,
        password: expect.any(String),
      });
    });

    it("should find a user by username", async () => {
      const user = await repository.findOne({ username: createdUser.username });

      expect(user).toEqual({
        id: createdUser.id,
        name: createdUser.name,
        username: createdUser.username,
        password: expect.any(String),
      });
    });

    it("should find a user by id and username", async () => {
      const user = await repository.findOne({
        id: createdUser.id,
        username: createdUser.username,
      });

      expect(user).toEqual({
        id: createdUser.id,
        name: createdUser.name,
        username: createdUser.username,
        password: expect.any(String),
      });
    });

    it("should return null if the user does not exist", async () => {
      const user = await repository.findOne({ id: "NON-EXISTENT-ID" });

      expect(user).toBeNull();
    });
  });
});
