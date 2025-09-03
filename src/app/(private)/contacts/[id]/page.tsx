"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Calendar,
  Phone,
  MapPin,
  User,
  Info,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/card";
// import { Badge } from "@/components/badge";
import { getContactById } from "@/actions/contact/get";
import { Contact } from "@/types/contact";
import { ContactViewSkeleton } from "../_components/contact-view-skeleton";
import { formatPhoneNumber } from "@/lib/utils";

export default function ContactViewPage() {
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

  const handleEdit = () => {
    router.push(`/contacts/${contactId}/edit`);
  };

  const handleBack = () => {
    router.push("/contacts");
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "Não informado";
    return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const getGenderLabel = (gender: string | null) => {
    switch (gender?.toUpperCase()) {
      case "MALE":
        return "Masculino";
      case "FEMALE":
        return "Feminino";
      default:
        return "Não informado";
    }
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
          <ContactViewSkeleton />
        </PageContent>
      </PageContainer>
    );
  }

  if (error || !contact) {
    return (
      <PageContainer>
        <PageHeader>
          <PageHeaderContent>
            <PageTitle>Erro</PageTitle>
            <PageDescription>
              Não foi possível carregar o contato
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
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                <Info className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium">{error}</p>
                <p className="text-sm mt-2">
                  Verifique se o ID do contato está correto ou tente novamente.
                </p>
              </div>
            </CardContent>
          </Card>
        </PageContent>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>{contact.name}</PageTitle>
          <PageDescription>Detalhes do contato</PageDescription>
        </PageHeaderContent>
        <PageActions>
          <Button onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </PageActions>
      </PageHeader>
      <PageContent>
        <div className="grid gap-6">
          {/* Informações Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Nome
                  </label>
                  <p className="text-sm">{contact.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Data de Nascimento
                  </label>
                  <p className="text-sm">{formatDate(contact.dateOfBirth)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Sexo
                  </label>
                  <p className="text-sm">{getGenderLabel(contact.sex)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Telefone
                  </label>
                  <p className="text-sm flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {formatPhoneNumber(contact.phoneNumber)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações Parlamentares */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2H3a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                Informações Parlamentares
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    CPF
                  </label>
                  <p className="text-sm">{contact.cpf || "Não informado"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    RG
                  </label>
                  <p className="text-sm">{contact.rg || "Não informado"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Título de Eleitor
                  </label>
                  <p className="text-sm">
                    {contact.voterId || "Não informado"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Partido Político
                  </label>
                  <p className="text-sm">
                    {contact.politicalParty || "Não informado"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Status de Eleitor
                  </label>
                  <p className="text-sm">
                    {contact.isVoter ? "Eleitor Ativo" : "Não Eleitor"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Zona Eleitoral
                  </label>
                  <p className="text-sm">
                    {contact.votingZone || "Não informado"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Seção Eleitoral
                  </label>
                  <p className="text-sm">
                    {contact.votingSection || "Não informado"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Profissão/Ocupação
                  </label>
                  <p className="text-sm">
                    {contact.occupation || "Não informado"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Endereço */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Endereço
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    CEP
                  </label>
                  <p className="text-sm">
                    {contact.zipCode || "Não informado"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Endereço
                  </label>
                  <p className="text-sm">
                    {contact.address || "Não informado"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Número
                  </label>
                  <p className="text-sm">{contact.number || "Não informado"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Complemento
                  </label>
                  <p className="text-sm">
                    {contact.complement || "Não informado"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Bairro
                  </label>
                  <p className="text-sm">
                    {contact.neighborhood || "Não informado"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Cidade
                  </label>
                  <p className="text-sm">{contact.city || "Não informado"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Estado
                  </label>
                  <p className="text-sm">{contact.state || "Não informado"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações de Contato e Redes Sociais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
                Informações de Contato e Redes Sociais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Email
                  </label>
                  <p className="text-sm">{contact.email || "Não informado"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    WhatsApp
                  </label>
                  <p className="text-sm">
                    {contact.whatsapp || "Não informado"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Instagram
                  </label>
                  <p className="text-sm">
                    {contact.instagram || "Não informado"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Facebook
                  </label>
                  <p className="text-sm">
                    {contact.facebook || "Não informado"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    LinkedIn
                  </label>
                  <p className="text-sm">
                    {contact.linkedin || "Não informado"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações do Sistema */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Informações do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Data de Criação
                  </label>
                  <p className="text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(contact.createdAt)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Última Atualização
                  </label>
                  <p className="text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(contact.updatedAt)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContent>
    </PageContainer>
  );
}
