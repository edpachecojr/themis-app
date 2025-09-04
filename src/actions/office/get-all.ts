"use server";

import { actionClient } from "@/lib/next-safe-action";
import { officeService } from "@/services/office-service";
import { logger } from "@/lib/utils";
import { officePaginationSchema } from "@/lib/validators/office-validator";

export const getOffices = actionClient
  .schema(officePaginationSchema)
  .action(async ({ parsedInput }) => {
    const result = await officeService.getAllPaginatedWithSearch(
      parsedInput.page,
      parsedInput.itemsPerPage,
      parsedInput.search
    );
    return { ok: true, ...result };
  });

export const getAllOffices = actionClient.action(async () => {
  try {
    const offices = await officeService.getAll();

    return {
      ok: true,
      offices,
    };
  } catch (error) {
    logger.error("Erro ao buscar offices:", error);
    return {
      ok: false,
      error: "Erro ao buscar offices",
    };
  }
});
