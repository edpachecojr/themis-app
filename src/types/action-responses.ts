import {
  Contact,
  ContactListResponse,
  CreateContactData,
  UpdateContactData,
  ContactFilters,
} from "./contact";
import { Demand, DemandNote, DemandTag } from "./demand";

export interface ActionResponse<T = unknown> {
  ok: boolean;
  data?: T;
  error?: string;
}

// Tipos específicos para actions de contact usando o tipo genérico
export type ContactActionResponse = ActionResponse<Contact>;
export type ContactsActionResponse = ActionResponse<Contact[]>;
export type ContactListActionResponse = ActionResponse<ContactListResponse>;
export type CreateContactActionResponse = ActionResponse<CreateContactData>;
export type UpdateContactActionResponse = ActionResponse<UpdateContactData>;
export type ContactFiltersActionResponse = ActionResponse<ContactFilters>;

// Tipos específicos para actions de demand usando o tipo genérico
export type DemandActionResponse = ActionResponse<Demand>;
export type DemandsActionResponse = ActionResponse<Demand[]>;
export type DemandNoteActionResponse = ActionResponse<DemandNote>;
export type DemandNotesActionResponse = ActionResponse<DemandNote[]>;
export type DemandTagActionResponse = ActionResponse<DemandTag>;
export type DemandTagsActionResponse = ActionResponse<DemandTag[]>;
export type DemandListActionResponse = ActionResponse<{
  demands: Demand[];
  total: number;
  page: number;
  limit: number;
}>;
