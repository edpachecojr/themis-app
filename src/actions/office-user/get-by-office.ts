"use server";

import { actionClient } from "@/lib/next-safe-action";
import { officeUserService } from "@/services/office-user-service";
import { logger } from "@/lib/utils";
import { z } from "zod";

const getOfficeUsersByOfficeSchema = z.object({
  officeId: z.string().uuid("ID do office inválido"),
});

export const getOfficeUsersByOffice = actionClient
  .inputSchema(getOfficeUsersByOfficeSchema)
  .action(async ({ parsedInput }) => {
    try {
      const officeUsers = await officeUserService.getByOfficeId(
        parsedInput.officeId
      );

      return { ok: true, officeUsers };
    } catch (error) {
      logger.error("Erro ao buscar usuários do office:", error);
      return {
        ok: false,
        error: "Erro ao buscar usuários do office",
      };
    }
  });
