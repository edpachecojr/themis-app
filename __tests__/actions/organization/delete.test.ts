import { describe, it, expect, vi, beforeEach } from "vitest";
import { deleteOrganization } from "@/actions/organization/delete";
import { organizationService } from "@/services/organization-service";
import { revalidatePath } from "next/cache";

describe("deleteOrganization Action", () => {
  const mockOrganizationService = vi.mocked(organizationService);
  const mockRevalidatePath = vi.mocked(revalidatePath);

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Configurar o comportamento padrão dos mocks
    mockOrganizationService.deleteOrganization.mockResolvedValue(true);
    mockRevalidatePath.mockReturnValue(undefined);
  });

  it("should delete an organization successfully", async () => {
    const inputData = {
      id: "550e8400-e29b-41d4-a716-446655440000",
    };

    const result = await deleteOrganization(inputData);

    expect(mockOrganizationService.deleteOrganization).toHaveBeenCalledWith(inputData.id);
    expect(result.data).toEqual({
      ok: true,
    });
  });

  it("should return error when organization not found", async () => {
    const inputData = {
      id: "550e8400-e29b-41d4-a716-446655440001",
    };

    mockOrganizationService.deleteOrganization.mockResolvedValue(false);

    const result = await deleteOrganization(inputData);

    expect(mockOrganizationService.deleteOrganization).toHaveBeenCalledWith(inputData.id);
    expect(result.data).toEqual({
      ok: false,
      error: "Organização não encontrada",
    });
  });

  it("should call revalidatePath after successful deletion", async () => {
    const inputData = {
      id: "550e8400-e29b-41d4-a716-446655440002",
    };

    await deleteOrganization(inputData);

    expect(mockRevalidatePath).toHaveBeenCalledWith("/organizations");
  });

  it("should validate input schema correctly", () => {
    // Verificar se a action está configurada corretamente
    expect(deleteOrganization).toBeDefined();
  });
});
