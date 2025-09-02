import { OrganizationStatus } from "@prisma/client";

export type OrganizationDto = {
  id?: string;
  name: string;
  description?: string;
  status?: OrganizationStatus;
  owner?: string;
  deletedAt?: Date; // Exclusão lógica
};
