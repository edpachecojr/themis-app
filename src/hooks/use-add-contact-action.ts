import { useAction } from "next-safe-action/hooks";
import { addContact } from "@/actions/contact/add";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useAddContactAction(
  onSuccess?: () => void,
  onError?: () => void
) {
  const router = useRouter();

  return useAction(addContact, {
    onSuccess: () => {
      toast.success("Contato criado com sucesso!");
      // Aguardar um pouco para o toast ser exibido antes do redirecionamento
      setTimeout(() => {
        router.push("/contacts");
      }, 1000);
      onSuccess?.();
    },
    onError: () => {
      onError?.();
    },
  });
}
