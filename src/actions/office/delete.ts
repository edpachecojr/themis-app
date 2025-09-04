"use server";

import { actionClient } from "@/lib/next-safe-action";
import { officeService } from "@/services/office-service";
import { logger } from "@/lib/utils";
import { officeIdSchema } from "@/lib/validators/office-validator";
import { revalidatePath } from "next/cache";

export const deleteOffice = actionClient
  .inputSchema(officeIdSchema)
  .action(async ({ parsedInput }) => {
    try {
      const success = await officeService.delete(parsedInput.id);

      if (!success) {
        return { ok: false, error: "Office não encontrado" };
      }

      revalidatePath("/dashboard");
      revalidatePath("/offices");

      return {
        ok: true,
        message: "Office deletado com sucesso",
      };
    } catch (error) {
      logger.error("Erro ao deletar office:", error);
      return {
        ok: false,
        error: "Erro ao deletar office",
      };
    }
  });
