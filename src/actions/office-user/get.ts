"use server";

import { actionClient } from "@/lib/next-safe-action";
import { officeUserService } from "@/services/office-user-service";
import { logger } from "@/lib/utils";
import { officeUserIdSchema } from "@/lib/validators/office-user-validator";

export const getOfficeUserById = actionClient
  .inputSchema(officeUserIdSchema)
  .action(async ({ parsedInput }) => {
    try {
      const officeUser = await officeUserService.getById(parsedInput.id);

      if (!officeUser) {
        return { ok: false, error: "Office user não encontrado" };
      }

      return { ok: true, officeUser };
    } catch (error) {
      logger.error("Erro ao buscar office user:", error);
      return {
        ok: false,
        error: "Erro ao buscar office user",
      };
    }
  });
