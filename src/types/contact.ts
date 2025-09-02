import { Gender } from "@prisma/client";

export interface Contact {
  id: string;
  name: string;
  email: string | undefined;
  zipCode: string | undefined;
  address: string | undefined;
  neighborhood: string | undefined;
  city: string | undefined;
  state: string | undefined;
  number: string | undefined;
  complement: string | undefined;
  dateOfBirth: Date | undefined;
  createdAt: Date;
  createdBy: string | undefined;
  updatedBy: string | undefined;
  updatedAt: Date | undefined;
  phoneNumber: string;
  sex: Gender;
  deletedAt?: Date; // Exclusão lógica
  organizationId: string; // Campo para multi-tenancy por organização
}
