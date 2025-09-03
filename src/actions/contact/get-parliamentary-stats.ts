"use server";

import { actionClient } from "@/lib/next-safe-action";
import { contactService } from "@/services/contact-service";
import { logger } from "@/lib/utils";

export const getParliamentaryStats = actionClient.action(async () => {
  try {
    const stats = await contactService.getParliamentaryStats();

    return {
      ok: true,
      stats,
    };
  } catch (error) {
    logger.error("Erro ao buscar estatísticas parlamentares:", error);
    return {
      ok: false,
      error: "Erro ao buscar estatísticas parlamentares",
    };
  }
});
