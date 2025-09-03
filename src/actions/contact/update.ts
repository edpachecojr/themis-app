"use server";

import { actionClient } from "@/lib/next-safe-action";
import { contactUpdateSchema } from "@/lib/validators/add-contact-validator";
import { contactService } from "@/services/contact-service";
import { revalidatePath } from "next/cache";

export const updateContact = actionClient
  .inputSchema(contactUpdateSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { id, ...updateData } = parsedInput;

      // Mapear todos os campos possíveis para atualização
      const mappedUpdateData = {
        ...updateData,
        // Campos básicos já estão incluídos automaticamente
        // Campos parlamentares serão incluídos se fornecidos
      };

      const contact = await contactService.update(id, mappedUpdateData);

      if (!contact) {
        return { ok: false, error: "Contato não encontrado" };
      }

      revalidatePath("/dashboard");
      revalidatePath("/contacts");

      return { ok: true, contact };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        error: "Erro ao atualizar contato",
      };
    }
  });
