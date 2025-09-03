"use server";

import { actionClient } from "@/lib/next-safe-action";
import { contactService } from "@/services/contact-service";
import { logger } from "@/lib/utils";
import { z } from "zod";
import {
  EducationLevel,
  AgeGroup,
  SocialClass,
  UrbanRural,
} from "@/types/contact";

// O service adiciona automaticamente o organizationId através do withOrganizationIsolation

const advancedFiltersSchema = z.object({
  page: z.number().min(1).default(1),
  itemsPerPage: z.number().min(1).max(100).default(10),
  // Filtros básicos
  name: z.string().optional(),
  email: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  // Filtros parlamentares
  cpf: z.string().optional(),
  voterId: z.string().optional(),
  politicalParty: z.string().optional(),
  education: z.nativeEnum(EducationLevel).optional(),
  ageGroup: z.nativeEnum(AgeGroup).optional(),
  socialClass: z.nativeEnum(SocialClass).optional(),
  urbanRural: z.nativeEnum(UrbanRural).optional(),
  isVoter: z.boolean().optional(),
  // Busca geral
  search: z.string().optional(),
});

export const getContactsWithAdvancedFilters = actionClient
  .inputSchema(advancedFiltersSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { page, itemsPerPage, ...filters } = parsedInput;

      // O service adiciona automaticamente o organizationId através do withOrganizationIsolation
      const result = await contactService.getAllPaginatedWithAdvancedFilters(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        filters as any, // Cast necessário pois o service adiciona organizationId automaticamente
        page,
        itemsPerPage
      );

      return {
        ok: true,
        ...result,
      };
    } catch (error) {
      logger.error("Erro ao buscar contatos com filtros avançados:", error);
      return {
        ok: false,
        error: "Erro ao buscar contatos com filtros avançados",
      };
    }
  });
