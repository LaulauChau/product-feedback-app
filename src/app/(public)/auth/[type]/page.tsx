import Link from "next/link";

import { AuthForm } from "~/app/(public)/auth/_components/auth-form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import { Separator } from "~/app/_components/ui/separator";

export default async function AuthPage({
  params: { type },
}: {
  params: Readonly<{ type: "login" | "register" }>;
}) {
  return (
    <main className="grid place-items-center h-full bg-blue-100">
      <Card className="flex flex-col py-6 px-6 rounded-lg md:py-10 md:px-10 w-[327px] md:w-[540px]">
        <CardHeader className="sm:w-full sm:max-w-sm">
          <CardTitle className="mb-10 font-semibold tracking-tight text-left text-blue-gray-700 heading-1">
            {type === "login" ? "Login to your account" : "Create an account"}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 w-full">
          <AuthForm type={type} />
        </CardContent>

        <Separator orientation="horizontal" />

        <CardFooter className="mx-auto mt-6">
          <p className="text-center body-2 text-muted-foreground">
            {type === "login"
              ? "Don't have an account?"
              : "Already have an account?"}
            <br />
            <Link
              href={type === "login" ? "/auth/register" : "/auth/login"}
              className="underline underline-offset-4 hover:text-primary"
            >
              {type === "login" ? "Register" : "Login"}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
