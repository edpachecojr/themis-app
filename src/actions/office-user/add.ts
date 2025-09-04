"use server";

import { actionClient } from "@/lib/next-safe-action";
import { revalidatePath } from "next/cache";
import { officeUserFormSchema } from "@/lib/validators/office-user-validator";
import { OfficeUserDto } from "@/types/dtos/office/office-user-dto";
import { officeUserService } from "@/services/office-user-service";

export const addOfficeUser = actionClient
  .inputSchema(officeUserFormSchema)
  .action(async ({ parsedInput }) => {
    try {
      const inputDto: OfficeUserDto = {
        userId: parsedInput.userId,
        officeId: parsedInput.officeId,
        role: parsedInput.role,
        permissions: parsedInput.permissions,
        isActive: parsedInput.isActive,
        accessStartDate: parsedInput.accessStartDate,
        accessEndDate: parsedInput.accessEndDate,
      };

      const officeUser = await officeUserService.create(inputDto);
      revalidatePath("/dashboard");
      revalidatePath("/office-users");

      return { ok: true, officeUser };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        error: "Erro ao adicionar usuário ao office",
      };
    }
  });
