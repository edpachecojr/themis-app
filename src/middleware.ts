import { NextRequest, MiddlewareConfig, NextResponse } from "next/server";

// Função auxiliar para validação síncrona de token
function validateSessionToken(token: string): boolean {
  if (!token || typeof token !== "string") {
    return false;
  }
  if (token.length < 32) {
    return false;
  }
  if (token.trim().length === 0) {
    return false;
  }
  const dangerousChars = /[<>\"'&]/;
  if (dangerousChars.test(token)) {
    return false;
  }
  return true;
}

/**
 * Rotas públicas da aplicação
 * - whenAuthenticated: "next" - permite acesso mesmo quando autenticado
 * - whenAuthenticated: "redirect" - redireciona usuários autenticados para o dashboard
 */
const publicRoutes = [
  { path: "/", whenAuthenticated: "next" },
  { path: "/register", whenAuthenticated: "redirect" },
  { path: "/login", whenAuthenticated: "redirect" },
  { path: "/create-password", whenAuthenticated: "redirect" },
  { path: "/verify-email", whenAuthenticated: "redirect" },
] as const;

// Rotas de redirecionamento
const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = "/login";
const REDIRECT_WHEN_AUTHENTICATED_ROUTE = "/dashboard";

/**
 * Middleware de autenticação para Next.js
 *
 * Esta middleware verifica se o usuário está autenticado usando validação síncrona
 * de cookies do better-auth e redireciona conforme necessário.
 *
 * Funcionalidades:
 * - Protege rotas privadas redirecionando para /login se não autenticado
 * - Redireciona usuários autenticados de rotas públicas para /dashboard quando apropriado
 * - Permite acesso livre às rotas da API do better-auth
 * - Validação síncrona otimizada para Edge Runtime
 */
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Não interceptar rotas da API do better-auth
  if (path.startsWith("/api/auth/")) {
    return NextResponse.next();
  }

  const publicRoute = publicRoutes.find((route) => route.path === path);

  // Verificar se existe um token de sessão válido
  // O nome do cookie é configurado via variável de ambiente BETTER_AUTH_SESSION_TOKEN
  const sessionCookieName =
    process.env.BETTER_AUTH_SESSION_TOKEN || "better-auth.session-token";
  const sessionToken = request.cookies.get(sessionCookieName)?.value;
  const isAuthenticated = sessionToken
    ? validateSessionToken(sessionToken)
    : false;

  // Log para debug em desenvolvimento
  if (process.env.NODE_ENV === "development") {
    console.log("Middleware - Token:", sessionToken ? "Present" : "Missing");
    console.log("Middleware - Is Authenticated:", isAuthenticated);
    console.log("Middleware - Path:", path);
  }

  // Se não está autenticado e é uma rota pública, permitir acesso
  if (!isAuthenticated && publicRoute) {
    return NextResponse.next();
  }

  // Se não está autenticado e não é uma rota pública, redirecionar para login
  if (!isAuthenticated && !publicRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;
    return NextResponse.redirect(redirectUrl);
  }

  // Se está autenticado e é uma rota pública que deve redirecionar, redirecionar para dashboard
  if (
    isAuthenticated &&
    publicRoute &&
    publicRoute.whenAuthenticated === "redirect"
  ) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = REDIRECT_WHEN_AUTHENTICATED_ROUTE;
    return NextResponse.redirect(redirectUrl);
  }

  // Se está autenticado e não é uma rota pública, permitir acesso
  if (isAuthenticated && !publicRoute) {
    return NextResponse.next();
  }

  // Para qualquer outro caso, permitir acesso
  return NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
