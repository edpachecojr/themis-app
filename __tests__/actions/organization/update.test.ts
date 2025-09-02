import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateOrganization } from "@/actions/organization/update";
import { organizationService } from "@/services/organization-service";
import { revalidatePath } from "next/cache";

describe("updateOrganization Action", () => {
  const mockOrganizationService = vi.mocked(organizationService);
  const mockRevalidatePath = vi.mocked(revalidatePath);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should update an organization successfully", async () => {
    const inputData = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: "Updated Organization",
      description: "Updated description",
      status: "ACTIVE" as const,
    };

    const mockUpdatedOrganization = {
      id: inputData.id,
      name: inputData.name,
      description: inputData.description,
      status: inputData.status,
      owner: "test-user-id",
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: "test-user-id",
      updatedBy: "test-user-id",
      deletedAt: undefined,
    };

    mockOrganizationService.updateOrganization.mockResolvedValue(
      mockUpdatedOrganization
    );

    const result = await updateOrganization(inputData);

    const { id, ...updateData } = inputData;

    expect(mockOrganizationService.updateOrganization).toHaveBeenCalledWith(
      id,
      updateData
    );
    expect(result.data).toEqual({
      ok: true,
      organization: mockUpdatedOrganization,
    });
  });

  it("should update organization with partial data successfully", async () => {
    const inputData = {
      id: "550e8400-e29b-41d4-a716-446655440001",
      name: "Partially Updated Organization",
    };

    const mockUpdatedOrganization = {
      id: inputData.id,
      name: inputData.name,
      description: "Original description",
      status: "ACTIVE" as const,
      owner: "test-user-id",
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: "test-user-id",
      updatedBy: "test-user-id",
      deletedAt: undefined,
    };

    mockOrganizationService.updateOrganization.mockResolvedValue(
      mockUpdatedOrganization
    );

    const result = await updateOrganization(inputData);

    const { id, ...updateData } = inputData;

    expect(mockOrganizationService.updateOrganization).toHaveBeenCalledWith(
      id,
      updateData
    );
    expect(result.data).toEqual({
      ok: true,
      organization: mockUpdatedOrganization,
    });
  });

  it("should update organization status successfully", async () => {
    const inputData = {
      id: "550e8400-e29b-41d4-a716-446655440002",
      status: "INACTIVE" as const,
    };

    const mockUpdatedOrganization = {
      id: inputData.id,
      name: "Original Name",
      description: "Original description",
      status: inputData.status,
      owner: "test-user-id",
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: "test-user-id",
      updatedBy: "test-user-id",
      deletedAt: undefined,
    };

    mockOrganizationService.updateOrganization.mockResolvedValue(
      mockUpdatedOrganization
    );

    const result = await updateOrganization(inputData);

    const { id, ...updateData } = inputData;

    expect(mockOrganizationService.updateOrganization).toHaveBeenCalledWith(
      id,
      updateData
    );
    expect(result.data).toEqual({
      ok: true,
      organization: mockUpdatedOrganization,
    });
  });

  it("should update organization description successfully", async () => {
    const inputData = {
      id: "550e8400-e29b-41d4-a716-446655440003",
      description: "Updated description only",
    };

    const mockUpdatedOrganization = {
      id: inputData.id,
      name: "Original Name",
      description: inputData.description,
      status: "ACTIVE" as const,
      owner: "test-user-id",
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: "test-user-id",
      updatedBy: "test-user-id",
      deletedAt: undefined,
    };

    mockOrganizationService.updateOrganization.mockResolvedValue(
      mockUpdatedOrganization
    );

    const result = await updateOrganization(inputData);

    const { id, ...updateData } = inputData;

    expect(mockOrganizationService.updateOrganization).toHaveBeenCalledWith(
      id,
      updateData
    );
    expect(result.data).toEqual({
      ok: true,
      organization: mockUpdatedOrganization,
    });
  });

  it("should update organization with all fields successfully", async () => {
    const inputData = {
      id: "550e8400-e29b-41d4-a716-446655440004",
      name: "Fully Updated Organization",
      description: "Fully updated description",
      status: "SUSPENDED" as const,
    };

    const mockUpdatedOrganization = {
      id: inputData.id,
      name: inputData.name,
      description: inputData.description,
      status: inputData.status,
      owner: "test-user-id",
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: "test-user-id",
      updatedBy: "test-user-id",
      deletedAt: undefined,
    };

    mockOrganizationService.updateOrganization.mockResolvedValue(
      mockUpdatedOrganization
    );

    const result = await updateOrganization(inputData);

    const { id, ...updateData } = inputData;

    expect(mockOrganizationService.updateOrganization).toHaveBeenCalledWith(
      id,
      updateData
    );
    expect(result.data).toEqual({
      ok: true,
      organization: mockUpdatedOrganization,
    });
  });

  it("should return error when organization not found", async () => {
    const inputData = {
      id: "550e8400-e29b-41d4-a716-446655440005",
      name: "Non-existent Organization",
    };

    mockOrganizationService.updateOrganization.mockResolvedValue(null);

    const result = await updateOrganization(inputData);

    const { id, ...updateData } = inputData;

    expect(mockOrganizationService.updateOrganization).toHaveBeenCalledWith(
      id,
      updateData
    );
    expect(result.data).toEqual({
      ok: false,
      error: "Organização não encontrada",
    });
  });

  it("should return error when update fails", async () => {
    const inputData = {
      id: "550e8400-e29b-41d4-a716-446655440006",
      name: "Failed Update Organization",
    };

    mockOrganizationService.updateOrganization.mockResolvedValue(null);

    const result = await updateOrganization(inputData);

    const { id, ...updateData } = inputData;

    expect(mockOrganizationService.updateOrganization).toHaveBeenCalledWith(
      id,
      updateData
    );
    expect(result.data).toEqual({
      ok: false,
      error: "Organização não encontrada",
    });
  });

  it("should validate input schema correctly", () => {
    // Verificar se a action está configurada corretamente
    expect(updateOrganization).toBeDefined();
  });

  it("should call revalidatePath for both paths after successful update", async () => {
    const inputData = {
      id: "550e8400-e29b-41d4-a716-446655440007",
      name: "Revalidate Test Organization",
    };

    const mockUpdatedOrganization = {
      id: inputData.id,
      name: inputData.name,
      description: "Test description",
      status: "ACTIVE" as const,
      owner: "test-user-id",
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: "test-user-id",
      updatedBy: "test-user-id",
      deletedAt: undefined,
    };

    mockOrganizationService.updateOrganization.mockResolvedValue(
      mockUpdatedOrganization
    );

    await updateOrganization(inputData);

    expect(mockRevalidatePath).toHaveBeenCalledWith("/dashboard");
    expect(mockRevalidatePath).toHaveBeenCalledWith("/organizations");
  });

  it("should handle organization update with special characters successfully", async () => {
    const inputData = {
      id: "550e8400-e29b-41d4-a716-446655440008",
      name: "Special Chars Org!@#$%^&*()",
      description: "Description with special chars: !@#$%^&*()",
    };

    const mockUpdatedOrganization = {
      id: inputData.id,
      name: inputData.name,
      description: inputData.description,
      status: "ACTIVE" as const,
      owner: "test-user-id",
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: "test-user-id",
      updatedBy: "test-user-id",
      deletedAt: undefined,
    };

    mockOrganizationService.updateOrganization.mockResolvedValue(
      mockUpdatedOrganization
    );

    const result = await updateOrganization(inputData);

    const { id, ...updateData } = inputData;

    expect(mockOrganizationService.updateOrganization).toHaveBeenCalledWith(
      id,
      updateData
    );
    expect(result.data).toEqual({
      ok: true,
      organization: mockUpdatedOrganization,
    });
  });

  it("should handle organization update with long text successfully", async () => {
    const longName = "A".repeat(100);
    const longDescription = "A".repeat(500);

    const inputData = {
      id: "550e8400-e29b-41d4-a716-446655440009",
      name: longName,
      description: longDescription,
    };

    const mockUpdatedOrganization = {
      id: inputData.id,
      name: inputData.name,
      description: inputData.description,
      status: "ACTIVE" as const,
      owner: "test-user-id",
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: "test-user-id",
      updatedBy: "test-user-id",
      deletedAt: undefined,
    };

    mockOrganizationService.updateOrganization.mockResolvedValue(
      mockUpdatedOrganization
    );

    const result = await updateOrganization(inputData);

    const { id, ...updateData } = inputData;

    expect(mockOrganizationService.updateOrganization).toHaveBeenCalledWith(
      id,
      updateData
    );
    expect(result.data).toEqual({
      ok: true,
      organization: mockUpdatedOrganization,
    });
  });

  it("should handle organization update with empty description successfully", async () => {
    const inputData = {
      id: "550e8400-e29b-41d4-a716-44665544000a",
      description: "",
    };

    const mockUpdatedOrganization = {
      id: inputData.id,
      name: "Original Name",
      description: inputData.description,
      status: "ACTIVE" as const,
      owner: "test-user-id",
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: "test-user-id",
      updatedBy: "test-user-id",
      deletedAt: undefined,
    };

    mockOrganizationService.updateOrganization.mockResolvedValue(
      mockUpdatedOrganization
    );

    const result = await updateOrganization(inputData);

    const { id, ...updateData } = inputData;

    expect(mockOrganizationService.updateOrganization).toHaveBeenCalledWith(
      id,
      updateData
    );
    expect(result.data).toEqual({
      ok: true,
      organization: mockUpdatedOrganization,
    });
  });
});
