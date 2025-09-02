import { betterAuth } from "better-auth";
import { prisma } from "../db/prisma";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { v4 as uuidv4 } from "uuid";

// Configurar provedores sociais apenas se as credenciais estiverem disponíveis
const socialProviders: Record<
  string,
  { clientId: string; clientSecret: string }
> = {};

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  advanced: {
    database: {
      generateId: () => uuidv4(),
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders,
  // Configuração de callback URLs
  baseURL: process.env.NEXT_PUBLIC_URL || "http://localhost:3000",
  // Secret para criptografia (obrigatório em produção)
  secret:
    process.env.BETTER_AUTH_SECRET || "dev-secret-key-for-development-only",
});
