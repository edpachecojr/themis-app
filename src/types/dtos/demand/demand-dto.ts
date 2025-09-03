import { DemandStatus, Priority } from "@prisma/client";

export type DemandDto = {
  id?: string;
  protocolNumber: string;
  title: string;
  description?: string;
  contactId?: string;
  organizationId: string;
  status?: DemandStatus;
  priority?: Priority;
  createdById: string;
};

export type DemandUpdateDto = {
  title?: string;
  description?: string;
  contactId?: string;
  status?: DemandStatus;
  priority?: Priority;
};

export type DemandNoteDto = {
  id?: string;
  content: string;
  demandId: string;
  organizationId: string;
  createdById: string;
};

export type DemandNoteUpdateDto = {
  content: string;
};

export type DemandTagDto = {
  id?: string;
  name: string;
  color?: string;
  demandId: string;
  organizationId: string;
};

export type DemandTagUpdateDto = {
  name?: string;
  color?: string;
};
