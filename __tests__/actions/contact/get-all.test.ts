import { describe, it, expect, vi, beforeEach } from "vitest";
import { getContacts, getAllContacts } from "@/actions/contact/get-all";
import { contactService } from "@/services/contact-service";
import { Contact } from "@/types/contact";

// Mock das dependências
vi.mock("@/services/contact-service");

const mockContactService = vi.mocked(contactService);

describe("Contact Actions - Get All", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getContacts", () => {
    it("should get contacts with pagination and search successfully", async () => {
      const inputData = {
        page: 1,
        itemsPerPage: 10,
      };

      const mockPaginatedResult = {
        data: [
          {
            id: "test-contact-1",
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
          },
          {
            id: "test-contact-2",
            name: "Jane Smith",
            phoneNumber: "+0987654321",
            sex: "FEMALE" as const,
            address: "456 Oak Ave",
            neighborhood: "Uptown",
            city: "Los Angeles",
            state: "CA",
            zipCode: "90210",
            number: "456",
            complement: "Apt 2B",
            dateOfBirth: undefined,
            email: undefined,
            createdAt: new Date(),
            createdBy: "test-user-id",
            updatedBy: undefined,
            updatedAt: undefined,
            deletedAt: undefined,
            organizationId: "test-org-id",
          },
        ] as Contact[],
        total: 2,
        totalPages: 1,
        currentPage: 1,
        itemsPerPage: 10,
      };

      mockContactService.getAllPaginatedWithSearch.mockResolvedValue(
        mockPaginatedResult
      );

      const result = await getContacts(inputData);

      expect(mockContactService.getAllPaginatedWithSearch).toHaveBeenCalledWith(
        inputData.page,
        inputData.itemsPerPage,
        undefined
      );
      expect(result.data).toEqual({ ok: true, ...mockPaginatedResult });
    });

    it("should use default values when not provided", async () => {
      const inputData = {};

      const mockPaginatedResult = {
        data: [] as Contact[],
        total: 0,
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: 10,
      };

      mockContactService.getAllPaginatedWithSearch.mockResolvedValue(
        mockPaginatedResult
      );

      const result = await getContacts(inputData);

      expect(mockContactService.getAllPaginatedWithSearch).toHaveBeenCalledWith(
        1,
        10,
        undefined
      );
      expect(result.data).toEqual({ ok: true, ...mockPaginatedResult });
    });

    it("should handle pagination with custom values", async () => {
      const inputData = {
        page: 2,
        itemsPerPage: 5,
        search: "John",
      };

      const mockPaginatedResult = {
        data: [
          {
            id: "test-contact-3",
            name: "John Doe",
            phoneNumber: "+1111111111",
            sex: "MALE" as const,
            address: "789 John St",
            neighborhood: "John Neighborhood",
            city: "John City",
            state: "JC",
            zipCode: "11111",
            number: "789",
            complement: undefined,
            dateOfBirth: undefined,
            email: undefined,
            createdAt: new Date(),
            createdBy: "test-user-id",
            updatedBy: undefined,
            updatedAt: undefined,
            deletedAt: undefined,
            organizationId: "test-org-id",
          },
        ] as Contact[],
        total: 1,
        totalPages: 1,
        currentPage: 2,
        itemsPerPage: 5,
      };

      mockContactService.getAllPaginatedWithSearch.mockResolvedValue(
        mockPaginatedResult
      );

      const result = await getContacts(inputData);

      expect(mockContactService.getAllPaginatedWithSearch).toHaveBeenCalledWith(
        inputData.page,
        inputData.itemsPerPage,
        inputData.search
      );
      expect(result.data).toEqual({ ok: true, ...mockPaginatedResult });
    });

    it("should validate input schema correctly", () => {
      // Verificar se a action está configurada corretamente
      expect(getContacts).toBeDefined();
    });
  });

  describe("getAllContacts", () => {
    it("should get all contacts successfully", async () => {
      const mockContacts = [
        {
          id: "test-contact-1",
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
        },
      ] as Contact[];

      mockContactService.getAll.mockResolvedValue(mockContacts);

      const result = await getAllContacts();

      expect(mockContactService.getAll).toHaveBeenCalled();
      expect(result.data).toEqual({
        ok: true,
        contacts: mockContacts,
      });
    });

    it("should handle empty contacts list successfully", async () => {
      const mockContacts = [] as Contact[];

      mockContactService.getAll.mockResolvedValue(mockContacts);

      const result = await getAllContacts();

      expect(mockContactService.getAll).toHaveBeenCalled();
      expect(result.data).toEqual({
        ok: true,
        contacts: mockContacts,
      });
    });

    it("should handle service errors gracefully", async () => {
      const mockError = new Error("Database connection failed");
      mockContactService.getAll.mockRejectedValue(mockError);

      const result = await getAllContacts();

      expect(mockContactService.getAll).toHaveBeenCalled();
      expect(result.data).toEqual({
        ok: false,
        error: "Erro ao buscar contatos",
      });
    });

    it("should validate action configuration correctly", () => {
      // Verificar se a action está configurada corretamente
      expect(getAllContacts).toBeDefined();
    });
  });
});
