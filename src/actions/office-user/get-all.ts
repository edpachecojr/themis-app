"use server";

import { actionClient } from "@/lib/next-safe-action";
import { officeUserService } from "@/services/office-user-service";
import { logger } from "@/lib/utils";
import { officeUserPaginationSchema } from "@/lib/validators/office-user-validator";

export const getOfficeUsers = actionClient
  .schema(officeUserPaginationSchema)
  .action(async ({ parsedInput }) => {
    const result = await officeUserService.getAllPaginated(
      parsedInput.page,
      parsedInput.itemsPerPage
    );
    return { ok: true, ...result };
  });

export const getAllOfficeUsers = actionClient.action(async () => {
  try {
    const officeUsers = await officeUserService.getAll();

    return {
      ok: true,
      officeUsers,
    };
  } catch (error) {
    logger.error("Erro ao buscar office users:", error);
    return {
      ok: false,
      error: "Erro ao buscar office users",
    };
  }
});
