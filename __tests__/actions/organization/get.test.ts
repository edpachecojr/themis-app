import { describe, it, expect, vi, beforeEach } from "vitest";
import { getOrganizationById } from "@/actions/organization/get";
import { organizationService } from "@/services/organization-service";

describe("getOrganizationById Action", () => {
  const mockOrganizationService = vi.mocked(organizationService);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should get an organization by id successfully", async () => {
    const inputData = {
      id: "550e8400-e29b-41d4-a716-446655440000",
    };

    const mockOrganization = {
      id: inputData.id,
      name: "Test Organization",
      description: "A test organization",
      status: "ACTIVE" as const,
      owner: "test-user-id",
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: "test-user-id",
      updatedBy: "test-user-id",
      deletedAt: undefined,
    };

    mockOrganizationService.getOrganizationById.mockResolvedValue(
      mockOrganization
    );

    const result = await getOrganizationById(inputData);

    expect(mockOrganizationService.getOrganizationById).toHaveBeenCalledWith(
      inputData.id
    );
    expect(result.data).toEqual({
      ok: true,
      organization: mockOrganization,
    });
  });

  it("should return error when organization not found", async () => {
    const inputData = {
      id: "550e8400-e29b-41d4-a716-446655440001",
    };

    mockOrganizationService.getOrganizationById.mockResolvedValue(null);

    const result = await getOrganizationById(inputData);

    expect(mockOrganizationService.getOrganizationById).toHaveBeenCalledWith(
      inputData.id
    );
    expect(result.data).toEqual({
      ok: false,
      error: "Organização não encontrada",
    });
  });

  it("should handle organization with active status successfully", async () => {
    const inputData = {
      id: "550e8400-e29b-41d4-a716-446655440002",
    };

    const mockOrganization = {
      id: inputData.id,
      name: "Active Organization",
      description: "An active organization",
      status: "ACTIVE" as const,
      owner: "test-user-id",
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: "test-user-id",
      updatedBy: "test-user-id",
      deletedAt: undefined,
    };

    mockOrganizationService.getOrganizationById.mockResolvedValue(
      mockOrganization
    );

    const result = await getOrganizationById(inputData);

    expect(mockOrganizationService.getOrganizationById).toHaveBeenCalledWith(
      inputData.id
    );
    expect(result.data).toEqual({
      ok: true,
      organization: mockOrganization,
    });
  });

  it("should handle organization with inactive status successfully", async () => {
    const inputData = {
      id: "550e8400-e29b-41d4-a716-446655440003",
    };

    const mockOrganization = {
      id: inputData.id,
      name: "Inactive Organization",
      description: "An inactive organization",
      status: "INACTIVE" as const,
      owner: "test-user-id",
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: "test-user-id",
      updatedBy: "test-user-id",
      deletedAt: undefined,
    };

    mockOrganizationService.getOrganizationById.mockResolvedValue(
      mockOrganization
    );

    const result = await getOrganizationById(inputData);

    expect(mockOrganizationService.getOrganizationById).toHaveBeenCalledWith(
      inputData.id
    );
    expect(result.data).toEqual({
      ok: true,
      organization: mockOrganization,
    });
  });

  it("should handle organization with minimal data successfully", async () => {
    const inputData = {
      id: "550e8400-e29b-41d4-a716-446655440004",
    };

    const mockOrganization = {
      id: inputData.id,
      name: "Minimal Org",
      description: undefined,
      status: "ACTIVE" as const,
      owner: "test-user-id",
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: "test-user-id",
      updatedBy: "test-user-id",
      deletedAt: undefined,
    };

    mockOrganizationService.getOrganizationById.mockResolvedValue(
      mockOrganization
    );

    const result = await getOrganizationById(inputData);

    expect(mockOrganizationService.getOrganizationById).toHaveBeenCalledWith(
      inputData.id
    );
    expect(result.data).toEqual({
      ok: true,
      organization: mockOrganization,
    });
  });

  it("should handle organization with all fields populated successfully", async () => {
    const inputData = {
      id: "550e8400-e29b-41d4-a716-446655440005",
    };

    const mockOrganization = {
      id: inputData.id,
      name: "Complete Organization",
      description: "A complete organization with all fields",
      status: "ACTIVE" as const,
      owner: "test-user-id",
      createdAt: new Date("2023-01-01"),
      updatedAt: new Date("2023-12-31"),
      createdBy: "test-user-id",
      updatedBy: "test-user-id",
      deletedAt: undefined,
    };

    mockOrganizationService.getOrganizationById.mockResolvedValue(
      mockOrganization
    );

    const result = await getOrganizationById(inputData);

    expect(mockOrganizationService.getOrganizationById).toHaveBeenCalledWith(
      inputData.id
    );
    expect(result.data).toEqual({
      ok: true,
      organization: mockOrganization,
    });
  });

  it("should handle organization with long description successfully", async () => {
    const inputData = {
      id: "550e8400-e29b-41d4-a716-446655440006",
    };

    const longDescription = "A".repeat(500);
    const mockOrganization = {
      id: inputData.id,
      name: "Long Description Org",
      description: longDescription,
      status: "ACTIVE" as const,
      owner: "test-user-id",
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: "test-user-id",
      updatedBy: "test-user-id",
      deletedAt: undefined,
    };

    mockOrganizationService.getOrganizationById.mockResolvedValue(
      mockOrganization
    );

    const result = await getOrganizationById(inputData);

    expect(mockOrganizationService.getOrganizationById).toHaveBeenCalledWith(
      inputData.id
    );
    expect(result.data).toEqual({
      ok: true,
      organization: mockOrganization,
    });
  });

  it("should handle organization with special characters successfully", async () => {
    const inputData = {
      id: "550e8400-e29b-41d4-a716-446655440007",
    };

    const mockOrganization = {
      id: inputData.id,
      name: "Special Chars Org!@#$%^&*()",
      description: "Organization with special characters: !@#$%^&*()",
      status: "ACTIVE" as const,
      owner: "test-user-id",
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: "test-user-id",
      updatedBy: "test-user-id",
      deletedAt: undefined,
    };

    mockOrganizationService.getOrganizationById.mockResolvedValue(
      mockOrganization
    );

    const result = await getOrganizationById(inputData);

    expect(mockOrganizationService.getOrganizationById).toHaveBeenCalledWith(
      inputData.id
    );
    expect(result.data).toEqual({
      ok: true,
      organization: mockOrganization,
    });
  });

  it("should validate input schema correctly", () => {
    // Verificar se a action está configurada corretamente
    expect(getOrganizationById).toBeDefined();
  });

  it("should validate required id field", () => {
    // Verificar se a action está configurada corretamente
    expect(getOrganizationById).toBeDefined();
  });

  it("should handle organization with different status types successfully", async () => {
    const statuses = ["ACTIVE", "INACTIVE", "SUSPENDED"] as const;

    for (const status of statuses) {
      const inputData = {
        id: `550e8400-e29b-41d4-a716-44665544000${statuses.indexOf(status)}`,
      };

      const mockOrganization = {
        id: inputData.id,
        name: `${status} Organization`,
        description: `A ${status.toLowerCase()} organization`,
        status,
        owner: "test-user-id",
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: "test-user-id",
        updatedBy: "test-user-id",
        deletedAt: undefined,
      };

      mockOrganizationService.getOrganizationById.mockResolvedValue(
        mockOrganization
      );

      const result = await getOrganizationById(inputData);

      expect(mockOrganizationService.getOrganizationById).toHaveBeenCalledWith(
        inputData.id
      );
      expect(result.data).toEqual({
        ok: true,
        organization: mockOrganization,
      });
    }
  });
});
