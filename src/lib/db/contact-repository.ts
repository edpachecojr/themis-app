import { Contact } from "@/types/contact";
import { prisma } from "./prisma";

export interface PaginationResult<T> {
  data: T[];
  total: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

export class ContactRepository {
  toContactType(prismaContact: unknown): Contact {
    return prismaContact as Contact;
  }

  async create(data: Contact & { organizationId: string }): Promise<Contact> {
    const created = await prisma.contact.create({ data });

    return this.toContactType(created);
  }

  async getById(id: string, organizationId: string): Promise<Contact | null> {
    const contact = await prisma.contact.findFirst({
      where: {
        id,
        organizationId, // Filtro por organização
        deletedAt: null, // Exclusão lógica - não retorna registros deletados
      },
    });

    return this.toContactType(contact);
  }

  async getAll(organizationId: string): Promise<Contact[]> {
    const contacts = await prisma.contact.findMany({
      where: {
        organizationId, // Filtro por organização
        deletedAt: null, // Exclusão lógica - não retorna registros deletados
      },
      orderBy: { createdAt: "desc" },
    });

    return contacts.map(this.toContactType);
  }

  async getAllPaginated(
    organizationId: string,
    page: number = 1,
    itemsPerPage: number = 10
  ): Promise<PaginationResult<Contact>> {
    const skip = (page - 1) * itemsPerPage;

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where: {
          organizationId, // Filtro por organização
          deletedAt: null, // Exclusão lógica - não retorna registros deletados
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: itemsPerPage,
      }),
      prisma.contact.count({
        where: {
          organizationId, // Filtro por organização
          deletedAt: null, // Exclusão lógica - não conta registros deletados
        },
      }),
    ]);

    const totalPages = Math.ceil(total / itemsPerPage);

    return {
      data: contacts.map(this.toContactType),
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
  ): Promise<PaginationResult<Contact>> {
    const skip = (page - 1) * itemsPerPage;

    const whereClause = {
      organizationId, // Filtro por organização
      deletedAt: null, // Exclusão lógica - não retorna registros deletados
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { phoneNumber: { contains: search, mode: "insensitive" as const } },
          { address: { contains: search, mode: "insensitive" as const } },
          {
            neighborhood: { contains: search, mode: "insensitive" as const },
          },
          { city: { contains: search, mode: "insensitive" as const } },
          { state: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    };

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        skip,
        take: itemsPerPage,
      }),
      prisma.contact.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(total / itemsPerPage);

    return {
      data: contacts.map(this.toContactType),
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
      Omit<Contact, "id" | "createdAt" | "createdBy" | "organizationId">
    > & {
      updatedBy?: string;
    }
  ): Promise<Contact | null> {
    try {
      const contact = await prisma.contact.update({
        where: {
          id,
          organizationId, // Garante que só atualiza se pertencer à organização
        },
        data,
      });

      return this.toContactType(contact);
    } catch {
      return null;
    }
  }

  async delete(id: string, organizationId: string): Promise<boolean> {
    try {
      await prisma.contact.update({
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

  // Método para verificar se um paciente pertence à organização
  async isOwner(contactId: string, organizationId: string): Promise<boolean> {
    const contact = await prisma.contact.findFirst({
      where: {
        id: contactId,
        organizationId,
        deletedAt: null,
      },
      select: { id: true },
    });

    return !!contact;
  }
}
