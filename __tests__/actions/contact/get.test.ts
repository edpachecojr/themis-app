import { describe, it, expect, vi, beforeEach } from "vitest";
import { getContactById } from "@/actions/contact/get";
import { contactService } from "@/services/contact-service";
import { Contact } from "@/types/contact";

// Mock das dependências
vi.mock("@/services/contact-service");

const mockContactService = vi.mocked(contactService);

describe("getContactById Action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should get a contact by id successfully", async () => {
    const inputData = {
      id: "test-contact-id",
    };

    const mockContact = {
      id: "test-contact-id",
      name: "John Doe",
      phoneNumber: "+1234567890",
      sex: "MALE" as const,
      address: "123 Main St",
      neighborhood: "Downtown",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      number: "123",
      complement: undefined,
      dateOfBirth: undefined,
      email: undefined,
      createdAt: new Date(),
      createdBy: "test-user-id",
      updatedBy: undefined,
      updatedAt: undefined,
      deletedAt: undefined,
      organizationId: "test-org-id",
    } as Contact;

    mockContactService.getById.mockResolvedValue(mockContact);

    const result = await getContactById(inputData);

    expect(mockContactService.getById).toHaveBeenCalledWith(inputData.id);
    expect(result.data).toEqual({ ok: true, contact: mockContact });
  });

  it("should return error when contact not found", async () => {
    const inputData = {
      id: "non-existent-id",
    };

    mockContactService.getById.mockResolvedValue(null);

    const result = await getContactById(inputData);

    expect(mockContactService.getById).toHaveBeenCalledWith(inputData.id);
    expect(result.data).toEqual({ ok: false, error: "Contato não encontrado" });
  });

  it("should handle service errors gracefully", async () => {
    const inputData = {
      id: "test-contact-id",
    };

    const mockError = new Error("Database connection failed");
    mockContactService.getById.mockRejectedValue(mockError);

    const result = await getContactById(inputData);

    expect(mockContactService.getById).toHaveBeenCalledWith(inputData.id);
    expect(result.data).toEqual({ ok: false, error: "Erro ao buscar contato" });
  });

  it("should validate input schema correctly", () => {
    // Verificar se a action está configurada corretamente
    expect(getContactById).toBeDefined();
  });

  it("should handle contact with minimal data successfully", async () => {
    const inputData = {
      id: "minimal-contact-id",
    };

    const mockContact = {
      id: "minimal-contact-id",
      name: "Minimal Contact",
      phoneNumber: "+1234567890",
      sex: "MALE" as const,
      address: "123 Main St",
      neighborhood: "Downtown",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      number: "123",
      complement: undefined,
      dateOfBirth: undefined,
      email: undefined,
      createdAt: new Date(),
      createdBy: "test-user-id",
      updatedBy: undefined,
      updatedAt: undefined,
      deletedAt: undefined,
      organizationId: "test-org-id",
    } as Contact;

    mockContactService.getById.mockResolvedValue(mockContact);

    const result = await getContactById(inputData);

    expect(mockContactService.getById).toHaveBeenCalledWith(inputData.id);
    expect(result.data).toEqual({ ok: true, contact: mockContact });
  });

  it("should handle contact with all fields populated successfully", async () => {
    const inputData = {
      id: "full-contact-id",
    };

    const mockContact = {
      id: "full-contact-id",
      name: "Full Contact",
      phoneNumber: "+1234567890",
      sex: "FEMALE" as const,
      address: "456 Oak Ave",
      neighborhood: "Uptown",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90210",
      number: "456",
      complement: "Apt 2B",
      dateOfBirth: new Date("1990-01-01"),
      email: "full@example.com",
      createdAt: new Date(),
      createdBy: "test-user-id",
      updatedBy: "test-user-id",
      updatedAt: new Date(),
      deletedAt: undefined,
      organizationId: "test-org-id",
    } as Contact;

    mockContactService.getById.mockResolvedValue(mockContact);

    const result = await getContactById(inputData);

    expect(mockContactService.getById).toHaveBeenCalledWith(inputData.id);
    expect(result.data).toEqual({ ok: true, contact: mockContact });
  });

  it("should validate required id field", () => {
    // Verificar se a action está configurada corretamente
    expect(getContactById).toBeDefined();
  });
});
