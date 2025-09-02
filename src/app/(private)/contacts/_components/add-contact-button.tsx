"use client";

import { Button } from "@/components/button";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const AddContactButton = () => {
  const router = useRouter();

  return (
    <Button onClick={() => router.push("/contacts/new")}>
      <PlusCircle className="mr-2 h-4 w-4" />
      Adicionar contato
    </Button>
  );
};

export default AddContactButton;
