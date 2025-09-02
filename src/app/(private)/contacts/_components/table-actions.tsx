import { EditIcon, MoreVerticalIcon, TrashIcon, EyeIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

import { deleteContact } from "@/actions/contact/delete";
import { useContactsContext } from "@/contexts/contacts-context";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/alert-dialog";
import { Button } from "@/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu";
import { Contact } from "@/types/contact";
import { useRouter } from "next/navigation";

interface ContactsTableActionsProps {
  contact: Contact;
}

const ContactsTableActions = ({ contact }: ContactsTableActionsProps) => {
  const { triggerRefresh } = useContactsContext();
  const router = useRouter();

  const deleteContactAction = useAction(deleteContact, {
    onSuccess: () => {
      console.log("onSuccess chamado!");
      toast.success("Contato deletado com sucesso.");
      triggerRefresh(); // Dispara atualização da lista
    },
    onError: () => {
      toast.error("Erro ao deletar contato.");
    },
  });

  const handleDeleteContactClick = () => {
    if (!contact) return;
    deleteContactAction.execute({ id: contact.id });
  };

  const handleViewContact = () => {
    router.push(`/contacts/${contact.id}`);
  };

  const handleEditContact = () => {
    router.push(`/contacts/${contact.id}/edit`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" size="icon">
          <MoreVerticalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{contact.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleViewContact}>
          <EyeIcon className="mr-2 h-4 w-4" />
          Visualizar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEditContact}>
          <EditIcon className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <TrashIcon className="mr-2 h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Tem certeza que deseja deletar esse contato?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Essa ação não pode ser revertida. Isso irá deletar o contato e
                todos os dados associados.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={handleDeleteContactClick}
              >
                Deletar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ContactsTableActions;
