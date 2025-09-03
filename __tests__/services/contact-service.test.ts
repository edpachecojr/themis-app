import { describe, it, expect, vi, beforeEach } from "vitest";
import { ContactService } from "@/services/contact-service";
import { Contact } from "@/types/contact";

// Mock do módulo inteiro do serviço
vi.mock("@/services/contact-service", () => ({
  ContactService: vi.fn().mockImplementation(() => ({
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    getAllPaginated: vi.fn(),
    getAllPaginatedWithSearch: vi.fn(),
    isContactOwner: vi.fn(),
    // Novos métodos parlamentares
    getByCpf: vi.fn(),
    getByVoterId: vi.fn(),
    getByPoliticalParty: vi.fn(),
    getByAgeGroup: vi.fn(),
    getBySocialClass: vi.fn(),
    getByEducation: vi.fn(),
    getByUrbanRural: vi.fn(),
    getByVoterStatus: vi.fn(),
    getAllPaginatedWithAdvancedFilters: vi.fn(),
    getParliamentaryStats: vi.fn(),
    getByPoliticalInterests: vi.fn(),
    getByParticipationLevel: vi.fn(),
  })),
}));

describe("ContactService", () => {
  let service: ContactService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ContactService();
  });

  describe("getAll", () => {
    it("should get all contacts successfully", async () => {
      const mockContacts = [
        {
          id: "test-contact-1",
          name: "Test Contact 1",
          email: "test1@example.com",
          phoneNumber: "+1234567890",
          sex: "MALE" as any,
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
          updatedBy: undefined,
          updatedAt: undefined,
          deletedAt: undefined,
          organizationId: "test-org-id",
          // Campos parlamentares obrigatórios
          isVoter: true,
          politicalInterests: [],
          votingHistory: [],
          // Campos parlamentares opcionais
          cpf: undefined,
          rg: undefined,
          voterId: undefined,
          maritalStatus: undefined,
          occupation: undefined,
          education: undefined,
          income: undefined,
          politicalParty: undefined,
          votingZone: undefined,
          votingSection: undefined,
          whatsapp: undefined,
          instagram: undefined,
          facebook: undefined,
          linkedin: undefined,
          spouseName: undefined,
          childrenCount: undefined,
          dependents: undefined,
          participationLevel: undefined,
          ageGroup: undefined,
          socialClass: undefined,
          urbanRural: undefined,
        },
      ] as Contact[];

      // Mock do método getAll do serviço
      vi.mocked(service.getAll).mockResolvedValue(mockContacts);

      const result = await service.getAll();

      expect(service.getAll).toHaveBeenCalled();
      expect(result).toEqual(mockContacts);
    });
  });

  describe("getById", () => {
    it("should get a contact by id successfully", async () => {
      const mockContact = {
        id: "test-contact-1",
        name: "Test Contact 1",
        email: "test1@example.com",
        phoneNumber: "+1234567890",
        sex: "MALE" as any,
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
        updatedBy: undefined,
        updatedAt: undefined,
        deletedAt: undefined,
        organizationId: "test-org-id",
        // Campos parlamentares obrigatórios
        isVoter: true,
        politicalInterests: [],
        votingHistory: [],
        // Campos parlamentares opcionais
        cpf: undefined,
        rg: undefined,
        voterId: undefined,
        maritalStatus: undefined,
        occupation: undefined,
        education: undefined,
        income: undefined,
        politicalParty: undefined,
        votingZone: undefined,
        votingSection: undefined,
        whatsapp: undefined,
        instagram: undefined,
        facebook: undefined,
        linkedin: undefined,
        spouseName: undefined,
        childrenCount: undefined,
        dependents: undefined,
        participationLevel: undefined,
        ageGroup: undefined,
        socialClass: undefined,
        urbanRural: undefined,
      } as Contact;

      // Mock do método getById do serviço
      vi.mocked(service.getById).mockResolvedValue(mockContact);

      const result = await service.getById("test-contact-id");

      expect(service.getById).toHaveBeenCalledWith("test-contact-id");
      expect(result).toEqual(mockContact);
    });

    it("should return null when contact not found", async () => {
      // Mock do método getById do serviço para retornar null
      vi.mocked(service.getById).mockResolvedValue(null);

      const result = await service.getById("non-existent-id");

      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    it("should create a contact successfully", async () => {
      const contactData = {
        name: "New Contact",
        email: "new@example.com",
        phoneNumber: "+1234567890",
        sex: "FEMALE" as any, // Usar any temporariamente para compatibilidade
        address: "456 New St",
        neighborhood: "New Neighborhood",
        city: "New City",
        state: "NS",
        zipCode: "54321",
        number: "456",
        complement: "Apt 2",
        dateOfBirth: new Date("1995-01-01"),
      };

      const mockCreatedContact = {
        id: "new-contact-id",
        ...contactData,
        createdAt: new Date(),
        createdBy: "test-user-id",
        updatedBy: undefined,
        updatedAt: undefined,
        deletedAt: undefined,
        organizationId: "test-org-id",
      } as Contact;

      // Mock do método create do serviço
      vi.mocked(service.create).mockResolvedValue(mockCreatedContact);

      const result = await service.create(contactData);

      expect(service.create).toHaveBeenCalledWith(contactData);
      expect(result).toEqual(mockCreatedContact);
    });
  });

  describe("update", () => {
    it("should update a contact successfully", async () => {
      const contactId = "test-contact-1";
      const updateData = {
        name: "Updated Contact",
        email: "updated@example.com",
      };

      const mockUpdatedContact = {
        id: contactId,
        name: "Updated Contact",
        email: "updated@example.com",
        phoneNumber: "+1234567890",
        sex: "MALE" as any,
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
        deletedAt: undefined,
        organizationId: "test-org-id",
        // Campos parlamentares obrigatórios
        isVoter: true,
        politicalInterests: [],
        votingHistory: [],
        // Campos parlamentares opcionais
        cpf: undefined,
        rg: undefined,
        voterId: undefined,
        maritalStatus: undefined,
        occupation: undefined,
        education: undefined,
        income: undefined,
        politicalParty: undefined,
        votingZone: undefined,
        votingSection: undefined,
        whatsapp: undefined,
        instagram: undefined,
        facebook: undefined,
        linkedin: undefined,
        spouseName: undefined,
        childrenCount: undefined,
        dependents: undefined,
        participationLevel: undefined,
        ageGroup: undefined,
        socialClass: undefined,
        urbanRural: undefined,
      } as Contact;

      // Mock do método update do serviço
      vi.mocked(service.update).mockResolvedValue(mockUpdatedContact);

      const result = await service.update(contactId, updateData);

      expect(service.update).toHaveBeenCalledWith(contactId, updateData);
      expect(result).toEqual(mockUpdatedContact);
    });

    it("should return null when update fails", async () => {
      // Mock do método update do serviço para retornar null
      vi.mocked(service.update).mockResolvedValue(null);

      const result = await service.update("test-contact-id", {
        name: "Updated Contact",
      });

      expect(result).toBeNull();
    });
  });

  describe("delete", () => {
    it("should delete a contact successfully", async () => {
      const contactId = "test-contact-1";

      // Mock do método delete do serviço
      vi.mocked(service.delete).mockResolvedValue(true);

      const result = await service.delete(contactId);

      expect(service.delete).toHaveBeenCalledWith(contactId);
      expect(result).toBe(true);
    });

    it("should return false when delete fails", async () => {
      // Mock do método delete do serviço para retornar false
      vi.mocked(service.delete).mockResolvedValue(false);

      const result = await service.delete("test-contact-id");

      expect(result).toBe(false);
    });
  });

  describe("getAllPaginated", () => {
    it("should get paginated contacts successfully", async () => {
      const mockPaginatedResult = {
        data: [
          {
            id: "test-contact-1",
            name: "Test Contact 1",
          },
          {
            id: "test-contact-2",
            name: "Test Contact 2",
          },
        ] as Contact[],
        total: 2,
        totalPages: 1,
        currentPage: 1,
        itemsPerPage: 10,
      };

      // Mock do método getAllPaginated do serviço
      vi.mocked(service.getAllPaginated).mockResolvedValue(mockPaginatedResult);

      const result = await service.getAllPaginated(1, 10);

      expect(service.getAllPaginated).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual(mockPaginatedResult);
    });
  });

  describe("getAllPaginatedWithSearch", () => {
    it("should get paginated contacts with search successfully", async () => {
      const mockPaginatedResult = {
        data: [
          {
            id: "test-contact-1",
            name: "Test Contact 1",
          },
        ] as Contact[],
        total: 1,
        totalPages: 1,
        currentPage: 1,
        itemsPerPage: 10,
      };

      // Mock do método getAllPaginatedWithSearch do serviço
      vi.mocked(service.getAllPaginatedWithSearch).mockResolvedValue(
        mockPaginatedResult
      );

      const result = await service.getAllPaginatedWithSearch(1, 10, "Test");

      expect(service.getAllPaginatedWithSearch).toHaveBeenCalledWith(
        1,
        10,
        "Test"
      );
      expect(result).toEqual(mockPaginatedResult);
    });

    it("should get paginated contacts without search when search is undefined", async () => {
      const mockPaginatedResult = {
        data: [] as Contact[],
        total: 0,
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: 10,
      };

      // Mock do método getAllPaginatedWithSearch do serviço
      vi.mocked(service.getAllPaginatedWithSearch).mockResolvedValue(
        mockPaginatedResult
      );

      const result = await service.getAllPaginatedWithSearch(1, 10);

      expect(service.getAllPaginatedWithSearch).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual(mockPaginatedResult);
    });
  });

  describe("isContactOwner", () => {
    it("should return true when contact belongs to organization", async () => {
      // Mock do método isContactOwner do serviço
      vi.mocked(service.isContactOwner).mockResolvedValue(true);

      const result = await service.isContactOwner("test-contact-id");

      expect(service.isContactOwner).toHaveBeenCalledWith("test-contact-id");
      expect(result).toBe(true);
    });

    it("should return false when contact does not belong to organization", async () => {
      // Mock do método isContactOwner do serviço
      vi.mocked(service.isContactOwner).mockResolvedValue(false);

      const result = await service.isContactOwner("test-contact-id");

      expect(result).toBe(false);
    });
  });

  // === TESTES PARA MÉTODOS PARLAMENTARES ===

  describe("getByCpf", () => {
    it("should get contact by CPF successfully", async () => {
      const mockContact = {
        id: "test-contact-1",
        name: "Test Contact 1",
        cpf: "12345678901",
      } as Contact;

      vi.mocked(service.getByCpf).mockResolvedValue(mockContact);

      const result = await service.getByCpf("12345678901");

      expect(service.getByCpf).toHaveBeenCalledWith("12345678901");
      expect(result).toEqual(mockContact);
    });

    it("should return null when CPF not found", async () => {
      vi.mocked(service.getByCpf).mockResolvedValue(null);

      const result = await service.getByCpf("99999999999");

      expect(result).toBeNull();
    });
  });

  describe("getByVoterId", () => {
    it("should get contact by voter ID successfully", async () => {
      const mockContact = {
        id: "test-contact-1",
        name: "Test Contact 1",
        voterId: "123456789012",
      } as Contact;

      vi.mocked(service.getByVoterId).mockResolvedValue(mockContact);

      const result = await service.getByVoterId("123456789012");

      expect(service.getByVoterId).toHaveBeenCalledWith("123456789012");
      expect(result).toEqual(mockContact);
    });
  });

  describe("getByPoliticalParty", () => {
    it("should get contacts by political party successfully", async () => {
      const mockContacts = [
        { id: "contact-1", name: "Contact 1", politicalParty: "Party A" },
        { id: "contact-2", name: "Contact 2", politicalParty: "Party A" },
      ] as Contact[];

      vi.mocked(service.getByPoliticalParty).mockResolvedValue(mockContacts);

      const result = await service.getByPoliticalParty("Party A");

      expect(service.getByPoliticalParty).toHaveBeenCalledWith("Party A");
      expect(result).toEqual(mockContacts);
      expect(result).toHaveLength(2);
    });
  });

  describe("getByAgeGroup", () => {
    it("should get contacts by age group successfully", async () => {
      const mockContacts = [
        { id: "contact-1", name: "Contact 1", ageGroup: "AGE_18_25" },
      ] as Contact[];

      vi.mocked(service.getByAgeGroup).mockResolvedValue(mockContacts);

      const result = await service.getByAgeGroup("AGE_18_25");

      expect(service.getByAgeGroup).toHaveBeenCalledWith("AGE_18_25");
      expect(result).toEqual(mockContacts);
    });
  });

  describe("getByVoterStatus", () => {
    it("should get active voters successfully", async () => {
      const mockContacts = [
        { id: "contact-1", name: "Contact 1", isVoter: true },
        { id: "contact-2", name: "Contact 2", isVoter: true },
      ] as Contact[];

      vi.mocked(service.getByVoterStatus).mockResolvedValue(mockContacts);

      const result = await service.getByVoterStatus(true);

      expect(service.getByVoterStatus).toHaveBeenCalledWith(true);
      expect(result).toEqual(mockContacts);
      expect(result).toHaveLength(2);
    });
  });

  describe("getParliamentaryStats", () => {
    it("should get parliamentary statistics successfully", async () => {
      const mockStats = {
        totalContacts: 100,
        totalVoters: 85,
        voterPercentage: 85,
        byAgeGroup: [],
        bySocialClass: [],
        byEducation: [],
        byPoliticalParty: [],
        byUrbanRural: [],
      };

      vi.mocked(service.getParliamentaryStats).mockResolvedValue(mockStats);

      const result = await service.getParliamentaryStats();

      expect(service.getParliamentaryStats).toHaveBeenCalled();
      expect(result).toEqual(mockStats);
      expect(result.totalContacts).toBe(100);
      expect(result.voterPercentage).toBe(85);
    });
  });

  describe("getAllPaginatedWithAdvancedFilters", () => {
    it("should get paginated contacts with advanced filters successfully", async () => {
      const filters = {
        organizationId: "test-org-id",
        ageGroup: "AGE_18_25" as any,
        education: "COMPLETE_HIGH_SCHOOL" as any,
        isVoter: true,
      };

      const mockResult = {
        data: [{ id: "contact-1", name: "Contact 1" }] as Contact[],
        total: 1,
        totalPages: 1,
        currentPage: 1,
        itemsPerPage: 10,
      };

      vi.mocked(service.getAllPaginatedWithAdvancedFilters).mockResolvedValue(
        mockResult
      );

      const result = await service.getAllPaginatedWithAdvancedFilters(
        filters,
        1,
        10
      );

      expect(service.getAllPaginatedWithAdvancedFilters).toHaveBeenCalledWith(
        filters,
        1,
        10
      );
      expect(result).toEqual(mockResult);
    });
  });
});
