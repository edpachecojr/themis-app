import { useEffect } from "react";
import { authClient } from "@/lib/authentication/client";
import { createDefaultOrganization } from "@/actions/organization/create-default";
import { getAllOrganizations } from "@/actions/organization/get-all";

export function useAuthCallback() {
  useEffect(() => {
    const checkAndCreateDefaultOrg = async () => {
      try {
        const session = await authClient.getSession();
        if (session?.data?.user?.id) {
          // Verificar se o usuário já tem organizações
          const orgsResult = await getAllOrganizations();

          if (
            orgsResult.data?.organizations &&
            orgsResult.data.organizations.length === 0
          ) {
            // Se não tiver organizações, criar a organização padrão
            const result = await createDefaultOrganization({
              userId: session.data.user.id,
            });

            if (result.data?.ok) {
              console.log(
                "Default organization created for user:",
                session.data.user.id
              );
            }
          }
        }
      } catch (error) {
        console.error("Error in auth callback:", error);
      }
    };

    // Verificar quando o componente monta
    checkAndCreateDefaultOrg();
  }, []);
}
