"use server";

import { actionClient } from "@/lib/next-safe-action";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";

const checkUserExistsSchema = z.object({
  email: z.string().email("Email inválido"),
});

export const checkUserExists = actionClient
  .schema(checkUserExistsSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { email } = parsedInput;

      // Verificar se o usuário já existe
      const existingUser = await prisma.user.findUnique({
        where: { email },
        include: {
          accounts: true,
        },
      });

      if (!existingUser) {
        return {
          ok: true,
          exists: false,
        };
      }

      // Verificar se já tem conta com email/senha
      const hasEmailPassword = existingUser.accounts.some(
        (account) => account.providerId === "email"
      );

      return {
        ok: true,
        exists: true,
        hasEmailPassword,
        userId: existingUser.id,
      };
    } catch (error) {
      console.error("Error checking user exists:", error);
      return {
        ok: false,
        error: "Erro ao verificar usuário",
      };
    }
  });
