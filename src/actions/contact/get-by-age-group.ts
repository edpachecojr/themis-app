"use server";

import { actionClient } from "@/lib/next-safe-action";
import { contactService } from "@/services/contact-service";
import { logger } from "@/lib/utils";
import { z } from "zod";
import { AgeGroup } from "@/types/contact";

const getByAgeGroupSchema = z.object({
  ageGroup: z.nativeEnum(AgeGroup, {
    message: "Faixa etária inválida",
  }),
});

export const getContactsByAgeGroup = actionClient
  .inputSchema(getByAgeGroupSchema)
  .action(async ({ parsedInput }) => {
    try {
      const contacts = await contactService.getByAgeGroup(parsedInput.ageGroup);

      return {
        ok: true,
        contacts,
        total: contacts.length,
        ageGroup: parsedInput.ageGroup,
      };
    } catch (error) {
      logger.error("Erro ao buscar contatos por faixa etária:", error);
      return {
        ok: false,
        error: "Erro ao buscar contatos por faixa etária",
      };
    }
  });
