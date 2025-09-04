"use server";

import { actionClient } from "@/lib/next-safe-action";
import { officeService } from "@/services/office-service";
import { logger } from "@/lib/utils";

export const getOfficeStats = actionClient.action(async () => {
  try {
    const stats = await officeService.getOfficeStats();

    return {
      ok: true,
      stats,
    };
  } catch (error) {
    logger.error("Erro ao buscar estatísticas de offices:", error);
    return {
      ok: false,
      error: "Erro ao buscar estatísticas de offices",
    };
  }
});
