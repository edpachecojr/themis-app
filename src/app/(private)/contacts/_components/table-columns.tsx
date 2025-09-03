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
    id: "cpf",
    accessorKey: "cpf",
    header: "CPF",
    cell: (params) => {
      const contact = params.row.original;
      return contact.cpf || "-";
    },
    meta: {
      hideOnMobile: true,
    },
  },
  {
    id: "politicalParty",
    accessorKey: "politicalParty",
    header: "Partido",
    cell: (params) => {
      const contact = params.row.original;
      return contact.politicalParty || "-";
    },
    meta: {
      hideOnTablet: true,
    },
  },
  {
    id: "isVoter",
    accessorKey: "isVoter",
    header: "Eleitor",
    cell: (params) => {
      const contact = params.row.original;
      return contact.isVoter ? "Sim" : "Não";
    },
    meta: {
      hideOnTablet: true,
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
    id: "city",
    accessorKey: "city",
    header: "Cidade",
    cell: (params) => {
      const contact = params.row.original;
      return contact.city || "-";
    },
    meta: {
      hideOnMobile: true,
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
