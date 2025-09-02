import { describe, it, expect, vi, beforeEach } from "vitest";
import { OrganizationService } from "@/services/organization-service";
import { Organization } from "@/types/organization";

// Mock do módulo inteiro do serviço
vi.mock("@/services/organization-service", () => ({
  OrganizationService: vi.fn().mockImplementation(() => ({
    getAll: vi.fn(),
    getOrganizationById: vi.fn(),
    createOrganization: vi.fn(),
    updateOrganization: vi.fn(),
    deleteOrganization: vi.fn(),
    getAllPaginated: vi.fn(),
    getAllPaginatedWithSearch: vi.fn(),
    isOrganizationOwner: vi.fn(),
  })),
}));

describe("OrganizationService", () => {
  let service: OrganizationService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new OrganizationService();
  });

  describe("getAll", () => {
    it("should get all organizations successfully", async () => {
      const mockOrganizations = [
        {
          id: "test-org-1",
          name: "Test Organization 1",
          description: "Test Description 1",
          status: "ACTIVE" as const,
          owner: "test-user-id",
          createdAt: new Date(),
          createdBy: "test-user-id",
          updatedAt: new Date(),
          updatedBy: "test-user-id",
          deletedAt: undefined,
        },
      ] as Organization[];

      // Mock do método getAll do serviço
      vi.mocked(service.getAll).mockResolvedValue(mockOrganizations);

      const result = await service.getAll();

      expect(service.getAll).toHaveBeenCalled();
      expect(result).toEqual(mockOrganizations);
    });
  });

  describe("getOrganizationById", () => {
    it("should get an organization by id successfully", async () => {
      const mockOrganization = {
        id: "test-org-1",
        name: "Test Organization 1",
        description: "Test Description 1",
        status: "ACTIVE" as const,
        owner: "test-user-id",
        createdAt: new Date(),
        createdBy: "test-user-id",
        updatedAt: new Date(),
        updatedBy: "test-user-id",
        deletedAt: undefined,
      } as Organization;

      // Mock do método getOrganizationById do serviço
      vi.mocked(service.getOrganizationById).mockResolvedValue(
        mockOrganization
      );

      const result = await service.getOrganizationById("test-org-id");

      expect(service.getOrganizationById).toHaveBeenCalledWith("test-org-id");
      expect(result).toEqual(mockOrganization);
    });

    it("should return null when organization not found", async () => {
      // Mock do método getOrganizationById do serviço para retornar null
      vi.mocked(service.getOrganizationById).mockResolvedValue(null);

      const result = await service.getOrganizationById("non-existent-id");

      expect(result).toBeNull();
    });
  });

  describe("createOrganization", () => {
    it("should create an organization successfully", async () => {
      const organizationData = {
        name: "New Organization",
        description: "New Description",
        status: "ACTIVE" as const,
      };

      const mockCreatedOrganization = {
        id: "new-org-id",
        ...organizationData,
        owner: "test-user-id",
        createdAt: new Date(),
        createdBy: "test-user-id",
        updatedAt: new Date(),
        updatedBy: "test-user-id",
        deletedAt: undefined,
      } as Organization;

      // Mock do método createOrganization do serviço
      vi.mocked(service.createOrganization).mockResolvedValue(
        mockCreatedOrganization
      );

      const result = await service.createOrganization(organizationData);

      expect(service.createOrganization).toHaveBeenCalledWith(organizationData);
      expect(result).toEqual(mockCreatedOrganization);
    });
  });

  describe("updateOrganization", () => {
    it("should update an organization successfully", async () => {
      const organizationId = "test-org-1";
      const updateData = {
        name: "Updated Organization",
        description: "Updated Description",
      };

      const mockUpdatedOrganization = {
        id: organizationId,
        name: "Updated Organization",
        description: "Updated Description",
        status: "ACTIVE" as const,
        owner: "test-user-id",
        createdAt: new Date(),
        createdBy: "test-user-id",
        updatedAt: new Date(),
        updatedBy: "test-user-id",
        deletedAt: undefined,
      } as Organization;

      // Mock do método updateOrganization do serviço
      vi.mocked(service.updateOrganization).mockResolvedValue(
        mockUpdatedOrganization
      );

      const result = await service.updateOrganization(
        organizationId,
        updateData
      );

      expect(service.updateOrganization).toHaveBeenCalledWith(
        organizationId,
        updateData
      );
      expect(result).toEqual(mockUpdatedOrganization);
    });

    it("should return null when update fails", async () => {
      // Mock do método updateOrganization do serviço para retornar null
      vi.mocked(service.updateOrganization).mockResolvedValue(null);

      const result = await service.updateOrganization("test-org-id", {
        name: "Updated Organization",
      });

      expect(result).toBeNull();
    });
  });

  describe("deleteOrganization", () => {
    it("should delete an organization successfully", async () => {
      const organizationId = "test-org-1";

      // Mock do método deleteOrganization do serviço
      vi.mocked(service.deleteOrganization).mockResolvedValue(true);

      const result = await service.deleteOrganization(organizationId);

      expect(service.deleteOrganization).toHaveBeenCalledWith(organizationId);
      expect(result).toBe(true);
    });

    it("should return false when delete fails", async () => {
      // Mock do método deleteOrganization do serviço para retornar false
      vi.mocked(service.deleteOrganization).mockResolvedValue(false);

      const result = await service.deleteOrganization("test-org-id");

      expect(result).toBe(false);
    });
  });

  describe("getAllPaginated", () => {
    it("should get paginated organizations successfully", async () => {
      const mockPaginatedResult = {
        data: [
          {
            id: "test-org-1",
            name: "Test Organization 1",
          },
          {
            id: "test-org-2",
            name: "Test Organization 2",
          },
        ] as Organization[],
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
    it("should get paginated organizations with search successfully", async () => {
      const mockPaginatedResult = {
        data: [
          {
            id: "test-org-1",
            name: "Test Organization 1",
          },
        ] as Organization[],
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

    it("should get paginated organizations without search when search is undefined", async () => {
      const mockPaginatedResult = {
        data: [] as Organization[],
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

  describe("isOrganizationOwner", () => {
    it("should return true when organization belongs to user", async () => {
      // Mock do método isOrganizationOwner do serviço
      vi.mocked(service.isOrganizationOwner).mockResolvedValue(true);

      const result = await service.isOrganizationOwner("test-org-id");

      expect(service.isOrganizationOwner).toHaveBeenCalledWith("test-org-id");
      expect(result).toBe(true);
    });

    it("should return false when organization does not belong to user", async () => {
      // Mock do método isOrganizationOwner do serviço
      vi.mocked(service.isOrganizationOwner).mockResolvedValue(false);

      const result = await service.isOrganizationOwner("test-org-id");

      expect(result).toBe(false);
    });
  });
});
