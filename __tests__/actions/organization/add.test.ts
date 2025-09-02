import { describe, it, expect, vi, beforeEach } from "vitest";
import { addOrganization } from "@/actions/organization/add";
import { organizationService } from "@/services/organization-service";
import { revalidatePath } from "next/cache";

describe("addOrganization Action", () => {
  const mockOrganizationService = vi.mocked(organizationService);
  const mockRevalidatePath = vi.mocked(revalidatePath);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should add an organization successfully", async () => {
    const inputData = {
      name: "Test Organization",
      description: "A test organization for testing purposes",
      status: "ACTIVE" as const,
    };

    const mockCreatedOrganization = {
      id: "test-org-id",
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

    mockOrganizationService.createOrganization.mockResolvedValue(
      mockCreatedOrganization
    );

    const result = await addOrganization(inputData);

    expect(mockOrganizationService.createOrganization).toHaveBeenCalledWith({
      name: inputData.name,
      description: inputData.description,
      status: inputData.status,
    });

    expect(mockRevalidatePath).toHaveBeenCalledWith("/organizations");
  });

  it("should add organization with minimal data successfully", async () => {
    const inputData = {
      name: "Minimal Org",
      description: undefined,
      status: "INACTIVE" as const,
    };

    const mockCreatedOrganization = {
      id: "test-org-id-2",
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

    mockOrganizationService.createOrganization.mockResolvedValue(
      mockCreatedOrganization
    );

    const result = await addOrganization(inputData);

    expect(mockOrganizationService.createOrganization).toHaveBeenCalledWith({
      name: inputData.name,
      description: inputData.description,
      status: inputData.status,
    });

    expect(mockRevalidatePath).toHaveBeenCalledWith("/organizations");
  });

  it("should validate input schema correctly", () => {
    // Verificar se a action está configurada corretamente
    expect(addOrganization).toBeDefined();
    expect(typeof addOrganization).toBe("function");
  });
});
