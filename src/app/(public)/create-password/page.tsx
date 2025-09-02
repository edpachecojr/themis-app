import { Suspense } from "react";
import { CreatePasswordForm } from "./_components/create-password-form";

export default function CreatePassword() {
  return (
    <>
      <div className="text-center">
        <h1 className="text-3xl font-bold">Criar Senha</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Crie uma senha para acessar sua conta com email e senha
        </p>
      </div>

      <Suspense fallback={<div>Carregando...</div>}>
        <CreatePasswordForm />
      </Suspense>
    </>
  );
}
