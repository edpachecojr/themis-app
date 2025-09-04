import {
  OfficeUser,
  CreateOfficeUserData,
  UpdateOfficeUserData,
  OfficeUserFilters,
  OfficeUserStats,
  OfficeUserReport,
  OfficeUserValidationResult,
} from "../../types/office";
import { prisma } from "./prisma";
import { PaginationResult } from "./types";
import { OfficeRole } from "../../types/office";

export class OfficeUserRepository {
  toOfficeUserType(prismaOfficeUser: unknown): OfficeUser {
    return prismaOfficeUser as OfficeUser;
  }

  // ========================================
  // MÉTODOS CRUD BÁSICOS
  // ========================================

  async create(data: CreateOfficeUserData): Promise<OfficeUser> {
    const created = await prisma.officeUser.create({
      data: {
        ...data,
        id: crypto.randomUUID(),
        role: data.role || "STAFF",
        permissions: data.permissions || [],
        isActive: data.isActive ?? true,
        accessStartDate: data.accessStartDate || new Date(),
      },
    });

    return this.toOfficeUserType(created);
  }

  async getById(
    id: string,
    organizationId: string
  ): Promise<OfficeUser | null> {
    const officeUser = await prisma.officeUser.findFirst({
      where: {
        id,
        office: {
          organizationId, // Filtro por organização através do office
        },
      },
      include: {
        office: true,
      },
    });

    return this.toOfficeUserType(officeUser);
  }

  async getAll(organizationId: string): Promise<OfficeUser[]> {
    const officeUsers = await prisma.officeUser.findMany({
      where: {
        office: {
          organizationId, // Filtro por organização
          deletedAt: null, // Exclusão lógica do office
        },
      },
      include: {
        office: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return officeUsers.map(this.toOfficeUserType);
  }

  async getAllPaginated(
    organizationId: string,
    page: number = 1,
    itemsPerPage: number = 10
  ): Promise<PaginationResult<OfficeUser>> {
    const skip = (page - 1) * itemsPerPage;

    const [officeUsers, total] = await Promise.all([
      prisma.officeUser.findMany({
        where: {
          office: {
            organizationId, // Filtro por organização
            deletedAt: null, // Exclusão lógica do office
          },
        },
        include: {
          office: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: itemsPerPage,
      }),
      prisma.officeUser.count({
        where: {
          office: {
            organizationId, // Filtro por organização
            deletedAt: null, // Exclusão lógica do office
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / itemsPerPage);

    return {
      data: officeUsers.map(this.toOfficeUserType),
      total,
      totalPages,
      currentPage: page,
      itemsPerPage,
    };
  }

  async update(
    id: string,
    organizationId: string,
    data: UpdateOfficeUserData
  ): Promise<OfficeUser | null> {
    try {
      const officeUser = await prisma.officeUser.update({
        where: {
          id,
          office: {
            organizationId, // Garante que só atualiza se pertencer à organização
          },
        },
        data,
        include: {
          office: true,
        },
      });

      return this.toOfficeUserType(officeUser);
    } catch {
      return null;
    }
  }

  async delete(id: string, organizationId: string): Promise<boolean> {
    try {
      await prisma.officeUser.delete({
        where: {
          id,
          office: {
            organizationId, // Garante que só deleta se pertencer à organização
          },
        },
      });
      return true;
    } catch {
      return false;
    }
  }

  // ========================================
  // MÉTODOS DE VALIDAÇÃO E VERIFICAÇÃO
  // ========================================

  async isOwner(
    officeUserId: string,
    organizationId: string
  ): Promise<boolean> {
    const officeUser = await prisma.officeUser.findFirst({
      where: {
        id: officeUserId,
        office: {
          organizationId,
          deletedAt: null,
        },
      },
      select: { id: true },
    });

    return !!officeUser;
  }

  async isUserInOffice(
    userId: string,
    officeId: string,
    organizationId: string
  ): Promise<boolean> {
    const officeUser = await prisma.officeUser.findFirst({
      where: {
        userId,
        officeId,
        office: {
          organizationId,
          deletedAt: null,
        },
        isActive: true,
      },
      select: { id: true },
    });

    return !!officeUser;
  }

  async validateOfficeUser(
    data: CreateOfficeUserData | UpdateOfficeUserData
  ): Promise<OfficeUserValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validações obrigatórias
    if (!data.userId || data.userId.trim().length === 0) {
      errors.push("ID do usuário é obrigatório");
    }

    if (!data.officeId || data.officeId.trim().length === 0) {
      errors.push("ID do office é obrigatório");
    }

    // Validações de datas
    if (data.accessStartDate && data.accessEndDate) {
      if (data.accessStartDate >= data.accessEndDate) {
        errors.push("Data de início deve ser anterior à data de término");
      }
    }

    if (data.accessEndDate && data.accessEndDate < new Date()) {
      warnings.push("Data de término está no passado");
    }

    // Validações de permissões
    if (data.permissions && data.permissions.length > 20) {
      warnings.push("Muitas permissões podem impactar a performance");
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  // ========================================
  // MÉTODOS ESPECIALIZADOS POR CRITÉRIOS
  // ========================================

  async getByUserId(
    userId: string,
    organizationId: string
  ): Promise<OfficeUser[]> {
    const officeUsers = await prisma.officeUser.findMany({
      where: {
        userId,
        office: {
          organizationId,
          deletedAt: null,
        },
      },
      include: {
        office: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return officeUsers.map(this.toOfficeUserType);
  }

  async getByOfficeId(
    officeId: string,
    organizationId: string
  ): Promise<OfficeUser[]> {
    const officeUsers = await prisma.officeUser.findMany({
      where: {
        officeId,
        office: {
          organizationId,
          deletedAt: null,
        },
      },
      include: {
        office: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return officeUsers.map(this.toOfficeUserType);
  }

  async getByRole(
    role: OfficeRole,
    organizationId: string
  ): Promise<OfficeUser[]> {
    const officeUsers = await prisma.officeUser.findMany({
      where: {
        role,
        office: {
          organizationId,
          deletedAt: null,
        },
      },
      include: {
        office: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return officeUsers.map(this.toOfficeUserType);
  }

  async getActiveUsers(organizationId: string): Promise<OfficeUser[]> {
    const officeUsers = await prisma.officeUser.findMany({
      where: {
        isActive: true,
        office: {
          organizationId,
          deletedAt: null,
        },
      },
      include: {
        office: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return officeUsers.map(this.toOfficeUserType);
  }

  async getInactiveUsers(organizationId: string): Promise<OfficeUser[]> {
    const officeUsers = await prisma.officeUser.findMany({
      where: {
        isActive: false,
        office: {
          organizationId,
          deletedAt: null,
        },
      },
      include: {
        office: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return officeUsers.map(this.toOfficeUserType);
  }

  async getUsersWithExpiredAccess(
    organizationId: string
  ): Promise<OfficeUser[]> {
    const officeUsers = await prisma.officeUser.findMany({
      where: {
        accessEndDate: {
          lt: new Date(),
        },
        isActive: true,
        office: {
          organizationId,
          deletedAt: null,
        },
      },
      include: {
        office: true,
      },
      orderBy: { accessEndDate: "asc" },
    });

    return officeUsers.map(this.toOfficeUserType);
  }

  // ========================================
  // MÉTODOS DE FILTROS AVANÇADOS
  // ========================================

  async getAllPaginatedWithAdvancedFilters(
    filters: OfficeUserFilters,
    page: number = 1,
    itemsPerPage: number = 10
  ): Promise<PaginationResult<OfficeUser>> {
    const skip = (page - 1) * itemsPerPage;

    const whereClause = {
      office: {
        organizationId: filters.organizationId,
        deletedAt: null,
      },
      ...(filters.userId && { userId: filters.userId }),
      ...(filters.officeId && { officeId: filters.officeId }),
      ...(filters.role && { role: filters.role }),
      ...(filters.isActive !== undefined && { isActive: filters.isActive }),
      ...(filters.search && {
        OR: [
          {
            userId: { contains: filters.search, mode: "insensitive" as const },
          },
          {
            office: {
              name: { contains: filters.search, mode: "insensitive" as const },
            },
          },
          {
            office: {
              code: { contains: filters.search, mode: "insensitive" as const },
            },
          },
        ],
      }),
    };

    const [officeUsers, total] = await Promise.all([
      prisma.officeUser.findMany({
        where: whereClause,
        include: {
          office: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: itemsPerPage,
      }),
      prisma.officeUser.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(total / itemsPerPage);

    return {
      data: officeUsers.map(this.toOfficeUserType),
      total,
      totalPages,
      currentPage: page,
      itemsPerPage,
    };
  }

  // ========================================
  // MÉTODOS DE ESTATÍSTICAS
  // ========================================

  async getOfficeUserStats(organizationId: string): Promise<OfficeUserStats> {
    const [totalUsers, activeUsers, inactiveUsers, byRole, byOffice] =
      await Promise.all([
        prisma.officeUser.count({
          where: {
            office: {
              organizationId,
              deletedAt: null,
            },
          },
        }),
        prisma.officeUser.count({
          where: {
            isActive: true,
            office: {
              organizationId,
              deletedAt: null,
            },
          },
        }),
        prisma.officeUser.count({
          where: {
            isActive: false,
            office: {
              organizationId,
              deletedAt: null,
            },
          },
        }),
        prisma.officeUser.groupBy({
          by: ["role"],
          where: {
            office: {
              organizationId,
              deletedAt: null,
            },
          },
          _count: { role: true },
        }),
        prisma.officeUser.groupBy({
          by: ["officeId"],
          where: {
            office: {
              organizationId,
              deletedAt: null,
            },
          },
          _count: { officeId: true },
          _max: { office: { select: { name: true } } },
        }),
      ]);

    // Calcular média de offices por usuário
    const uniqueUsers = await prisma.officeUser.groupBy({
      by: ["userId"],
      where: {
        office: {
          organizationId,
          deletedAt: null,
        },
      },
      _count: { userId: true },
    });

    const averageOfficesPerUser =
      uniqueUsers.length > 0 ? totalUsers / uniqueUsers.length : 0;

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      byRole: byRole.map((item) => ({
        role: item.role,
        count: item._count.role,
      })),
      byOffice: byOffice.map((item) => ({
        officeId: item.officeId,
        officeName: (item as any)._max.office?.name || "Office não encontrado",
        count: item._count.officeId,
      })),
      averageOfficesPerUser,
    };
  }

  // ========================================
  // MÉTODOS DE RELATÓRIOS
  // ========================================

  async getOfficeUserReport(
    userId: string,
    organizationId: string
  ): Promise<OfficeUserReport | null> {
    const officeUsers = await this.getByUserId(userId, organizationId);
    if (officeUsers.length === 0) return null;

    // Buscar informações do usuário (assumindo que existe uma tabela User)
    // TODO: Implementar busca de informações do usuário quando disponível
    const user = {
      id: userId,
      name: "Nome do Usuário", // TODO: Buscar do banco
      email: "email@exemplo.com", // TODO: Buscar do banco
    };

    const activeOffices = officeUsers.filter((ou) => ou.isActive).length;
    const lastActivity = new Date(); // TODO: Implementar cálculo da última atividade

    return {
      user,
      offices: officeUsers.map((ou) => ({
        office: ou.office!,
        role: ou.role,
        permissions: ou.permissions,
        isActive: ou.isActive,
        accessStartDate: ou.accessStartDate,
        accessEndDate: ou.accessEndDate,
      })),
      totalOffices: officeUsers.length,
      activeOffices,
      lastActivity,
    };
  }

  // ========================================
  // MÉTODOS DE PERMISSÕES E ACESSO
  // ========================================

  async getUserPermissions(
    userId: string,
    officeId: string,
    organizationId: string
  ): Promise<string[]> {
    const officeUser = await prisma.officeUser.findFirst({
      where: {
        userId,
        officeId,
        isActive: true,
        office: {
          organizationId,
          deletedAt: null,
        },
      },
      select: { permissions: true },
    });

    return officeUser?.permissions || [];
  }

  async hasPermission(
    userId: string,
    officeId: string,
    permission: string,
    organizationId: string
  ): Promise<boolean> {
    const permissions = await this.getUserPermissions(
      userId,
      officeId,
      organizationId
    );
    return permissions.includes(permission);
  }

  async getUserOffices(
    userId: string,
    organizationId: string
  ): Promise<OfficeUser[]> {
    return this.getByUserId(userId, organizationId);
  }

  async getActiveUserOffices(
    userId: string,
    organizationId: string
  ): Promise<OfficeUser[]> {
    const officeUsers = await this.getByUserId(userId, organizationId);
    return officeUsers.filter((ou) => ou.isActive);
  }

  // ========================================
  // MÉTODOS DE GESTÃO DE ACESSO
  // ========================================

  async deactivateUserAccess(
    userId: string,
    officeId: string,
    organizationId: string
  ): Promise<boolean> {
    try {
      await prisma.officeUser.updateMany({
        where: {
          userId,
          officeId,
          office: {
            organizationId,
            deletedAt: null,
          },
        },
        data: {
          isActive: false,
          updatedAt: new Date(),
        },
      });
      return true;
    } catch {
      return false;
    }
  }

  async activateUserAccess(
    userId: string,
    officeId: string,
    organizationId: string
  ): Promise<boolean> {
    try {
      await prisma.officeUser.updateMany({
        where: {
          userId,
          officeId,
          office: {
            organizationId,
            deletedAt: null,
          },
        },
        data: {
          isActive: true,
          updatedAt: new Date(),
        },
      });
      return true;
    } catch {
      return false;
    }
  }

  async updateUserPermissions(
    userId: string,
    officeId: string,
    permissions: string[],
    organizationId: string
  ): Promise<boolean> {
    try {
      await prisma.officeUser.updateMany({
        where: {
          userId,
          officeId,
          office: {
            organizationId,
            deletedAt: null,
          },
        },
        data: {
          permissions,
          updatedAt: new Date(),
        },
      });
      return true;
    } catch {
      return false;
    }
  }

  async extendUserAccess(
    userId: string,
    officeId: string,
    newEndDate: Date,
    organizationId: string
  ): Promise<boolean> {
    try {
      await prisma.officeUser.updateMany({
        where: {
          userId,
          officeId,
          office: {
            organizationId,
            deletedAt: null,
          },
        },
        data: {
          accessEndDate: newEndDate,
          updatedAt: new Date(),
        },
      });
      return true;
    } catch {
      return false;
    }
  }
}
