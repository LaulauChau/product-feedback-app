import { authService } from "~/application/services/auth";
import { passwordService } from "~/application/services/password";
import { loginUseCase } from "~/application/use-cases/auth/login";
import { registerUseCase } from "~/application/use-cases/auth/register";
import { userRepository } from "~/infrastructure/repositories/user";

export const createAuthUseCases = () => ({
  login: loginUseCase(authService, passwordService(), userRepository()),

  register: registerUseCase(authService, passwordService(), userRepository()),
});
