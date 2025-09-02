"use client";

import { Contact } from "@/types/contact";
import { ColumnDef } from "@tanstack/react-table";
import ContactsTableActions from "./table-actions";
import { formatPhoneNumber } from "@/lib/utils";

export const contactsTableColumns: ColumnDef<Contact>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Nome",
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
    meta: {
      hideOnMobile: true,
    },
  },
  {
    id: "phoneNumber",
    accessorKey: "phoneNumber",
    header: "Telefone",
    cell: (params) => {
      const contact = params.row.original;
      return formatPhoneNumber(contact.phoneNumber);
    },
  },
  {
    id: "sex",
    accessorKey: "sex",
    header: "Sexo",
    cell: (params) => {
      const contact = params.row.original;
      return contact.sex === "MALE" ? "Masculino" : "Feminino";
    },
    meta: {
      hideOnTablet: true,
    },
  },
  {
    id: "actions",
    header: "Ações",
    cell: (params) => {
      const contact = params.row.original;
      return <ContactsTableActions contact={contact} />;
    },
  },
];
