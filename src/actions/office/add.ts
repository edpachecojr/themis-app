"use server";

import { actionClient } from "@/lib/next-safe-action";
import { revalidatePath } from "next/cache";
import { officeFormSchema } from "@/lib/validators/office-validator";
import { OfficeDto } from "@/types/dtos/office/office-dto";
import { officeService } from "@/services/office-service";

export const addOffice = actionClient
  .inputSchema(officeFormSchema)
  .action(async ({ parsedInput }) => {
    try {
      const inputDto: OfficeDto = {
        name: parsedInput.name,
        code: parsedInput.code,
        description: parsedInput.description,
        type: parsedInput.type,
        status: parsedInput.status,

        // Localização
        address: parsedInput.address,
        city: parsedInput.city,
        state: parsedInput.state,
        zipCode: parsedInput.zipCode,
        neighborhood: parsedInput.neighborhood,
        complement: parsedInput.complement,

        // Contato
        phone: parsedInput.phone,
        email: parsedInput.email,
        whatsapp: parsedInput.whatsapp,

        // Configurações
        capacity: parsedInput.capacity,
        maxUsers: parsedInput.maxUsers,
        openingHours: parsedInput.openingHours,
        isOpenOnWeekends: parsedInput.isOpenOnWeekends,
        metadata: parsedInput.metadata,
      };

      const office = await officeService.create(inputDto);
      revalidatePath("/dashboard");
      revalidatePath("/offices");

      return { ok: true, office };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        error: "Erro ao criar office",
      };
    }
  });
