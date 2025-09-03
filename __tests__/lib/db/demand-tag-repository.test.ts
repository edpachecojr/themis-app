import { describe, it, expect, vi, beforeEach } from "vitest";
import { DemandTagRepository } from "@/lib/db/demand-tag-repository";
import { prisma } from "@/lib/db/prisma";
import { DemandTag } from "@/types/demand";

// Mock do Prisma
const mockDate = new Date("2025-01-01T00:00:00.000Z");

const mockDemandTag = {
  id: "test-tag-id",
  name: "Test Tag",
  color: "#FF0000",
  demandId: "test-demand-id",
  organizationId: "test-org-id",
  createdAt: mockDate,
  demand: {
    id: "test-demand-id",
    title: "Test Demand",
    protocolNumber: "001",
  },
  organization: {
    id: "test-org-id",
    name: "Test Organization",
  },
} as any;

const mockDemandTagList = [
  {
    ...mockDemandTag,
    id: "test-tag-id-1",
    name: "Test Tag 1",
    color: "#FF0000",
  },
  {
    ...mockDemandTag,
    id: "test-tag-id-2",
    name: "Test Tag 2",
    color: "#00FF00",
  },
] as any[];

const mockUniqueTags = [
  {
    name: "Test Tag 1",
    color: "#FF0000",
    _count: { name: 2 },
  },
  {
    name: "Test Tag 2",
    color: "#00FF00",
    _count: { name: 1 },
  },
];

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    demandTag: {
      create: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      groupBy: vi.fn(),
    },
  },
}));

describe("DemandTagRepository", () => {
  let repository: DemandTagRepository;

  beforeEach(() => {
    repository = new DemandTagRepository();
    vi.clearAllMocks();
  });

  describe("create", () => {
    it("should create a demand tag successfully", async () => {
      const createData = {
        name: "Test Tag",
        color: "#FF0000",
        demandId: "test-demand-id",
        organizationId: "test-org-id",
      };

      vi.mocked(prisma.demandTag.create).mockResolvedValue(mockDemandTag);

      const result = await repository.create(createData);

      expect(prisma.demandTag.create).toHaveBeenCalledWith({
        data: {
          ...createData,
          id: expect.any(String),
        },
      });
      expect(result).toEqual(mockDemandTag);
    });

    it("should create a demand tag without color", async () => {
      const createData = {
        name: "Test Tag",
        demandId: "test-demand-id",
        organizationId: "test-org-id",
      };

      const tagWithoutColor = { ...mockDemandTag, color: null };
      vi.mocked(prisma.demandTag.create).mockResolvedValue(tagWithoutColor);

      const result = await repository.create(createData);

      expect(prisma.demandTag.create).toHaveBeenCalledWith({
        data: {
          ...createData,
          id: expect.any(String),
        },
      });
      expect(result).toEqual(tagWithoutColor);
    });
  });

  describe("getById", () => {
    it("should return a demand tag by id", async () => {
      vi.mocked(prisma.demandTag.findFirst).mockResolvedValue(mockDemandTag);

      const result = await repository.getById("test-tag-id", "test-org-id");

      expect(prisma.demandTag.findFirst).toHaveBeenCalledWith({
        where: {
          id: "test-tag-id",
          organizationId: "test-org-id",
        },
        include: {
          demand: {
            select: {
              id: true,
              title: true,
              protocolNumber: true,
            },
          },
          organization: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      expect(result).toEqual(mockDemandTag);
    });

    it("should return null when tag not found", async () => {
      vi.mocked(prisma.demandTag.findFirst).mockResolvedValue(null);

      const result = await repository.getById("non-existent-id", "test-org-id");

      expect(result).toBeNull();
    });
  });

  describe("getByDemandId", () => {
    it("should return all tags for a demand", async () => {
      vi.mocked(prisma.demandTag.findMany).mockResolvedValue(mockDemandTagList);

      const result = await repository.getByDemandId(
        "test-demand-id",
        "test-org-id"
      );

      expect(prisma.demandTag.findMany).toHaveBeenCalledWith({
        where: {
          demandId: "test-demand-id",
          organizationId: "test-org-id",
        },
        include: {
          demand: {
            select: {
              id: true,
              title: true,
              protocolNumber: true,
            },
          },
          organization: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      expect(result).toEqual(mockDemandTagList);
    });

    it("should return empty array when no tags found", async () => {
      vi.mocked(prisma.demandTag.findMany).mockResolvedValue([]);

      const result = await repository.getByDemandId(
        "test-demand-id",
        "test-org-id"
      );

      expect(result).toEqual([]);
    });
  });

  describe("getByName", () => {
    it("should return a tag by name for a specific demand", async () => {
      vi.mocked(prisma.demandTag.findFirst).mockResolvedValue(mockDemandTag);

      const result = await repository.getByName(
        "Test Tag",
        "test-demand-id",
        "test-org-id"
      );

      expect(prisma.demandTag.findFirst).toHaveBeenCalledWith({
        where: {
          name: "Test Tag",
          demandId: "test-demand-id",
          organizationId: "test-org-id",
        },
        include: {
          demand: {
            select: {
              id: true,
              title: true,
              protocolNumber: true,
            },
          },
          organization: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      expect(result).toEqual(mockDemandTag);
    });

    it("should return null when tag not found by name", async () => {
      vi.mocked(prisma.demandTag.findFirst).mockResolvedValue(null);

      const result = await repository.getByName(
        "Non-existent Tag",
        "test-demand-id",
        "test-org-id"
      );

      expect(result).toBeNull();
    });
  });

  describe("update", () => {
    it("should update a demand tag successfully", async () => {
      const updateData = {
        name: "Updated Tag",
        color: "#00FF00",
      };

      const updatedTag = { ...mockDemandTag, ...updateData };
      vi.mocked(prisma.demandTag.update).mockResolvedValue(updatedTag);

      const result = await repository.update(
        "test-tag-id",
        "test-org-id",
        updateData
      );

      expect(prisma.demandTag.update).toHaveBeenCalledWith({
        where: {
          id: "test-tag-id",
          organizationId: "test-org-id",
        },
        data: updateData,
        include: {
          demand: {
            select: {
              id: true,
              title: true,
              protocolNumber: true,
            },
          },
          organization: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      expect(result).toEqual(updatedTag);
    });

    it("should update only name when color not provided", async () => {
      const updateData = {
        name: "Updated Tag",
      };

      const updatedTag = { ...mockDemandTag, ...updateData };
      vi.mocked(prisma.demandTag.update).mockResolvedValue(updatedTag);

      const result = await repository.update(
        "test-tag-id",
        "test-org-id",
        updateData
      );

      expect(prisma.demandTag.update).toHaveBeenCalledWith({
        where: {
          id: "test-tag-id",
          organizationId: "test-org-id",
        },
        data: updateData,
        include: {
          demand: {
            select: {
              id: true,
              title: true,
              protocolNumber: true,
            },
          },
          organization: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      expect(result).toEqual(updatedTag);
    });

    it("should return null when update fails", async () => {
      vi.mocked(prisma.demandTag.update).mockRejectedValue(
        new Error("Update failed")
      );

      const result = await repository.update("test-tag-id", "test-org-id", {
        name: "Updated",
      });

      expect(result).toBeNull();
    });
  });

  describe("delete", () => {
    it("should delete a demand tag successfully", async () => {
      vi.mocked(prisma.demandTag.delete).mockResolvedValue(mockDemandTag);

      const result = await repository.delete("test-tag-id", "test-org-id");

      expect(prisma.demandTag.delete).toHaveBeenCalledWith({
        where: {
          id: "test-tag-id",
          organizationId: "test-org-id",
        },
      });
      expect(result).toBe(true);
    });

    it("should return false when delete fails", async () => {
      vi.mocked(prisma.demandTag.delete).mockRejectedValue(
        new Error("Delete failed")
      );

      const result = await repository.delete("test-tag-id", "test-org-id");

      expect(result).toBe(false);
    });
  });

  describe("isOwner", () => {
    it("should return true when tag belongs to organization", async () => {
      vi.mocked(prisma.demandTag.findFirst).mockResolvedValue({
        id: "test-tag-id",
      } as any);

      const result = await repository.isOwner("test-tag-id", "test-org-id");

      expect(prisma.demandTag.findFirst).toHaveBeenCalledWith({
        where: {
          id: "test-tag-id",
          organizationId: "test-org-id",
        },
        select: { id: true },
      });
      expect(result).toBe(true);
    });

    it("should return false when tag does not belong to organization", async () => {
      vi.mocked(prisma.demandTag.findFirst).mockResolvedValue(null);

      const result = await repository.isOwner("test-tag-id", "test-org-id");

      expect(result).toBe(false);
    });
  });

  describe("getUniqueTags", () => {
    it("should return unique tags with counts for an organization", async () => {
      vi.mocked(prisma.demandTag.groupBy).mockResolvedValue(
        mockUniqueTags as any
      );

      const result = await repository.getUniqueTags("test-org-id");

      expect(prisma.demandTag.groupBy).toHaveBeenCalledWith({
        by: ["name", "color"],
        where: { organizationId: "test-org-id" },
        _count: { name: true },
        orderBy: { _count: { name: "desc" } },
      });
      expect(result).toEqual([
        {
          name: "Test Tag 1",
          color: "#FF0000",
          count: 2,
        },
        {
          name: "Test Tag 2",
          color: "#00FF00",
          count: 1,
        },
      ]);
    });

    it("should return empty array when no tags found", async () => {
      vi.mocked(prisma.demandTag.groupBy).mockResolvedValue([]);

      const result = await repository.getUniqueTags("test-org-id");

      expect(result).toEqual([]);
    });
  });
});
