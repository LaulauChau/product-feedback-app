import { passwordService } from "~/application/services/password";

vi.mock("@node-rs/argon2", () => ({
  hash: vi.fn().mockResolvedValue("hashed-password"),
  verify: vi.fn().mockResolvedValue(true),
}));

describe("PasswordService", () => {
  describe("hashPassword", () => {
    it("should hash a password", async () => {
      const hashedPassword = await passwordService().hashPassword("password");

      expect(hashedPassword).toBe("hashed-password");
    });
  });

  describe("verifyPassword", () => {
    it("should verify a password", async () => {
      const result = await passwordService().verifyPassword(
        "password",
        "hashed-password",
      );

      expect(result).toBe(true);
    });
  });
});
