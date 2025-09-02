"use server";

import { actionClient } from "@/lib/next-safe-action";
import { contactService } from "@/services/contact-service";
import { logger } from "@/lib/utils";
import { z } from "zod";

const deleteContactSchema = z.object({
  id: z.string().min(1, "ID é obrigatório"),
});

export const deleteContact = actionClient
  .inputSchema(deleteContactSchema)
  .action(async ({ parsedInput }) => {
    try {
      const contact = await contactService.update(parsedInput.id, {
        deletedAt: new Date(),
      });

      if (!contact) throw new Error("Contato não encontrado");

      return {
        ok: true,
        contact,
      };
    } catch (error) {
      logger.error("Erro ao deletar contato:", error);
      return {
        ok: false,
        error: "Erro ao deletar contato",
      };
    }
  });
