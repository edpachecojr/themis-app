import { vi } from "vitest";

// Mock do contactService
export const mockContactService = {
  create: vi.fn(),
  update: vi.fn(),
  getById: vi.fn(),
  getAll: vi.fn(),
  getAllPaginated: vi.fn(),
  getAllPaginatedWithSearch: vi.fn(),
  delete: vi.fn(),
  isContactOwner: vi.fn(),
};

// Mock do organizationService
export const mockOrganizationService = {
  createOrganization: vi.fn(),
  getOrganization: vi.fn(),
  getOrganizationById: vi.fn(),
  getAll: vi.fn(),
  getAllOrganizations: vi.fn(),
  updateOrganization: vi.fn(),
  deleteOrganization: vi.fn(),
  getAllPaginated: vi.fn(),
  getAllPaginatedWithSearch: vi.fn(),
  isOrganizationOwner: vi.fn(),
};

// Mock do prisma
export const mockPrisma = {
  user: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    update: vi.fn(),
    create: vi.fn(),
  },
  verificationCode: {
    findFirst: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  },
  account: {
    create: vi.fn(),
  },
  contact: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
  appointment: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  organization: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
};

// Mock do revalidatePath
export const mockRevalidatePath = vi.fn();

// Mock do withOrganizationIsolation
export const mockWithOrganizationIsolation = vi.fn();

// Mock do withUserIsolation
export const mockWithUserIsolation = vi.fn();

// Mock do requireAuthenticatedUser
export const mockRequireAuthenticatedUser = vi.fn();

// Função para limpar todos os mocks
export const clearAllMocks = () => {
  vi.clearAllMocks();

  // Limpar mocks dos serviços
  Object.values(mockContactService).forEach((mock) => {
    if (typeof mock === "function") mock.mockClear();
  });

  Object.values(mockOrganizationService).forEach((mock) => {
    if (typeof mock === "function") mock.mockClear();
  });

  // Limpar mocks do prisma
  Object.values(mockPrisma).forEach((model) => {
    if (typeof model === "object") {
      Object.values(model).forEach((mock) => {
        if (typeof mock === "function") mock.mockClear();
      });
    }
  });

  mockRevalidatePath.mockClear();
  mockWithOrganizationIsolation.mockClear();
  mockWithUserIsolation.mockClear();
  mockRequireAuthenticatedUser.mockClear();
};

// Função para configurar mocks padrão
export const setupDefaultMocks = () => {
  // Configurar mocks padrão para auth
  mockRequireAuthenticatedUser.mockResolvedValue("test-user-id");
  mockWithOrganizationIsolation.mockImplementation(async (callback) => {
    return await callback("test-org-id");
  });
  mockWithUserIsolation.mockImplementation(async (callback) => {
    return await callback("test-user-id");
  });
};
