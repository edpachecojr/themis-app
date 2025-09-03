import {
  Contact,
  CreateContactData,
  ContactFilters,
} from "../../types/contact";
import { prisma } from "./prisma";
import { PaginationResult } from "./types";

export class ContactRepository {
  toContactType(prismaContact: unknown): Contact {
    return prismaContact as Contact;
  }

  async create(data: CreateContactData): Promise<Contact> {
    const created = await prisma.contact.create({
      data: {
        ...data,
        id: crypto.randomUUID(),
      },
    });

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
          { email: { contains: search, mode: "insensitive" as const } },
          { address: { contains: search, mode: "insensitive" as const } },
          { neighborhood: { contains: search, mode: "insensitive" as const } },
          { city: { contains: search, mode: "insensitive" as const } },
          { state: { contains: search, mode: "insensitive" as const } },
          { cpf: { contains: search, mode: "insensitive" as const } },
          { voterId: { contains: search, mode: "insensitive" as const } },
          { occupation: { contains: search, mode: "insensitive" as const } },
          {
            politicalParty: { contains: search, mode: "insensitive" as const },
          },
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

  // === MÉTODOS ESPECIALIZADOS PARA CRM PARLAMENTAR ===

  // Busca por CPF
  async getByCpf(cpf: string, organizationId: string): Promise<Contact | null> {
    const contact = await prisma.contact.findFirst({
      where: {
        cpf,
        organizationId,
        deletedAt: null,
      },
    });

    return this.toContactType(contact);
  }

  // Busca por Título de Eleitor
  async getByVoterId(
    voterId: string,
    organizationId: string
  ): Promise<Contact | null> {
    const contact = await prisma.contact.findFirst({
      where: {
        voterId,
        organizationId,
        deletedAt: null,
      },
    });

    return this.toContactType(contact);
  }

  // Busca por Partido Político
  async getByPoliticalParty(
    politicalParty: string,
    organizationId: string
  ): Promise<Contact[]> {
    const contacts = await prisma.contact.findMany({
      where: {
        politicalParty,
        organizationId,
        deletedAt: null,
      },
      orderBy: { createdAt: "desc" },
    });

    return contacts.map(this.toContactType);
  }

  // Busca por Faixa Etária
  async getByAgeGroup(
    ageGroup: string,
    organizationId: string
  ): Promise<Contact[]> {
    const contacts = await prisma.contact.findMany({
      where: {
        ageGroup: ageGroup as
          | "UNDER_18"
          | "AGE_18_25"
          | "AGE_26_35"
          | "AGE_36_45"
          | "AGE_46_55"
          | "AGE_56_65"
          | "OVER_65",
        organizationId,
        deletedAt: null,
      },
      orderBy: { createdAt: "desc" },
    });

    return contacts.map(this.toContactType);
  }

  // Busca por Classe Social
  async getBySocialClass(
    socialClass: string,
    organizationId: string
  ): Promise<Contact[]> {
    const contacts = await prisma.contact.findMany({
      where: {
        socialClass: socialClass as
          | "CLASS_A"
          | "CLASS_B"
          | "CLASS_C"
          | "CLASS_D"
          | "CLASS_E",
        organizationId,
        deletedAt: null,
      },
      orderBy: { createdAt: "desc" },
    });

    return contacts.map(this.toContactType);
  }

  // Busca por Nível de Educação
  async getByEducation(
    education: string,
    organizationId: string
  ): Promise<Contact[]> {
    const contacts = await prisma.contact.findMany({
      where: {
        education: education as
          | "ILLITERATE"
          | "INCOMPLETE_ELEMENTARY"
          | "COMPLETE_ELEMENTARY"
          | "INCOMPLETE_HIGH_SCHOOL"
          | "COMPLETE_HIGH_SCHOOL"
          | "INCOMPLETE_COLLEGE"
          | "COMPLETE_COLLEGE"
          | "GRADUATE"
          | "MASTERS"
          | "DOCTORATE",
        organizationId,
        deletedAt: null,
      },
      orderBy: { createdAt: "desc" },
    });

    return contacts.map(this.toContactType);
  }

  // Busca por Área (Urbana/Rural)
  async getByUrbanRural(
    urbanRural: string,
    organizationId: string
  ): Promise<Contact[]> {
    const contacts = await prisma.contact.findMany({
      where: {
        urbanRural: urbanRural as "URBAN" | "RURAL" | "PERIURBAN",
        organizationId,
        deletedAt: null,
      },
      orderBy: { createdAt: "desc" },
    });

    return contacts.map(this.toContactType);
  }

  // Busca por Eleitores Ativos/Inativos
  async getByVoterStatus(
    isVoter: boolean,
    organizationId: string
  ): Promise<Contact[]> {
    const contacts = await prisma.contact.findMany({
      where: {
        isVoter,
        organizationId,
        deletedAt: null,
      },
      orderBy: { createdAt: "desc" },
    });

    return contacts.map(this.toContactType);
  }

  // Filtros avançados para CRM parlamentar
  async getAllPaginatedWithAdvancedFilters(
    filters: ContactFilters,
    page: number = 1,
    itemsPerPage: number = 10
  ): Promise<PaginationResult<Contact>> {
    const skip = (page - 1) * itemsPerPage;

    const whereClause = {
      organizationId: filters.organizationId,
      deletedAt: null,
      ...(filters.name && {
        name: { contains: filters.name, mode: "insensitive" as const },
      }),
      ...(filters.email && {
        email: { contains: filters.email, mode: "insensitive" as const },
      }),
      ...(filters.city && {
        city: { contains: filters.city, mode: "insensitive" as const },
      }),
      ...(filters.state && {
        state: { contains: filters.state, mode: "insensitive" as const },
      }),
      ...(filters.cpf && {
        cpf: { contains: filters.cpf, mode: "insensitive" as const },
      }),
      ...(filters.voterId && {
        voterId: { contains: filters.voterId, mode: "insensitive" as const },
      }),
      ...(filters.politicalParty && {
        politicalParty: {
          contains: filters.politicalParty,
          mode: "insensitive" as const,
        },
      }),
      ...(filters.education && { education: filters.education }),
      ...(filters.ageGroup && { ageGroup: filters.ageGroup }),
      ...(filters.socialClass && { socialClass: filters.socialClass }),
      ...(filters.urbanRural && { urbanRural: filters.urbanRural }),
      ...(filters.isVoter !== undefined && { isVoter: filters.isVoter }),
      ...(filters.search && {
        OR: [
          { name: { contains: filters.search, mode: "insensitive" as const } },
          { email: { contains: filters.search, mode: "insensitive" as const } },
          { cpf: { contains: filters.search, mode: "insensitive" as const } },
          {
            voterId: { contains: filters.search, mode: "insensitive" as const },
          },
          {
            occupation: {
              contains: filters.search,
              mode: "insensitive" as const,
            },
          },
          {
            politicalParty: {
              contains: filters.search,
              mode: "insensitive" as const,
            },
          },
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

  // Estatísticas para relatórios parlamentares
  async getParliamentaryStats(organizationId: string) {
    const [
      totalContacts,
      totalVoters,
      byAgeGroup,
      bySocialClass,
      byEducation,
      byPoliticalParty,
      byUrbanRural,
    ] = await Promise.all([
      prisma.contact.count({
        where: { organizationId, deletedAt: null },
      }),
      prisma.contact.count({
        where: { organizationId, isVoter: true, deletedAt: null },
      }),
      prisma.contact.groupBy({
        by: ["ageGroup"],
        where: { organizationId, deletedAt: null },
        _count: { ageGroup: true },
      }),
      prisma.contact.groupBy({
        by: ["socialClass"],
        where: { organizationId, deletedAt: null },
        _count: { socialClass: true },
      }),
      prisma.contact.groupBy({
        by: ["education"],
        where: { organizationId, deletedAt: null },
        _count: { education: true },
      }),
      prisma.contact.groupBy({
        by: ["politicalParty"],
        where: { organizationId, deletedAt: null },
        _count: { politicalParty: true },
      }),
      prisma.contact.groupBy({
        by: ["urbanRural"],
        where: { organizationId, deletedAt: null },
        _count: { urbanRural: true },
      }),
    ]);

    return {
      totalContacts,
      totalVoters,
      voterPercentage:
        totalContacts > 0 ? (totalVoters / totalContacts) * 100 : 0,
      byAgeGroup,
      bySocialClass,
      byEducation,
      byPoliticalParty,
      byUrbanRural,
    };
  }

  // Busca por interesses políticos
  async getByPoliticalInterests(
    interests: string[],
    organizationId: string
  ): Promise<Contact[]> {
    const contacts = await prisma.contact.findMany({
      where: {
        organizationId,
        deletedAt: null,
        politicalInterests: {
          hasSome: interests,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return contacts.map(this.toContactType);
  }

  // Busca por nível de participação política
  async getByParticipationLevel(
    participationLevel: string,
    organizationId: string
  ): Promise<Contact[]> {
    const contacts = await prisma.contact.findMany({
      where: {
        participationLevel: participationLevel as
          | "VERY_LOW"
          | "LOW"
          | "MEDIUM"
          | "HIGH"
          | "VERY_HIGH",
        organizationId,
        deletedAt: null,
      },
      orderBy: { createdAt: "desc" },
    });

    return contacts.map(this.toContactType);
  }
}
