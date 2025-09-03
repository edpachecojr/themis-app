// Enums para CRM Parlamentar
export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export enum MaritalStatus {
  SINGLE = "SINGLE",
  MARRIED = "MARRIED",
  DIVORCED = "DIVORCED",
  WIDOWED = "WIDOWED",
  SEPARATED = "SEPARATED",
  CIVIL_UNION = "CIVIL_UNION",
}

export enum EducationLevel {
  ILLITERATE = "ILLITERATE",
  INCOMPLETE_ELEMENTARY = "INCOMPLETE_ELEMENTARY",
  COMPLETE_ELEMENTARY = "COMPLETE_ELEMENTARY",
  INCOMPLETE_HIGH_SCHOOL = "INCOMPLETE_HIGH_SCHOOL",
  COMPLETE_HIGH_SCHOOL = "COMPLETE_HIGH_SCHOOL",
  INCOMPLETE_COLLEGE = "INCOMPLETE_COLLEGE",
  COMPLETE_COLLEGE = "COMPLETE_COLLEGE",
  GRADUATE = "GRADUATE",
  MASTERS = "MASTERS",
  DOCTORATE = "DOCTORATE",
}

export enum ParticipationLevel {
  VERY_LOW = "VERY_LOW",
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  VERY_HIGH = "VERY_HIGH",
}

export enum AgeGroup {
  UNDER_18 = "UNDER_18",
  AGE_18_25 = "AGE_18_25",
  AGE_26_35 = "AGE_26_35",
  AGE_36_45 = "AGE_36_45",
  AGE_46_55 = "AGE_46_55",
  AGE_56_65 = "AGE_56_65",
  OVER_65 = "OVER_65",
}

export enum SocialClass {
  CLASS_A = "CLASS_A",
  CLASS_B = "CLASS_B",
  CLASS_C = "CLASS_C",
  CLASS_D = "CLASS_D",
  CLASS_E = "CLASS_E",
}

export enum UrbanRural {
  URBAN = "URBAN",
  RURAL = "RURAL",
  PERIURBAN = "PERIURBAN",
}

export interface Contact {
  id: string;
  name: string;
  email?: string;
  zipCode?: string;
  address?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  number?: string;
  complement?: string;
  dateOfBirth?: Date;
  createdAt: Date;
  createdBy?: string;
  updatedBy?: string;
  updatedAt?: Date;
  phoneNumber: string;
  sex: Gender;
  deletedAt?: Date; // Exclusão lógica
  organizationId: string; // Campo para multi-tenancy por organização

  // Campos específicos para CRM Parlamentar
  cpf?: string; // CPF do cidadão
  rg?: string; // RG do cidadão
  voterId?: string; // Título de Eleitor
  maritalStatus?: MaritalStatus; // Estado civil
  occupation?: string; // Profissão/Ocupação
  education?: EducationLevel; // Nível de educação
  income?: string; // Faixa de renda
  politicalParty?: string; // Partido político (se filiado)
  isVoter: boolean; // É eleitor ativo
  votingZone?: string; // Zona eleitoral
  votingSection?: string; // Seção eleitoral

  // Informações de contato adicionais
  whatsapp?: string; // Número do WhatsApp
  instagram?: string; // Usuário do Instagram
  facebook?: string; // Usuário do Facebook
  linkedin?: string; // Perfil do LinkedIn

  // Informações familiares
  spouseName?: string; // Nome do cônjuge
  childrenCount?: number; // Número de filhos
  dependents?: number; // Número de dependentes

  // Informações de interesse político
  politicalInterests: string[]; // Interesses políticos (tags)
  votingHistory: string[]; // Histórico de votações importantes
  participationLevel?: ParticipationLevel; // Nível de participação política

  // Campos de segmentação
  ageGroup?: AgeGroup; // Faixa etária
  socialClass?: SocialClass; // Classe social
  urbanRural?: UrbanRural; // Área urbana/rural
}

// Tipos para criação e atualização
export interface CreateContactData {
  name: string;
  email?: string;
  zipCode?: string;
  address?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  number?: string;
  complement?: string;
  dateOfBirth?: Date;
  phoneNumber: string;
  sex: Gender;
  organizationId: string;

  // Campos específicos para CRM Parlamentar
  cpf?: string;
  rg?: string;
  voterId?: string;
  maritalStatus?: MaritalStatus;
  occupation?: string;
  education?: EducationLevel;
  income?: string;
  politicalParty?: string;
  isVoter?: boolean;
  votingZone?: string;
  votingSection?: string;

  // Informações de contato adicionais
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;

  // Informações familiares
  spouseName?: string;
  childrenCount?: number;
  dependents?: number;

  // Informações de interesse político
  politicalInterests?: string[];
  votingHistory?: string[];
  participationLevel?: ParticipationLevel;

  // Campos de segmentação
  ageGroup?: AgeGroup;
  socialClass?: SocialClass;
  urbanRural?: UrbanRural;
}

export interface UpdateContactData {
  name?: string;
  email?: string;
  zipCode?: string;
  address?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  number?: string;
  complement?: string;
  dateOfBirth?: Date;
  phoneNumber?: string;
  sex?: Gender;

  // Campos específicos para CRM Parlamentar
  cpf?: string;
  rg?: string;
  voterId?: string;
  maritalStatus?: MaritalStatus;
  occupation?: string;
  education?: EducationLevel;
  income?: string;
  politicalParty?: string;
  isVoter?: boolean;
  votingZone?: string;
  votingSection?: string;

  // Informações de contato adicionais
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;

  // Informações familiares
  spouseName?: string;
  childrenCount?: number;
  dependents?: number;

  // Informações de interesse político
  politicalInterests?: string[];
  votingHistory?: string[];
  participationLevel?: ParticipationLevel;

  // Campos de segmentação
  ageGroup?: AgeGroup;
  socialClass?: SocialClass;
  urbanRural?: UrbanRural;
}

// Tipos para filtros e consultas
export interface ContactFilters {
  organizationId: string;
  name?: string;
  email?: string;
  city?: string;
  state?: string;
  cpf?: string;
  voterId?: string;
  politicalParty?: string;
  education?: EducationLevel;
  ageGroup?: AgeGroup;
  socialClass?: SocialClass;
  urbanRural?: UrbanRural;
  isVoter?: boolean;
  search?: string;
}

export interface ContactListResponse {
  contacts: Contact[];
  total: number;
  page: number;
  limit: number;
}
