"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/input";
import { PatternFormat } from "react-number-format";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";
import { Button } from "@/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { ContactDto } from "@/types/dtos/contact/contact-dto";
import { format } from "date-fns";
import { fetchAddressByCep } from "@/services/cep-service";
import { useAddContactAction } from "@/hooks/use-add-contact-action";
import { useUpdateContactAction } from "@/hooks/use-update-contact-action";
import {
  ContactFormSchema,
  contactFormSchema,
} from "@/lib/validators/add-contact-validator";
import { User, MapPin } from "lucide-react";
import { LoadingOverlay } from "@/components/loading-overlay";

interface ContactFormProps {
  isOpen?: boolean;
  contact?: ContactDto;
  isEditMode?: boolean;
  onSuccess: () => void;
}

export default function ContactForm({
  contact,
  isEditMode = false,
  onSuccess,
}: ContactFormProps) {
  const addContactAction = useAddContactAction(onSuccess);
  const updateContactAction = useUpdateContactAction(onSuccess);
  const [cepLoading, setCepLoading] = useState(false);
  const numberInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ContactFormSchema>({
    shouldUnregister: true,
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: contact?.name ?? "",
      email: contact?.email ?? "",
      phoneNumber: contact?.phoneNumber ?? "",
      address: contact?.address ?? "",
      neighborhood: contact?.neighborhood ?? "",
      city: contact?.city ?? "",
      state: contact?.state ?? "",
      zipCode: contact?.zipCode ?? "",
      number: contact?.number ?? "",
      complement: contact?.complement ?? "",
      dateOfBirth: contact?.dateOfBirth ?? undefined,
      sex: contact?.sex ?? undefined,
      // Campos parlamentares básicos
      cpf: contact?.cpf ?? "",
      rg: contact?.rg ?? "",
      voterId: contact?.voterId ?? "",
      maritalStatus: contact?.maritalStatus ?? undefined,
      occupation: contact?.occupation ?? "",
      education: contact?.education ?? undefined,
      income: contact?.income ?? "",
      politicalParty: contact?.politicalParty ?? "",
      isVoter: contact?.isVoter ?? true,
      votingZone: contact?.votingZone ?? "",
      votingSection: contact?.votingSection ?? "",
      // Informações de contato adicionais
      whatsapp: contact?.whatsapp ?? "",
      instagram: contact?.instagram ?? "",
      facebook: contact?.facebook ?? "",
      linkedin: contact?.linkedin ?? "",
      // Informações familiares
      spouseName: contact?.spouseName ?? "",
      childrenCount: contact?.childrenCount ?? undefined,
      dependents: contact?.dependents ?? undefined,
      // Informações de interesse político
      politicalInterests: contact?.politicalInterests ?? [],
      votingHistory: contact?.votingHistory ?? [],
      participationLevel: contact?.participationLevel ?? undefined,
      // Campos de segmentação
      ageGroup: contact?.ageGroup ?? undefined,
      socialClass: contact?.socialClass ?? undefined,
      urbanRural: contact?.urbanRural ?? undefined,
    },
  });

  useEffect(() => {
    if (contact) {
      form.reset(contact);
    }
  }, [contact, form]);

  const onSubmit = (values: ContactFormSchema) => {
    if (isEditMode && contact) {
      console.log(contact.id, values);
      updateContactAction.execute({
        id: contact.id as string,
        ...values,
      });
    } else {
      addContactAction.execute(values);
    }
  };

  const handleCepChange = async (cep: string) => {
    form.setValue("zipCode", cep);
    if (cep.replace(/\D/g, "").length === 8) {
      setCepLoading(true);
      const addressData = await fetchAddressByCep(cep);
      setCepLoading(false);
      if (addressData) {
        form.setValue("address", addressData.address ?? "");
        form.setValue("neighborhood", addressData.neighborhood ?? "");
        form.setValue("city", addressData.city ?? "");
        form.setValue("state", addressData.state ?? "");

        setTimeout(() => {
          numberInputRef.current?.focus();
        }, 500);
      }
    }
  };

  const isSubmitting =
    addContactAction.isPending || updateContactAction.isPending;

  return (
    <>
      <LoadingOverlay
        isVisible={isSubmitting}
        title={isEditMode ? "Atualizando contato..." : "Criando contato..."}
        message="Aguarde enquanto salvamos as informações..."
      />

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            {isEditMode ? "Editar Contato" : "Novo Contato"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Seção: Informações Pessoais */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Informações Pessoais
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Nome completo{" "}
                          <span className="text-tertiary-red">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite o nome completo"
                            {...field}
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
                            type="email"
                            placeholder="email@exemplo.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de nascimento</FormLabel>
                        <FormControl>
                          <PatternFormat
                            format="##/##/####"
                            mask="_"
                            placeholder="dd/mm/aaaa"
                            value={
                              field.value
                                ? format(field.value, "dd/MM/yyyy")
                                : ""
                            }
                            onValueChange={(value) => {
                              if (value.value.length === 8) {
                                const day = value.value.slice(0, 2);
                                const month = value.value.slice(2, 4);
                                const year = value.value.slice(4, 8);
                                const dateStr = `${year}-${month}-${day}T00:00:00-03:00`;
                                const date = new Date(dateStr);
                                field.onChange(date);
                              } else {
                                field.onChange(undefined);
                              }
                            }}
                            customInput={Input}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sex"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sexo *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o sexo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="MALE">Masculino</SelectItem>
                            <SelectItem value="FEMALE">Feminino</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Número de telefone{" "}
                          <span className="text-tertiary-red">*</span>
                        </FormLabel>
                        <FormControl>
                          <PatternFormat
                            format="(##) #####-####"
                            mask="_"
                            placeholder="(11) 99999-9999"
                            value={field.value}
                            onValueChange={(value) => {
                              field.onChange(value.value);
                            }}
                            customInput={Input}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cpf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPF</FormLabel>
                        <FormControl>
                          <PatternFormat
                            format="###.###.###-##"
                            mask="_"
                            placeholder="000.000.000-00"
                            value={field.value}
                            onValueChange={(value) => {
                              field.onChange(value.value);
                            }}
                            customInput={Input}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Seção: Endereço */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Endereço
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CEP</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <PatternFormat
                              format="#####-###"
                              mask="_"
                              placeholder="00000-000"
                              value={field.value}
                              onValueChange={(value) => {
                                field.onChange(value.value);
                                handleCepChange(value.value);
                              }}
                              customInput={Input}
                            />
                            {cepLoading && (
                              <span className="animate-spin">
                                <svg
                                  className="w-4 h-4"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  />
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8z"
                                  />
                                </svg>
                              </span>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Endereço</FormLabel>
                        <FormControl>
                          <Input placeholder="Endereço" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Número"
                            {...field}
                            ref={numberInputRef}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="complement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Complemento</FormLabel>
                        <FormControl>
                          <Input placeholder="Complemento" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="neighborhood"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bairro</FormLabel>
                        <FormControl>
                          <Input placeholder="Bairro" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade</FormLabel>
                        <FormControl>
                          <Input placeholder="Cidade" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <FormControl>
                          <Input placeholder="Estado" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Seção: Informações Parlamentares */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                  <svg
                    className="h-4 w-4 text-muted-foreground"
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
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Informações Parlamentares
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="rg"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>RG</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite o RG" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="voterId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título de Eleitor</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite o título de eleitor"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="politicalParty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Partido Político</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite o partido político"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="occupation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profissão/Ocupação</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite a profissão" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="votingZone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zona Eleitoral</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite a zona eleitoral"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="votingSection"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Seção Eleitoral</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite a seção eleitoral"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="isVoter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status de Eleitor</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(value === "true")
                          }
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="true">Eleitor Ativo</SelectItem>
                            <SelectItem value="false">Não Eleitor</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="income"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Faixa de Renda</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite a faixa de renda"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Seção: Redes Sociais */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                  <svg
                    className="h-4 w-4 text-muted-foreground"
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
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Redes Sociais
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="whatsapp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>WhatsApp</FormLabel>
                        <FormControl>
                          <PatternFormat
                            format="(##) #####-####"
                            mask="_"
                            placeholder="(11) 99999-9999"
                            value={field.value}
                            onValueChange={(value) => {
                              field.onChange(value.value);
                            }}
                            customInput={Input}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="instagram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram</FormLabel>
                        <FormControl>
                          <Input placeholder="@usuario" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="facebook"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facebook</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome do usuário" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="linkedin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn</FormLabel>
                        <FormControl>
                          <Input placeholder="URL do perfil" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Seção: Segmentação e Demografia */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                  <svg
                    className="h-4 w-4 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Segmentação e Demografia
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="ageGroup"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Faixa Etária</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a faixa etária" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="UNDER_18">
                              Menor de 18 anos
                            </SelectItem>
                            <SelectItem value="AGE_18_25">
                              18 a 25 anos
                            </SelectItem>
                            <SelectItem value="AGE_26_35">
                              26 a 35 anos
                            </SelectItem>
                            <SelectItem value="AGE_36_45">
                              36 a 45 anos
                            </SelectItem>
                            <SelectItem value="AGE_46_55">
                              46 a 55 anos
                            </SelectItem>
                            <SelectItem value="AGE_56_65">
                              56 a 65 anos
                            </SelectItem>
                            <SelectItem value="OVER_65">
                              Acima de 65 anos
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="socialClass"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Classe Social</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a classe social" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="CLASS_A">Classe A</SelectItem>
                            <SelectItem value="CLASS_B">Classe B</SelectItem>
                            <SelectItem value="CLASS_C">Classe C</SelectItem>
                            <SelectItem value="CLASS_D">Classe D</SelectItem>
                            <SelectItem value="CLASS_E">Classe E</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="education"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nível de Educação</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o nível de educação" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ILLITERATE">
                              Analfabeto
                            </SelectItem>
                            <SelectItem value="INCOMPLETE_ELEMENTARY">
                              Fundamental Incompleto
                            </SelectItem>
                            <SelectItem value="COMPLETE_ELEMENTARY">
                              Fundamental Completo
                            </SelectItem>
                            <SelectItem value="INCOMPLETE_HIGH_SCHOOL">
                              Médio Incompleto
                            </SelectItem>
                            <SelectItem value="COMPLETE_HIGH_SCHOOL">
                              Médio Completo
                            </SelectItem>
                            <SelectItem value="INCOMPLETE_COLLEGE">
                              Superior Incompleto
                            </SelectItem>
                            <SelectItem value="COMPLETE_COLLEGE">
                              Superior Completo
                            </SelectItem>
                            <SelectItem value="GRADUATE">Graduado</SelectItem>
                            <SelectItem value="MASTERS">Mestrado</SelectItem>
                            <SelectItem value="DOCTORATE">Doutorado</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="urbanRural"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Área</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a área" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="URBAN">Urbana</SelectItem>
                            <SelectItem value="RURAL">Rural</SelectItem>
                            <SelectItem value="PERIURBAN">
                              Periurbana
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="maritalStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado Civil</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o estado civil" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="SINGLE">Solteiro(a)</SelectItem>
                            <SelectItem value="MARRIED">Casado(a)</SelectItem>
                            <SelectItem value="DIVORCED">
                              Divorciado(a)
                            </SelectItem>
                            <SelectItem value="WIDOWED">Viúvo(a)</SelectItem>
                            <SelectItem value="SEPARATED">
                              Separado(a)
                            </SelectItem>
                            <SelectItem value="CIVIL_UNION">
                              União Estável
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="participationLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nível de Participação Política</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o nível de participação" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="VERY_LOW">
                              Muito Baixo
                            </SelectItem>
                            <SelectItem value="LOW">Baixo</SelectItem>
                            <SelectItem value="MEDIUM">Médio</SelectItem>
                            <SelectItem value="HIGH">Alto</SelectItem>
                            <SelectItem value="VERY_HIGH">
                              Muito Alto
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Seção: Informações Familiares */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                  <svg
                    className="h-4 w-4 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Informações Familiares
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="spouseName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Cônjuge</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite o nome do cônjuge"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="childrenCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de Filhos</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? parseInt(e.target.value)
                                  : undefined
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dependents"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de Dependentes</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? parseInt(e.target.value)
                                  : undefined
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Botões */}
              <div className="flex justify-end gap-4 pt-4 border-t border-border/50">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-w-[140px]"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                          />
                        </svg>
                      </span>
                      {isEditMode ? "Salvando..." : "Criando..."}
                    </>
                  ) : (
                    "Salvar"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
