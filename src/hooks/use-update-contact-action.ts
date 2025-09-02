import { useAction } from "next-safe-action/hooks";
import { updateContact } from "@/actions/contact/update";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useUpdateContactAction(
  onSuccess?: () => void,
  onError?: () => void
) {
  const router = useRouter();

  return useAction(updateContact, {
    onSuccess: () => {
      toast.success("Contato atualizado com sucesso!");
      // Aguardar um pouco para o toast ser exibido antes do redirecionamento
      setTimeout(() => {
        router.push("/contacts");
      }, 1000);
      onSuccess?.();
    },
    onError: () => {
      toast.error("Erro ao atualizar contato. Tente novamente.");
      onError?.();
    },
  });
}
