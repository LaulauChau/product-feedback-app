import type { AuthService } from "~/application/interfaces/auth";
import type { PasswordService } from "~/application/interfaces/password";
import { loginUseCase } from "~/application/use-cases/auth/login";
import type { User } from "~/domain/entities/user";
import type { UserRepository } from "~/domain/repositories/user";

describe("Login Use Case", () => {
  const mockAuthService = {
    createSessionCookie: vi.fn().mockResolvedValue("mock-cookie"),
  };
  const mockPasswordService = {
    verifyPassword: vi.fn(),
    hashPassword: vi.fn(),
  };
  const mockUserRepository = {
    create: vi.fn(),
    findOne: vi.fn(),
  };
  let login: ReturnType<typeof loginUseCase>;

  beforeEach(() => {
    login = loginUseCase(
      mockAuthService as AuthService,
      mockPasswordService as PasswordService,
      mockUserRepository as UserRepository,
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully log in a user with correct credentials", async () => {
    const mockUser: User = {
      id: "1",
      username: "testuser",
      password: "hashedpassword",
      name: "Test User",
    };

    mockUserRepository.findOne.mockResolvedValue(mockUser);
    mockPasswordService.verifyPassword.mockResolvedValue(true);

    const result = await login.execute({
      username: "testuser",
      password: "correctpassword",
    });

    expect(result).toBe("mock-cookie");
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      username: "testuser",
    });
    expect(mockPasswordService.verifyPassword).toHaveBeenCalledWith(
      "correctpassword",
      "hashedpassword",
    );
    expect(mockAuthService.createSessionCookie).toHaveBeenCalledWith("1");
  });

  it("should throw an error when user is not found", async () => {
    mockUserRepository.findOne.mockResolvedValue(null);

    await expect(
      login.execute({ username: "nonexistent", password: "anypassword" }),
    ).rejects.toThrow("Invalid credentials");

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      username: "nonexistent",
    });
    expect(mockPasswordService.verifyPassword).not.toHaveBeenCalled();
    expect(mockAuthService.createSessionCookie).not.toHaveBeenCalled();
  });

  it("should throw an error when password is incorrect", async () => {
    const mockUser: User = {
      id: "1",
      username: "testuser",
      password: "hashedpassword",
      name: "Test User",
    };

    mockUserRepository.findOne.mockResolvedValue(mockUser);
    mockPasswordService.verifyPassword.mockResolvedValue(false);

    await expect(
      login.execute({ username: "testuser", password: "wrongpassword" }),
    ).rejects.toThrow("Invalid credentials");

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      username: "testuser",
    });
    expect(mockPasswordService.verifyPassword).toHaveBeenCalledWith(
      "wrongpassword",
      "hashedpassword",
    );
    expect(mockAuthService.createSessionCookie).not.toHaveBeenCalled();
  });

  it("should propagate errors from dependencies", async () => {
    mockUserRepository.findOne.mockRejectedValue(new Error("Database error"));

    await expect(
      login.execute({ username: "testuser", password: "password" }),
    ).rejects.toThrow("Database error");

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      username: "testuser",
    });
    expect(mockPasswordService.verifyPassword).not.toHaveBeenCalled();
    expect(mockAuthService.createSessionCookie).not.toHaveBeenCalled();
  });
});
