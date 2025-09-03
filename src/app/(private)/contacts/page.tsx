"use client";

import {
  PageContainer,
  PageHeader,
  PageHeaderContent,
  PageTitle,
  PageDescription,
  PageActions,
  PageContent,
} from "@/components/layout/page-container";
import AddContactButton from "./_components/add-contact-button";
import { DataTable } from "@/components/data-table";
import { contactsTableColumns } from "./_components/table-columns";
import { getContacts } from "@/actions/contact/get-all";
import { Contact } from "@/types/contact";
import { Pagination } from "@/components/pagination";
import { Skeleton } from "@/components/skeleton";
import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchBar } from "./_components/search-bar";
import {
  ContactsProvider,
  useContactsContext,
} from "@/contexts/contacts-context";
import { ContactsTableSkeleton } from "./_components/contacts-table-skeleton";

function ContactsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshTrigger } = useContactsContext();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  const currentPage = parseInt(searchParams.get("page") || "1");
  const currentItemsPerPage = parseInt(
    searchParams.get("itemsPerPage") || "10"
  );
  const currentSearch = searchParams.get("search") || "";

  const loadContacts = useCallback(
    async (page: number, itemsPerPage: number, search: string) => {
      setLoading(true);
      try {
        const response = await getContacts({ page, itemsPerPage, search });

        if (response.data?.ok) {
          setContacts(response.data.data);
          setPagination({
            currentPage: response.data.currentPage,
            totalPages: response.data.totalPages,
            totalItems: response.data.total,
            itemsPerPage: response.data.itemsPerPage,
          });
        }
      } catch (error) {
        console.error("Erro ao carregar contatos:", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadContacts(currentPage, currentItemsPerPage, currentSearch);
  }, [
    currentPage,
    currentItemsPerPage,
    currentSearch,
    loadContacts,
    refreshTrigger,
  ]);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("itemsPerPage", itemsPerPage.toString());
    params.set("page", "1"); // Reset to first page when changing items per page
    router.push(`?${params.toString()}`);
  };

  const handleSearch = useCallback(
    (search: string) => {
      const params = new URLSearchParams(searchParams);
      if (search.trim()) {
        params.set("search", search.trim());
      } else {
        params.delete("search");
      }
      params.set("page", "1"); // Reset to first page when searching
      router.push(`?${params.toString()}`);
    },
    [searchParams, router]
  );

  if (loading) {
    return (
      <PageContainer>
        <PageHeader>
          <PageHeaderContent>
            <PageTitle>Contatos</PageTitle>
            <PageDescription>
              CRM Parlamentar - Gerencie cadastro de eleitores e contatos
              políticos
            </PageDescription>
          </PageHeaderContent>
          <PageActions>
            <AddContactButton />
          </PageActions>
        </PageHeader>
        <PageContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-10 w-80" />
              <Skeleton className="h-4 w-32" />
            </div>
            <ContactsTableSkeleton />
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-48" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          </div>
        </PageContent>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Contatos</PageTitle>
          <PageDescription>
            CRM Parlamentar - Gerencie cadastro de eleitores e contatos
            políticos
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <AddContactButton />
        </PageActions>
      </PageHeader>
      <PageContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Buscar por nome, CPF, título de eleitor, partido político..."
              className="w-80"
              initialValue={currentSearch}
            />
            {currentSearch && (
              <div className="text-sm text-neutral-600">
                {pagination.totalItems} resultado
                {pagination.totalItems !== 1 ? "s" : ""} encontrado
                {pagination.totalItems !== 1 ? "s" : ""}
              </div>
            )}
          </div>
          <DataTable data={contacts} columns={contactsTableColumns} />
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            itemsPerPage={pagination.itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      </PageContent>
    </PageContainer>
  );
}

export default function Contacts() {
  return (
    <ContactsProvider>
      <ContactsContent />
    </ContactsProvider>
  );
}
