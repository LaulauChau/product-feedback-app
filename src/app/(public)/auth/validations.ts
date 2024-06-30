import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(255, "Username must be at most 255 characters"),
  password: z
    .string()
    .min(12, "Password must be at least 12 characters")
    .max(255, "Password must be at most 255 characters")
    .refine(
      (value) =>
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()]).{12,255}$/g.test(
          value,
        ),
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const registerSchema = loginSchema
  .extend({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(255, "Name must be at most 255 characters")
      .refine(
        (value) => /^[a-zA-ZÀ-ÿ\s-]{3,}$/g.test(value),
        "Name must contain only letters, spaces, and hyphens",
      ),
    confirmPassword: z
      .string()
      .min(12, "Password must be at least 12 characters")
      .max(255, "Password must be at most 255 characters")
      .refine(
        (value) =>
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()]).{12,255}$/g.test(
            value,
          ),
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      ),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
