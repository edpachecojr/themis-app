"use server";

import { actionClient } from "@/lib/next-safe-action";
import { revalidatePath } from "next/cache";
import { contactFormSchema } from "@/lib/validators/add-contact-validator";
import { ContactDto } from "@/types/dtos/contact/contact-dto";
import { contactService } from "@/services/contact-service";

export const addContact = actionClient
  .inputSchema(contactFormSchema)
  .action(async ({ parsedInput }) => {
    try {
      const inputDto: ContactDto = {
        name: parsedInput.name,
        email: parsedInput.email,
        phoneNumber: parsedInput.phoneNumber,
        sex: parsedInput.sex,
        address: parsedInput.address,
        neighborhood: parsedInput.neighborhood,
        city: parsedInput.city,
        state: parsedInput.state,
        zipCode: parsedInput.zipCode,
        number: parsedInput.number,
        complement: parsedInput.complement,
        dateOfBirth: parsedInput.dateOfBirth,
        // Campos parlamentares básicos
        cpf: parsedInput.cpf,
        rg: parsedInput.rg,
        voterId: parsedInput.voterId,
        maritalStatus: parsedInput.maritalStatus,
        occupation: parsedInput.occupation,
        education: parsedInput.education,
        income: parsedInput.income,
        politicalParty: parsedInput.politicalParty,
        isVoter: parsedInput.isVoter,
        votingZone: parsedInput.votingZone,
        votingSection: parsedInput.votingSection,
        // Informações de contato adicionais
        whatsapp: parsedInput.whatsapp,
        instagram: parsedInput.instagram,
        facebook: parsedInput.facebook,
        linkedin: parsedInput.linkedin,
        // Informações familiares
        spouseName: parsedInput.spouseName,
        childrenCount: parsedInput.childrenCount,
        dependents: parsedInput.dependents,
        // Informações de interesse político
        politicalInterests: parsedInput.politicalInterests,
        votingHistory: parsedInput.votingHistory,
        participationLevel: parsedInput.participationLevel,
        // Campos de segmentação
        ageGroup: parsedInput.ageGroup,
        socialClass: parsedInput.socialClass,
        urbanRural: parsedInput.urbanRural,
      };

      const contact = await contactService.create(inputDto);
      revalidatePath("/dashboard");
      revalidatePath("/contacts");

      return { ok: true, contact };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        error: "Erro ao criar contato",
      };
    }
  });
