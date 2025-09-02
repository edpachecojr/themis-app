"use server";

import { actionClient } from "@/lib/next-safe-action";
import { organizationIdSchema } from "@/lib/validators/organization-validator";
import { organizationService } from "@/services/organization-service";

export const getOrganizationById = actionClient
  .inputSchema(organizationIdSchema)
  .action(async ({ parsedInput }) => {
    try {
      const organization = await organizationService.getOrganizationById(
        parsedInput.id
      );

      if (!organization) {
        return { ok: false, error: "Organização não encontrada" };
      }

      return { ok: true, organization };
    } catch {
      return {
        ok: false,
        error: "Erro ao buscar organização",
      };
    }
  });
