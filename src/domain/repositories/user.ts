import type { User, UserWithoutPassword } from "~/domain/entities/user";

export type UserRepository = {
  create(data: Omit<User, "id">): Promise<UserWithoutPassword>;

  findOne(
    where:
      | (Required<Pick<User, "id">> & Partial<Pick<User, "username">>)
      | (Required<Pick<User, "username">> & Partial<Pick<User, "id">>)
      | Required<Pick<User, "id" | "username">>,
  ): Promise<User | null>;
};
