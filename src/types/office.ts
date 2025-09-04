// Enums para Office (definidos manualmente para evitar dependência do Prisma Client)
export enum OfficeType {
  MAIN_OFFICE = "MAIN_OFFICE",
  REGIONAL_OFFICE = "REGIONAL_OFFICE",
  SERVICE_CENTER = "SERVICE_CENTER",
  SPECIALIZED_UNIT = "SPECIALIZED_UNIT",
  CONSULTATION_ROOM = "CONSULTATION_ROOM",
  EMERGENCY_ROOM = "EMERGENCY_ROOM",
  WARD = "WARD",
  SURGERY_ROOM = "SURGERY_ROOM",
  LABORATORY = "LABORATORY",
  IMAGING_CENTER = "IMAGING_CENTER",
}

export enum OfficeStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
  MAINTENANCE = "MAINTENANCE",
}

export enum OfficeRole {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  SUPERVISOR = "SUPERVISOR",
  STAFF = "STAFF",
  SPECIALIST = "SPECIALIST",
  RECEPTIONIST = "RECEPTIONIST",
  INTERN = "INTERN",
  VOLUNTEER = "VOLUNTEER",
  OTHER = "OTHER",
}

// ========================================
// TIPOS PARA OFFICE
// ========================================

export interface Office {
  id: string;
  name: string;
  code: string;
  description?: string;
  type: OfficeType;
  status: OfficeStatus;

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
  maxUsers: number;
  openingHours?: string;
  isOpenOnWeekends: boolean;
  metadata?: Record<string, any>;

  // Timestamps
  createdAt: Date;
  createdBy?: string;
  updatedAt: Date;
  updatedBy?: string;
  deletedAt?: Date;

  // Relacionamentos
  organizationId: string;
  officeUsers?: OfficeUser[];
  demands?: any[]; // Demand[] - evitando dependência circular
}

// ========================================
// TIPOS PARA OFFICE USER
// ========================================

export interface OfficeUser {
  id: string;
  userId: string;
  officeId: string;

  // Permissões
  role: OfficeRole;
  permissions: string[];
  isActive: boolean;

  // Controle temporal
  accessStartDate: Date;
  accessEndDate?: Date;

  // Timestamps
  createdAt: Date;
  createdBy?: string;
  updatedAt: Date;
  updatedBy?: string;

  // Relacionamentos
  office?: Office;
}

// ========================================
// TIPOS PARA CRIAÇÃO
// ========================================

export interface CreateOfficeData {
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

  // Relacionamentos
  organizationId: string;
  createdBy?: string;
}

export interface CreateOfficeUserData {
  userId: string;
  officeId: string;
  role?: OfficeRole;
  permissions?: string[];
  isActive?: boolean;
  accessStartDate?: Date;
  accessEndDate?: Date;
  createdBy?: string;
}

// ========================================
// TIPOS PARA ATUALIZAÇÃO
// ========================================

export interface UpdateOfficeData {
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

  // Timestamps
  updatedBy?: string;
}

export interface UpdateOfficeUserData {
  role?: OfficeRole;
  permissions?: string[];
  isActive?: boolean;
  accessStartDate?: Date;
  accessEndDate?: Date;
  updatedBy?: string;
}

// ========================================
// TIPOS PARA FILTROS
// ========================================

export interface OfficeFilters {
  organizationId: string;
  name?: string;
  code?: string;
  type?: OfficeType;
  status?: OfficeStatus;
  city?: string;
  state?: string;
  search?: string;
}

export interface OfficeUserFilters {
  organizationId: string;
  userId?: string;
  officeId?: string;
  role?: OfficeRole;
  isActive?: boolean;
  search?: string;
}

// ========================================
// TIPOS PARA ESTATÍSTICAS
// ========================================

export interface OfficeStats {
  totalOffices: number;
  activeOffices: number;
  inactiveOffices: number;
  suspendedOffices: number;
  maintenanceOffices: number;
  byType: Array<{
    type: OfficeType;
    count: number;
  }>;
  byStatus: Array<{
    status: OfficeStatus;
    count: number;
  }>;
  byCity: Array<{
    city: string;
    count: number;
  }>;
  byState: Array<{
    state: string;
    count: number;
  }>;
  totalUsers: number;
  averageUsersPerOffice: number;
}

export interface OfficeUserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  byRole: Array<{
    role: OfficeRole;
    count: number;
  }>;
  byOffice: Array<{
    officeId: string;
    officeName: string;
    count: number;
  }>;
  averageOfficesPerUser: number;
}

// ========================================
// TIPOS PARA PERMISSÕES
// ========================================

export interface OfficePermissions {
  canView: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canManageUsers: boolean;
  canViewStats: boolean;
  canManageDemands: boolean;
}

// ========================================
// TIPOS PARA VALIDAÇÃO
// ========================================

export interface OfficeValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface OfficeUserValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// ========================================
// TIPOS PARA RELATÓRIOS
// ========================================

export interface OfficeReport {
  office: Office;
  totalUsers: number;
  activeUsers: number;
  totalDemands: number;
  openDemands: number;
  closedDemands: number;
  averageResolutionTime: number;
  lastActivity: Date;
}

export interface OfficeUserReport {
  user: {
    id: string;
    name: string;
    email: string;
  };
  offices: Array<{
    office: Office;
    role: OfficeRole;
    permissions: string[];
    isActive: boolean;
    accessStartDate: Date;
    accessEndDate?: Date;
  }>;
  totalOffices: number;
  activeOffices: number;
  lastActivity: Date;
}
