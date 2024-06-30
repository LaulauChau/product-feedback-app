"use client";

import { RotateCw } from "lucide-react";

import { FormInput } from "~/app/_components/form-input";
import { Button } from "~/app/_components/ui/button";
import { Form } from "~/app/_components/ui/form";
import { useAuthForm } from "../hooks/use-auth-form";

export function AuthForm({ type }: Readonly<{ type: "login" | "register" }>) {
  const { form, isLoading, onSubmit } = useAuthForm(type);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-8 w-full">
          <div className="flex flex-col gap-6 w-full">
            {type === "register" && (
              <FormInput control={form.control} label="name" />
            )}
            <FormInput control={form.control} label="username" />
            <FormInput control={form.control} label="password" />
            {type === "register" && (
              <FormInput control={form.control} label="confirmPassword" />
            )}
          </div>
          <Button className="w-full" disabled={isLoading} type="submit">
            {isLoading && <RotateCw className="mr-2 w-4 h-4 animate-spin" />}
            {type === "login" ? "Login" : "Register"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
