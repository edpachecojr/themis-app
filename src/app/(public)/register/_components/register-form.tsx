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
import { EyeOff, Eye, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { authClient } from "@/lib/authentication/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createDefaultOrganization } from "@/actions/organization/create-default";
import { GoogleLogoIcon } from "@phosphor-icons/react";
import React from "react";
import { checkUserExists } from "@/actions/auth/check-user-exists";

const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
    email: z.string().email({ message: "Email inválido" }),
    password: z
      .string()
      .min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
    confirmPassword: z.string().min(8, {
      message: "A confirmação de senha deve ter pelo menos 8 caracteres",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const router = useRouter();

  // Função para criar organização padrão
  const createDefaultOrgForUser = async () => {
    try {
      // Aguardar um pouco para garantir que o usuário foi criado
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Obter o usuário atual para criar a organização padrão
      const session = await authClient.getSession();
      if (session?.data?.user?.id) {
        // Criar organização padrão
        const result = await createDefaultOrganization({
          userId: session.data.user.id,
        });

        if (result.data?.ok) {
          return {
            success: true,
            message:
              "Cadastro realizado com sucesso! Organização padrão criada.",
          };
        } else {
          return { success: true, message: "Cadastro realizado com sucesso!" };
        }
      } else {
        return { success: true, message: "Cadastro realizado com sucesso!" };
      }
    } catch (error) {
      console.error("Error creating default organization:", error);
      return { success: true, message: "Cadastro realizado com sucesso!" };
    }
  };

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(formData: RegisterFormValues) {
    setShowOverlay(true);
    setIsLoading(true);

    try {
      // Primeiro, verificar se o usuário já existe
      const userCheck = await checkUserExists({ email: formData.email });

      if (userCheck.data?.exists) {
        setIsLoading(false);
        setShowOverlay(false);

        if (userCheck.data.hasEmailPassword) {
          toast.error("Usuário já possui senha cadastrada. Faça login.");
          router.push("/login");
        } else {
          toast.info(
            "Usuário já existe. Redirecionando para verificação de email..."
          );
          setTimeout(() => {
            router.push(
              `/verify-email?email=${encodeURIComponent(formData.email)}`
            );
          }, 1500);
        }
        return;
      }

      // Se não existe, prosseguir com o registro
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data: _data, error: _error } = await authClient.signUp.email(
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          callbackURL: "/dashboard",
        },
        {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          onRequest: (_ctx) => {
            // Loading já foi iniciado
          },
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          onSuccess: async (_ctx) => {
            const result = await createDefaultOrgForUser();
            setIsLoading(false);

            // Exibir toast
            if (result.success) {
              toast.success(result.message);
            }

            // Redirecionar imediatamente - o overlay permanecerá até a navegação
            router.replace("/dashboard");
          },
          onError: (error) => {
            setIsLoading(false);
            setShowOverlay(false);

            // Debug: log do erro para entender a estrutura
            console.log("Erro de registro:", error);

            // Verificar se é erro de usuário já existente
            if (
              error?.error?.code === "USER_ALREADY_EXISTS" ||
              error?.error?.message?.includes("existing email") ||
              error?.error?.message?.includes("already exists")
            ) {
              toast.info(
                "Usuário já existe. Redirecionando para verificação de email..."
              );
              // Redirecionar para verificação de email
              setTimeout(() => {
                router.push(
                  `/verify-email?email=${encodeURIComponent(formData.email)}`
                );
              }, 1500);
            } else {
              toast.error("Erro ao cadastrar. Verifique seus dados.");
            }
          },
        }
      );
    } catch {
      toast.error("Erro ao cadastrar. Verifique seus dados.");
      setIsLoading(false);
      setShowOverlay(false);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Seu nome completo"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="seu@email.com"
                    type="email"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      {...field}
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Esconder senha" : "Mostrar senha"}
                      </span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar Senha</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="••••••••"
                      type={showConfirmPassword ? "text" : "password"}
                      {...field}
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="sr-only">
                        {showConfirmPassword
                          ? "Esconder senha"
                          : "Mostrar senha"}
                      </span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            disabled={isLoading}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cadastrando...
              </>
            ) : (
              "Cadastrar"
            )}
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-primary-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gradient-to-br from-primary-50 to-primary-100 px-2 text-neutral-600">
                Ou continue com
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full bg-white text-neutral-700 hover:bg-primary-50 hover:text-primary-600 border-primary-200 hover:border-primary-300 transition-all duration-300"
            disabled={isGoogleLoading}
            onClick={async () => {
              setShowOverlay(true);
              setIsGoogleLoading(true);
              try {
                await authClient.signIn.social({
                  provider: "google",
                  callbackURL: "/dashboard",
                });
                // O overlay permanecerá ativo até o redirecionamento
                // A organização padrão será criada após o redirecionamento
                // através do callback ou hook de autenticação
              } catch {
                toast.error("Erro ao cadastrar com Google");
                setIsGoogleLoading(false);
                setShowOverlay(false);
              }
            }}
          >
            {isGoogleLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cadastrando...
              </>
            ) : (
              <>
                <GoogleLogoIcon className="mr-2 h-4 w-4" />
                Cadastrar com Google
              </>
            )}
          </Button>
        </form>
      </Form>

      {/* Overlay de bloqueio */}
      {showOverlay && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center min-h-screen">
          <div className="bg-white rounded-2xl p-8 shadow-xl max-w-sm w-full mx-4 text-center border border-primary-100">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
              <h3 className="text-lg font-semibold text-neutral-800">
                Aguarde um momento
              </h3>
              <p className="text-sm text-neutral-600">
                Enquanto preparamos tudo para você...
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
