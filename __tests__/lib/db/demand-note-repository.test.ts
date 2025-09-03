import { describe, it, expect, vi, beforeEach } from "vitest";
import { DemandNoteRepository } from "@/lib/db/demand-note-repository";
import { prisma } from "@/lib/db/prisma";
import { DemandNote } from "@/types/demand";

// Mock do Prisma
const mockDate = new Date("2025-01-01T00:00:00.000Z");

const mockDemandNote = {
  id: "test-note-id",
  content: "Test Note Content",
  demandId: "test-demand-id",
  organizationId: "test-org-id",
  createdById: "test-user-id",
  createdAt: mockDate,
  updatedAt: mockDate,
  demand: {
    id: "test-demand-id",
    title: "Test Demand",
    protocolNumber: "001",
  },
  organization: {
    id: "test-org-id",
    name: "Test Organization",
  },
  createdBy: {
    id: "test-user-id",
    name: "Test User",
  },
} as any;

const mockDemandNoteList = [
  {
    ...mockDemandNote,
    id: "test-note-id-1",
    content: "Test Note 1",
  },
  {
    ...mockDemandNote,
    id: "test-note-id-2",
    content: "Test Note 2",
  },
] as any[];

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    demandNote: {
      create: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe("DemandNoteRepository", () => {
  let repository: DemandNoteRepository;

  beforeEach(() => {
    repository = new DemandNoteRepository();
    vi.clearAllMocks();
  });

  describe("create", () => {
    it("should create a demand note successfully", async () => {
      const createData = {
        content: "Test Note Content",
        demandId: "test-demand-id",
        organizationId: "test-org-id",
        createdById: "test-user-id",
      };

      vi.mocked(prisma.demandNote.create).mockResolvedValue(mockDemandNote);

      const result = await repository.create(createData);

      expect(prisma.demandNote.create).toHaveBeenCalledWith({
        data: {
          ...createData,
          id: expect.any(String),
        },
      });
      expect(result).toEqual(mockDemandNote);
    });
  });

  describe("getById", () => {
    it("should return a demand note by id", async () => {
      vi.mocked(prisma.demandNote.findFirst).mockResolvedValue(mockDemandNote);

      const result = await repository.getById("test-note-id", "test-org-id");

      expect(prisma.demandNote.findFirst).toHaveBeenCalledWith({
        where: {
          id: "test-note-id",
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
          createdBy: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      expect(result).toEqual(mockDemandNote);
    });

    it("should return null when note not found", async () => {
      vi.mocked(prisma.demandNote.findFirst).mockResolvedValue(null);

      const result = await repository.getById("non-existent-id", "test-org-id");

      expect(result).toBeNull();
    });
  });

  describe("getByDemandId", () => {
    it("should return all notes for a demand", async () => {
      vi.mocked(prisma.demandNote.findMany).mockResolvedValue(
        mockDemandNoteList
      );

      const result = await repository.getByDemandId(
        "test-demand-id",
        "test-org-id"
      );

      expect(prisma.demandNote.findMany).toHaveBeenCalledWith({
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
          createdBy: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      expect(result).toEqual(mockDemandNoteList);
    });

    it("should return empty array when no notes found", async () => {
      vi.mocked(prisma.demandNote.findMany).mockResolvedValue([]);

      const result = await repository.getByDemandId(
        "test-demand-id",
        "test-org-id"
      );

      expect(result).toEqual([]);
    });
  });

  describe("update", () => {
    it("should update a demand note successfully", async () => {
      const updateData = {
        content: "Updated Note Content",
      };

      const updatedNote = { ...mockDemandNote, ...updateData };
      vi.mocked(prisma.demandNote.update).mockResolvedValue(updatedNote);

      const result = await repository.update(
        "test-note-id",
        "test-org-id",
        updateData
      );

      expect(prisma.demandNote.update).toHaveBeenCalledWith({
        where: {
          id: "test-note-id",
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
          createdBy: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      expect(result).toEqual(updatedNote);
    });

    it("should return null when update fails", async () => {
      vi.mocked(prisma.demandNote.update).mockRejectedValue(
        new Error("Update failed")
      );

      const result = await repository.update("test-note-id", "test-org-id", {
        content: "Updated",
      });

      expect(result).toBeNull();
    });
  });

  describe("delete", () => {
    it("should delete a demand note successfully", async () => {
      vi.mocked(prisma.demandNote.delete).mockResolvedValue(mockDemandNote);

      const result = await repository.delete("test-note-id", "test-org-id");

      expect(prisma.demandNote.delete).toHaveBeenCalledWith({
        where: {
          id: "test-note-id",
          organizationId: "test-org-id",
        },
      });
      expect(result).toBe(true);
    });

    it("should return false when delete fails", async () => {
      vi.mocked(prisma.demandNote.delete).mockRejectedValue(
        new Error("Delete failed")
      );

      const result = await repository.delete("test-note-id", "test-org-id");

      expect(result).toBe(false);
    });
  });

  describe("isOwner", () => {
    it("should return true when note belongs to organization", async () => {
      vi.mocked(prisma.demandNote.findFirst).mockResolvedValue({
        id: "test-note-id",
      } as any);

      const result = await repository.isOwner("test-note-id", "test-org-id");

      expect(prisma.demandNote.findFirst).toHaveBeenCalledWith({
        where: {
          id: "test-note-id",
          organizationId: "test-org-id",
        },
        select: { id: true },
      });
      expect(result).toBe(true);
    });

    it("should return false when note does not belong to organization", async () => {
      vi.mocked(prisma.demandNote.findFirst).mockResolvedValue(null);

      const result = await repository.isOwner("test-note-id", "test-org-id");

      expect(result).toBe(false);
    });
  });
});
