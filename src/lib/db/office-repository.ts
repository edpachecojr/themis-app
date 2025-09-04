import {
  Office,
  CreateOfficeData,
  UpdateOfficeData,
  OfficeFilters,
  OfficeStats,
  OfficeReport,
  OfficeValidationResult,
} from "../../types/office";
import { prisma } from "./prisma";
import { PaginationResult } from "./types";
import { OfficeType, OfficeStatus } from "../../types/office";

export class OfficeRepository {
  toOfficeType(prismaOffice: unknown): Office {
    return prismaOffice as Office;
  }

  // ========================================
  // MÉTODOS CRUD BÁSICOS
  // ========================================

  async create(data: CreateOfficeData): Promise<Office> {
    const created = await prisma.office.create({
      data: {
        ...data,
        id: crypto.randomUUID(),
        status: data.status || "ACTIVE",
        maxUsers: data.maxUsers || 10,
        isOpenOnWeekends: data.isOpenOnWeekends || false,
      },
    });

    return this.toOfficeType(created);
  }

  async getById(id: string, organizationId: string): Promise<Office | null> {
    const office = await prisma.office.findFirst({
      where: {
        id,
        organizationId, // Filtro por organização
        deletedAt: null, // Exclusão lógica
      },
      include: {
        officeUsers: {
          where: { isActive: true },
          include: {
            office: false, // Evita recursão
          },
        },
      },
    });

    return this.toOfficeType(office);
  }

  async getAll(organizationId: string): Promise<Office[]> {
    const offices = await prisma.office.findMany({
      where: {
        organizationId, // Filtro por organização
        deletedAt: null, // Exclusão lógica
      },
      orderBy: { createdAt: "desc" },
    });

    return offices.map(this.toOfficeType);
  }

  async getAllPaginated(
    organizationId: string,
    page: number = 1,
    itemsPerPage: number = 10
  ): Promise<PaginationResult<Office>> {
    const skip = (page - 1) * itemsPerPage;

    const [offices, total] = await Promise.all([
      prisma.office.findMany({
        where: {
          organizationId, // Filtro por organização
          deletedAt: null, // Exclusão lógica
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: itemsPerPage,
      }),
      prisma.office.count({
        where: {
          organizationId, // Filtro por organização
          deletedAt: null, // Exclusão lógica
        },
      }),
    ]);

    const totalPages = Math.ceil(total / itemsPerPage);

    return {
      data: offices.map(this.toOfficeType),
      total,
      totalPages,
      currentPage: page,
      itemsPerPage,
    };
  }

  async getAllPaginatedWithSearch(
    organizationId: string,
    page: number = 1,
    itemsPerPage: number = 10,
    search?: string
  ): Promise<PaginationResult<Office>> {
    const skip = (page - 1) * itemsPerPage;

    const whereClause = {
      organizationId, // Filtro por organização
      deletedAt: null, // Exclusão lógica
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { code: { contains: search, mode: "insensitive" as const } },
          { description: { contains: search, mode: "insensitive" as const } },
          { address: { contains: search, mode: "insensitive" as const } },
          { city: { contains: search, mode: "insensitive" as const } },
          { state: { contains: search, mode: "insensitive" as const } },
          { neighborhood: { contains: search, mode: "insensitive" as const } },
          { phone: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    };

    const [offices, total] = await Promise.all([
      prisma.office.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        skip,
        take: itemsPerPage,
      }),
      prisma.office.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(total / itemsPerPage);

    return {
      data: offices.map(this.toOfficeType),
      total,
      totalPages,
      currentPage: page,
      itemsPerPage,
    };
  }

  async update(
    id: string,
    organizationId: string,
    data: UpdateOfficeData
  ): Promise<Office | null> {
    try {
      const office = await prisma.office.update({
        where: {
          id,
          organizationId, // Garante que só atualiza se pertencer à organização
        },
        data,
      });

      return this.toOfficeType(office);
    } catch {
      return null;
    }
  }

  async delete(id: string, organizationId: string): Promise<boolean> {
    try {
      await prisma.office.update({
        where: {
          id,
          organizationId, // Garante que só deleta se pertencer à organização
        },
        data: {
          deletedAt: new Date(),
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

  async isOwner(officeId: string, organizationId: string): Promise<boolean> {
    const office = await prisma.office.findFirst({
      where: {
        id: officeId,
        organizationId,
        deletedAt: null,
      },
      select: { id: true },
    });

    return !!office;
  }

  async isCodeUnique(
    code: string,
    organizationId: string,
    excludeId?: string
  ): Promise<boolean> {
    const office = await prisma.office.findFirst({
      where: {
        code,
        organizationId,
        deletedAt: null,
        ...(excludeId && { id: { not: excludeId } }),
      },
      select: { id: true },
    });

    return !office;
  }

  async validateOffice(
    data: CreateOfficeData | UpdateOfficeData
  ): Promise<OfficeValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validações obrigatórias
    if (!data.name || data.name.trim().length === 0) {
      errors.push("Nome é obrigatório");
    }

    if (!data.code || data.code.trim().length === 0) {
      errors.push("Código é obrigatório");
    }

    if (data.maxUsers && data.maxUsers < 1) {
      errors.push("Número máximo de usuários deve ser maior que 0");
    }

    if (data.capacity && data.capacity < 0) {
      errors.push("Capacidade não pode ser negativa");
    }

    // Validações de formato
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push("Email inválido");
    }

    if (data.zipCode && !/^\d{5}-?\d{3}$/.test(data.zipCode)) {
      errors.push("CEP inválido");
    }

    // Warnings
    if (data.maxUsers && data.maxUsers > 50) {
      warnings.push("Número alto de usuários pode impactar a performance");
    }

    if (data.capacity && data.capacity > 100) {
      warnings.push("Capacidade alta pode indicar necessidade de subdivisão");
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  // ========================================
  // MÉTODOS ESPECIALIZADOS POR TIPO
  // ========================================

  async getByType(type: OfficeType, organizationId: string): Promise<Office[]> {
    const offices = await prisma.office.findMany({
      where: {
        type,
        organizationId,
        deletedAt: null,
      },
      orderBy: { createdAt: "desc" },
    });

    return offices.map(this.toOfficeType);
  }

  async getByStatus(
    status: OfficeStatus,
    organizationId: string
  ): Promise<Office[]> {
    const offices = await prisma.office.findMany({
      where: {
        status,
        organizationId,
        deletedAt: null,
      },
      orderBy: { createdAt: "desc" },
    });

    return offices.map(this.toOfficeType);
  }

  async getByCity(city: string, organizationId: string): Promise<Office[]> {
    const offices = await prisma.office.findMany({
      where: {
        city: { contains: city, mode: "insensitive" },
        organizationId,
        deletedAt: null,
      },
      orderBy: { createdAt: "desc" },
    });

    return offices.map(this.toOfficeType);
  }

  async getByState(state: string, organizationId: string): Promise<Office[]> {
    const offices = await prisma.office.findMany({
      where: {
        state: { contains: state, mode: "insensitive" },
        organizationId,
        deletedAt: null,
      },
      orderBy: { createdAt: "desc" },
    });

    return offices.map(this.toOfficeType);
  }

  async getByCode(
    code: string,
    organizationId: string
  ): Promise<Office | null> {
    const office = await prisma.office.findFirst({
      where: {
        code,
        organizationId,
        deletedAt: null,
      },
    });

    return this.toOfficeType(office);
  }

  // ========================================
  // MÉTODOS DE FILTROS AVANÇADOS
  // ========================================

  async getAllPaginatedWithAdvancedFilters(
    filters: OfficeFilters,
    page: number = 1,
    itemsPerPage: number = 10
  ): Promise<PaginationResult<Office>> {
    const skip = (page - 1) * itemsPerPage;

    const whereClause = {
      organizationId: filters.organizationId,
      deletedAt: null,
      ...(filters.name && {
        name: { contains: filters.name, mode: "insensitive" as const },
      }),
      ...(filters.code && {
        code: { contains: filters.code, mode: "insensitive" as const },
      }),
      ...(filters.type && { type: filters.type }),
      ...(filters.status && { status: filters.status }),
      ...(filters.city && {
        city: { contains: filters.city, mode: "insensitive" as const },
      }),
      ...(filters.state && {
        state: { contains: filters.state, mode: "insensitive" as const },
      }),
      ...(filters.search && {
        OR: [
          { name: { contains: filters.search, mode: "insensitive" as const } },
          { code: { contains: filters.search, mode: "insensitive" as const } },
          {
            description: {
              contains: filters.search,
              mode: "insensitive" as const,
            },
          },
          {
            address: { contains: filters.search, mode: "insensitive" as const },
          },
          { city: { contains: filters.search, mode: "insensitive" as const } },
          { state: { contains: filters.search, mode: "insensitive" as const } },
          { phone: { contains: filters.search, mode: "insensitive" as const } },
          { email: { contains: filters.search, mode: "insensitive" as const } },
        ],
      }),
    };

    const [offices, total] = await Promise.all([
      prisma.office.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        skip,
        take: itemsPerPage,
      }),
      prisma.office.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(total / itemsPerPage);

    return {
      data: offices.map(this.toOfficeType),
      total,
      totalPages,
      currentPage: page,
      itemsPerPage,
    };
  }

  // ========================================
  // MÉTODOS DE ESTATÍSTICAS
  // ========================================

  async getOfficeStats(organizationId: string): Promise<OfficeStats> {
    const [
      totalOffices,
      activeOffices,
      inactiveOffices,
      suspendedOffices,
      maintenanceOffices,
      byType,
      byStatus,
      byCity,
      byState,
      totalUsers,
    ] = await Promise.all([
      prisma.office.count({
        where: { organizationId, deletedAt: null },
      }),
      prisma.office.count({
        where: { organizationId, status: "ACTIVE", deletedAt: null },
      }),
      prisma.office.count({
        where: { organizationId, status: "INACTIVE", deletedAt: null },
      }),
      prisma.office.count({
        where: { organizationId, status: "SUSPENDED", deletedAt: null },
      }),
      prisma.office.count({
        where: { organizationId, status: "MAINTENANCE", deletedAt: null },
      }),
      prisma.office.groupBy({
        by: ["type"],
        where: { organizationId, deletedAt: null },
        _count: { type: true },
      }),
      prisma.office.groupBy({
        by: ["status"],
        where: { organizationId, deletedAt: null },
        _count: { status: true },
      }),
      prisma.office.groupBy({
        by: ["city"],
        where: { organizationId, deletedAt: null, city: { not: null } },
        _count: { city: true },
      }),
      prisma.office.groupBy({
        by: ["state"],
        where: { organizationId, deletedAt: null, state: { not: null } },
        _count: { state: true },
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
    ]);

    const averageUsersPerOffice =
      totalOffices > 0 ? totalUsers / totalOffices : 0;

    return {
      totalOffices,
      activeOffices,
      inactiveOffices,
      suspendedOffices,
      maintenanceOffices,
      byType: byType.map((item) => ({
        type: item.type,
        count: item._count.type,
      })),
      byStatus: byStatus.map((item) => ({
        status: item.status,
        count: item._count.status,
      })),
      byCity: byCity.map((item) => ({
        city: item.city || "Não informado",
        count: item._count.city,
      })),
      byState: byState.map((item) => ({
        state: item.state || "Não informado",
        count: item._count.state,
      })),
      totalUsers,
      averageUsersPerOffice,
    };
  }

  // ========================================
  // MÉTODOS DE RELATÓRIOS
  // ========================================

  async getOfficeReport(
    officeId: string,
    organizationId: string
  ): Promise<OfficeReport | null> {
    const office = await this.getById(officeId, organizationId);
    if (!office) return null;

    const [
      totalUsers,
      activeUsers,
      totalDemands,
      openDemands,
      closedDemands,
      averageResolutionTime,
      lastActivity,
    ] = await Promise.all([
      prisma.officeUser.count({
        where: { officeId, isActive: true },
      }),
      prisma.officeUser.count({
        where: { officeId, isActive: true },
      }),
      prisma.demand.count({
        where: { officeId },
      }),
      prisma.demand.count({
        where: { officeId, status: { in: ["NEW", "IN_PROGRESS", "PENDING"] } },
      }),
      prisma.demand.count({
        where: { officeId, status: { in: ["RESOLVED", "CLOSED"] } },
      }),
      // TODO: Implementar cálculo de tempo médio de resolução
      0,
      new Date(), // TODO: Implementar cálculo da última atividade
    ]);

    return {
      office,
      totalUsers,
      activeUsers,
      totalDemands,
      openDemands,
      closedDemands,
      averageResolutionTime,
      lastActivity,
    };
  }

  // ========================================
  // MÉTODOS DE CAPACIDADE E DISPONIBILIDADE
  // ========================================

  async getAvailableCapacity(
    officeId: string,
    organizationId: string
  ): Promise<number> {
    const office = await this.getById(officeId, organizationId);
    if (!office || !office.capacity) return 0;

    const currentUsage = await prisma.demand.count({
      where: {
        officeId,
        status: { in: ["NEW", "IN_PROGRESS", "PENDING"] },
      },
    });

    return Math.max(0, office.capacity - currentUsage);
  }

  async isOfficeAvailable(
    officeId: string,
    organizationId: string
  ): Promise<boolean> {
    const office = await this.getById(officeId, organizationId);
    if (!office) return false;

    return office.status === "ACTIVE" && !office.deletedAt;
  }

  async getOfficesByAvailability(organizationId: string): Promise<Office[]> {
    const offices = await prisma.office.findMany({
      where: {
        organizationId,
        status: "ACTIVE",
        deletedAt: null,
      },
      orderBy: { createdAt: "desc" },
    });

    return offices.map(this.toOfficeType);
  }
}
