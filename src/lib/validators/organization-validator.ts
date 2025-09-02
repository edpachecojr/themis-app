import { z } from "zod";

export const organizationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, {
      message: "Nome é obrigatório.",
    })
    .max(100, {
      message: "Nome muito longo.",
    }),
  description: z
    .string()
    .trim()
    .max(500, {
      message: "Descrição muito longa.",
    })
    .optional(),
  status: z
    .enum(["ACTIVE", "INACTIVE", "SUSPENDED"], {
      message: "Status inválido.",
    })
    .default("ACTIVE"),
  owner: z.string().trim().min(1, {
    message: "Proprietário é obrigatório.",
  }),
  createdBy: z.string().trim().min(1, {
    message: "Usuário responsável é obrigatório.",
  }),
  updatedBy: z.string().trim().nullable().optional(),
});

export type OrganizationSchema = z.infer<typeof organizationSchema>;

export const organizationUpdateSchema = z.object({
  id: z.string().uuid("ID inválido"),
  name: z
    .string()
    .trim()
    .min(1, {
      message: "Nome é obrigatório.",
    })
    .max(100, {
      message: "Nome muito longo.",
    })
    .optional(),
  description: z
    .string()
    .trim()
    .max(500, {
      message: "Descrição muito longa.",
    })
    .optional(),
  status: z
    .enum(["ACTIVE", "INACTIVE", "SUSPENDED"], {
      message: "Status inválido.",
    })
    .optional(),
});

export const organizationIdSchema = z.object({
  id: z.string().uuid("ID inválido"),
});
