"use server";

import { actionClient } from "@/lib/next-safe-action";
import { officeUserService } from "@/services/office-user-service";
import { logger } from "@/lib/utils";
import { z } from "zod";

const getOfficeUsersByUserSchema = z.object({
  userId: z.string().uuid("ID do usuário inválido"),
});

export const getOfficeUsersByUser = actionClient
  .inputSchema(getOfficeUsersByUserSchema)
  .action(async ({ parsedInput }) => {
    try {
      const officeUsers = await officeUserService.getByUserId(
        parsedInput.userId
      );

      return { ok: true, officeUsers };
    } catch (error) {
      logger.error("Erro ao buscar offices do usuário:", error);
      return {
        ok: false,
        error: "Erro ao buscar offices do usuário",
      };
    }
  });
