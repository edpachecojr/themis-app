import { contactRepo } from "@/lib/db/contact-repos-instance";
import { Contact } from "@/types/contact";
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
        email: undefined,
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
}

export const contactService = new ContactService();
