"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";

import { Button } from "~/app/_components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/app/_components/ui/form";
import { Input } from "~/app/_components/ui/input";
import { cn } from "~/app/_libs/utils";

type FormInputProps<T extends FieldValues> = {
  control: Control<T>;
  label: keyof T;
};

export function FormInput<T extends FieldValues>({
  control,
  label,
}: FormInputProps<T>) {
  const {
    convertToTitleCase,
    getInputType,
    showPassword,
    togglePasswordVisibility,
  } = useFormInput();

  return (
    <FormField
      control={control}
      name={label as Path<T>}
      render={({ field }) => (
        <FormItem>
          <div
            className={cn(
              label.toString().toLowerCase().includes("password") &&
                "flex items-center justify-between",
            )}
          >
            <FormLabel className="capitalize">
              {convertToTitleCase(label.toString())}
            </FormLabel>
            {label.toString().toLowerCase().includes("password") && (
              <Button
                onClick={togglePasswordVisibility}
                size="icon"
                type="button"
                variant="ghost"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </Button>
            )}
          </div>
          <FormControl>
            <Input
              className="mt-4 placeholder:capitalize"
              placeholder={convertToTitleCase(label.toString())}
              type={getInputType(label.toString())}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function useFormInput() {
  const [showPassword, setShowPassword] = useState(false);

  function convertToTitleCase(str: string): string {
    return str
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (s) => s.toUpperCase())
      .trim();
  }

  function getInputType(label: string): string {
    if (label.toLowerCase().includes("password")) {
      return showPassword ? "text" : "password";
    }

    return "text";
  }

  function togglePasswordVisibility(): void {
    setShowPassword((prev) => !prev);
  }

  return {
    convertToTitleCase,
    getInputType,
    showPassword,
    togglePasswordVisibility,
  };
}
