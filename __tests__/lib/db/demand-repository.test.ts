import { describe, it, expect, vi, beforeEach } from "vitest";
import { DemandRepository } from "@/lib/db/demand-repository";
import { prisma } from "@/lib/db/prisma";
import { Demand, DemandStatus, Priority } from "@/types/demand";

// Mock do Prisma
const mockDate = new Date("2025-01-01T00:00:00.000Z");

const mockDemand = {
  id: "test-demand-id",
  protocolNumber: "001",
  title: "Test Demand",
  description: "Test Description",
  contactId: "test-contact-id",
  organizationId: "test-org-id",
  status: "NEW" as DemandStatus,
  priority: "MEDIUM" as Priority,
  createdById: "test-user-id",
  createdAt: mockDate,
  updatedAt: mockDate,
  contact: {
    id: "test-contact-id",
    name: "Test Contact",
  },
  organization: {
    id: "test-org-id",
    name: "Test Organization",
  },
  createdBy: {
    id: "test-user-id",
    name: "Test User",
  },
  notes: [],
  tags: [],
} as any;

const mockDemandList = [
  {
    ...mockDemand,
    id: "test-demand-id-1",
    protocolNumber: "001",
    title: "Test Demand 1",
  },
  {
    ...mockDemand,
    id: "test-demand-id-2",
    protocolNumber: "002",
    title: "Test Demand 2",
  },
] as any[];

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    demand: {
      create: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
      groupBy: vi.fn(),
    },
  },
}));

describe("DemandRepository", () => {
  let repository: DemandRepository;

  beforeEach(() => {
    repository = new DemandRepository();
    vi.clearAllMocks();
  });

  describe("create", () => {
    it("should create a demand successfully", async () => {
      const createData = {
        protocolNumber: "001",
        title: "Test Demand",
        description: "Test Description",
        organizationId: "test-org-id",
        createdById: "test-user-id",
      };

      vi.mocked(prisma.demand.create).mockResolvedValue(mockDemand);

      const result = await repository.create(createData);

      expect(prisma.demand.create).toHaveBeenCalledWith({
        data: {
          ...createData,
          id: expect.any(String),
        },
      });
      expect(result).toEqual(mockDemand);
    });
  });

  describe("getById", () => {
    it("should return a demand by id", async () => {
      vi.mocked(prisma.demand.findFirst).mockResolvedValue(mockDemand);

      const result = await repository.getById("test-demand-id", "test-org-id");

      expect(prisma.demand.findFirst).toHaveBeenCalledWith({
        where: {
          id: "test-demand-id",
          organizationId: "test-org-id",
        },
        include: {
          contact: {
            select: {
              id: true,
              name: true,
            },
          },
          organization: {
            select: {
              id: true,
              name: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
            },
          },
          notes: {
            orderBy: { createdAt: "desc" },
          },
          tags: {
            orderBy: { createdAt: "desc" },
          },
        },
      });
      expect(result).toEqual(mockDemand);
    });

    it("should return null when demand not found", async () => {
      vi.mocked(prisma.demand.findFirst).mockResolvedValue(null);

      const result = await repository.getById("non-existent-id", "test-org-id");

      expect(result).toBeNull();
    });
  });

  describe("getByProtocol", () => {
    it("should return a demand by protocol number", async () => {
      vi.mocked(prisma.demand.findFirst).mockResolvedValue(mockDemand);

      const result = await repository.getByProtocol("001", "test-org-id");

      expect(prisma.demand.findFirst).toHaveBeenCalledWith({
        where: {
          protocolNumber: "001",
          organizationId: "test-org-id",
        },
        include: {
          contact: {
            select: {
              id: true,
              name: true,
            },
          },
          organization: {
            select: {
              id: true,
              name: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
            },
          },
          notes: {
            orderBy: { createdAt: "desc" },
          },
          tags: {
            orderBy: { createdAt: "desc" },
          },
        },
      });
      expect(result).toEqual(mockDemand);
    });
  });

  describe("getAll", () => {
    it("should return all demands for an organization", async () => {
      vi.mocked(prisma.demand.findMany).mockResolvedValue(mockDemandList);

      const result = await repository.getAll("test-org-id");

      expect(prisma.demand.findMany).toHaveBeenCalledWith({
        where: {
          organizationId: "test-org-id",
        },
        include: {
          contact: {
            select: {
              id: true,
              name: true,
            },
          },
          organization: {
            select: {
              id: true,
              name: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
            },
          },
          notes: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
          tags: {
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      expect(result).toEqual(mockDemandList);
    });
  });

  describe("getAllPaginated", () => {
    it("should return paginated demands", async () => {
      vi.mocked(prisma.demand.findMany).mockResolvedValue(mockDemandList);
      vi.mocked(prisma.demand.count).mockResolvedValue(2);

      const result = await repository.getAllPaginated("test-org-id", 1, 10);

      expect(prisma.demand.findMany).toHaveBeenCalledWith({
        where: {
          organizationId: "test-org-id",
        },
        include: {
          contact: {
            select: {
              id: true,
              name: true,
            },
          },
          organization: {
            select: {
              id: true,
              name: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
            },
          },
          notes: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
          tags: {
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: 0,
        take: 10,
      });
      expect(result).toEqual({
        data: mockDemandList,
        total: 2,
        totalPages: 1,
        currentPage: 1,
        itemsPerPage: 10,
      });
    });
  });

  describe("getAllPaginatedWithFilters", () => {
    it("should return filtered and paginated demands", async () => {
      const filters = {
        organizationId: "test-org-id",
        status: "NEW" as DemandStatus,
        priority: "HIGH" as Priority,
        search: "test",
      };

      vi.mocked(prisma.demand.findMany).mockResolvedValue(mockDemandList);
      vi.mocked(prisma.demand.count).mockResolvedValue(2);

      const result = await repository.getAllPaginatedWithFilters(
        filters,
        1,
        10
      );

      expect(prisma.demand.findMany).toHaveBeenCalledWith({
        where: {
          organizationId: "test-org-id",
          status: "NEW",
          priority: "HIGH",
          OR: [
            { title: { contains: "test", mode: "insensitive" } },
            { description: { contains: "test", mode: "insensitive" } },
            { protocolNumber: { contains: "test", mode: "insensitive" } },
          ],
        },
        include: {
          contact: {
            select: {
              id: true,
              name: true,
            },
          },
          organization: {
            select: {
              id: true,
              name: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
            },
          },
          notes: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
          tags: {
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: 0,
        take: 10,
      });
      expect(result.data).toEqual(mockDemandList);
      expect(result.total).toBe(2);
    });
  });

  describe("update", () => {
    it("should update a demand successfully", async () => {
      const updateData = {
        title: "Updated Title",
        description: "Updated Description",
      };

      const updatedDemand = { ...mockDemand, ...updateData };
      vi.mocked(prisma.demand.update).mockResolvedValue(updatedDemand);

      const result = await repository.update(
        "test-demand-id",
        "test-org-id",
        updateData
      );

      expect(prisma.demand.update).toHaveBeenCalledWith({
        where: {
          id: "test-demand-id",
          organizationId: "test-org-id",
        },
        data: updateData,
        include: {
          contact: {
            select: {
              id: true,
              name: true,
            },
          },
          organization: {
            select: {
              id: true,
              name: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
            },
          },
          notes: {
            orderBy: { createdAt: "desc" },
          },
          tags: {
            orderBy: { createdAt: "desc" },
          },
        },
      });
      expect(result).toEqual(updatedDemand);
    });

    it("should return null when update fails", async () => {
      vi.mocked(prisma.demand.update).mockRejectedValue(
        new Error("Update failed")
      );

      const result = await repository.update("test-demand-id", "test-org-id", {
        title: "Updated",
      });

      expect(result).toBeNull();
    });
  });

  describe("delete", () => {
    it("should delete a demand successfully", async () => {
      vi.mocked(prisma.demand.delete).mockResolvedValue(mockDemand);

      const result = await repository.delete("test-demand-id", "test-org-id");

      expect(prisma.demand.delete).toHaveBeenCalledWith({
        where: {
          id: "test-demand-id",
          organizationId: "test-org-id",
        },
      });
      expect(result).toBe(true);
    });

    it("should return false when delete fails", async () => {
      vi.mocked(prisma.demand.delete).mockRejectedValue(
        new Error("Delete failed")
      );

      const result = await repository.delete("test-demand-id", "test-org-id");

      expect(result).toBe(false);
    });
  });

  describe("isOwner", () => {
    it("should return true when demand belongs to organization", async () => {
      vi.mocked(prisma.demand.findFirst).mockResolvedValue({
        id: "test-demand-id",
      } as any);

      const result = await repository.isOwner("test-demand-id", "test-org-id");

      expect(prisma.demand.findFirst).toHaveBeenCalledWith({
        where: {
          id: "test-demand-id",
          organizationId: "test-org-id",
        },
        select: { id: true },
      });
      expect(result).toBe(true);
    });

    it("should return false when demand does not belong to organization", async () => {
      vi.mocked(prisma.demand.findFirst).mockResolvedValue(null);

      const result = await repository.isOwner("test-demand-id", "test-org-id");

      expect(result).toBe(false);
    });
  });

  describe("getStats", () => {
    it("should return demand statistics", async () => {
      const mockStats = {
        total: 2,
        byStatus: [
          { status: "NEW", _count: { status: 1 } },
          { status: "IN_PROGRESS", _count: { status: 1 } },
        ],
        byPriority: [
          { priority: "MEDIUM", _count: { priority: 1 } },
          { priority: "HIGH", _count: { priority: 1 } },
        ],
      };

      vi.mocked(prisma.demand.count).mockResolvedValue(2);
      vi.mocked(prisma.demand.groupBy).mockResolvedValueOnce(
        mockStats.byStatus as any
      );
      vi.mocked(prisma.demand.groupBy).mockResolvedValueOnce(
        mockStats.byPriority as any
      );

      const result = await repository.getStats("test-org-id");

      expect(prisma.demand.count).toHaveBeenCalledWith({
        where: { organizationId: "test-org-id" },
      });
      expect(prisma.demand.groupBy).toHaveBeenCalledWith({
        by: ["status"],
        where: { organizationId: "test-org-id" },
        _count: { status: true },
      });
      expect(prisma.demand.groupBy).toHaveBeenCalledWith({
        by: ["priority"],
        where: { organizationId: "test-org-id" },
        _count: { priority: true },
      });
      expect(result).toEqual(mockStats);
    });
  });
});
