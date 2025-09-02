import { deleteContact } from "@/actions/contact/delete";
import { useAction } from "next-safe-action/hooks";
import { useContactsContext } from "@/contexts/contacts-context";

export function useDeleteContactAction() {
  const { triggerRefresh } = useContactsContext();

  return useAction(deleteContact, {
    onSuccess: () => {
      triggerRefresh();
    },
  });
}
