import { DemandNote, CreateDemandNoteData } from "../../types/demand";
import { prisma } from "./prisma";

export class DemandNoteRepository {
  toDemandNoteType(prismaDemandNote: unknown): DemandNote {
    return prismaDemandNote as DemandNote;
  }

  async create(
    data: CreateDemandNoteData
  ): Promise<DemandNote> {
    const created = await prisma.demandNote.create({ 
      data: {
        ...data,
        id: crypto.randomUUID(),
      }
    });

    return this.toDemandNoteType(created);
  }

  async getById(
    id: string,
    organizationId: string
  ): Promise<DemandNote | null> {
    const note = await prisma.demandNote.findFirst({
      where: {
        id,
        organizationId, // Filtro por organização
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

    return this.toDemandNoteType(note);
  }

  async getByDemandId(
    demandId: string,
    organizationId: string
  ): Promise<DemandNote[]> {
    const notes = await prisma.demandNote.findMany({
      where: {
        demandId,
        organizationId, // Filtro por organização
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

    return notes.map(this.toDemandNoteType);
  }

  async update(
    id: string,
    organizationId: string,
    data: Partial<
      Omit<
        DemandNote,
        "id" | "createdAt" | "createdById" | "demandId" | "organizationId" | "demand" | "organization" | "createdBy"
      >
    >
  ): Promise<DemandNote | null> {
    try {
      const note = await prisma.demandNote.update({
        where: {
          id,
          organizationId, // Garante que só atualiza se pertencer à organização
        },
        data,
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

      return this.toDemandNoteType(note);
    } catch {
      return null;
    }
  }

  async delete(id: string, organizationId: string): Promise<boolean> {
    try {
      await prisma.demandNote.delete({
        where: {
          id,
          organizationId, // Garante que só deleta se pertencer à organização
        },
      });
      return true;
    } catch {
      return false;
    }
  }

  // Método para verificar se uma nota pertence à organização
  async isOwner(noteId: string, organizationId: string): Promise<boolean> {
    const note = await prisma.demandNote.findFirst({
      where: {
        id: noteId,
        organizationId,
      },
      select: { id: true },
    });

    return !!note;
  }
}
