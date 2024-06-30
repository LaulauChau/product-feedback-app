import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";

import { validateRequest } from "~/app/_libs/auth";

export default async function ProtectedLayout({
  children,
}: Readonly<PropsWithChildren>) {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/auth/login");
  }

  return children;
}
