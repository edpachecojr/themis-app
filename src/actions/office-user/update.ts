"use server";

import { actionClient } from "@/lib/next-safe-action";
import { officeUserUpdateSchema } from "@/lib/validators/office-user-validator";
import { officeUserService } from "@/services/office-user-service";
import { revalidatePath } from "next/cache";

export const updateOfficeUser = actionClient
  .inputSchema(officeUserUpdateSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { id, ...updateData } = parsedInput;

      // Mapear todos os campos possíveis para atualização
      const mappedUpdateData = {
        ...updateData,
        // Campos básicos já estão incluídos automaticamente
        // Campos específicos serão incluídos se fornecidos
      };

      const officeUser = await officeUserService.update(id, mappedUpdateData);

      if (!officeUser) {
        return { ok: false, error: "Office user não encontrado" };
      }

      revalidatePath("/dashboard");
      revalidatePath("/office-users");

      return { ok: true, officeUser };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        error: "Erro ao atualizar office user",
      };
    }
  });
