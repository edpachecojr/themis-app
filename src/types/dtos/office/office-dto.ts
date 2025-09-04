import { OfficeType, OfficeStatus } from "../../office";

// ========================================
// DTOs PARA OFFICE
// ========================================

export interface OfficeDto {
  name: string;
  code: string;
  description?: string;
  type: OfficeType;
  status?: OfficeStatus;

  // Localização
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  neighborhood?: string;
  complement?: string;

  // Contato
  phone?: string;
  email?: string;
  whatsapp?: string;

  // Configurações
  capacity?: number;
  maxUsers?: number;
  openingHours?: string;
  isOpenOnWeekends?: boolean;
  metadata?: Record<string, any>;
}

export interface UpdateOfficeDto {
  name?: string;
  code?: string;
  description?: string;
  type?: OfficeType;
  status?: OfficeStatus;

  // Localização
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  neighborhood?: string;
  complement?: string;

  // Contato
  phone?: string;
  email?: string;
  whatsapp?: string;

  // Configurações
  capacity?: number;
  maxUsers?: number;
  openingHours?: string;
  isOpenOnWeekends?: boolean;
  metadata?: Record<string, any>;
}

// ========================================
// DTOs PARA FILTROS
// ========================================

export interface OfficeFiltersDto {
  name?: string;
  code?: string;
  type?: OfficeType;
  status?: OfficeStatus;
  city?: string;
  state?: string;
  search?: string;
}

// ========================================
// DTOs PARA VALIDAÇÃO
// ========================================

export interface OfficeValidationDto {
  name: string;
  code: string;
  type: OfficeType;
  email?: string;
  zipCode?: string;
  maxUsers?: number;
  capacity?: number;
}

// ========================================
// DTOs PARA RELATÓRIOS
// ========================================

export interface OfficeReportDto {
  officeId: string;
  includeUsers?: boolean;
  includeDemands?: boolean;
  includeStats?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
}
