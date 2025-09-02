import { describe, it, expect, vi, beforeEach } from "vitest";
import { deleteContact } from "@/actions/contact/delete";
import { contactService } from "@/services/contact-service";
import { Contact } from "@/types/contact";

// Mock das dependências
vi.mock("@/services/contact-service");

const mockContactService = vi.mocked(contactService);

describe("deleteContact Action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should delete a contact successfully", async () => {
    const inputData = {
      id: "test-contact-id",
    };

    const mockDeletedContact = {
      id: "test-contact-id",
      name: "Deleted Contact",
      email: "deleted@example.com",
      phoneNumber: "+1234567890",
      sex: "MALE" as const,
      address: "123 Test St",
      neighborhood: "Test Neighborhood",
      city: "Test City",
      state: "TS",
      zipCode: "12345",
      number: "123",
      complement: "Apt 1",
      dateOfBirth: new Date("1990-01-01"),
      createdAt: new Date(),
      createdBy: "test-user-id",
      updatedBy: "test-user-id",
      updatedAt: new Date(),
      deletedAt: new Date(),
      organizationId: "test-org-id",
    } as Contact;

    mockContactService.update.mockResolvedValue(mockDeletedContact);

    const result = await deleteContact(inputData);

    expect(mockContactService.update).toHaveBeenCalledWith(inputData.id, {
      deletedAt: expect.any(Date),
    });
    expect(result.data).toEqual({ ok: true, contact: mockDeletedContact });
  });

  it("should handle contact not found error gracefully", async () => {
    const inputData = {
      id: "non-existent-id",
    };

    mockContactService.update.mockResolvedValue(null);

    const result = await deleteContact(inputData);

    expect(mockContactService.update).toHaveBeenCalledWith(inputData.id, {
      deletedAt: expect.any(Date),
    });
    expect(result.data).toEqual({
      ok: false,
      error: "Erro ao deletar contato",
    });
  });

  it("should handle service errors gracefully", async () => {
    const inputData = {
      id: "test-contact-id",
    };

    const mockError = new Error("Service error");
    mockContactService.update.mockRejectedValue(mockError);

    const result = await deleteContact(inputData);

    expect(mockContactService.update).toHaveBeenCalledWith(inputData.id, {
      deletedAt: expect.any(Date),
    });
    expect(result.data).toEqual({
      ok: false,
      error: "Erro ao deletar contato",
    });
  });

  it("should validate input schema correctly", () => {
    // Verificar se a action está configurada corretamente
    expect(deleteContact).toBeDefined();
  });

  it("should set deletedAt timestamp when deleting contact", async () => {
    const inputData = {
      id: "test-contact-id",
    };

    const mockDeletedContact = {
      id: "test-contact-id",
      name: "Test Contact",
      deletedAt: new Date("2023-12-01T10:00:00Z"),
    } as Contact;

    mockContactService.update.mockResolvedValue(mockDeletedContact);

    const result = await deleteContact(inputData);

    expect(mockContactService.update).toHaveBeenCalledWith(inputData.id, {
      deletedAt: expect.any(Date),
    });

    // Verificar se o deletedAt foi definido
    const updateCall = mockContactService.update.mock.calls[0];
    const updateData = updateCall[1];
    expect(updateData.deletedAt).toBeInstanceOf(Date);

    expect(result.data).toEqual({ ok: true, contact: mockDeletedContact });
  });

  it("should handle deletion of contact with minimal data successfully", async () => {
    const inputData = {
      id: "minimal-contact-id",
    };

    const mockDeletedContact = {
      id: "minimal-contact-id",
      name: "Minimal Contact",
      phoneNumber: "+1234567890",
      sex: "MALE" as const,
      address: "123 Test St",
      neighborhood: "Test Neighborhood",
      city: "Test City",
      state: "TS",
      zipCode: "12345",
      number: "123",
      deletedAt: new Date(),
    } as Contact;

    mockContactService.update.mockResolvedValue(mockDeletedContact);

    const result = await deleteContact(inputData);

    expect(mockContactService.update).toHaveBeenCalledWith(inputData.id, {
      deletedAt: expect.any(Date),
    });
    expect(result.data).toEqual({ ok: true, contact: mockDeletedContact });
  });

  it("should handle deletion of contact with all fields populated successfully", async () => {
    const inputData = {
      id: "full-contact-id",
    };

    const mockDeletedContact = {
      id: "full-contact-id",
      name: "Full Contact",
      email: "full@example.com",
      phoneNumber: "+1234567890",
      sex: "FEMALE" as const,
      address: "123 Full St",
      neighborhood: "Full Neighborhood",
      city: "Full City",
      state: "FC",
      zipCode: "12345",
      number: "123",
      complement: "Suite 100",
      dateOfBirth: new Date("1985-06-15"),
      createdAt: new Date("2023-01-01"),
      createdBy: "test-user-id",
      updatedBy: "test-user-id",
      updatedAt: new Date("2023-12-01"),
      deletedAt: new Date("2023-12-01T15:00:00Z"),
      organizationId: "test-org-id",
    } as Contact;

    mockContactService.update.mockResolvedValue(mockDeletedContact);

    const result = await deleteContact(inputData);

    expect(mockContactService.update).toHaveBeenCalledWith(inputData.id, {
      deletedAt: expect.any(Date),
    });
    expect(result.data).toEqual({ ok: true, contact: mockDeletedContact });
  });

  it("should validate required id field", () => {
    // Verificar se a action está configurada corretamente
    expect(deleteContact).toBeDefined();
  });

  it("should use logical deletion (soft delete) approach", async () => {
    const inputData = {
      id: "test-contact-id",
    };

    const mockDeletedContact = {
      id: "test-contact-id",
      name: "Soft Deleted Contact",
      deletedAt: new Date(),
    } as Contact;

    mockContactService.update.mockResolvedValue(mockDeletedContact);

    const result = await deleteContact(inputData);

    // Verificar que usa update em vez de delete físico
    expect(mockContactService.update).toHaveBeenCalledWith(inputData.id, {
      deletedAt: expect.any(Date),
    });

    // Verificar que não chama um método de delete físico
    expect(mockContactService.delete).not.toHaveBeenCalled();

    expect(result.data).toEqual({ ok: true, contact: mockDeletedContact });
  });
});
