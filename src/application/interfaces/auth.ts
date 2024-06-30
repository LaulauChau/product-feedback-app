import type { Cookie } from "lucia";

export type AuthService = {
  createSessionCookie(userId: string): Promise<Cookie>;
};
