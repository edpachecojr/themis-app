export type ContactDto = {
  id?: string;
  name: string;
  phoneNumber: string;
  address?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  number?: string;
  complement?: string;
  dateOfBirth?: Date | undefined;
  sex: "MALE" | "FEMALE";
  deletedAt?: Date; // Exclusão lógica
};
