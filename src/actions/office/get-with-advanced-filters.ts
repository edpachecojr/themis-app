"use server";

import { actionClient } from "@/lib/next-safe-action";
import { officeService } from "@/services/office-service";
import { logger } from "@/lib/utils";
import { officeAdvancedFiltersSchema } from "@/lib/validators/office-validator";

export const getOfficesWithAdvancedFilters = actionClient
  .inputSchema(officeAdvancedFiltersSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { page, itemsPerPage, ...filters } = parsedInput;

      const result = await officeService.getAllPaginatedWithAdvancedFilters(
        filters,
        page,
        itemsPerPage
      );

      return { ok: true, ...result };
    } catch (error) {
      logger.error("Erro ao buscar offices com filtros avançados:", error);
      return {
        ok: false,
        error: "Erro ao buscar offices com filtros avançados",
      };
    }
  });
