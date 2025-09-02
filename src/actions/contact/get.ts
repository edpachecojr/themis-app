"use server";

import { actionClient } from "@/lib/next-safe-action";
import { contactService } from "@/services/contact-service";
import { logger } from "@/lib/utils";
import { z } from "zod";

const getContactByIdSchema = z.object({
  id: z.string().min(1, "ID é obrigatório"),
});

export const getContactById = actionClient
  .inputSchema(getContactByIdSchema)
  .action(async ({ parsedInput }) => {
    try {
      const contact = await contactService.getById(parsedInput.id);

      if (!contact) {
        return { ok: false, error: "Contato não encontrado" };
      }

      return { ok: true, contact };
    } catch (error) {
      logger.error("Erro ao buscar contato:", error);
      return {
        ok: false,
        error: "Erro ao buscar contato",
      };
    }
  });
