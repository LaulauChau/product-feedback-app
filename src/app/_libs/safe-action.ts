import { createServerAction, createServerActionProcedure } from "zsa";

import { validateRequest } from "./auth";

export const publicAction = createServerAction();

export const protectedAction = createServerActionProcedure()
  .handler(async () => {
    const { user } = await validateRequest();

    if (!user) {
      throw new Error("Unauthorized");
    }

    return { user };
  })
  .createServerAction();
