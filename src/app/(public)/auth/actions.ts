"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import sanitize from "sanitize-html";

import { publicAction } from "~/app/_libs/safe-action";
import { createAuthUseCases } from "~/application/factories/auth";
import { loginSchema, registerSchema } from "./validations";

export const loginAction = publicAction
  .input(loginSchema)
  .handler(async ({ input: { username, password } }) => {
    const { login } = createAuthUseCases();

    const sessionCookie = await login.execute({
      username: sanitize(username),
      password: sanitize(password),
    });

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    redirect("/");
  });

export const registerAction = publicAction
  .input(registerSchema)
  .handler(async ({ input: { name, username, password } }) => {
    const { register } = createAuthUseCases();

    const sessionCookie = await register.execute({
      name: sanitize(name),
      username: sanitize(username),
      password: sanitize(password),
    });

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    redirect("/");
  });
