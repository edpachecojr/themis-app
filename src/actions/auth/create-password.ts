"use server";

import { actionClient } from "@/lib/next-safe-action";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";
import { logger } from "@/lib/utils";

const createPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
});

export const createPasswordForUser = actionClient
  .schema(createPasswordSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { email, password } = parsedInput;

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

      // Criar conta de email/senha usando bcrypt
      const hashedPassword = await bcrypt.hash(password, 12);

      await prisma.account.create({
        data: {
          id: crypto.randomUUID(),
          accountId: email,
          providerId: "email",
          userId: existingUser.id,
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      await prisma.user.update({
        where: { email },
        data: {
          emailVerified: true,
        },
      });

      return { ok: true, message: "Senha criada com sucesso" };
    } catch (error) {
      logger.error("Error creating password:", error);
      return {
        ok: false,
        error: "Erro ao criar senha",
      };
    }
  });
