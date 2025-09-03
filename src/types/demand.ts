import { DemandStatus, Priority } from "@prisma/client";

export interface Demand {
  id: string;
  protocolNumber: string;
  title: string;
  description?: string;
  contactId?: string;
  organizationId: string;
  status: DemandStatus;
  priority: Priority;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;

  // Relacionamentos opcionais (tipos básicos para evitar importações circulares)
  contact?: {
    id: string;
    name: string;
  };
  organization?: {
    id: string;
    name: string;
  };
  createdBy?: {
    id: string;
    name: string;
  };
  notes?: DemandNote[];
  tags?: DemandTag[];
}

// Types relacionados
export interface DemandNote {
  id: string;
  content: string;
  demandId: string;
  organizationId: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;

  // Relacionamentos opcionais
  demand?: Demand;
  organization?: {
    id: string;
    name: string;
  };
  createdBy?: {
    id: string;
    name: string;
  };
}

export interface DemandTag {
  id: string;
  name: string;
  color?: string; // Cor em formato hex (#FF0000)
  demandId: string;
  organizationId: string;
  createdAt: Date;

  // Relacionamentos opcionais
  demand?: Demand;
  organization?: {
    id: string;
    name: string;
  };
}

// Types para criação e atualização
export interface CreateDemandData {
  protocolNumber: string;
  title: string;
  description?: string;
  contactId?: string;
  organizationId: string;
  status?: DemandStatus;
  priority?: Priority;
  createdById: string;
}

export interface UpdateDemandData {
  title?: string;
  description?: string;
  contactId?: string;
  status?: DemandStatus;
  priority?: Priority;
}

export interface CreateDemandNoteData {
  content: string;
  demandId: string;
  organizationId: string;
  createdById: string;
}

export interface UpdateDemandNoteData {
  content: string;
}

export interface CreateDemandTagData {
  name: string;
  color?: string;
  demandId: string;
  organizationId: string;
}

export interface UpdateDemandTagData {
  name?: string;
  color?: string;
}

// Types para filtros e consultas
export interface DemandFilters {
  organizationId: string;
  status?: DemandStatus;
  priority?: Priority;
  contactId?: string;
  createdById?: string;
  search?: string;
}

export interface DemandListResponse {
  demands: Demand[];
  total: number;
  page: number;
  limit: number;
}
