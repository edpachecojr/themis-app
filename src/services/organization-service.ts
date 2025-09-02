import { organizationRepo } from "@/lib/db/organization-repos-instance";
import { Organization } from "@/types/organization";
import { OrganizationDto } from "@/types/dtos/organization/organization-dto";
import { v4 as uuidv4 } from "uuid";
import { withUserIsolation } from "@/lib/auth-utils";

export class OrganizationService {
  async getAll(): Promise<Organization[]> {
    return await withUserIsolation(async (userId) => {
      return await organizationRepo.getAll(userId);
    });
  }

  async getOrganizationById(id: string): Promise<Organization | null> {
    return await withUserIsolation(async (userId) => {
      return await organizationRepo.getOrganizationById(id, userId);
    });
  }

  async createOrganization(data: OrganizationDto): Promise<Organization> {
    return await withUserIsolation(async (userId) => {
      // Validações e tratamento de dados antes de enviar para o repository
      const organizationData: Organization & { owner: string } = {
        id: uuidv4(),
        name: data.name,
        description: data.description,
        status: data.status || "ACTIVE",
        owner: userId, // Campo de multi-tenancy
        createdAt: new Date(),
        createdBy: userId,
        updatedBy: userId,
        updatedAt: new Date(),
      };

      return await organizationRepo.createOrganization(organizationData);
    });
  }

  async updateOrganization(
    id: string,
    data: Partial<Organization>
  ): Promise<Organization | null> {
    return await withUserIsolation(async (userId) => {
      // Validações e tratamento de dados antes de enviar para o repository
      const updateData = {
        ...data,
        updatedAt: new Date(),
        updatedBy: userId,
      };

      return await organizationRepo.updateOrganization(id, userId, updateData);
    });
  }

  async deleteOrganization(id: string): Promise<boolean> {
    return await withUserIsolation(async (userId) => {
      return await organizationRepo.deleteOrganization(id, userId);
    });
  }

  async getAllPaginated(
    page: number = 1,
    itemsPerPage: number = 10
  ): Promise<{
    data: Organization[];
    total: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  }> {
    return await withUserIsolation(async (userId) => {
      return await organizationRepo.getAllPaginated(userId, page, itemsPerPage);
    });
  }

  async getAllPaginatedWithSearch(
    page: number = 1,
    itemsPerPage: number = 10,
    search?: string
  ): Promise<{
    data: Organization[];
    total: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  }> {
    return await withUserIsolation(async (userId) => {
      return await organizationRepo.getAllPaginatedWithSearch(
        userId,
        page,
        itemsPerPage,
        search
      );
    });
  }

  // Método para verificar se uma organização pertence ao usuário autenticado
  async isOrganizationOwner(organizationId: string): Promise<boolean> {
    return await withUserIsolation(async (userId) => {
      return await organizationRepo.isOrganizationOwner(organizationId, userId);
    });
  }
}

export const organizationService = new OrganizationService();
