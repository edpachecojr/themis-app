"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

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
import ContactForm from "../_components/contact-form";
import { ContactsProvider } from "@/contexts/contacts-context";

function NewContactContent() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/contacts");
  };

  const handleSuccess = () => {
    router.push("/contacts");
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Novo Contato</PageTitle>
          <PageDescription>Cadastre um novo contato no sistema</PageDescription>
        </PageHeaderContent>
        <PageActions>
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </PageActions>
      </PageHeader>
      <PageContent>
        <ContactForm isEditMode={false} onSuccess={handleSuccess} />
      </PageContent>
    </PageContainer>
  );
}

export default function NewContactPage() {
  return (
    <ContactsProvider>
      <NewContactContent />
    </ContactsProvider>
  );
}
