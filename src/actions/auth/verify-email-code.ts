"use server";

import { actionClient } from "@/lib/next-safe-action";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";

const verifyEmailCodeSchema = z.object({
  email: z.string().email("Email inválido"),
  code: z.string().length(6, "Código deve ter 6 dígitos"),
});

export const verifyEmailCode = actionClient
  .schema(verifyEmailCodeSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { email, code } = parsedInput;

      // Buscar código de verificação
      const verification = await prisma.verification.findUnique({
        where: {
          identifier: email,
        },
      });

      if (!verification) {
        return {
          ok: false,
          error: "Código de verificação não encontrado",
        };
      }

      // Verificar se o código expirou
      if (new Date() > verification.expiresAt) {
        // Remover código expirado
        await prisma.verification.delete({
          where: { id: verification.id },
        });

        return {
          ok: false,
          error: "Código de verificação expirado",
        };
      }

      // Verificar se o código está correto
      if (verification.value !== code) {
        return {
          ok: false,
          error: "Código de verificação inválido",
        };
      }

      // Verificar se o usuário existe
      const existingUser = await prisma.user.findUnique({
        where: { email },
        include: {
          accounts: true,
        },
      });

      if (!existingUser) {
        return {
          ok: false,
          error: "Usuário não encontrado",
        };
      }

      // Verificar se já tem conta com email/senha
      const hasEmailPassword = existingUser.accounts.some(
        (account) => account.providerId === "email"
      );

      if (hasEmailPassword) {
        return {
          ok: false,
          error: "Usuário já possui senha cadastrada",
        };
      }

      // Remover código usado
      await prisma.verification.delete({
        where: { id: verification.id },
      });

      return {
        ok: true,
        message: "Código verificado com sucesso",
        userId: existingUser.id,
      };
    } catch (error) {
      console.error("Error verifying email code:", error);
      return {
        ok: false,
        error: "Erro ao verificar código",
      };
    }
  });
