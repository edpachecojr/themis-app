"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Home, Search, MapPin, Compass } from "lucide-react";

import { PageContainer, PageContent } from "@/components/layout/page-container";
import { Button } from "@/components/button";
import { Card, CardContent } from "@/components/card";

export default function NotFound() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/dashboard");
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <PageContainer>
      <PageContent>
        <div className="flex flex-col items-center justify-center py-16">
          <Card className="w-full max-w-2xl">
            <CardContent className="flex flex-col items-center text-center p-12">
              {/* 404 com elementos lúdicos */}
              <div className="relative mb-8">
                <div className="text-8xl font-bold text-muted-foreground/20 relative">
                  404
                  <div className="absolute -top-4 -right-4 text-2xl animate-bounce">
                    🚀
                  </div>
                  <div className="absolute -bottom-4 -left-4 text-2xl animate-pulse">
                    🌌
                  </div>
                </div>
                <div className="absolute inset-0 m-auto flex items-center justify-center">
                  <div className="relative">
                    <Search className="h-16 w-16 text-primary-400 animate-pulse" />
                    <div className="absolute -top-2 -right-2 text-lg animate-spin">
                      🔍
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-neutral-800 mb-4">
                Página não encontrada
              </h2>

              <p className="text-lg text-neutral-600 mb-8 max-w-lg">
                Nossa equipe de detetives digitais está investigando o caso, mas
                parece que esta página
                <span className="font-semibold text-primary-600">
                  {" "}
                  desapareceu no universo da internet
                </span>
                .
              </p>

              {/* Seção lúdica com sugestões */}
              <div className="bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 rounded-lg p-6 mb-8 w-full">
                <h3 className="text-lg font-semibold text-primary-800 mb-4 flex items-center justify-center gap-2">
                  <Compass className="h-5 w-5" />
                  Possíveis teorias sobre o desaparecimento:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-primary-700">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">🕵️</span>
                    <div>
                      <strong>Teoria do Detetive:</strong> A página está em
                      missão secreta
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-lg">🌍</span>
                    <div>
                      <strong>Teoria do Viajante:</strong> Ela foi para o espaço
                      sideral
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-lg">☕</span>
                    <div>
                      <strong>Teoria do Café:</strong> Está tomando uma pausa
                      para café
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-lg">🎭</span>
                    <div>
                      <strong>Teoria do Artista:</strong> Está ensaiando para um
                      novo show
                    </div>
                  </div>
                </div>
              </div>

              {/* Mensagem de ajuda */}
              <div className="bg-tertiary-blue/10 border border-tertiary-blue/20 rounded-lg p-4 mb-8 w-full">
                <div className="flex items-center gap-2 text-tertiary-blue mb-2">
                  <MapPin className="h-4 w-4" />
                  <span className="font-medium">Dica de navegação:</span>
                </div>
                <p className="text-sm text-tertiary-blue">
                  Enquanto nossa equipe procura a página perdida, que tal
                  explorar outras áreas do sistema? Temos muitas funcionalidades
                  interessantes esperando por você!
                </p>
              </div>

              {/* Botões de ação */}
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                <Button
                  variant="outline"
                  onClick={handleGoBack}
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
                <Button onClick={handleGoHome} className="flex-1">
                  <Home className="mr-2 h-4 w-4" />
                  Ir para o Início
                </Button>
              </div>

              {/* Footer lúdico */}
              <div className="mt-8 text-xs text-neutral-500">
                <p>
                  💡{" "}
                  <em>
                    Dica: Se você continuar vendo esta página, tente recarregar
                    ou verificar o endereço.
                  </em>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContent>
    </PageContainer>
  );
}
