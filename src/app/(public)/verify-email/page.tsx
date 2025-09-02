import { Suspense } from "react";
import { VerifyEmailForm } from "./_components/verify-email-form";

export default function VerifyEmail() {
  return (
    <>
      <div className="text-center">
        <h1 className="text-3xl font-bold">Verificar Email</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Digite o código de 6 dígitos gerado para seu email
        </p>
      </div>

      <Suspense fallback={<div>Carregando...</div>}>
        <VerifyEmailForm />
      </Suspense>
    </>
  );
}
