"use server";

import { actionClient } from "@/lib/next-safe-action";
import { organizationService } from "@/services/organization-service";

export const getAllOrganizations = actionClient.action(async () => {
  try {
    const organizations = await organizationService.getAll();

    return {
      ok: true,
      organizations,
    };
  } catch {
    return {
      ok: false,
      error: "Erro ao buscar organizações",
    };
  }
});
