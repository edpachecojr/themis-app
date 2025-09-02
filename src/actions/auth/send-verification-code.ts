"use server";

import { actionClient } from "@/lib/next-safe-action";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { logger } from "@/lib/utils";

const sendVerificationCodeSchema = z.object({
  email: z.string().email("Email inválido"),
});

export const sendVerificationCode = actionClient
  .schema(sendVerificationCodeSchema)
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

      // Gerar código de 6 dígitos
      const verificationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      // Salvar código no banco (com expiração de 10 minutos)
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

      await prisma.verification.upsert({
        where: {
          identifier: email,
        },
        update: {
          value: verificationCode,
          expiresAt,
        },
        create: {
          id: crypto.randomUUID(),
          identifier: email,
          value: verificationCode,
          expiresAt,
        },
      });

      return {
        ok: true,
        message: "Código de verificação gerado com sucesso",
      };
    } catch (error) {
      logger.error("Error sending verification code:", error);
      return {
        ok: false,
        error: "Erro ao enviar código de verificação",
      };
    }
  });
