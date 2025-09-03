import { DemandTag, CreateDemandTagData } from "../../types/demand";
import { prisma } from "./prisma";

export class DemandTagRepository {
  toDemandTagType(prismaDemandTag: unknown): DemandTag {
    return prismaDemandTag as DemandTag;
  }

  async create(
    data: CreateDemandTagData
  ): Promise<DemandTag> {
    const created = await prisma.demandTag.create({ 
      data: {
        ...data,
        id: crypto.randomUUID(),
      }
    });

    return this.toDemandTagType(created);
  }

  async getById(id: string, organizationId: string): Promise<DemandTag | null> {
    const tag = await prisma.demandTag.findFirst({
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
      },
    });

    return this.toDemandTagType(tag);
  }

  async getByDemandId(
    demandId: string,
    organizationId: string
  ): Promise<DemandTag[]> {
    const tags = await prisma.demandTag.findMany({
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
      },
      orderBy: { createdAt: "desc" },
    });

    return tags.map(this.toDemandTagType);
  }

  async getByName(
    name: string,
    demandId: string,
    organizationId: string
  ): Promise<DemandTag | null> {
    const tag = await prisma.demandTag.findFirst({
      where: {
        name,
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
      },
    });

    return this.toDemandTagType(tag);
  }

  async update(
    id: string,
    organizationId: string,
    data: Partial<
      Omit<DemandTag, "id" | "createdAt" | "demandId" | "organizationId" | "demand" | "organization">
    >
  ): Promise<DemandTag | null> {
    try {
      const tag = await prisma.demandTag.update({
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
        },
      });

      return this.toDemandTagType(tag);
    } catch {
      return null;
    }
  }

  async delete(id: string, organizationId: string): Promise<boolean> {
    try {
      await prisma.demandTag.delete({
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

  // Método para verificar se uma tag pertence à organização
  async isOwner(tagId: string, organizationId: string): Promise<boolean> {
    const tag = await prisma.demandTag.findFirst({
      where: {
        id: tagId,
        organizationId,
      },
      select: { id: true },
    });

    return !!tag;
  }

  // Método para obter todas as tags únicas de uma organização
  async getUniqueTags(
    organizationId: string
  ): Promise<{ name: string; color: string | null; count: number }[]> {
    const tags = await prisma.demandTag.groupBy({
      by: ["name", "color"],
      where: { organizationId },
      _count: { name: true },
      orderBy: { _count: { name: "desc" } },
    });

    return tags.map((tag) => ({
      name: tag.name,
      color: tag.color,
      count: tag._count.name,
    }));
  }
}
