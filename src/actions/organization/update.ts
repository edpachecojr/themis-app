"use server";

import { actionClient } from "@/lib/next-safe-action";
import { revalidatePath } from "next/cache";
import { organizationUpdateSchema } from "@/lib/validators/organization-validator";
import { organizationService } from "@/services/organization-service";

export const updateOrganization = actionClient
  .inputSchema(organizationUpdateSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { id, ...updateData } = parsedInput;

      const organization = await organizationService.updateOrganization(
        id,
        updateData
      );

      if (!organization) {
        return { ok: false, error: "Organização não encontrada" };
      }

      revalidatePath("/dashboard");
      revalidatePath("/organizations");

      return { ok: true, organization };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        error: "Erro ao atualizar organização",
      };
    }
  });
