import { useAction } from "next-safe-action/hooks";
import { getContacts } from "@/actions/contact/get-all";

export function useGetAllContactsAction() {
  return useAction(getContacts, {});
}
