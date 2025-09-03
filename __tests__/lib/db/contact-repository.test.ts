import { describe, it, expect, vi, beforeEach } from "vitest";
import { ContactRepository } from "@/lib/db/contact-repository";
import { prisma } from "@/lib/db/prisma";
import { Contact } from "@/types/contact";

// Mock do Prisma
const mockDate = new Date("2025-01-01T00:00:00.000Z");

vi.mocked(prisma.contact.create).mockResolvedValue({
  id: "test-contact-id",
  name: "Test Contact",
  email: "test@example.com",
  phoneNumber: "+1234567890",
  sex: "MALE",
  address: "123 Test St",
  neighborhood: "Test Neighborhood",
  city: "Test City",
  state: "TS",
  zipCode: "12345",
  number: "123",
  complement: "Apt 1",
  dateOfBirth: new Date("1990-01-01"),
  createdAt: mockDate,
  createdBy: "test-user-id",
  updatedBy: null,
  updatedAt: null,
  deletedAt: null,
  organizationId: "test-org-id",
} as any);

vi.mocked(prisma.contact.findFirst).mockResolvedValue({
  id: "test-contact-id",
  name: "Test Contact",
  email: "test@example.com",
  phoneNumber: "+1234567890",
  sex: "MALE",
  address: "123 Test St",
  neighborhood: "Test Neighborhood",
  city: "Test City",
  state: "TS",
  zipCode: "12345",
  number: "123",
  complement: "Apt 1",
  dateOfBirth: new Date("1990-01-01"),
  createdAt: mockDate,
  createdBy: "test-user-id",
  updatedBy: null,
  updatedAt: null,
  deletedAt: null,
  organizationId: "test-org-id",
} as any);

vi.mocked(prisma.contact.findMany).mockResolvedValue([
  {
    id: "test-contact-id-1",
    name: "Test Contact 1",
    email: "test1@example.com",
    phoneNumber: "+1234567890",
    sex: "MALE",
    address: "123 Test St",
    neighborhood: "Test Neighborhood",
    city: "Test City",
    state: "TS",
    zipCode: "12345",
    number: "123",
    complement: "Apt 1",
    dateOfBirth: new Date("1990-01-01"),
    createdAt: mockDate,
    createdBy: "test-user-id",
    updatedBy: null,
    updatedAt: null,
    deletedAt: null,
    organizationId: "test-org-id",
  },
  {
    id: "test-contact-id-2",
    name: "Test Contact 2",
    email: "test2@example.com",
    phoneNumber: "+0987654321",
    sex: "FEMALE",
    address: "456 Test Ave",
    neighborhood: "Test Neighborhood 2",
    city: "Test City 2",
    state: "TS2",
    zipCode: "54321",
    number: "456",
    complement: "Apt 2",
    dateOfBirth: new Date("1995-01-01"),
    createdAt: mockDate,
    createdBy: "test-user-id",
    updatedBy: null,
    updatedAt: null,
    deletedAt: null,
    organizationId: "test-org-id",
  },
] as any[]);

vi.mocked(prisma.contact.update).mockResolvedValue({
  id: "test-contact-id",
  name: "Updated Contact",
  email: "updated@example.com",
  phoneNumber: "+1234567890",
  sex: "MALE",
  address: "123 Test St",
  neighborhood: "Test Neighborhood",
  city: "Test City",
  state: "TS",
  zipCode: "12345",
  number: "123",
  complement: "Apt 1",
  dateOfBirth: new Date("1990-01-01"),
  createdAt: mockDate,
  createdBy: "test-user-id",
  updatedBy: "test-user-id",
  updatedAt: mockDate,
  deletedAt: null,
  organizationId: "test-org-id",
} as any);

vi.mocked(prisma.contact.count).mockResolvedValue(2);

describe("ContactRepository", () => {
  let repository: ContactRepository;

  beforeEach(() => {
    repository = new ContactRepository();
    vi.clearAllMocks();
  });

  describe("create", () => {
    it("should create a contact successfully", async () => {
      const contactData = {
        id: "test-contact-id",
        name: "Test Contact",
        email: "test@example.com",
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
        createdAt: mockDate,
        createdBy: "test-user-id",
        updatedBy: null,
        updatedAt: null,
        deletedAt: null,
        organizationId: "test-org-id",
      };

      const result = await repository.create(contactData);

      // Verifica se o create foi chamado com os dados corretos (sem id, pois será gerado)
      const { id, ...dataWithoutId } = contactData;
      expect(prisma.contact.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          ...dataWithoutId,
          id: expect.any(String), // Verifica se um id foi gerado
        }),
      });

      // Verifica se o resultado tem os dados corretos
      expect(result).toMatchObject(dataWithoutId);
      expect(result.id).toBeDefined();
      expect(typeof result.id).toBe("string");
    });
  });

  describe("getById", () => {
    it("should get a contact by id successfully", async () => {
      const result = await repository.getById("test-contact-id", "test-org-id");

      expect(prisma.contact.findFirst).toHaveBeenCalledWith({
        where: {
          id: "test-contact-id",
          organizationId: "test-org-id",
          deletedAt: null,
        },
      });
      expect(result).toBeDefined();
      expect(result?.id).toBe("test-contact-id");
    });

    it("should return null when contact not found", async () => {
      vi.mocked(prisma.contact.findFirst).mockResolvedValueOnce(null);

      const result = await repository.getById("non-existent-id", "test-org-id");

      expect(result).toBeNull();
    });
  });

  describe("getAll", () => {
    it("should get all contacts for an organization successfully", async () => {
      const result = await repository.getAll("test-org-id");

      expect(prisma.contact.findMany).toHaveBeenCalledWith({
        where: {
          organizationId: "test-org-id",
          deletedAt: null,
        },
        orderBy: { createdAt: "desc" },
      });
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe("test-contact-id-1");
      expect(result[1].id).toBe("test-contact-id-2");
    });
  });

  describe("getAllPaginated", () => {
    it("should get paginated contacts successfully", async () => {
      const result = await repository.getAllPaginated("test-org-id", 1, 10);

      expect(prisma.contact.findMany).toHaveBeenCalledWith({
        where: {
          organizationId: "test-org-id",
          deletedAt: null,
        },
        orderBy: { createdAt: "desc" },
        skip: 0,
        take: 10,
      });
      expect(prisma.contact.count).toHaveBeenCalledWith({
        where: {
          organizationId: "test-org-id",
          deletedAt: null,
        },
      });
      expect(result).toEqual({
        data: expect.any(Array),
        total: 2,
        totalPages: 1,
        currentPage: 1,
        itemsPerPage: 10,
      });
      expect(result.data).toHaveLength(2);
    });

    it("should calculate pagination correctly for multiple pages", async () => {
      vi.mocked(prisma.contact.count).mockResolvedValueOnce(25);

      const result = await repository.getAllPaginated("test-org-id", 2, 10);

      expect(result.totalPages).toBe(3);
      expect(result.currentPage).toBe(2);
      expect(result.total).toBe(25);
    });
  });

  describe("getAllPaginatedWithSearch", () => {
    it("should get paginated contacts with search successfully", async () => {
      const result = await repository.getAllPaginatedWithSearch(
        "test-org-id",
        1,
        10,
        "Test"
      );

      expect(prisma.contact.findMany).toHaveBeenCalledWith({
        where: {
          organizationId: "test-org-id",
          deletedAt: null,
          OR: [
            { name: { contains: "Test", mode: "insensitive" } },
            { phoneNumber: { contains: "Test", mode: "insensitive" } },
            { email: { contains: "Test", mode: "insensitive" } },
            { address: { contains: "Test", mode: "insensitive" } },
            { neighborhood: { contains: "Test", mode: "insensitive" } },
            { city: { contains: "Test", mode: "insensitive" } },
            { state: { contains: "Test", mode: "insensitive" } },
            { cpf: { contains: "Test", mode: "insensitive" } },
            { voterId: { contains: "Test", mode: "insensitive" } },
            { occupation: { contains: "Test", mode: "insensitive" } },
            { politicalParty: { contains: "Test", mode: "insensitive" } },
          ],
        },
        orderBy: { createdAt: "desc" },
        skip: 0,
        take: 10,
      });
      expect(result).toEqual({
        data: expect.any(Array),
        total: 2,
        totalPages: 1,
        currentPage: 1,
        itemsPerPage: 10,
      });
    });

    it("should get paginated contacts without search when search is undefined", async () => {
      const result = await repository.getAllPaginatedWithSearch(
        "test-org-id",
        1,
        10
      );

      expect(prisma.contact.findMany).toHaveBeenCalledWith({
        where: {
          organizationId: "test-org-id",
          deletedAt: null,
        },
        orderBy: { createdAt: "desc" },
        skip: 0,
        take: 10,
      });
      expect(result).toBeDefined();
    });
  });

  describe("update", () => {
    it("should update a contact successfully", async () => {
      const updateData = {
        name: "Updated Contact",
        address: "123 Updated St",
        updatedBy: "test-user-id",
      };

      const result = await repository.update(
        "test-contact-id",
        "test-org-id",
        updateData
      );

      expect(prisma.contact.update).toHaveBeenCalledWith({
        where: {
          id: "test-contact-id",
          organizationId: "test-org-id",
        },
        data: updateData,
      });
      expect(result).toBeDefined();
      expect(result?.name).toBe("Updated Contact");
    });

    it("should return null when update fails", async () => {
      vi.mocked(prisma.contact.update).mockRejectedValueOnce(
        new Error("Update failed")
      );

      const result = await repository.update("test-contact-id", "test-org-id", {
        name: "Updated Contact",
      });

      expect(result).toBeNull();
    });
  });

  describe("delete", () => {
    it("should delete a contact successfully", async () => {
      const result = await repository.delete("test-contact-id", "test-org-id");

      expect(prisma.contact.update).toHaveBeenCalledWith({
        where: {
          id: "test-contact-id",
          organizationId: "test-org-id",
        },
        data: {
          deletedAt: expect.any(Date),
        },
      });
      expect(result).toBe(true);
    });

    it("should return false when delete fails", async () => {
      vi.mocked(prisma.contact.update).mockRejectedValueOnce(
        new Error("Delete failed")
      );

      const result = await repository.delete("test-contact-id", "test-org-id");

      expect(result).toBe(false);
    });
  });

  describe("isOwner", () => {
    it("should return true when contact belongs to organization", async () => {
      vi.mocked(prisma.contact.findFirst).mockResolvedValueOnce({
        id: "test-contact-id",
      } as any);

      const result = await repository.isOwner("test-contact-id", "test-org-id");

      expect(prisma.contact.findFirst).toHaveBeenCalledWith({
        where: {
          id: "test-contact-id",
          organizationId: "test-org-id",
          deletedAt: null,
        },
        select: { id: true },
      });
      expect(result).toBe(true);
    });

    it("should return false when contact does not belong to organization", async () => {
      vi.mocked(prisma.contact.findFirst).mockResolvedValueOnce(null);

      const result = await repository.isOwner("test-contact-id", "test-org-id");

      expect(result).toBe(false);
    });
  });

  describe("toContactType", () => {
    it("should convert prisma contact to Contact type", () => {
      const prismaContact = {
        id: "test-id",
        name: "Test Name",
      };

      const result = repository.toContactType(prismaContact);

      expect(result).toEqual(prismaContact);
    });
  });
});
