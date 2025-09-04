"use server";

import { actionClient } from "@/lib/next-safe-action";
import { officeUserService } from "@/services/office-user-service";
import { logger } from "@/lib/utils";

export const getOfficeUserStats = actionClient.action(async () => {
  try {
    const stats = await officeUserService.getOfficeUserStats();

    return {
      ok: true,
      stats,
    };
  } catch (error) {
    logger.error("Erro ao buscar estatísticas de office users:", error);
    return {
      ok: false,
      error: "Erro ao buscar estatísticas de office users",
    };
  }
});
