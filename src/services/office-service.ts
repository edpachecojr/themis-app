import { officeRepo } from "@/lib/db/office-repos-instance";
import {
  Office,
  OfficeFilters,
  OfficeStats,
  OfficeReport,
  OfficeValidationResult,
} from "@/types/office";
import {
  OfficeDto,
  UpdateOfficeDto,
  OfficeFiltersDto,
} from "@/types/dtos/office/office-dto";
import { v4 as uuidv4 } from "uuid";
import {
  withOrganizationIsolation,
  requireAuthenticatedUser,
} from "@/lib/auth-utils";
import { OfficeType, OfficeStatus } from "@/types/office";

export class OfficeService {
  async getAll(): Promise<Office[]> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await officeRepo.getAll(organizationId);
    });
  }

  async getById(id: string): Promise<Office | null> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await officeRepo.getById(id, organizationId);
    });
  }

  async create(data: OfficeDto): Promise<Office> {
    return await withOrganizationIsolation(async (organizationId) => {
      const userId = await requireAuthenticatedUser();

      // Validações e tratamento de dados antes de enviar para o repository
      const officeData = {
        id: uuidv4(),
        name: data.name,
        code: data.code,
        description: data.description,
        type: data.type,
        status: data.status || OfficeStatus.ACTIVE,
        organizationId, // Campo de multi-tenancy por organização

        // Localização
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        neighborhood: data.neighborhood,
        complement: data.complement,

        // Contato
        phone: data.phone,
        email: data.email,
        whatsapp: data.whatsapp,

        // Configurações
        capacity: data.capacity,
        maxUsers: data.maxUsers || 10,
        openingHours: data.openingHours,
        isOpenOnWeekends: data.isOpenOnWeekends || false,
        metadata: data.metadata,

        // Timestamps
        createdAt: new Date(),
        createdBy: userId,
        updatedBy: undefined,
        updatedAt: undefined,
      };

      return await officeRepo.create(officeData);
    });
  }

  async update(id: string, data: UpdateOfficeDto): Promise<Office | null> {
    return await withOrganizationIsolation(async (organizationId) => {
      const userId = await requireAuthenticatedUser();

      // Validações e tratamento de dados antes de enviar para o repository
      const updateData = {
        ...data,
        updatedAt: new Date(),
        updatedBy: userId,
      };

      return await officeRepo.update(id, organizationId, updateData);
    });
  }

  async delete(id: string): Promise<boolean> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await officeRepo.delete(id, organizationId);
    });
  }

  async getAllPaginated(
    page: number = 1,
    itemsPerPage: number = 10
  ): Promise<{
    data: Office[];
    total: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  }> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await officeRepo.getAllPaginated(
        organizationId,
        page,
        itemsPerPage
      );
    });
  }

  async getAllPaginatedWithSearch(
    page: number = 1,
    itemsPerPage: number = 10,
    search?: string
  ): Promise<{
    data: Office[];
    total: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  }> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await officeRepo.getAllPaginatedWithSearch(
        organizationId,
        page,
        itemsPerPage,
        search
      );
    });
  }

  // Método para verificar se um office pertence à organização do usuário autenticado
  async isOfficeOwner(officeId: string): Promise<boolean> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await officeRepo.isOwner(officeId, organizationId);
    });
  }

  // ========================================
  // MÉTODOS ESPECIALIZADOS POR TIPO
  // ========================================

  // Busca por tipo de office
  async getByType(type: OfficeType): Promise<Office[]> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await officeRepo.getByType(type, organizationId);
    });
  }

  // Busca por status
  async getByStatus(status: OfficeStatus): Promise<Office[]> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await officeRepo.getByStatus(status, organizationId);
    });
  }

  // Busca por cidade
  async getByCity(city: string): Promise<Office[]> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await officeRepo.getByCity(city, organizationId);
    });
  }

  // Busca por estado
  async getByState(state: string): Promise<Office[]> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await officeRepo.getByState(state, organizationId);
    });
  }

  // Busca por código
  async getByCode(code: string): Promise<Office | null> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await officeRepo.getByCode(code, organizationId);
    });
  }

  // ========================================
  // MÉTODOS DE VALIDAÇÃO
  // ========================================

  // Verificar se código é único
  async isCodeUnique(code: string, excludeId?: string): Promise<boolean> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await officeRepo.isCodeUnique(code, organizationId, excludeId);
    });
  }

  // Validar dados do office
  async validateOffice(
    data: OfficeDto | UpdateOfficeDto
  ): Promise<OfficeValidationResult> {
    return await officeRepo.validateOffice(data);
  }

  // ========================================
  // MÉTODOS DE FILTROS AVANÇADOS
  // ========================================

  // Filtros avançados para offices
  async getAllPaginatedWithAdvancedFilters(
    filters: OfficeFiltersDto,
    page: number = 1,
    itemsPerPage: number = 10
  ): Promise<{
    data: Office[];
    total: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  }> {
    return await withOrganizationIsolation(async (organizationId) => {
      const officeFilters: OfficeFilters = {
        ...filters,
        organizationId,
      };

      return await officeRepo.getAllPaginatedWithAdvancedFilters(
        officeFilters,
        page,
        itemsPerPage
      );
    });
  }

  // ========================================
  // MÉTODOS DE ESTATÍSTICAS
  // ========================================

  // Estatísticas para relatórios de offices
  async getOfficeStats(): Promise<OfficeStats> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await officeRepo.getOfficeStats(organizationId);
    });
  }

  // Relatório detalhado de um office
  async getOfficeReport(officeId: string): Promise<OfficeReport | null> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await officeRepo.getOfficeReport(officeId, organizationId);
    });
  }

  // ========================================
  // MÉTODOS DE CAPACIDADE E DISPONIBILIDADE
  // ========================================

  // Verificar capacidade disponível
  async getAvailableCapacity(officeId: string): Promise<number> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await officeRepo.getAvailableCapacity(officeId, organizationId);
    });
  }

  // Verificar se office está disponível
  async isOfficeAvailable(officeId: string): Promise<boolean> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await officeRepo.isOfficeAvailable(officeId, organizationId);
    });
  }

  // Buscar offices disponíveis
  async getAvailableOffices(): Promise<Office[]> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await officeRepo.getOfficesByAvailability(organizationId);
    });
  }

  // ========================================
  // MÉTODOS ESPECÍFICOS PARA GABINETES PARLAMENTARES
  // ========================================

  // Buscar gabinetes principais
  async getMainOffices(): Promise<Office[]> {
    return await this.getByType(OfficeType.MAIN_OFFICE);
  }

  // Buscar escritórios regionais
  async getRegionalOffices(): Promise<Office[]> {
    return await this.getByType(OfficeType.REGIONAL_OFFICE);
  }

  // Buscar centros de atendimento
  async getServiceCenters(): Promise<Office[]> {
    return await this.getByType(OfficeType.SERVICE_CENTER);
  }

  // Buscar unidades especializadas
  async getSpecializedUnits(): Promise<Office[]> {
    return await this.getByType(OfficeType.SPECIALIZED_UNIT);
  }

  // ========================================
  // MÉTODOS ESPECÍFICOS PARA CLÍNICAS
  // ========================================

  // Buscar consultórios
  async getConsultationRooms(): Promise<Office[]> {
    return await this.getByType(OfficeType.CONSULTATION_ROOM);
  }

  // Buscar salas de emergência
  async getEmergencyRooms(): Promise<Office[]> {
    return await this.getByType(OfficeType.EMERGENCY_ROOM);
  }

  // Buscar enfermarias
  async getWards(): Promise<Office[]> {
    return await this.getByType(OfficeType.WARD);
  }

  // Buscar salas de cirurgia
  async getSurgeryRooms(): Promise<Office[]> {
    return await this.getByType(OfficeType.SURGERY_ROOM);
  }

  // Buscar laboratórios
  async getLaboratories(): Promise<Office[]> {
    return await this.getByType(OfficeType.LABORATORY);
  }

  // Buscar centros de imagem
  async getImagingCenters(): Promise<Office[]> {
    return await this.getByType(OfficeType.IMAGING_CENTER);
  }
}

export const officeService = new OfficeService();
