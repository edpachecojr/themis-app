import { vi, beforeEach, afterEach } from "vitest";

// Suprimir logs durante os testes
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleInfo = console.info;

beforeEach(() => {
  // Suprimir todos os logs durante os testes
  console.log = vi.fn();
  console.error = vi.fn();
  console.warn = vi.fn();
  console.info = vi.fn();
});

afterEach(() => {
  // Restaurar logs após os testes
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
  console.info = originalConsoleInfo;
});

// Mock do next/cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// Mock do contactService - corrigindo para exportar o serviço com o nome correto
vi.mock("@/services/contact-service", () => ({
  ContactService: vi.fn().mockImplementation(() => ({
    create: vi.fn(),
    update: vi.fn(),
    getById: vi.fn(),
    getAll: vi.fn(),
    getAllPaginated: vi.fn(),
    getAllPaginatedWithSearch: vi.fn(),
    delete: vi.fn(),
    isContactOwner: vi.fn(),
  })),
  contactService: {
    create: vi.fn(),
    update: vi.fn(),
    getById: vi.fn(),
    getAll: vi.fn(),
    getAllPaginated: vi.fn(),
    getAllPaginatedWithSearch: vi.fn(),
    delete: vi.fn(),
    isContactOwner: vi.fn(),
  },
}));

// Mock do organizationService - corrigindo para exportar o serviço com o nome correto
vi.mock("@/services/organization-service", () => ({
  OrganizationService: vi.fn().mockImplementation(() => ({
    createOrganization: vi.fn(),
    getOrganizationById: vi.fn(),
    getAll: vi.fn(),
    getAllOrganizations: vi.fn(),
    updateOrganization: vi.fn(),
    deleteOrganization: vi.fn(),
    getAllPaginated: vi.fn(),
    getAllPaginatedWithSearch: vi.fn(),
    isOrganizationOwner: vi.fn(),
  })),
  organizationService: {
    createOrganization: vi.fn(),
    getOrganizationById: vi.fn(),
    getAll: vi.fn(),
    getAllOrganizations: vi.fn(),
    updateOrganization: vi.fn(),
    deleteOrganization: vi.fn(),
    getAllPaginated: vi.fn(),
    getAllPaginatedWithSearch: vi.fn(),
    isOrganizationOwner: vi.fn(),
  },
}));

// Mock do prisma - adicionando métodos que faltam
vi.mock("@/lib/db/prisma", () => ({
  prisma: {
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
  },
}));

// Mock do auth-utils - configurando implementações padrão
vi.mock("@/lib/auth-utils", () => ({
  withOrganizationIsolation: vi.fn().mockImplementation(async (callback) => {
    return await callback("test-org-id");
  }),
  withUserIsolation: vi.fn().mockImplementation(async (callback) => {
    return await callback("test-user-id");
  }),
  requireAuthenticatedUser: vi.fn().mockResolvedValue("test-user-id"),
}));

// Mock do uuid
vi.mock("uuid", () => ({
  v4: vi.fn(() => "test-uuid-123"),
}));

// Mock do bcrypt
vi.mock("bcrypt", () => ({
  hash: vi.fn((password: string) => Promise.resolve(`hashed_${password}`)),
  compare: vi.fn((password: string, hash: string) =>
    Promise.resolve(hash === `hashed_${password}`)
  ),
}));

// Mock do nodemailer
vi.mock("nodemailer", () => ({
  createTransport: vi.fn(() => ({
    sendMail: vi.fn(),
  })),
}));

// Configuração global para os testes
beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.clearAllMocks();
});
