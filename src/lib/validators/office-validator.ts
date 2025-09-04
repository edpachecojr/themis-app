import { z } from "zod";
import { OfficeType, OfficeStatus } from "@/types/office";

export const officeFormSchema = z.object({
  name: z.string().trim().min(1, {
    message: "Nome é obrigatório.",
  }),
  code: z.string().trim().min(1, {
    message: "Código é obrigatório.",
  }),
  description: z.string().optional(),
  type: z.nativeEnum(OfficeType, {
    message: "Tipo é obrigatório.",
  }),
  status: z.nativeEnum(OfficeStatus).optional(),

  // Localização
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  neighborhood: z.string().optional(),
  complement: z.string().optional(),

  // Contato
  phone: z.string().optional(),
  email: z.string().email("Email inválido").optional(),
  whatsapp: z.string().optional(),

  // Configurações
  capacity: z.number().min(0).optional(),
  maxUsers: z.number().min(1).optional(),
  openingHours: z.string().optional(),
  isOpenOnWeekends: z.boolean().optional(),
  metadata: z.record(z.any()).optional(),
});

export type OfficeFormSchema = z.infer<typeof officeFormSchema>;

export const officeUpdateSchema = officeFormSchema.partial().extend({
  id: z.string().uuid("ID inválido"),
});

export const officeIdSchema = z.object({
  id: z.string().uuid("ID inválido"),
});

export const officeFiltersSchema = z.object({
  name: z.string().optional(),
  code: z.string().optional(),
  type: z.nativeEnum(OfficeType).optional(),
  status: z.nativeEnum(OfficeStatus).optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  search: z.string().optional(),
});

export const officePaginationSchema = z.object({
  page: z.number().min(1).default(1),
  itemsPerPage: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
});

export const officeAdvancedFiltersSchema = officeFiltersSchema.extend({
  page: z.number().min(1).default(1),
  itemsPerPage: z.number().min(1).max(100).default(10),
});
