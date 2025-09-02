import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAllOrganizations } from "@/actions/organization/get-all";
import { organizationService } from "@/services/organization-service";

describe("getAllOrganizations Action", () => {
  const mockOrganizationService = vi.mocked(organizationService);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should get all organizations successfully", async () => {
    const mockOrganizations = [
      {
        id: "test-org-1",
        name: "Test Organization 1",
        description: "A test organization for testing purposes",
        status: "ACTIVE" as const,
        owner: "test-user-id",
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: "test-user-id",
        updatedBy: "test-user-id",
        deletedAt: undefined,
      },
      {
        id: "test-org-2",
        name: "Test Organization 2",
        description: "Another test organization",
        status: "INACTIVE" as const,
        owner: "test-user-id",
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: "test-user-id",
        updatedBy: "test-user-id",
        deletedAt: undefined,
      },
    ];

    mockOrganizationService.getAll.mockResolvedValue(mockOrganizations);

    const result = await getAllOrganizations();

    expect(mockOrganizationService.getAll).toHaveBeenCalled();
    expect(result.data).toEqual({
      ok: true,
      organizations: mockOrganizations,
    });
  });

  it("should handle empty organizations list successfully", async () => {
    const mockOrganizations: any[] = [];

    mockOrganizationService.getAll.mockResolvedValue(mockOrganizations);

    const result = await getAllOrganizations();

    expect(mockOrganizationService.getAll).toHaveBeenCalled();
    expect(result.data).toEqual({
      ok: true,
      organizations: mockOrganizations,
    });
  });

  it("should handle single organization successfully", async () => {
    const mockOrganizations = [
      {
        id: "single-org",
        name: "Single Organization",
        description: "Just one organization",
        status: "ACTIVE" as const,
        owner: "test-user-id",
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: "test-user-id",
        updatedBy: "test-user-id",
        deletedAt: undefined,
      },
    ];

    mockOrganizationService.getAll.mockResolvedValue(mockOrganizations);

    const result = await getAllOrganizations();

    expect(mockOrganizationService.getAll).toHaveBeenCalled();
    expect(result.data).toEqual({
      ok: true,
      organizations: mockOrganizations,
    });
  });

  it("should handle organizations with different statuses successfully", async () => {
    const mockOrganizations = [
      {
        id: "active-org",
        name: "Active Organization",
        description: "An active organization",
        status: "ACTIVE" as const,
        owner: "test-user-id",
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: "test-user-id",
        updatedBy: "test-user-id",
        deletedAt: undefined,
      },
      {
        id: "inactive-org",
        name: "Inactive Organization",
        description: "An inactive organization",
        status: "INACTIVE" as const,
        owner: "test-user-id",
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: "test-user-id",
        updatedBy: "test-user-id",
        deletedAt: undefined,
      },
      {
        id: "suspended-org",
        name: "Suspended Organization",
        description: "A suspended organization",
        status: "SUSPENDED" as const,
        owner: "test-user-id",
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: "test-user-id",
        updatedBy: "test-user-id",
        deletedAt: undefined,
      },
    ];

    mockOrganizationService.getAll.mockResolvedValue(mockOrganizations);

    const result = await getAllOrganizations();

    expect(mockOrganizationService.getAll).toHaveBeenCalled();
    expect(result.data).toEqual({
      ok: true,
      organizations: mockOrganizations,
    });
  });

  it("should handle organizations with long names and descriptions successfully", async () => {
    const mockOrganizations = [
      {
        id: "long-org",
        name: "This is a very long organization name that exceeds normal lengths and should be handled properly by the system",
        description:
          "This is an extremely long description that contains a lot of text and information about the organization. It should be able to handle long descriptions without any issues. The description includes various details about the organization's purpose, mission, and activities.",
        status: "ACTIVE" as const,
        owner: "test-user-id",
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: "test-user-id",
        updatedBy: "test-user-id",
        deletedAt: undefined,
      },
    ];

    mockOrganizationService.getAll.mockResolvedValue(mockOrganizations);

    const result = await getAllOrganizations();

    expect(mockOrganizationService.getAll).toHaveBeenCalled();
    expect(result.data).toEqual({
      ok: true,
      organizations: mockOrganizations,
    });
  });

  it("should handle organizations with special characters successfully", async () => {
    const mockOrganizations = [
      {
        id: "special-org",
        name: "Organization with Special Chars: !@#$%^&*()_+-=[]{}|;:,.<>?",
        description:
          "This organization has special characters like: á, é, í, ó, ú, ñ, ç, ã, õ, ü, ä, ö, ß",
        status: "ACTIVE" as const,
        owner: "test-user-id",
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: "test-user-id",
        updatedBy: "test-user-id",
        deletedAt: undefined,
      },
    ];

    mockOrganizationService.getAll.mockResolvedValue(mockOrganizations);

    const result = await getAllOrganizations();

    expect(mockOrganizationService.getAll).toHaveBeenCalled();
    expect(result.data).toEqual({
      ok: true,
      organizations: mockOrganizations,
    });
  });

  it("should handle organizations with empty descriptions successfully", async () => {
    const mockOrganizations = [
      {
        id: "no-desc-org",
        name: "Organization without description",
        description: undefined,
        status: "ACTIVE" as const,
        owner: "test-user-id",
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: "test-user-id",
        updatedBy: "test-user-id",
        deletedAt: undefined,
      },
      {
        id: "empty-desc-org",
        name: "Organization with empty description",
        description: "",
        status: "INACTIVE" as const,
        owner: "test-user-id",
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: "test-user-id",
        updatedBy: "test-user-id",
        deletedAt: undefined,
      },
    ];

    mockOrganizationService.getAll.mockResolvedValue(mockOrganizations);

    const result = await getAllOrganizations();

    expect(mockOrganizationService.getAll).toHaveBeenCalled();
    expect(result.data).toEqual({
      ok: true,
      organizations: mockOrganizations,
    });
  });

  it("should validate action configuration correctly", () => {
    // Verificar se a action está configurada corretamente
    expect(getAllOrganizations).toBeDefined();
  });

  it("should handle organizations with different creation dates successfully", async () => {
    const mockOrganizations = [
      {
        id: "old-org",
        name: "Old Organization",
        description: "Created a long time ago",
        status: "ACTIVE" as const,
        owner: "test-user-id",
        createdAt: new Date("2020-01-01"),
        updatedAt: new Date("2020-01-01"),
        createdBy: "test-user-id",
        updatedBy: "test-user-id",
        deletedAt: undefined,
      },
      {
        id: "new-org",
        name: "New Organization",
        description: "Created recently",
        status: "ACTIVE" as const,
        owner: "test-user-id",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        createdBy: "test-user-id",
        updatedBy: "test-user-id",
        deletedAt: undefined,
      },
    ];

    mockOrganizationService.getAll.mockResolvedValue(mockOrganizations);

    const result = await getAllOrganizations();

    expect(mockOrganizationService.getAll).toHaveBeenCalled();
    expect(result.data).toEqual({
      ok: true,
      organizations: mockOrganizations,
    });
  });
});
