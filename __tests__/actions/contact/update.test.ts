import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateContact } from "@/actions/contact/update";
import { contactService } from "@/services/contact-service";
import { revalidatePath } from "next/cache";

// Mock do contactService
vi.mock("@/services/contact-service", () => ({
  contactService: {
    update: vi.fn(),
  },
}));

// Mock do revalidatePath
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("updateContact Action", () => {
  const mockContactService = vi.mocked(contactService);
  const mockRevalidatePath = vi.mocked(revalidatePath);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should update a contact successfully", async () => {
    const inputData = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: "Updated Contact",
      phoneNumber: "+1234567890",
      sex: "FEMALE" as const,
      address: "456 Updated St",
      neighborhood: "Updated Neighborhood",
      city: "Updated City",
      state: "US",
      zipCode: "54321",
      number: "456",
      complement: "Apt 2",
      dateOfBirth: new Date("1995-05-15"),
    };

    const mockUpdatedContact = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: inputData.name,
      phoneNumber: inputData.phoneNumber,
      sex: inputData.sex,
      address: inputData.address,
      neighborhood: inputData.neighborhood,
      city: inputData.city,
      state: inputData.state,
      zipCode: inputData.zipCode,
      number: inputData.number,
      complement: inputData.complement,
      dateOfBirth: inputData.dateOfBirth,
      email: "updated@example.com",
      organizationId: "test-org-id",
      createdBy: "test-user-id",
      createdAt: new Date(),
      updatedAt: new Date(),
      updatedBy: "test-user-id",
      deletedAt: undefined,
    };

    mockContactService.update.mockResolvedValue(mockUpdatedContact);

    const result = await updateContact(inputData);

    expect(mockContactService.update).toHaveBeenCalledWith(inputData.id, {
      name: inputData.name,
      phoneNumber: inputData.phoneNumber,
      sex: inputData.sex,
      address: inputData.address,
      neighborhood: inputData.neighborhood,
      city: inputData.city,
      state: inputData.state,
      zipCode: inputData.zipCode,
      number: inputData.number,
      complement: inputData.complement,
      dateOfBirth: inputData.dateOfBirth,
    });

    expect(result.data).toEqual({ ok: true, contact: mockUpdatedContact });
  });

  it("should update contact with partial data successfully", async () => {
    const inputData = {
      id: "123e4567-e89b-12d3-a456-426614174001",
      name: "Partially Updated Contact",
      phoneNumber: "+1234567890",
      sex: "MALE" as const,
      address: "789 Partial St",
      neighborhood: "Partial Neighborhood",
      city: "Partial City",
      state: "PS",
      zipCode: "98765",
      number: "789",
      complement: undefined,
      dateOfBirth: undefined,
    };

    const mockUpdatedContact = {
      id: "123e4567-e89b-12d3-a456-426614174001",
      name: inputData.name,
      phoneNumber: inputData.phoneNumber,
      sex: inputData.sex,
      address: inputData.address,
      neighborhood: inputData.neighborhood,
      city: inputData.city,
      state: inputData.state,
      zipCode: inputData.zipCode,
      number: inputData.number,
      complement: inputData.complement,
      dateOfBirth: inputData.dateOfBirth,
      email: "partial@example.com",
      organizationId: "test-org-id",
      createdBy: "test-user-id",
      createdAt: new Date(),
      updatedAt: new Date(),
      updatedBy: "test-user-id",
      deletedAt: undefined,
    };

    mockContactService.update.mockResolvedValue(mockUpdatedContact);

    const result = await updateContact(inputData);

    expect(mockContactService.update).toHaveBeenCalledWith(inputData.id, {
      name: inputData.name,
      phoneNumber: inputData.phoneNumber,
      sex: inputData.sex,
      address: inputData.address,
      neighborhood: inputData.neighborhood,
      city: inputData.city,
      state: inputData.state,
      zipCode: inputData.zipCode,
      number: inputData.number,
      complement: inputData.complement,
      dateOfBirth: inputData.dateOfBirth,
    });

    expect(result.data).toEqual({ ok: true, contact: mockUpdatedContact });
  });

  it("should update contact with only required fields successfully", async () => {
    const inputData = {
      id: "123e4567-e89b-12d3-a456-426614174002",
      name: "Required Only Contact",
      phoneNumber: "+1234567890",
      sex: "FEMALE" as const,
      address: "123 Required St",
      neighborhood: "Required Neighborhood",
      city: "Required City",
      state: "RS",
      zipCode: "12345",
      number: "123",
      complement: undefined,
      dateOfBirth: undefined,
    };

    const mockUpdatedContact = {
      id: "123e4567-e89b-12d3-a456-426614174002",
      name: inputData.name,
      phoneNumber: inputData.phoneNumber,
      sex: inputData.sex,
      address: inputData.address,
      neighborhood: inputData.neighborhood,
      city: inputData.city,
      state: inputData.state,
      zipCode: inputData.zipCode,
      number: inputData.number,
      complement: inputData.complement,
      dateOfBirth: inputData.dateOfBirth,
      email: "required@example.com",
      organizationId: "test-org-id",
      createdBy: "test-user-id",
      createdAt: new Date(),
      updatedAt: new Date(),
      updatedBy: "test-user-id",
      deletedAt: undefined,
    };

    mockContactService.update.mockResolvedValue(mockUpdatedContact);

    const result = await updateContact(inputData);

    expect(mockContactService.update).toHaveBeenCalledWith(inputData.id, {
      name: inputData.name,
      phoneNumber: inputData.phoneNumber,
      sex: inputData.sex,
      address: inputData.address,
      neighborhood: inputData.neighborhood,
      city: inputData.city,
      state: inputData.state,
      zipCode: inputData.zipCode,
      number: inputData.number,
      complement: inputData.complement,
      dateOfBirth: inputData.dateOfBirth,
    });

    expect(result.data).toEqual({ ok: true, contact: mockUpdatedContact });
  });

  it("should call revalidatePath after successful update", async () => {
    const inputData = {
      id: "123e4567-e89b-12d3-a456-426614174003",
      name: "Test Contact",
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
    };

    const mockUpdatedContact = {
      id: "123e4567-e89b-12d3-a456-426614174003",
      name: inputData.name,
      phoneNumber: inputData.phoneNumber,
      sex: inputData.sex,
      address: inputData.address,
      neighborhood: inputData.neighborhood,
      city: inputData.city,
      state: inputData.state,
      zipCode: inputData.zipCode,
      number: inputData.number,
      complement: inputData.complement,
      dateOfBirth: inputData.dateOfBirth,
      email: "test@example.com",
      organizationId: "test-org-id",
      createdBy: "test-user-id",
      createdAt: new Date(),
      updatedAt: new Date(),
      updatedBy: "test-user-id",
      deletedAt: undefined,
    };

    mockContactService.update.mockResolvedValue(mockUpdatedContact);

    await updateContact(inputData);

    expect(mockRevalidatePath).toHaveBeenCalledWith("/contacts");
  });

  it("should handle type casting correctly for sex field", async () => {
    const inputData = {
      id: "123e4567-e89b-12d3-a456-426614174004",
      name: "Type Cast Contact",
      phoneNumber: "+1234567890",
      sex: "FEMALE" as const,
      address: "123 Type St",
      neighborhood: "Type Neighborhood",
      city: "Type City",
      state: "TC",
      zipCode: "12345",
      number: "123",
      complement: "Apt 1",
      dateOfBirth: new Date("1992-03-20"),
    };

    const mockUpdatedContact = {
      id: "123e4567-e89b-12d3-a456-426614174004",
      name: inputData.name,
      phoneNumber: inputData.phoneNumber,
      sex: inputData.sex,
      address: inputData.address,
      neighborhood: inputData.neighborhood,
      city: inputData.city,
      state: inputData.state,
      zipCode: inputData.zipCode,
      number: inputData.number,
      complement: inputData.complement,
      dateOfBirth: inputData.dateOfBirth,
      email: "typecast@example.com",
      organizationId: "test-org-id",
      createdBy: "test-user-id",
      createdAt: new Date(),
      updatedAt: new Date(),
      updatedBy: "test-user-id",
      deletedAt: undefined,
    };

    mockContactService.update.mockResolvedValue(mockUpdatedContact);

    const result = await updateContact(inputData);

    expect(mockContactService.update).toHaveBeenCalledWith(inputData.id, {
      name: inputData.name,
      phoneNumber: inputData.phoneNumber,
      sex: inputData.sex,
      address: inputData.address,
      neighborhood: inputData.neighborhood,
      city: inputData.city,
      state: inputData.state,
      zipCode: inputData.zipCode,
      number: inputData.number,
      complement: inputData.complement,
      dateOfBirth: inputData.dateOfBirth,
    });

    expect(result.data).toEqual({ ok: true, contact: mockUpdatedContact });
  });
});
