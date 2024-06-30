import type { AuthService } from "~/application/interfaces/auth";
import type { PasswordService } from "~/application/interfaces/password";
import { registerUseCase } from "~/application/use-cases/auth/register";
import type { User } from "~/domain/entities/user";
import type { UserRepository } from "~/domain/repositories/user";

describe("Register Use Case", () => {
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
  let register: ReturnType<typeof registerUseCase>;

  beforeEach(() => {
    register = registerUseCase(
      mockAuthService as AuthService,
      mockPasswordService as PasswordService,
      mockUserRepository as UserRepository,
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully register a new user", async () => {
    const newUser: User = {
      id: "1",
      name: "John Doe",
      username: "johndoe",
      password: "hashed-password",
    };

    mockUserRepository.findOne.mockResolvedValue(null);
    mockUserRepository.create.mockResolvedValue(newUser);

    const result = await register.execute({
      name: "John Doe",
      username: "johndoe",
      password: "password123",
    });

    expect(result).toBe("mock-cookie");
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      username: "johndoe",
    });
    expect(mockPasswordService.hashPassword).toHaveBeenCalledWith(
      "password123",
    );
    expect(mockUserRepository.create).toHaveBeenCalledWith({
      name: "John Doe",
      username: "johndoe",
    });
    expect(mockAuthService.createSessionCookie).toHaveBeenCalledWith("1");
  });

  it("should throw an error when username already exists", async () => {
    mockUserRepository.findOne.mockResolvedValue({
      id: "1",
      username: "johndoe",
    } as User);

    await expect(
      register.execute({
        name: "John Doe",
        username: "johndoe",
        password: "password123",
      }),
    ).rejects.toThrow("User already exists");

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      username: "johndoe",
    });
    expect(mockPasswordService.hashPassword).not.toHaveBeenCalled();
    expect(mockUserRepository.create).not.toHaveBeenCalled();
    expect(mockAuthService.createSessionCookie).not.toHaveBeenCalled();
  });

  it("should throw an error when user creation fails", async () => {
    mockUserRepository.findOne.mockResolvedValue(null);
    mockUserRepository.create.mockRejectedValue(new Error("Database error"));

    await expect(
      register.execute({
        name: "John Doe",
        username: "johndoe",
        password: "password123",
      }),
    ).rejects.toThrow("Database error");

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      username: "johndoe",
    });
    expect(mockPasswordService.hashPassword).toHaveBeenCalledWith(
      "password123",
    );
    expect(mockUserRepository.create).toHaveBeenCalled();
    expect(mockAuthService.createSessionCookie).not.toHaveBeenCalled();
  });

  it("should throw an error when password hashing fails", async () => {
    mockUserRepository.findOne.mockResolvedValue(null);
    mockPasswordService.hashPassword.mockRejectedValue(
      new Error("Hashing error"),
    );

    await expect(
      register.execute({
        name: "John Doe",
        username: "johndoe",
        password: "password123",
      }),
    ).rejects.toThrow("Hashing error");

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      username: "johndoe",
    });
    expect(mockPasswordService.hashPassword).toHaveBeenCalledWith(
      "password123",
    );
    expect(mockUserRepository.create).not.toHaveBeenCalled();
    expect(mockAuthService.createSessionCookie).not.toHaveBeenCalled();
  });

  it("should throw an error when session creation fails", async () => {
    const newUser: User = {
      id: "1",
      name: "John Doe",
      username: "johndoe",
      password: "hashed-password",
    };

    mockUserRepository.findOne.mockResolvedValue(null);
    mockPasswordService.hashPassword.mockResolvedValue("hashed-password");
    mockUserRepository.create.mockResolvedValue(newUser);
    mockAuthService.createSessionCookie.mockRejectedValue(
      new Error("Session error"),
    );

    await expect(
      register.execute({
        name: "John Doe",
        username: "johndoe",
        password: "password123",
      }),
    ).rejects.toThrow("Session error");

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      username: "johndoe",
    });
    expect(mockPasswordService.hashPassword).toHaveBeenCalledWith(
      "password123",
    );
    expect(mockUserRepository.create).toHaveBeenCalledWith({
      name: "John Doe",
      username: "johndoe",
      password: "hashed-password",
    });
    expect(mockAuthService.createSessionCookie).toHaveBeenCalledWith("1");
  });
});
