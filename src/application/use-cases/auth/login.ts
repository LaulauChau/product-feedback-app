import type { AuthUseCaseOutput, LoginDto } from "~/application/dto/auth";
import type { AuthService } from "~/application/interfaces/auth";
import type { PasswordService } from "~/application/interfaces/password";
import type { BaseUseCase } from "~/application/use-cases/base";
import type { UserRepository } from "~/domain/repositories/user";

export const loginUseCase = (
  authService: AuthService,
  passwordService: PasswordService,
  userRepository: UserRepository,
): BaseUseCase<LoginDto, AuthUseCaseOutput> => ({
  async execute({ username, password }) {
    const user = await userRepository.findOne({ username });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValidPassword = await passwordService.verifyPassword(
      password,
      user.password,
    );

    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    return authService.createSessionCookie(user.id);
  },
});
