"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { createPortal } from "react-dom";
import { authClient } from "@/lib/authentication/client";

export function LogoutButton() {
  const router = useRouter();
  const [showOverlay, setShowOverlay] = useState(false);

  async function handleLogout() {
    setShowOverlay(true);

    // Timeout de segurança para evitar overlay preso
    const timeoutId = setTimeout(() => {
      console.warn("Timeout no logout - forçando redirecionamento");
      setShowOverlay(false);
      router.replace("/login");
    }, 5000); // 5 segundos

    try {
      const result = await authClient.signOut();

      // Limpar timeout se logout for bem-sucedido
      clearTimeout(timeoutId);

      // Verificar se o logout foi bem-sucedido
      if (result.error) {
        console.error("Erro no logout:", result.error);
        setShowOverlay(false);
        return;
      }

      // Forçar redirecionamento após logout bem-sucedido
      router.replace("/login");
    } catch (error) {
      // Limpar timeout em caso de erro
      clearTimeout(timeoutId);
      console.error("Erro durante logout:", error);
      setShowOverlay(false);
    }
  }

  return (
    <>
      <div
        className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-neutral-100 hover:text-neutral-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full"
        onClick={handleLogout}
      >
        Logout
      </div>

      {/* Overlay de bloqueio usando Portal */}
      {showOverlay &&
        typeof window !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99999] flex items-center justify-center min-h-screen">
            <div className="bg-white rounded-lg p-8 shadow-xl max-w-sm w-full mx-4 text-center border border-neutral-200">
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-info" />
                <h3 className="text-lg font-semibold text-neutral-900">
                  Sair da conta
                </h3>
                <p className="text-sm text-neutral-600">
                  Tem certeza que deseja sair? Você será desconectado.
                </p>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
