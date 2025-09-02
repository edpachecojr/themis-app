"use server";

import { actionClient } from "@/lib/next-safe-action";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { OrganizationDto } from "@/types/dtos/organization/organization-dto";
import { organizationService } from "@/services/organization-service";

// Schema simplificado para criação de organização
const addOrganizationSchema = z.object({
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
});

export const addOrganization = actionClient
  .inputSchema(addOrganizationSchema)
  .action(async ({ parsedInput }) => {
    try {
      const inputDto: OrganizationDto = {
        name: parsedInput.name,
        description: parsedInput.description,
        status: parsedInput.status,
      };

      const organization = await organizationService.createOrganization(
        inputDto
      );

      revalidatePath("/dashboard");
      revalidatePath("/organizations");

      return {
        ok: true,
        organization,
      };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        error: "Erro ao criar organização",
      };
    }
  });
