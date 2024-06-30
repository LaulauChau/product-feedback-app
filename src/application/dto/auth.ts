import type { Cookie } from "lucia";

export type LoginDto = {
  username: string;
  password: string;
};

export type RegisterDto = LoginDto & {
  name: string;
};

export type AuthUseCaseOutput = Promise<Cookie>;
