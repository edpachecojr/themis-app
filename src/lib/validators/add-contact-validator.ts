import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, {
    message: "Nome é obrigatório.",
  }),
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
  sex: z.enum(["MALE", "FEMALE"], {
    message: "Sexo é obrigatório.",
  }),
});

export type ContactFormSchema = z.infer<typeof contactFormSchema>;

export const contactUpdateSchema = contactFormSchema.partial().extend({
  id: z.string().uuid("ID inválido"),
});

export const contactIdSchema = z.object({
  id: z.string().uuid("ID inválido"),
});
