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
