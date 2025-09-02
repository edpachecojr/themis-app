"use server";

import { actionClient } from "@/lib/next-safe-action";
import { revalidatePath } from "next/cache";
import { organizationIdSchema } from "@/lib/validators/organization-validator";
import { organizationService } from "@/services/organization-service";

export const deleteOrganization = actionClient
  .inputSchema(organizationIdSchema)
  .action(async ({ parsedInput }) => {
    try {
      const success = await organizationService.deleteOrganization(
        parsedInput.id
      );

      if (!success) {
        return { ok: false, error: "Organização não encontrada" };
      }

      revalidatePath("/dashboard");
      revalidatePath("/organizations");

      return { ok: true };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        error: "Erro ao deletar organização",
      };
    }
  });
