"use client";

import { Button } from "@/components/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/form";
import { Input } from "@/components/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { GoogleLogoIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
import { authClient } from "@/lib/authentication/client";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(formData: LoginFormValues) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data: _data, error: _error } = await authClient.signIn.email(
      {
        email: formData.email,
        password: formData.password,
        callbackURL: "/dashboard",
      },
      {
        onRequest: () => setIsLoading(true),
        onSuccess: () => {
          toast.success("Bem-vindo de volta!");
          setIsLoading(false);
          router.push("/dashboard");
        },
        onError: (ctx) => {
          setIsLoading(false);
          toast.error(
            ctx.error.code === "INVALID_EMAIL_OR_PASSWORD"
              ? "Email ou senha inválidos"
              : "Erro ao fazer login"
          );
        },
      }
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="seu@email.com"
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
                    placeholder="senha"
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

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Entrando...
            </>
          ) : (
            "Entrar"
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
          onClick={async () => {
            await authClient.signIn.social({
              provider: "google",
              callbackURL: "/dashboard",
            });
          }}
        >
          <GoogleLogoIcon className="mr-2 h-4 w-4" />
          Entrar com Google
        </Button>
      </form>
    </Form>
  );
}
