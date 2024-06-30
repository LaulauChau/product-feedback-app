import { hash, verify } from "@node-rs/argon2";
import type { PasswordService } from "~/application/interfaces/password";

export const passwordService = (
  config = {
    memoryCost: 19456,
    outputLen: 32,
    parallelism: 1,
    timeCost: 2,
  },
): PasswordService => ({
  async hashPassword(password) {
    return hash(password, config);
  },

  async verifyPassword(password, hashedPassword) {
    return verify(hashedPassword, password, config);
  },
});
