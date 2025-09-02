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

      <Card className="max-w-4xl mx-auto">
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
                          Nome do paciente{" "}
                          <span className="text-tertiary-red">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite o nome completo do paciente"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
