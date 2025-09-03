"use server";

import { actionClient } from "@/lib/next-safe-action";
import { contactService } from "@/services/contact-service";
import { logger } from "@/lib/utils";
import { z } from "zod";

const getByVoterStatusSchema = z.object({
  isVoter: z.boolean({
    message: "Status de eleitor deve ser true ou false",
  }),
});

export const getContactsByVoterStatus = actionClient
  .inputSchema(getByVoterStatusSchema)
  .action(async ({ parsedInput }) => {
    try {
      const contacts = await contactService.getByVoterStatus(
        parsedInput.isVoter
      );

      return {
        ok: true,
        contacts,
        total: contacts.length,
        isVoter: parsedInput.isVoter,
        status: parsedInput.isVoter ? "Eleitores Ativos" : "Não Eleitores",
      };
    } catch (error) {
      logger.error("Erro ao buscar contatos por status de eleitor:", error);
      return {
        ok: false,
        error: "Erro ao buscar contatos por status de eleitor",
      };
    }
  });
