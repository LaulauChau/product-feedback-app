"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";

import { loginAction, registerAction } from "~/app/(public)/auth/actions";
import {
  type LoginSchema,
  type RegisterSchema,
  loginSchema,
  registerSchema,
} from "~/app/(public)/auth/validations";

export function useAuthForm(type: "login" | "register") {
  const form = useForm<
    typeof type extends "login" ? LoginSchema : RegisterSchema
  >({
    resolver: zodResolver(type === "login" ? loginSchema : registerSchema),
  });
  const { isPending, execute } = useServerAction(
    type === "login" ? loginAction : registerAction,
    {
      onError: (error) => {
        toast.error(error.err.message);
      },
    },
  );

  return {
    form,
    isLoading: isPending,
    onSubmit: form.handleSubmit(async (data) => execute(data)),
  };
}
