"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { getContactById } from "@/actions/contact/get";
import { Contact } from "@/types/contact";
import ContactForm from "../../_components/contact-form";
import { ContactFormSkeleton } from "../../_components/contact-form-skeleton";
import { ContactsProvider } from "@/contexts/contacts-context";

function ContactEditContent() {
  const params = useParams();
  const router = useRouter();
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const contactId = params.id as string;

  useEffect(() => {
    const loadContact = async () => {
      if (!contactId) return;

      setLoading(true);
      try {
        const response = await getContactById({ id: contactId });

        if (response.data?.ok && response.data.contact) {
          setContact(response.data.contact);
        } else {
          setError("Contato não encontrado");
        }
      } catch (err) {
        setError("Erro ao carregar dados do contato");
        console.error("Erro ao carregar contato:", err);
      } finally {
        setLoading(false);
      }
    };

    loadContact();
  }, [contactId]);

  const handleBack = () => {
    router.push(`/contacts/${contactId}`);
  };

  const handleSuccess = () => {
    router.push(`/contacts/${contactId}`);
  };

  if (loading) {
    return (
      <PageContainer>
        <PageHeader>
          <PageHeaderContent>
            <PageTitle>Carregando...</PageTitle>
            <PageDescription>
              Aguarde enquanto carregamos os dados
            </PageDescription>
          </PageHeaderContent>
          <PageActions>
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </PageActions>
        </PageHeader>
        <PageContent>
          <ContactFormSkeleton />
        </PageContent>
      </PageContainer>
    );
  }

  if (error || !contact) {
    return (
      <PageContainer>
        <PageContent>
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="text-muted-foreground">
              {error || "Contato não encontrado"}
            </div>
            <Button onClick={() => router.push("/contacts")} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para lista
            </Button>
          </div>
        </PageContent>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Editar Contato</PageTitle>
          <PageDescription>
            Edite as informações do contato {contact.name}
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </PageActions>
      </PageHeader>

      <PageContent>
        <ContactForm
          contact={contact}
          isEditMode={true}
          onSuccess={handleSuccess}
        />
      </PageContent>
    </PageContainer>
  );
}

export default function ContactEditPage() {
  return (
    <ContactsProvider>
      <ContactEditContent />
    </ContactsProvider>
  );
}
