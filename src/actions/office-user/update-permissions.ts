"use server";

import { actionClient } from "@/lib/next-safe-action";
import { officeUserService } from "@/services/office-user-service";
import { logger } from "@/lib/utils";
import { officeUserPermissionsSchema } from "@/lib/validators/office-user-validator";
import { revalidatePath } from "next/cache";

export const updateUserPermissions = actionClient
  .inputSchema(officeUserPermissionsSchema)
  .action(async ({ parsedInput }) => {
    try {
      const success = await officeUserService.updateUserPermissions({
        userId: parsedInput.userId,
        officeId: parsedInput.officeId,
        permissions: parsedInput.permissions,
      });

      if (!success) {
        return { ok: false, error: "Erro ao atualizar permissões do usuário" };
      }

      revalidatePath("/dashboard");
      revalidatePath("/office-users");

      return {
        ok: true,
        message: "Permissões atualizadas com sucesso",
      };
    } catch (error) {
      logger.error("Erro ao atualizar permissões:", error);
      return {
        ok: false,
        error: "Erro ao atualizar permissões",
      };
    }
  });
