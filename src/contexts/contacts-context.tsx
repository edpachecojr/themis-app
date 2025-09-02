"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { Contact } from "@/types/contact";

interface ContactsContextType {
  contacts: Contact[];
  setContacts: (contacts: Contact[]) => void;
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const ContactsContext = createContext<ContactsContextType | undefined>(
  undefined
);

export function ContactsProvider({ children }: { children: React.ReactNode }) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return (
    <ContactsContext.Provider
      value={{
        contacts,
        setContacts,
        refreshTrigger,
        triggerRefresh,
      }}
    >
      {children}
    </ContactsContext.Provider>
  );
}

export function useContactsContext() {
  const context = useContext(ContactsContext);
  if (context === undefined) {
    throw new Error(
      "useContactsContext must be used within a ContactsProvider"
    );
  }
  return context;
}
