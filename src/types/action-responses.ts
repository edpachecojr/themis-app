import { Contact } from "./contact";

export interface ActionResponse<T = unknown> {
  ok: boolean;
  data?: T;
  error?: string;
}

// Tipos específicos para actions de contact usando o tipo genérico
export type ContactActionResponse = ActionResponse<Contact>;
export type ContactsActionResponse = ActionResponse<Contact[]>;
