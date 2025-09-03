import { Demand, DemandFilters, DemandListResponse } from "@/types/demand";
import { prisma } from "./prisma";

export interface PaginationResult<T> {
  data: T[];
  total: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

export class DemandRepository {
  toDemandType(prismaDemand: unknown): Demand {
    return prismaDemand as Demand;
  }

  async create(data: Demand & { organizationId: string }): Promise<Demand> {
    const created = await prisma.demand.create({ data });

    return this.toDemandType(created);
  }

  async getById(id: string, organizationId: string): Promise<Demand | null> {
    const demand = await prisma.demand.findFirst({
      where: {
        id,
        organizationId, // Filtro por organização
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

    return this.toDemandType(demand);
  }

  async getByProtocol(
    protocolNumber: string,
    organizationId: string
  ): Promise<Demand | null> {
    const demand = await prisma.demand.findFirst({
      where: {
        protocolNumber,
        organizationId, // Filtro por organização
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

    return this.toDemandType(demand);
  }

  async getAll(organizationId: string): Promise<Demand[]> {
    const demands = await prisma.demand.findMany({
      where: {
        organizationId, // Filtro por organização
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
          take: 1, // Apenas a nota mais recente
        },
        tags: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return demands.map(this.toDemandType);
  }

  async getAllPaginated(
    organizationId: string,
    page: number = 1,
    itemsPerPage: number = 10
  ): Promise<PaginationResult<Demand>> {
    const skip = (page - 1) * itemsPerPage;

    const [demands, total] = await Promise.all([
      prisma.demand.findMany({
        where: {
          organizationId, // Filtro por organização
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
            take: 1, // Apenas a nota mais recente
          },
          tags: {
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: itemsPerPage,
      }),
      prisma.demand.count({
        where: {
          organizationId, // Filtro por organização
        },
      }),
    ]);

    const totalPages = Math.ceil(total / itemsPerPage);

    return {
      data: demands.map(this.toDemandType),
      total,
      totalPages,
      currentPage: page,
      itemsPerPage,
    };
  }

  async getAllPaginatedWithFilters(
    filters: DemandFilters,
    page: number = 1,
    itemsPerPage: number = 10
  ): Promise<PaginationResult<Demand>> {
    const skip = (page - 1) * itemsPerPage;

    const whereClause = {
      organizationId: filters.organizationId, // Filtro obrigatório por organização
      ...(filters.status && { status: filters.status }),
      ...(filters.priority && { priority: filters.priority }),
      ...(filters.contactId && { contactId: filters.contactId }),
      ...(filters.createdById && { createdById: filters.createdById }),
      ...(filters.search && {
        OR: [
          { title: { contains: filters.search, mode: "insensitive" as const } },
          {
            description: {
              contains: filters.search,
              mode: "insensitive" as const,
            },
          },
          {
            protocolNumber: {
              contains: filters.search,
              mode: "insensitive" as const,
            },
          },
        ],
      }),
    };

    const [demands, total] = await Promise.all([
      prisma.demand.findMany({
        where: whereClause,
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
            take: 1, // Apenas a nota mais recente
          },
          tags: {
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: itemsPerPage,
      }),
      prisma.demand.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(total / itemsPerPage);

    return {
      data: demands.map(this.toDemandType),
      total,
      totalPages,
      currentPage: page,
      itemsPerPage,
    };
  }

  async update(
    id: string,
    organizationId: string,
    data: Partial<
      Omit<
        Demand,
        "id" | "createdAt" | "createdById" | "organizationId" | "protocolNumber"
      >
    >
  ): Promise<Demand | null> {
    try {
      const demand = await prisma.demand.update({
        where: {
          id,
          organizationId, // Garante que só atualiza se pertencer à organização
        },
        data,
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

      return this.toDemandType(demand);
    } catch {
      return null;
    }
  }

  async delete(id: string, organizationId: string): Promise<boolean> {
    try {
      await prisma.demand.delete({
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

  // Método para verificar se uma demanda pertence à organização
  async isOwner(demandId: string, organizationId: string): Promise<boolean> {
    const demand = await prisma.demand.findFirst({
      where: {
        id: demandId,
        organizationId,
      },
      select: { id: true },
    });

    return !!demand;
  }

  // Método para obter estatísticas das demandas por organização
  async getStats(organizationId: string) {
    const [total, byStatus, byPriority] = await Promise.all([
      prisma.demand.count({
        where: { organizationId },
      }),
      prisma.demand.groupBy({
        by: ["status"],
        where: { organizationId },
        _count: { status: true },
      }),
      prisma.demand.groupBy({
        by: ["priority"],
        where: { organizationId },
        _count: { priority: true },
      }),
    ]);

    return {
      total,
      byStatus,
      byPriority,
    };
  }
}
