import { z } from "zod";
import {
  Gender,
  MaritalStatus,
  EducationLevel,
  ParticipationLevel,
  AgeGroup,
  SocialClass,
  UrbanRural,
} from "../../types/contact";

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, {
    message: "Nome é obrigatório.",
  }),
  email: z.string().email("Email inválido").optional(),
  phoneNumber: z.string().trim().min(1, {
    message: "Número de telefone é obrigatório.",
  }),
  address: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  number: z.string().optional(),
  complement: z.string().optional(),
  dateOfBirth: z.date().optional(),
  sex: z.nativeEnum(Gender, {
    message: "Sexo é obrigatório.",
  }),
  // Campos parlamentares básicos
  cpf: z.string().optional(),
  rg: z.string().optional(),
  voterId: z.string().optional(),
  maritalStatus: z.nativeEnum(MaritalStatus).optional(),
  occupation: z.string().optional(),
  education: z.nativeEnum(EducationLevel).optional(),
  income: z.string().optional(),
  politicalParty: z.string().optional(),
  isVoter: z.boolean().optional(),
  votingZone: z.string().optional(),
  votingSection: z.string().optional(),
  // Informações de contato adicionais
  whatsapp: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  linkedin: z.string().optional(),
  // Informações familiares
  spouseName: z.string().optional(),
  childrenCount: z.number().min(0).optional(),
  dependents: z.number().min(0).optional(),
  // Informações de interesse político
  politicalInterests: z.array(z.string()).optional(),
  votingHistory: z.array(z.string()).optional(),
  participationLevel: z.nativeEnum(ParticipationLevel).optional(),
  // Campos de segmentação
  ageGroup: z.nativeEnum(AgeGroup).optional(),
  socialClass: z.nativeEnum(SocialClass).optional(),
  urbanRural: z.nativeEnum(UrbanRural).optional(),
});

export type ContactFormSchema = z.infer<typeof contactFormSchema>;

export const contactUpdateSchema = contactFormSchema.partial().extend({
  id: z.string().uuid("ID inválido"),
});

export const contactIdSchema = z.object({
  id: z.string().uuid("ID inválido"),
});
