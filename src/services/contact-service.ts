import { contactRepo } from "@/lib/db/contact-repos-instance";
import { Contact, ContactFilters } from "@/types/contact";
import { ContactDto } from "@/types/dtos/contact/contact-dto";
import { v4 as uuidv4 } from "uuid";
import {
  withOrganizationIsolation,
  requireAuthenticatedUser,
} from "@/lib/auth-utils";

export class ContactService {
  async getAll(): Promise<Contact[]> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await contactRepo.getAll(organizationId);
    });
  }

  async getById(id: string): Promise<Contact | null> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await contactRepo.getById(id, organizationId);
    });
  }

  async create(data: ContactDto): Promise<Contact> {
    return await withOrganizationIsolation(async (organizationId) => {
      const userId = await requireAuthenticatedUser();

      // Validações e tratamento de dados antes de enviar para o repository
      const contactData: Contact & { organizationId: string } = {
        id: uuidv4(),
        name: data.name,
        email: data.email,
        zipCode: data.zipCode,
        address: data.address,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        number: data.number,
        complement: data.complement,
        dateOfBirth: data.dateOfBirth,
        createdAt: new Date(),
        createdBy: userId,
        updatedBy: undefined,
        updatedAt: undefined,
        phoneNumber: data.phoneNumber,
        sex: data.sex,
        organizationId, // Campo de multi-tenancy por organização

        // Campos obrigatórios para CRM Parlamentar com valores padrão
        isVoter: data.isVoter ?? true,
        politicalInterests: data.politicalInterests ?? [],
        votingHistory: data.votingHistory ?? [],

        // Campos opcionais para CRM Parlamentar
        cpf: data.cpf,
        rg: data.rg,
        voterId: data.voterId,
        maritalStatus: data.maritalStatus,
        occupation: data.occupation,
        education: data.education,
        income: data.income,
        politicalParty: data.politicalParty,
        votingZone: data.votingZone,
        votingSection: data.votingSection,
        whatsapp: data.whatsapp,
        instagram: data.instagram,
        facebook: data.facebook,
        linkedin: data.linkedin,
        spouseName: data.spouseName,
        childrenCount: data.childrenCount,
        dependents: data.dependents,
        participationLevel: data.participationLevel,
        ageGroup: data.ageGroup,
        socialClass: data.socialClass,
        urbanRural: data.urbanRural,
      };

      return await contactRepo.create(contactData);
    });
  }

  async update(id: string, data: Partial<Contact>): Promise<Contact | null> {
    return await withOrganizationIsolation(async (organizationId) => {
      const userId = await requireAuthenticatedUser();

      // Validações e tratamento de dados antes de enviar para o repository
      const updateData = {
        ...data,
        updatedAt: new Date(),
        updatedBy: userId,
      };

      return await contactRepo.update(id, organizationId, updateData);
    });
  }

  async delete(id: string): Promise<boolean> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await contactRepo.delete(id, organizationId);
    });
  }

  async getAllPaginated(
    page: number = 1,
    itemsPerPage: number = 10
  ): Promise<{
    data: Contact[];
    total: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  }> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await contactRepo.getAllPaginated(
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
    data: Contact[];
    total: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  }> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await contactRepo.getAllPaginatedWithSearch(
        organizationId,
        page,
        itemsPerPage,
        search
      );
    });
  }

  // Método para verificar se um paciente pertence à organização do usuário autenticado
  async isContactOwner(contactId: string): Promise<boolean> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await contactRepo.isOwner(contactId, organizationId);
    });
  }

  // === MÉTODOS ESPECIALIZADOS PARA CRM PARLAMENTAR ===

  // Busca por CPF
  async getByCpf(cpf: string): Promise<Contact | null> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await contactRepo.getByCpf(cpf, organizationId);
    });
  }

  // Busca por Título de Eleitor
  async getByVoterId(voterId: string): Promise<Contact | null> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await contactRepo.getByVoterId(voterId, organizationId);
    });
  }

  // Busca por Partido Político
  async getByPoliticalParty(politicalParty: string): Promise<Contact[]> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await contactRepo.getByPoliticalParty(
        politicalParty,
        organizationId
      );
    });
  }

  // Busca por Faixa Etária
  async getByAgeGroup(ageGroup: string): Promise<Contact[]> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await contactRepo.getByAgeGroup(ageGroup, organizationId);
    });
  }

  // Busca por Classe Social
  async getBySocialClass(socialClass: string): Promise<Contact[]> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await contactRepo.getBySocialClass(socialClass, organizationId);
    });
  }

  // Busca por Nível de Educação
  async getByEducation(education: string): Promise<Contact[]> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await contactRepo.getByEducation(education, organizationId);
    });
  }

  // Busca por Área (Urbana/Rural)
  async getByUrbanRural(urbanRural: string): Promise<Contact[]> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await contactRepo.getByUrbanRural(urbanRural, organizationId);
    });
  }

  // Busca por Eleitores Ativos/Inativos
  async getByVoterStatus(isVoter: boolean): Promise<Contact[]> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await contactRepo.getByVoterStatus(isVoter, organizationId);
    });
  }

  // Filtros avançados para CRM parlamentar
  async getAllPaginatedWithAdvancedFilters(
    filters: ContactFilters,
    page: number = 1,
    itemsPerPage: number = 10
  ): Promise<{
    data: Contact[];
    total: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  }> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await contactRepo.getAllPaginatedWithAdvancedFilters(
        { ...filters, organizationId },
        page,
        itemsPerPage
      );
    });
  }

  // Estatísticas para relatórios parlamentares
  async getParliamentaryStats() {
    return await withOrganizationIsolation(async (organizationId) => {
      return await contactRepo.getParliamentaryStats(organizationId);
    });
  }

  // Busca por interesses políticos
  async getByPoliticalInterests(interests: string[]): Promise<Contact[]> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await contactRepo.getByPoliticalInterests(
        interests,
        organizationId
      );
    });
  }

  // Busca por nível de participação política
  async getByParticipationLevel(
    participationLevel: string
  ): Promise<Contact[]> {
    return await withOrganizationIsolation(async (organizationId) => {
      return await contactRepo.getByParticipationLevel(
        participationLevel,
        organizationId
      );
    });
  }
}

export const contactService = new ContactService();
