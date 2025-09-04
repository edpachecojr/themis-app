"use server";

import { actionClient } from "@/lib/next-safe-action";
import { officeUpdateSchema } from "@/lib/validators/office-validator";
import { officeService } from "@/services/office-service";
import { revalidatePath } from "next/cache";

export const updateOffice = actionClient
  .inputSchema(officeUpdateSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { id, ...updateData } = parsedInput;

      // Mapear todos os campos possíveis para atualização
      const mappedUpdateData = {
        ...updateData,
        // Campos básicos já estão incluídos automaticamente
        // Campos específicos serão incluídos se fornecidos
      };

      const office = await officeService.update(id, mappedUpdateData);

      if (!office) {
        return { ok: false, error: "Office não encontrado" };
      }

      revalidatePath("/dashboard");
      revalidatePath("/offices");

      return { ok: true, office };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        error: "Erro ao atualizar office",
      };
    }
  });
