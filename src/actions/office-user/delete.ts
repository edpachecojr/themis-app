"use server";

import { actionClient } from "@/lib/next-safe-action";
import { officeUserService } from "@/services/office-user-service";
import { logger } from "@/lib/utils";
import { officeUserIdSchema } from "@/lib/validators/office-user-validator";
import { revalidatePath } from "next/cache";

export const deleteOfficeUser = actionClient
  .inputSchema(officeUserIdSchema)
  .action(async ({ parsedInput }) => {
    try {
      const success = await officeUserService.delete(parsedInput.id);

      if (!success) {
        return { ok: false, error: "Office user não encontrado" };
      }

      revalidatePath("/dashboard");
      revalidatePath("/office-users");

      return {
        ok: true,
        message: "Office user removido com sucesso",
      };
    } catch (error) {
      logger.error("Erro ao deletar office user:", error);
      return {
        ok: false,
        error: "Erro ao deletar office user",
      };
    }
  });
