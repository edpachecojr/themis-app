import { officeUserRepo } from "@/lib/db/office-repos-instance";
import {
  OfficeUser,
  OfficeUserFilters,
  OfficeUserStats,
  OfficeUserReport,
  OfficeUserValidationResult,
} from "@/types/office";
import {
  OfficeUserDto,
  UpdateOfficeUserDto,
  OfficeUserFiltersDto,
  OfficeUserPermissionsDto,
  OfficeUserAccessDto,
} from "@/types/dtos/office/office-user-dto";
import { v4 as uuidv4 } from "uuid";
import {
  withOrganizationIsolation,
  requireAuthenticatedUser,
} from "@/lib/auth-utils";
import { OfficeRole } from "@/types/office";

export class OfficeUserService {
  async getAll(): Promise<OfficeUser[]> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await officeUserRepo.getAll(organizationId);
    });
  }

  async getById(id: string): Promise<OfficeUser | null> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await officeUserRepo.getById(id, organizationId);
    });
  }

  async create(data: OfficeUserDto): Promise<OfficeUser> {
    return await withOrganizationIsolation(async (organizationId) => {
      const userId = await requireAuthenticatedUser();

      // Validações e tratamento de dados antes de enviar para o repository
      const officeUserData = {
        id: uuidv4(),
        userId: data.userId,
        officeId: data.officeId,
        role: data.role || OfficeRole.STAFF,
        permissions: data.permissions || [],
        isActive: data.isActive ?? true,
        accessStartDate: data.accessStartDate || new Date(),
        accessEndDate: data.accessEndDate,

        // Timestamps
        createdAt: new Date(),
        createdBy: userId,
        updatedBy: undefined,
        updatedAt: undefined,
      };

      return await officeUserRepo.create(officeUserData);
    });
  }

  async update(
    id: string,
    data: UpdateOfficeUserDto
  ): Promise<OfficeUser | null> {
    return await withOrganizationIsolation(async (organizationId) => {
      const userId = await requireAuthenticatedUser();

      // Validações e tratamento de dados antes de enviar para o repository
      const updateData = {
        ...data,
        updatedAt: new Date(),
        updatedBy: userId,
      };

      return await officeUserRepo.update(id, organizationId, updateData);
    });
  }

  async delete(id: string): Promise<boolean> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await officeUserRepo.delete(id, organizationId);
    });
  }

  async getAllPaginated(
    page: number = 1,
    itemsPerPage: number = 10
  ): Promise<{
    data: OfficeUser[];
    total: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  }> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await officeUserRepo.getAllPaginated(
        organizationId,
        page,
        itemsPerPage
      );
    });
  }

  // Método para verificar se um office user pertence à organização do usuário autenticado
  async isOfficeUserOwner(officeUserId: string): Promise<boolean> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await officeUserRepo.isOwner(officeUserId, organizationId);
    });
  }

  // ========================================
  // MÉTODOS ESPECIALIZADOS POR CRITÉRIOS
  // ========================================

  // Busca por usuário
  async getByUserId(userId: string): Promise<OfficeUser[]> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await officeUserRepo.getByUserId(userId, organizationId);
    });
  }

  // Busca por office
  async getByOfficeId(officeId: string): Promise<OfficeUser[]> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await officeUserRepo.getByOfficeId(officeId, organizationId);
    });
  }

  // Busca por role
  async getByRole(role: OfficeRole): Promise<OfficeUser[]> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await officeUserRepo.getByRole(role, organizationId);
    });
  }

  // Buscar usuários ativos
  async getActiveUsers(): Promise<OfficeUser[]> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await officeUserRepo.getActiveUsers(organizationId);
    });
  }

  // Buscar usuários inativos
  async getInactiveUsers(): Promise<OfficeUser[]> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await officeUserRepo.getInactiveUsers(organizationId);
    });
  }

  // Buscar usuários com acesso expirado
  async getUsersWithExpiredAccess(): Promise<OfficeUser[]> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await officeUserRepo.getUsersWithExpiredAccess(organizationId);
    });
  }

  // ========================================
  // MÉTODOS DE VALIDAÇÃO
  // ========================================

  // Verificar se usuário está no office
  async isUserInOffice(userId: string, officeId: string): Promise<boolean> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await officeUserRepo.isUserInOffice(
        userId,
        officeId,
        organizationId
      );
    });
  }

  // Validar dados do office user
  async validateOfficeUser(
    data: OfficeUserDto | UpdateOfficeUserDto
  ): Promise<OfficeUserValidationResult> {
    return await officeUserRepo.validateOfficeUser(data);
  }

  // ========================================
  // MÉTODOS DE FILTROS AVANÇADOS
  // ========================================

  // Filtros avançados para office users
  async getAllPaginatedWithAdvancedFilters(
    filters: OfficeUserFiltersDto,
    page: number = 1,
    itemsPerPage: number = 10
  ): Promise<{
    data: OfficeUser[];
    total: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  }> {
    return await withOrganizationIsolation(async (organizationId) => {
      const officeUserFilters: OfficeUserFilters = {
        ...filters,
        organizationId,
      };

      return await officeUserRepo.getAllPaginatedWithAdvancedFilters(
        officeUserFilters,
        page,
        itemsPerPage
      );
    });
  }

  // ========================================
  // MÉTODOS DE ESTATÍSTICAS
  // ========================================

  // Estatísticas para relatórios de office users
  async getOfficeUserStats(): Promise<OfficeUserStats> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await officeUserRepo.getOfficeUserStats(organizationId);
    });
  }

  // Relatório detalhado de um office user
  async getOfficeUserReport(userId: string): Promise<OfficeUserReport | null> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await officeUserRepo.getOfficeUserReport(userId, organizationId);
    });
  }

  // ========================================
  // MÉTODOS DE PERMISSÕES E ACESSO
  // ========================================

  // Buscar permissões do usuário em um office
  async getUserPermissions(
    userId: string,
    officeId: string
  ): Promise<string[]> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await officeUserRepo.getUserPermissions(
        userId,
        officeId,
        organizationId
      );
    });
  }

  // Verificar se usuário tem permissão específica
  async hasPermission(
    userId: string,
    officeId: string,
    permission: string
  ): Promise<boolean> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await officeUserRepo.hasPermission(
        userId,
        officeId,
        permission,
        organizationId
      );
    });
  }

  // Buscar offices do usuário
  async getUserOffices(userId: string): Promise<OfficeUser[]> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await officeUserRepo.getUserOffices(userId, organizationId);
    });
  }

  // Buscar offices ativos do usuário
  async getActiveUserOffices(userId: string): Promise<OfficeUser[]> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await officeUserRepo.getActiveUserOffices(userId, organizationId);
    });
  }

  // ========================================
  // MÉTODOS DE GESTÃO DE ACESSO
  // ========================================

  // Desativar acesso do usuário ao office
  async deactivateUserAccess(
    userId: string,
    officeId: string
  ): Promise<boolean> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await officeUserRepo.deactivateUserAccess(
        userId,
        officeId,
        organizationId
      );
    });
  }

  // Ativar acesso do usuário ao office
  async activateUserAccess(userId: string, officeId: string): Promise<boolean> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await officeUserRepo.activateUserAccess(
        userId,
        officeId,
        organizationId
      );
    });
  }

  // Atualizar permissões do usuário
  async updateUserPermissions(
    data: OfficeUserPermissionsDto
  ): Promise<boolean> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await officeUserRepo.updateUserPermissions(
        data.userId,
        data.officeId,
        data.permissions,
        organizationId
      );
    });
  }

  // Estender acesso do usuário
  async extendUserAccess(
    userId: string,
    officeId: string,
    newEndDate: Date
  ): Promise<boolean> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await officeUserRepo.extendUserAccess(
        userId,
        officeId,
        newEndDate,
        organizationId
      );
    });
  }

  // ========================================
  // MÉTODOS ESPECÍFICOS PARA GESTÃO DE USUÁRIOS
  // ========================================

  // Adicionar usuário a múltiplos offices
  async addUserToOffices(
    userId: string,
    officeIds: string[],
    role: OfficeRole = OfficeRole.STAFF
  ): Promise<OfficeUser[]> {
    const results: OfficeUser[] = [];

    for (const officeId of officeIds) {
      const officeUser = await this.create({
        userId,
        officeId,
        role,
        permissions: [],
        isActive: true,
      });
      results.push(officeUser);
    }

    return results;
  }

  // Remover usuário de múltiplos offices
  async removeUserFromOffices(
    userId: string,
    officeIds: string[]
  ): Promise<boolean[]> {
    const results: boolean[] = [];

    for (const officeId of officeIds) {
      const success = await this.deactivateUserAccess(userId, officeId);
      results.push(success);
    }

    return results;
  }

  // Transferir usuário entre offices
  async transferUserBetweenOffices(
    userId: string,
    fromOfficeId: string,
    toOfficeId: string,
    role: OfficeRole = OfficeRole.STAFF
  ): Promise<boolean> {
    // Desativar acesso no office atual
    const deactivated = await this.deactivateUserAccess(userId, fromOfficeId);

    if (!deactivated) {
      return false;
    }

    // Adicionar ao novo office
    const newOfficeUser = await this.create({
      userId,
      officeId: toOfficeId,
      role,
      permissions: [],
      isActive: true,
    });

    return !!newOfficeUser;
  }

  // ========================================
  // MÉTODOS ESPECÍFICOS PARA ROLES
  // ========================================

  // Buscar administradores
  async getAdmins(): Promise<OfficeUser[]> {
    return await this.getByRole(OfficeRole.ADMIN);
  }

  // Buscar gerentes
  async getManagers(): Promise<OfficeUser[]> {
    return await this.getByRole(OfficeRole.MANAGER);
  }

  // Buscar supervisores
  async getSupervisors(): Promise<OfficeUser[]> {
    return await this.getByRole(OfficeRole.SUPERVISOR);
  }

  // Buscar funcionários
  async getStaff(): Promise<OfficeUser[]> {
    return await this.getByRole(OfficeRole.STAFF);
  }

  // Buscar especialistas
  async getSpecialists(): Promise<OfficeUser[]> {
    return await this.getByRole(OfficeRole.SPECIALIST);
  }

  // Buscar recepcionistas
  async getReceptionists(): Promise<OfficeUser[]> {
    return await this.getByRole(OfficeRole.RECEPTIONIST);
  }

  // Buscar estagiários
  async getInterns(): Promise<OfficeUser[]> {
    return await this.getByRole(OfficeRole.INTERN);
  }

  // Buscar voluntários
  async getVolunteers(): Promise<OfficeUser[]> {
    return await this.getByRole(OfficeRole.VOLUNTEER);
  }
}

export const officeUserService = new OfficeUserService();
