import { describe, it, expect, vi, beforeEach } from "vitest";
import { addContact } from "@/actions/contact/add";
import { contactService } from "@/services/contact-service";
import { revalidatePath } from "next/cache";

// Mock do contactService
vi.mock("@/services/contact-service", () => ({
  contactService: {
    create: vi.fn(),
  },
}));

// Mock do revalidatePath
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("addContact Action", () => {
  const mockContactService = vi.mocked(contactService);
  const mockRevalidatePath = vi.mocked(revalidatePath);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should add a contact successfully", async () => {
    const inputData = {
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

    const mockCreatedContact = {
      id: "test-contact-id",
      ...inputData,
      email: "test@example.com",
      organizationId: "test-org-id",
      createdBy: "test-user-id",
      createdAt: new Date(),
      updatedAt: undefined,
      updatedBy: undefined,
      deletedAt: undefined,
    };

    mockContactService.create.mockResolvedValue(mockCreatedContact);

    // Simular a execução da action real
    const result = await addContact(inputData);

    expect(mockContactService.create).toHaveBeenCalledWith({
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

    expect(result.data).toEqual({ ok: true, contact: mockCreatedContact });
  });

  it("should add a contact with minimal required fields successfully", async () => {
    const inputData = {
      name: "Minimal Contact",
      phoneNumber: "+1234567890",
      sex: "FEMALE" as const,
      address: "456 Minimal St",
      neighborhood: "Minimal Neighborhood",
      city: "Minimal City",
      state: "MS",
      zipCode: "54321",
      number: "456",
      complement: undefined,
      dateOfBirth: undefined,
    };

    const mockCreatedContact = {
      id: "test-contact-id-2",
      ...inputData,
      email: "minimal@example.com",
      organizationId: "test-org-id",
      createdBy: "test-user-id",
      createdAt: new Date(),
      updatedAt: undefined,
      updatedBy: undefined,
      deletedAt: undefined,
    };

    mockContactService.create.mockResolvedValue(mockCreatedContact);

    const result = await addContact(inputData);

    expect(mockContactService.create).toHaveBeenCalledWith({
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

    expect(result.data).toEqual({ ok: true, contact: mockCreatedContact });
  });

  it("should add a contact with all optional fields successfully", async () => {
    const inputData = {
      name: "Full Contact",
      phoneNumber: "+9876543210",
      sex: "MALE" as const,
      address: "789 Full St",
      neighborhood: "Full Neighborhood",
      city: "Full City",
      state: "FS",
      zipCode: "98765",
      number: "789",
      complement: "Suite 100",
      dateOfBirth: new Date("1985-05-15"),
    };

    const mockCreatedContact = {
      id: "test-contact-id-3",
      ...inputData,
      email: "full@example.com",
      organizationId: "test-org-id",
      createdBy: "test-user-id",
      createdAt: new Date(),
      updatedAt: undefined,
      updatedBy: undefined,
      deletedAt: undefined,
    };

    mockContactService.create.mockResolvedValue(mockCreatedContact);

    const result = await addContact(inputData);

    expect(mockContactService.create).toHaveBeenCalledWith({
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

    expect(result.data).toEqual({ ok: true, contact: mockCreatedContact });
  });

  it("should add a contact with special characters successfully", async () => {
    const inputData = {
      name: "João da Silva & Cia.",
      phoneNumber: "+55 11 99999-9999",
      sex: "MALE" as const,
      address: "Rua das Flores, nº 123",
      neighborhood: "Centro Histórico",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-567",
      number: "123",
      complement: "Sala 45, 4º andar",
      dateOfBirth: new Date("1980-12-25"),
    };

    const mockCreatedContact = {
      id: "test-contact-id-4",
      ...inputData,
      email: "joao@example.com",
      organizationId: "test-org-id",
      createdBy: "test-user-id",
      createdAt: new Date(),
      updatedAt: undefined,
      updatedBy: undefined,
      deletedAt: undefined,
    };

    mockContactService.create.mockResolvedValue(mockCreatedContact);

    const result = await addContact(inputData);

    expect(mockContactService.create).toHaveBeenCalledWith({
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

    expect(result.data).toEqual({ ok: true, contact: mockCreatedContact });
  });

  it("should add a contact with long text fields successfully", async () => {
    const longName = "A".repeat(100);
    const longAddress = "B".repeat(200);
    const longNeighborhood = "C".repeat(150);
    const longCity = "D".repeat(100);
    const longComplement = "E".repeat(300);

    const inputData = {
      name: longName,
      phoneNumber: "+1234567890",
      sex: "FEMALE" as const,
      address: longAddress,
      neighborhood: longNeighborhood,
      city: longCity,
      state: "LS",
      zipCode: "12345",
      number: "999",
      complement: longComplement,
      dateOfBirth: new Date("1995-08-10"),
    };

    const mockCreatedContact = {
      id: "test-contact-id-5",
      ...inputData,
      email: "long@example.com",
      organizationId: "test-org-id",
      createdBy: "test-user-id",
      createdAt: new Date(),
      updatedAt: undefined,
      updatedBy: undefined,
      deletedAt: undefined,
    };

    mockContactService.create.mockResolvedValue(mockCreatedContact);

    const result = await addContact(inputData);

    expect(mockContactService.create).toHaveBeenCalledWith({
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

    expect(result.data).toEqual({ ok: true, contact: mockCreatedContact });
  });

  it("should validate input schema correctly", async () => {
    // Verificar se o schema está configurado corretamente
    expect(addContact).toBeDefined();

    // Testar com dados válidos
    const inputData = {
      name: "Schema Test",
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

    const mockCreatedContact = {
      id: "test-contact-id-schema",
      ...inputData,
      email: "schema@example.com",
      organizationId: "test-org-id",
      createdBy: "test-user-id",
      createdAt: new Date(),
      updatedAt: undefined,
      updatedBy: undefined,
      deletedAt: undefined,
    };

    mockContactService.create.mockResolvedValue(mockCreatedContact);

    const result = await addContact(inputData);
    expect(result.data).toEqual({ ok: true, contact: mockCreatedContact });
  });

  it("should call revalidatePath after successful creation", async () => {
    const inputData = {
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

    const mockCreatedContact = {
      id: "test-contact-id",
      ...inputData,
      email: "test@example.com",
      organizationId: "test-org-id",
      createdBy: "test-user-id",
      createdAt: new Date(),
      updatedAt: undefined,
      updatedBy: undefined,
      deletedAt: undefined,
    };

    mockContactService.create.mockResolvedValue(mockCreatedContact);

    await addContact(inputData);

    expect(mockRevalidatePath).toHaveBeenCalledWith("/contacts");
  });

  it("should handle contact creation with different phone number formats successfully", async () => {
    const phoneFormats = [
      "+1234567890",
      "(12) 3456-7890",
      "12 3456 7890",
      "12.3456.7890",
      "12345-6789",
    ];

    for (const phoneFormat of phoneFormats) {
      const inputData = {
        name: `Contact ${phoneFormat}`,
        phoneNumber: phoneFormat,
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

      const mockCreatedContact = {
        id: `test-contact-${phoneFormat}`,
        ...inputData,
        email: `contact-${phoneFormat}@example.com`,
        organizationId: "test-org-id",
        createdBy: "test-user-id",
        createdAt: new Date(),
        updatedAt: undefined,
        updatedBy: undefined,
        deletedAt: undefined,
      };

      mockContactService.create.mockResolvedValue(mockCreatedContact);

      const result = await addContact(inputData);

      expect(mockContactService.create).toHaveBeenCalledWith({
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

      expect(result.data).toEqual({ ok: true, contact: mockCreatedContact });
    }
  });

  it("should handle contact creation with different date formats successfully", async () => {
    const dateFormats = [
      new Date("1990-01-01"),
      new Date("1985-05-15"),
      new Date("2000-12-31"),
      new Date("1975-06-20"),
      new Date("1995-08-10"),
    ];

    for (const dateFormat of dateFormats) {
      const inputData = {
        name: `Contact ${dateFormat.toISOString()}`,
        phoneNumber: "+1234567890",
        sex: "MALE" as const,
        address: "123 Test St",
        neighborhood: "Test Neighborhood",
        city: "Test City",
        state: "TS",
        zipCode: "12345",
        number: "123",
        complement: "Apt 1",
        dateOfBirth: dateFormat,
      };

      const mockCreatedContact = {
        id: `test-contact-${dateFormat.toISOString()}`,
        ...inputData,
        email: `contact-${dateFormat.toISOString()}@example.com`,
        organizationId: "test-org-id",
        createdBy: "test-user-id",
        createdAt: new Date(),
        updatedAt: undefined,
        updatedBy: undefined,
        deletedAt: undefined,
      };

      mockContactService.create.mockResolvedValue(mockCreatedContact);

      const result = await addContact(inputData);

      expect(mockContactService.create).toHaveBeenCalledWith({
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

      expect(result.data).toEqual({ ok: true, contact: mockCreatedContact });
    }
  });
});
