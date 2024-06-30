import { authService } from "~/application/services/auth";

vi.mock("~/infrastructure/services/auth", () => ({
  lucia: {
    createSession: vi.fn().mockResolvedValue({ id: "session-id" }),
    createSessionCookie: vi.fn().mockReturnValue("session-cookie"),
  },
}));

describe("AuthService", () => {
  describe("createSessionCookie", () => {
    it("should create a new session cookie", async () => {
      const sessionCookie = await authService.createSessionCookie("user-id");

      expect(sessionCookie).toBe("session-cookie");
    });
  });
});
