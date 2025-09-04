"use server";

import { actionClient } from "@/lib/next-safe-action";
import { officeService } from "@/services/office-service";
import { logger } from "@/lib/utils";
import { officeIdSchema } from "@/lib/validators/office-validator";

export const getOfficeById = actionClient
  .inputSchema(officeIdSchema)
  .action(async ({ parsedInput }) => {
    try {
      const office = await officeService.getById(parsedInput.id);

      if (!office) {
        return { ok: false, error: "Office não encontrado" };
      }

      return { ok: true, office };
    } catch (error) {
      logger.error("Erro ao buscar office:", error);
      return {
        ok: false,
        error: "Erro ao buscar office",
      };
    }
  });
