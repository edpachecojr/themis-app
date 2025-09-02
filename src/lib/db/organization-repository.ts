import { Organization } from "@/types/organization";
import { prisma } from "./prisma";

export interface PaginationResult<T> {
  data: T[];
  total: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

export class OrganizationRepository {
  toOrganizationType(prismaOrganization: unknown): Organization {
    return prismaOrganization as Organization;
  }

  async createOrganization(
    data: Organization & { owner: string }
  ): Promise<Organization> {
    const created = await prisma.organization.create({ data });

    return this.toOrganizationType(created);
  }

  async getOrganizationById(
    id: string,
    owner: string
  ): Promise<Organization | null> {
    const organizationDb = await prisma.organization.findFirst({
      where: {
        id,
        owner, // Filtro por proprietário
        deletedAt: null, // Exclusão lógica - não retorna registros deletados
      },
    });

    return this.toOrganizationType(organizationDb);
  }

  async getAll(owner: string): Promise<Organization[]> {
    const organizations = await prisma.organization.findMany({
      where: {
        owner, // Filtro por proprietário
        deletedAt: null, // Exclusão lógica - não retorna registros deletados
      },
      orderBy: { createdAt: "desc" },
    });

    return organizations.map(this.toOrganizationType);
  }

  async getAllPaginated(
    owner: string,
    page: number = 1,
    itemsPerPage: number = 10
  ): Promise<PaginationResult<Organization>> {
    const skip = (page - 1) * itemsPerPage;

    const [organizations, total] = await Promise.all([
      prisma.organization.findMany({
        where: {
          owner, // Filtro por proprietário
          deletedAt: null, // Exclusão lógica - não retorna registros deletados
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: itemsPerPage,
      }),
      prisma.organization.count({
        where: {
          owner, // Filtro por proprietário
          deletedAt: null, // Exclusão lógica - não conta registros deletados
        },
      }),
    ]);

    const totalPages = Math.ceil(total / itemsPerPage);

    return {
      data: organizations.map(this.toOrganizationType),
      total,
      totalPages,
      currentPage: page,
      itemsPerPage,
    };
  }

  async getAllPaginatedWithSearch(
    owner: string,
    page: number = 1,
    itemsPerPage: number = 10,
    search?: string
  ): Promise<PaginationResult<Organization>> {
    const skip = (page - 1) * itemsPerPage;

    const whereClause = {
      owner, // Filtro por proprietário
      deletedAt: null, // Exclusão lógica - não retorna registros deletados
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { description: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    };

    const [organizations, total] = await Promise.all([
      prisma.organization.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        skip,
        take: itemsPerPage,
      }),
      prisma.organization.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(total / itemsPerPage);

    return {
      data: organizations.map(this.toOrganizationType),
      total,
      totalPages,
      currentPage: page,
      itemsPerPage,
    };
  }

  async updateOrganization(
    id: string,
    owner: string,
    data: Partial<
      Omit<Organization, "id" | "createdAt" | "createdBy" | "owner">
    > & {
      updatedBy?: string;
    }
  ): Promise<Organization | null> {
    try {
      const updatedOrganization = await prisma.organization.update({
        where: {
          id,
          owner, // Garante que só atualiza se pertencer ao proprietário
        },
        data,
      });

      return this.toOrganizationType(updatedOrganization);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      return null;
    }
  }

  async deleteOrganization(id: string, owner: string): Promise<boolean> {
    try {
      await prisma.organization.update({
        where: {
          id,
          owner, // Garante que só deleta se pertencer ao proprietário
        },
        data: {
          deletedAt: new Date(),
        },
      });
      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      return false;
    }
  }

  // Método para verificar se uma organização pertence ao proprietário
  async isOrganizationOwner(
    organizationId: string,
    owner: string
  ): Promise<boolean> {
    const organization = await prisma.organization.findFirst({
      where: {
        id: organizationId,
        owner,
        deletedAt: null,
      },
      select: { id: true },
    });

    return !!organization;
  }
}
