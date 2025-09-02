"use client";

import { Button } from "@/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form";
import { Input } from "@/components/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { toast } from "sonner";
import { verifyEmailCode } from "@/actions/auth/verify-email-code";
import { sendVerificationCode } from "@/actions/auth/send-verification-code";

const verifyEmailSchema = z.object({
  code: z
    .string()
    .length(6, { message: "O código deve ter exatamente 6 dígitos" })
    .regex(/^\d{6}$/, { message: "O código deve conter apenas números" }),
});

type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;

export function VerifyEmailForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const form = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      code: "",
    },
  });

  const sendCode = useCallback(async () => {
    if (!email) return;

    setIsSendingCode(true);
    try {
      const result = await sendVerificationCode({ email });
      if (result.data?.ok) {
        setCodeSent(true);
        toast.success("Código gerado! Verifique o console do servidor.");
      } else {
        toast.error(result.data?.error || "Erro ao gerar código");
      }
    } catch {
      toast.error("Erro ao gerar código");
    } finally {
      setIsSendingCode(false);
    }
  }, [email]);

  // Gerar código automaticamente quando a página carrega
  useEffect(() => {
    if (email && !codeSent) {
      sendCode();
    }
  }, [email, codeSent, sendCode]);

  async function onSubmit(formData: VerifyEmailFormValues) {
    if (!email) {
      toast.error("Email não encontrado");
      return;
    }

    setIsLoading(true);

    try {
      const result = await verifyEmailCode({
        email,
        code: formData.code,
      });

      if (result.data?.ok) {
        toast.success("Email verificado com sucesso!");
        // Redirecionar para criação de senha
        router.push(`/create-password?email=${encodeURIComponent(email)}`);
      } else {
        toast.error(result.data?.error || "Código inválido");
      }
    } catch {
      toast.error("Erro ao verificar código");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código de Verificação</FormLabel>
              <FormControl>
                <Input
                  placeholder="123456"
                  maxLength={6}
                  {...field}
                  disabled={isLoading}
                  className="text-center text-lg tracking-widest"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verificando...
            </>
          ) : (
            "Verificar Código"
          )}
        </Button>

        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Não conseguiu ver o código?
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={sendCode}
            disabled={isSendingCode}
          >
            {isSendingCode ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando...
              </>
            ) : (
              "Gerar Novo Código"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
