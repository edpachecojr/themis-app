import { auth } from "./authentication/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { organizationRepo } from "./db/organization-repos-instance";

/**
 * Obtém o usuário autenticado da sessão
 * @returns O usuário autenticado ou null se não estiver autenticado
 */
export async function getAuthenticatedUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user || null;
}

/**
 * Obtém o ID do usuário autenticado
 * @returns O ID do usuário autenticado ou null se não estiver autenticado
 */
export async function getAuthenticatedUserId(): Promise<string | null> {
  const user = await getAuthenticatedUser();
  return user?.id || null;
}

/**
 * Redireciona para login se o usuário não estiver autenticado
 * @returns O ID do usuário autenticado
 */
export async function requireAuthenticatedUser(): Promise<string> {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    redirect("/login");
  }

  return userId;
}

/**
 * Middleware para isolamento por usuário
 * Garante que todas as operações sejam executadas no contexto do usuário autenticado
 */
export async function withUserIsolation<T>(
  operation: (userId: string) => Promise<T>
): Promise<T> {
  const userId = await requireAuthenticatedUser();
  return operation(userId);
}

/**
 * Verifica se um recurso pertence ao usuário autenticado
 * @param resourceUserId ID do usuário que possui o recurso
 * @returns true se o recurso pertence ao usuário autenticado
 */
export async function isResourceOwner(
  resourceUserId: string
): Promise<boolean> {
  const authenticatedUserId = await getAuthenticatedUserId();
  return authenticatedUserId === resourceUserId;
}

/**
 * Verifica se um recurso pertence ao usuário autenticado e redireciona se não pertencer
 * @param resourceUserId ID do usuário que possui o recurso
 * @returns O ID do usuário autenticado se for o proprietário
 */
export async function requireResourceOwnership(
  resourceUserId: string
): Promise<string> {
  const authenticatedUserId = await requireAuthenticatedUser();

  if (authenticatedUserId !== resourceUserId) {
    redirect("/unauthorized");
  }

  return authenticatedUserId;
}

/**
 * Obtém a organização do usuário autenticado
 * @returns A organização do usuário ou null se não estiver autenticado ou não tiver organização
 */
export async function getAuthenticatedUserOrganization() {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return null;
  }

  // Busca a primeira organização ativa do usuário
  const organizations = await organizationRepo.getAll(userId);
  return (
    organizations.find((org) => org.status === "ACTIVE") ||
    organizations[0] ||
    null
  );
}

/**
 * Obtém o ID da organização do usuário autenticado
 * @returns O ID da organização ou null se não estiver autenticado ou não tiver organização
 */
export async function getAuthenticatedUserOrganizationId(): Promise<
  string | null
> {
  const organization = await getAuthenticatedUserOrganization();
  return organization?.id || null;
}

/**
 * Redireciona para setup de organização se o usuário não tiver uma organização
 * @returns O ID da organização do usuário autenticado
 */
export async function requireAuthenticatedUserOrganization(): Promise<string> {
  const organizationId = await getAuthenticatedUserOrganizationId();

  if (!organizationId) {
    redirect("/setup-organization");
  }

  return organizationId;
}

/**
 * Middleware para garantir que uma operação só acesse dados da organização do usuário autenticado
 * @param operation Função que recebe o organizationId e executa a operação
 * @returns Resultado da operação
 */
export async function withOrganizationIsolation<T>(
  operation: (organizationId: string) => Promise<T>
): Promise<T> {
  const organizationId = await requireAuthenticatedUserOrganization();
  return operation(organizationId);
}
