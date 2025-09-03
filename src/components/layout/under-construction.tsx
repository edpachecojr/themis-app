"use client";

import {
  Construction,
  Home,
  ArrowLeft,
  FileText,
  Activity,
  Settings,
  Building2,
  Table,
  Palette,
  CreditCard,
} from "lucide-react";
import { useRouter } from "next/navigation";

import {
  PageContainer,
  PageHeader,
  PageHeaderContent,
  PageTitle,
  PageDescription,
  PageActions,
  PageContent,
} from "@/components/layout/page-container";
import { Button } from "@/components/button";
import { Card, CardContent } from "@/components/card";

interface UnderConstructionProps {
  title?: string;
  description?: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
  iconName?: string;
}

const iconMap = {
  FileText,
  Activity,
  Settings,
  Building2,
  Table,
  Palette,
  Home,
  Construction,
  CreditCard,
};

export function UnderConstruction({
  title = "Página em Construção",
  description = "Esta funcionalidade está sendo desenvolvida e estará disponível em breve.",
  showBackButton = true,
  showHomeButton = true,
  iconName = "Construction",
}: UnderConstructionProps) {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/dashboard");
  };

  const handleGoBack = () => {
    router.back();
  };

  const IconComponent =
    iconMap[iconName as keyof typeof iconMap] || Construction;

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>{title}</PageTitle>
          <PageDescription>{description}</PageDescription>
        </PageHeaderContent>
        {(showBackButton || showHomeButton) && (
          <PageActions>
            {showBackButton && (
              <Button variant="outline" onClick={handleGoBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            )}
            {showHomeButton && (
              <Button onClick={handleGoHome}>
                <Home className="mr-2 h-4 w-4" />
                Início
              </Button>
            )}
          </PageActions>
        )}
      </PageHeader>

      <PageContent>
        <div className="flex justify-center">
          <Card className="w-full max-w-2xl">
            <CardContent className="flex flex-col items-center text-center p-12">
              <div className="relative mb-8">
                <div className="h-24 w-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mb-6">
                  <IconComponent className="h-12 w-12 text-primary-600" />
                </div>
                <div className="absolute -top-2 -right-2 h-8 w-8 bg-gradient-to-r from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">🚧</span>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-neutral-800 mb-4">
                {title}
              </h2>

              <p className="text-lg text-neutral-600 mb-8 max-w-md">
                {description}
              </p>

              <div className="bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 rounded-lg p-6 mb-8 w-full">
                <h3 className="text-lg font-semibold text-primary-800 mb-3">
                  🚀 Em Desenvolvimento
                </h3>
                <p className="text-sm text-primary-700">
                  Esta funcionalidade está sendo desenvolvida e estará
                  disponível em breve.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                {showBackButton && (
                  <Button
                    variant="outline"
                    onClick={handleGoBack}
                    className="flex-1"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                  </Button>
                )}
                {showHomeButton && (
                  <Button onClick={handleGoHome} className="flex-1">
                    <Home className="mr-2 h-4 w-4" />
                    Ir para o Início
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContent>
    </PageContainer>
  );
}
