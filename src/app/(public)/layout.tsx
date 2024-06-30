import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";

import { validateRequest } from "~/app/_libs/auth";

export default async function PublicLayout({
  children,
}: Readonly<PropsWithChildren>) {
  const { user } = await validateRequest();

  if (user) {
    redirect("/");
  }

  return children;
}
