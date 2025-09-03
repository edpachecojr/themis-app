import {
  Gender,
  MaritalStatus,
  EducationLevel,
  ParticipationLevel,
  AgeGroup,
  SocialClass,
  UrbanRural,
} from "../../contact";

export type ContactDto = {
  id?: string;
  name: string;
  email?: string;
  phoneNumber: string;
  address?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  number?: string;
  complement?: string;
  dateOfBirth?: Date;
  sex: Gender;
  deletedAt?: Date; // Exclusão lógica

  // Campos específicos para CRM Parlamentar
  cpf?: string; // CPF do cidadão
  rg?: string; // RG do cidadão
  voterId?: string; // Título de Eleitor
  maritalStatus?: MaritalStatus; // Estado civil
  occupation?: string; // Profissão/Ocupação
  education?: EducationLevel; // Nível de educação
  income?: string; // Faixa de renda
  politicalParty?: string; // Partido político (se filiado)
  isVoter?: boolean; // É eleitor ativo
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
  politicalInterests?: string[]; // Interesses políticos (tags)
  votingHistory?: string[]; // Histórico de votações importantes
  participationLevel?: ParticipationLevel; // Nível de participação política

  // Campos de segmentação
  ageGroup?: AgeGroup; // Faixa etária
  socialClass?: SocialClass; // Classe social
  urbanRural?: UrbanRural; // Área urbana/rural
};
