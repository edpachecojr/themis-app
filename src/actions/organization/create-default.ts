"use server";

import { actionClient } from "@/lib/next-safe-action";
import { organizationService } from "@/services/organization-service";
import { z } from "zod";

const createDefaultOrganizationSchema = z.object({
  userId: z.string().uuid("ID de usuário inválido"),
});

export const createDefaultOrganization = actionClient
  .inputSchema(createDefaultOrganizationSchema)
  .action(async () => {
    try {
      const organization = await organizationService.createOrganization({
        name: "Minha Organização",
        description: "Organização padrão criada automaticamente",
        status: "ACTIVE",
      });

      return { ok: true, organization };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        error: "Erro ao criar organização padrão",
      };
    }
  });
