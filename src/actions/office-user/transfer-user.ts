"use server";

import { actionClient } from "@/lib/next-safe-action";
import { officeUserService } from "@/services/office-user-service";
import { logger } from "@/lib/utils";
import { transferUserSchema } from "@/lib/validators/office-user-validator";
import { revalidatePath } from "next/cache";

export const transferUserBetweenOffices = actionClient
  .inputSchema(transferUserSchema)
  .action(async ({ parsedInput }) => {
    try {
      const success = await officeUserService.transferUserBetweenOffices(
        parsedInput.userId,
        parsedInput.fromOfficeId,
        parsedInput.toOfficeId,
        parsedInput.role
      );

      if (!success) {
        return { ok: false, error: "Erro ao transferir usuário entre offices" };
      }

      revalidatePath("/dashboard");
      revalidatePath("/office-users");

      return {
        ok: true,
        message: "Usuário transferido com sucesso",
      };
    } catch (error) {
      logger.error("Erro ao transferir usuário:", error);
      return {
        ok: false,
        error: "Erro ao transferir usuário",
      };
    }
  });
