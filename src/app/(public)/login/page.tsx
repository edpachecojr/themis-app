import { LoginForm } from "./_components/login-form";
import { PublicLayout } from "@/components/layout/public";

export default function LoginPage() {
  return (
    <PublicLayout>
      <header className="bg-white/80 backdrop-blur-sm border-b border-primary-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-bold text-neutral-800">Themis</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              Bem-vindo de volta
            </h1>
            <p className="text-neutral-600">
              Entre na sua conta para continuar
            </p>
          </div>

          <LoginForm />

          <div className="text-center mt-6">
            <p className="text-neutral-600">
              Não tem uma conta?{" "}
              <a
                href="/register"
                className="font-medium text-primary-600 hover:text-primary-700 hover:underline"
              >
                Cadastre-se
              </a>
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-primary-100 bg-white/50 py-8 px-4 mt-auto">
        <div className="container mx-auto text-center">
          <p className="text-sm text-neutral-600">
            © 2024 Themis. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </PublicLayout>
  );
}
