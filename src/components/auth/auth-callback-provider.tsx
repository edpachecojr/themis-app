"use client";

import { useAuthCallback } from "@/hooks/use-auth-callback";

export function AuthCallbackProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useAuthCallback();

  return <>{children}</>;
}
