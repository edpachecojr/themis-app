import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return "Não informado";

  // Remove todos os caracteres não numéricos
  const cleaned = phone.replace(/\D/g, "");

  // Formata como (XX) XXXXX-XXXX
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(
      7
    )}`;
  }

  // Formata como (XX) XXXX-XXXX para números de 10 dígitos
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(
      6
    )}`;
  }

  // Retorna o número original se não conseguir formatar
  return phone;
}

// Funções de logging para produção
export const logger = {
  error: (message: string, error?: unknown) => {
    if (process.env.NODE_ENV === "development") {
      console.error(message, error);
    }
    // Em produção, você pode enviar para um serviço de logging como Sentry, LogRocket, etc.
  },
  warn: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV === "development") {
      console.warn(message, data);
    }
  },
  info: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV === "development") {
      console.info(message, data);
    }
  },
};
