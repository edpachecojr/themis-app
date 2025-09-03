"use server";

import { actionClient } from "@/lib/next-safe-action";
import { contactService } from "@/services/contact-service";
import { logger } from "@/lib/utils";
import { z } from "zod";

const getByPoliticalInterestsSchema = z.object({
  interests: z
    .array(z.string())
    .min(1, "Pelo menos um interesse deve ser fornecido"),
});

export const getContactsByPoliticalInterests = actionClient
  .inputSchema(getByPoliticalInterestsSchema)
  .action(async ({ parsedInput }) => {
    try {
      const contacts = await contactService.getByPoliticalInterests(
        parsedInput.interests
      );

      return {
        ok: true,
        contacts,
        total: contacts.length,
        interests: parsedInput.interests,
      };
    } catch (error) {
      logger.error("Erro ao buscar contatos por interesses políticos:", error);
      return {
        ok: false,
        error: "Erro ao buscar contatos por interesses políticos",
      };
    }
  });
