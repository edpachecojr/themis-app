import { describe, it, expect, vi, beforeEach } from "vitest";
import { OrganizationRepository } from "@/lib/db/organization-repository";
import { prisma } from "@/lib/db/prisma";
import { Organization } from "@/types/organization";

// Mock do Prisma
const mockDate = new Date("2025-01-01T00:00:00.000Z");

vi.mocked(prisma.organization.create).mockResolvedValue({
  id: "test-org-id",
  name: "Test Organization",
  description: "Test Description",
  status: "ACTIVE",
  owner: "test-user-id",
  createdAt: mockDate,
  createdBy: "test-user-id",
  updatedBy: "test-user-id",
  updatedAt: mockDate,
  deletedAt: null,
} as any);

vi.mocked(prisma.organization.findFirst).mockResolvedValue({
  id: "test-org-id",
  name: "Test Organization",
  description: "Test Description",
  status: "ACTIVE",
  owner: "test-user-id",
  createdAt: mockDate,
  createdBy: "test-user-id",
  updatedBy: "test-user-id",
  updatedAt: mockDate,
  deletedAt: null,
} as any);

vi.mocked(prisma.organization.findMany).mockResolvedValue([
  {
    id: "test-org-id-1",
    name: "Test Organization 1",
    description: "Test Description 1",
    status: "ACTIVE",
    owner: "test-user-id",
    createdAt: mockDate,
    createdBy: "test-user-id",
    updatedBy: "test-user-id",
    updatedAt: mockDate,
    deletedAt: null,
  },
  {
    id: "test-org-id-2",
    name: "Test Organization 2",
    description: "Test Description 2",
    status: "INACTIVE",
    owner: "test-user-id",
    createdAt: mockDate,
    createdBy: "test-user-id",
    updatedBy: "test-user-id",
    updatedAt: mockDate,
    deletedAt: null,
  },
] as any[]);

vi.mocked(prisma.organization.update).mockResolvedValue({
  id: "test-org-id",
  name: "Updated Organization",
  description: "Updated Description",
  status: "ACTIVE",
  owner: "test-user-id",
  createdAt: mockDate,
  createdBy: "test-user-id",
  updatedBy: "test-user-id",
  updatedAt: mockDate,
  deletedAt: null,
} as any);

vi.mocked(prisma.organization.count).mockResolvedValue(2);

describe("OrganizationRepository", () => {
  let repository: OrganizationRepository;

  beforeEach(() => {
    repository = new OrganizationRepository();
    vi.clearAllMocks();
  });

  describe("createOrganization", () => {
    it("should create an organization successfully", async () => {
      const organizationData = {
        id: "test-org-id",
        name: "Test Organization",
        description: "Test Description",
        status: "ACTIVE" as const,
        owner: "test-user-id",
        createdAt: mockDate,
        createdBy: "test-user-id",
        updatedBy: "test-user-id",
        updatedAt: mockDate,
        deletedAt: null,
      };

      const result = await repository.createOrganization(organizationData);

      expect(prisma.organization.create).toHaveBeenCalledWith({
        data: organizationData,
      });
      expect(result).toEqual(organizationData);
    });
  });

  describe("getOrganizationById", () => {
    it("should get an organization by id successfully", async () => {
      const result = await repository.getOrganizationById(
        "test-org-id",
        "test-user-id"
      );

      expect(prisma.organization.findFirst).toHaveBeenCalledWith({
        where: {
          id: "test-org-id",
          owner: "test-user-id",
          deletedAt: null,
        },
      });
      expect(result).toBeDefined();
      expect(result?.id).toBe("test-org-id");
    });

    it("should return null when organization not found", async () => {
      vi.mocked(prisma.organization.findFirst).mockResolvedValueOnce(null);

      const result = await repository.getOrganizationById(
        "non-existent-id",
        "test-user-id"
      );

      expect(result).toBeNull();
    });
  });

  describe("getAll", () => {
    it("should get all organizations for an owner successfully", async () => {
      const result = await repository.getAll("test-user-id");

      expect(prisma.organization.findMany).toHaveBeenCalledWith({
        where: {
          owner: "test-user-id",
          deletedAt: null,
        },
        orderBy: { createdAt: "desc" },
      });
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe("test-org-id-1");
      expect(result[1].id).toBe("test-org-id-2");
    });
  });

  describe("getAllPaginated", () => {
    it("should get paginated organizations successfully", async () => {
      const result = await repository.getAllPaginated("test-user-id", 1, 10);

      expect(prisma.organization.findMany).toHaveBeenCalledWith({
        where: {
          owner: "test-user-id",
          deletedAt: null,
        },
        orderBy: { createdAt: "desc" },
        skip: 0,
        take: 10,
      });
      expect(prisma.organization.count).toHaveBeenCalledWith({
        where: {
          owner: "test-user-id",
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
      vi.mocked(prisma.organization.count).mockResolvedValueOnce(25);

      const result = await repository.getAllPaginated("test-user-id", 2, 10);

      expect(result.totalPages).toBe(3);
      expect(result.currentPage).toBe(2);
      expect(result.total).toBe(25);
    });
  });

  describe("getAllPaginatedWithSearch", () => {
    it("should get paginated organizations with search successfully", async () => {
      const result = await repository.getAllPaginatedWithSearch(
        "test-user-id",
        1,
        10,
        "Test"
      );

      expect(prisma.organization.findMany).toHaveBeenCalledWith({
        where: {
          owner: "test-user-id",
          deletedAt: null,
          OR: [
            { name: { contains: "Test", mode: "insensitive" } },
            { description: { contains: "Test", mode: "insensitive" } },
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

    it("should get paginated organizations without search when search is undefined", async () => {
      const result = await repository.getAllPaginatedWithSearch(
        "test-user-id",
        1,
        10
      );

      expect(prisma.organization.findMany).toHaveBeenCalledWith({
        where: {
          owner: "test-user-id",
          deletedAt: null,
        },
        orderBy: { createdAt: "desc" },
        skip: 0,
        take: 10,
      });
      expect(result).toBeDefined();
    });
  });

  describe("updateOrganization", () => {
    it("should update an organization successfully", async () => {
      const updateData = {
        name: "Updated Organization",
        description: "Updated Description",
        updatedBy: "test-user-id",
      };

      const result = await repository.updateOrganization(
        "test-org-id",
        "test-user-id",
        updateData
      );

      expect(prisma.organization.update).toHaveBeenCalledWith({
        where: {
          id: "test-org-id",
          owner: "test-user-id",
        },
        data: updateData,
      });
      expect(result).toBeDefined();
      expect(result?.name).toBe("Updated Organization");
    });

    it("should return null when update fails", async () => {
      vi.mocked(prisma.organization.update).mockRejectedValueOnce(
        new Error("Update failed")
      );

      const result = await repository.updateOrganization(
        "test-org-id",
        "test-user-id",
        {
          name: "Updated Organization",
        }
      );

      expect(result).toBeNull();
    });
  });

  describe("deleteOrganization", () => {
    it("should delete an organization successfully", async () => {
      const result = await repository.deleteOrganization(
        "test-org-id",
        "test-user-id"
      );

      expect(prisma.organization.update).toHaveBeenCalledWith({
        where: {
          id: "test-org-id",
          owner: "test-user-id",
        },
        data: {
          deletedAt: expect.any(Date),
        },
      });
      expect(result).toBe(true);
    });

    it("should return false when delete fails", async () => {
      vi.mocked(prisma.organization.update).mockRejectedValueOnce(
        new Error("Delete failed")
      );

      const result = await repository.deleteOrganization(
        "test-org-id",
        "test-user-id"
      );

      expect(result).toBe(false);
    });
  });

  describe("isOrganizationOwner", () => {
    it("should return true when organization belongs to owner", async () => {
      vi.mocked(prisma.organization.findFirst).mockResolvedValueOnce({
        id: "test-org-id",
      } as any);

      const result = await repository.isOrganizationOwner(
        "test-org-id",
        "test-user-id"
      );

      expect(prisma.organization.findFirst).toHaveBeenCalledWith({
        where: {
          id: "test-org-id",
          owner: "test-user-id",
          deletedAt: null,
        },
        select: { id: true },
      });
      expect(result).toBe(true);
    });

    it("should return false when organization does not belong to owner", async () => {
      vi.mocked(prisma.organization.findFirst).mockResolvedValueOnce(null);

      const result = await repository.isOrganizationOwner(
        "test-org-id",
        "test-user-id"
      );

      expect(result).toBe(false);
    });
  });

  describe("toOrganizationType", () => {
    it("should convert prisma organization to Organization type", () => {
      const prismaOrganization = {
        id: "test-id",
        name: "Test Name",
      };

      const result = repository.toOrganizationType(prismaOrganization);

      expect(result).toEqual(prismaOrganization);
    });
  });
});
