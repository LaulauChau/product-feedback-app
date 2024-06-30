import type { AuthService } from "~/application/interfaces/auth";
import { lucia } from "~/infrastructure/services/auth";

export const authService: AuthService = {
  async createSessionCookie(userId) {
    const session = await lucia.createSession(userId, {});

    return lucia.createSessionCookie(session.id);
  },
};
