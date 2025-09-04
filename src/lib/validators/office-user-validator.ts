import { z } from "zod";
import { OfficeRole } from "@/types/office";

export const officeUserFormSchema = z.object({
  userId: z.string().uuid("ID do usuário inválido"),
  officeId: z.string().uuid("ID do office inválido"),
  role: z.nativeEnum(OfficeRole).optional(),
  permissions: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  accessStartDate: z.date().optional(),
  accessEndDate: z.date().optional(),
});

export type OfficeUserFormSchema = z.infer<typeof officeUserFormSchema>;

export const officeUserUpdateSchema = officeUserFormSchema.partial().extend({
  id: z.string().uuid("ID inválido"),
});

export const officeUserIdSchema = z.object({
  id: z.string().uuid("ID inválido"),
});

export const officeUserFiltersSchema = z.object({
  userId: z.string().uuid().optional(),
  officeId: z.string().uuid().optional(),
  role: z.nativeEnum(OfficeRole).optional(),
  isActive: z.boolean().optional(),
  search: z.string().optional(),
});

export const officeUserPaginationSchema = z.object({
  page: z.number().min(1).default(1),
  itemsPerPage: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
});

export const officeUserAdvancedFiltersSchema = officeUserFiltersSchema.extend({
  page: z.number().min(1).default(1),
  itemsPerPage: z.number().min(1).max(100).default(10),
});

export const officeUserPermissionsSchema = z.object({
  userId: z.string().uuid("ID do usuário inválido"),
  officeId: z.string().uuid("ID do office inválido"),
  permissions: z.array(z.string()),
});

export const officeUserAccessSchema = z.object({
  userId: z.string().uuid("ID do usuário inválido"),
  officeId: z.string().uuid("ID do office inválido"),
  isActive: z.boolean(),
  accessEndDate: z.date().optional(),
});

export const transferUserSchema = z.object({
  userId: z.string().uuid("ID do usuário inválido"),
  fromOfficeId: z.string().uuid("ID do office de origem inválido"),
  toOfficeId: z.string().uuid("ID do office de destino inválido"),
  role: z.nativeEnum(OfficeRole).optional(),
});
