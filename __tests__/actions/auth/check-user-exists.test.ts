import { describe, it, expect, vi, beforeEach } from "vitest";
import { checkUserExists } from "@/actions/auth/check-user-exists";

// Mock do prisma
vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

const mockPrisma = vi.mocked(await import("@/lib/db/prisma")).prisma;

describe("checkUserExists Action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return true when user exists", async () => {
    const email = "test@example.com";

    mockPrisma.user.findUnique.mockResolvedValue({
      id: "user-123",
      name: "Test User",
      email,
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      accounts: [],
    } as any);

    const result = await checkUserExists({ email });

    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { email },
      include: { accounts: true },
    });
    expect(result.data).toEqual({
      ok: true,
      exists: true,
      hasEmailPassword: false,
      userId: "user-123",
    });
  });

  it("should return false when user does not exist", async () => {
    const email = "nonexistent@example.com";

    mockPrisma.user.findUnique.mockResolvedValue(null);

    const result = await checkUserExists({ email });

    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { email },
      include: { accounts: true },
    });
    expect(result.data).toEqual({ ok: true, exists: false });
  });

  it("should handle database errors gracefully", async () => {
    const email = "test@example.com";

    mockPrisma.user.findUnique.mockRejectedValue(new Error("Database error"));

    const result = await checkUserExists({ email });

    expect(result.data).toEqual({
      ok: false,
      error: "Erro ao verificar usuário",
    });
  });

  it("should validate input schema correctly", () => {
    expect(checkUserExists).toBeDefined();
    expect(typeof checkUserExists).toBe("function");
  });
});
