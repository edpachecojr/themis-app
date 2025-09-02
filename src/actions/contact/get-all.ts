"use server";

import { actionClient } from "@/lib/next-safe-action";
import { contactService } from "@/services/contact-service";
import { logger } from "@/lib/utils";
import { z } from "zod";

const getContactsSchema = z.object({
  page: z.number().min(1).default(1),
  itemsPerPage: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
});

export const getContacts = actionClient
  .schema(getContactsSchema)
  .action(async ({ parsedInput }) => {
    const result = await contactService.getAllPaginatedWithSearch(
      parsedInput.page,
      parsedInput.itemsPerPage,
      parsedInput.search
    );
    return { ok: true, ...result };
  });

export const getAllContacts = actionClient.action(async () => {
  try {
    const contacts = await contactService.getAll();

    return {
      ok: true,
      contacts,
    };
  } catch (error) {
    logger.error("Erro ao buscar contatos:", error);
    return {
      ok: false,
      error: "Erro ao buscar contatos",
    };
  }
});
