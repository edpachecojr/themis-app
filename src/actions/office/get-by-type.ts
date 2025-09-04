"use server";

import { actionClient } from "@/lib/next-safe-action";
import { officeService } from "@/services/office-service";
import { logger } from "@/lib/utils";
import { z } from "zod";
import { OfficeType } from "@/types/office";

const getOfficesByTypeSchema = z.object({
  type: z.nativeEnum(OfficeType, {
    message: "Tipo é obrigatório.",
  }),
});

export const getOfficesByType = actionClient
  .inputSchema(getOfficesByTypeSchema)
  .action(async ({ parsedInput }) => {
    try {
      const offices = await officeService.getByType(parsedInput.type);

      return { ok: true, offices };
    } catch (error) {
      logger.error("Erro ao buscar offices por tipo:", error);
      return {
        ok: false,
        error: "Erro ao buscar offices por tipo",
      };
    }
  });
