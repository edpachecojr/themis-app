import { OfficeRole } from "../../office";

// ========================================
// DTOs PARA OFFICE USER
// ========================================

export interface OfficeUserDto {
  userId: string;
  officeId: string;
  role?: OfficeRole;
  permissions?: string[];
  isActive?: boolean;
  accessStartDate?: Date;
  accessEndDate?: Date;
}

export interface UpdateOfficeUserDto {
  role?: OfficeRole;
  permissions?: string[];
  isActive?: boolean;
  accessStartDate?: Date;
  accessEndDate?: Date;
}

// ========================================
// DTOs PARA FILTROS
// ========================================

export interface OfficeUserFiltersDto {
  userId?: string;
  officeId?: string;
  role?: OfficeRole;
  isActive?: boolean;
  search?: string;
}

// ========================================
// DTOs PARA VALIDAÇÃO
// ========================================

export interface OfficeUserValidationDto {
  userId: string;
  officeId: string;
  role?: OfficeRole;
  accessStartDate?: Date;
  accessEndDate?: Date;
}

// ========================================
// DTOs PARA PERMISSÕES
// ========================================

export interface OfficeUserPermissionsDto {
  userId: string;
  officeId: string;
  permissions: string[];
}

export interface OfficeUserAccessDto {
  userId: string;
  officeId: string;
  isActive: boolean;
  accessEndDate?: Date;
}

// ========================================
// DTOs PARA RELATÓRIOS
// ========================================

export interface OfficeUserReportDto {
  userId?: string;
  officeId?: string;
  includeOffices?: boolean;
  includePermissions?: boolean;
  includeActivity?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
}
