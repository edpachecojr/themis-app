"use server";

import { actionClient } from "@/lib/next-safe-action";
import { contactService } from "@/services/contact-service";
import { logger } from "@/lib/utils";
import { z } from "zod";

const getByPoliticalPartySchema = z.object({
  politicalParty: z.string().min(1, "Partido político é obrigatório"),
});

export const getContactsByPoliticalParty = actionClient
  .inputSchema(getByPoliticalPartySchema)
  .action(async ({ parsedInput }) => {
    try {
      const contacts = await contactService.getByPoliticalParty(
        parsedInput.politicalParty
      );

      return {
        ok: true,
        contacts,
        total: contacts.length,
      };
    } catch (error) {
      logger.error("Erro ao buscar contatos por partido político:", error);
      return {
        ok: false,
        error: "Erro ao buscar contatos por partido político",
      };
    }
  });
