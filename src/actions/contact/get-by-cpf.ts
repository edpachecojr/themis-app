"use server";

import { actionClient } from "@/lib/next-safe-action";
import { contactService } from "@/services/contact-service";
import { logger } from "@/lib/utils";
import { z } from "zod";

const getByCpfSchema = z.object({
  cpf: z
    .string()
    .min(11, "CPF deve ter pelo menos 11 dígitos")
    .max(14, "CPF deve ter no máximo 14 dígitos"),
});

export const getContactByCpf = actionClient
  .inputSchema(getByCpfSchema)
  .action(async ({ parsedInput }) => {
    try {
      const contact = await contactService.getByCpf(parsedInput.cpf);

      if (!contact) {
        return { ok: false, error: "Contato não encontrado" };
      }

      return { ok: true, contact };
    } catch (error) {
      logger.error("Erro ao buscar contato por CPF:", error);
      return {
        ok: false,
        error: "Erro ao buscar contato por CPF",
      };
    }
  });
