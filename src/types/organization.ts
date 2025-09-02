import { OrganizationStatus } from "@prisma/client";

export interface Organization {
  id: string;
  name: string;
  description: string | undefined;
  status: OrganizationStatus;
  owner: string;
  createdAt: Date;
  createdBy: string | undefined;
  updatedAt: Date;
  updatedBy: string | undefined;
  deletedAt?: Date; // Exclusão lógica
}
