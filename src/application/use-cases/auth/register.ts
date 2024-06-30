import type { AuthUseCaseOutput, RegisterDto } from "~/application/dto/auth";
import type { AuthService } from "~/application/interfaces/auth";
import type { PasswordService } from "~/application/interfaces/password";
import type { BaseUseCase } from "~/application/use-cases/base";
import type { UserRepository } from "~/domain/repositories/user";

export const registerUseCase = (
  authService: AuthService,
  passwordService: PasswordService,
  userRepository: UserRepository,
): BaseUseCase<RegisterDto, AuthUseCaseOutput> => ({
  async execute({ name, username, password }) {
    const existingUser = await userRepository.findOne({ username });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await passwordService.hashPassword(password);
    const newUser = await userRepository.create({
      name,
      username,
      password: hashedPassword,
    });

    return authService.createSessionCookie(newUser.id);
  },
});
