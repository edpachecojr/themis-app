"use client";

import { Button } from "@/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  showItemsPerPage?: boolean;
  itemsPerPageOptions?: number[];
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  showItemsPerPage = true,
  itemsPerPageOptions = [10, 20, 50, 100],
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Total de itens */}
      <div className="text-sm text-neutral-600">
        Mostrando {startItem} a {endItem} de {totalItems} resultados
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        {/* Seletor de itens por página */}
        {showItemsPerPage && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-600">Itens por página:</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => onItemsPerPageChange(Number(value))}
            >
              <SelectTrigger className="w-20 border-neutral-200 focus:border-primary-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-neutral-200">
                {itemsPerPageOptions.map((option) => (
                  <SelectItem
                    key={option}
                    value={option.toString()}
                    className="text-neutral-700 hover:text-primary-600 hover:bg-neutral-50"
                  >
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Controles de paginação */}
        <div className="flex items-center gap-1">
          {/* Primeira página */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="h-7 w-7 p-0 border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 hover:border-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronsLeft className="h-3 w-3" />
            <span className="sr-only">Primeira página</span>
          </Button>

          {/* Página anterior */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-7 w-7 p-0 border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 hover:border-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-3 w-3" />
            <span className="sr-only">Página anterior</span>
          </Button>

          {/* Números das páginas */}
          <div className="flex items-center gap-1">
            {visiblePages.map((page, index) => (
              <div key={index}>
                {page === "..." ? (
                  <span className="flex h-7 w-7 items-center justify-center text-sm text-neutral-500">
                    ...
                  </span>
                ) : (
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(page as number)}
                    className={cn(
                      "h-7 w-7 p-0",
                      currentPage === page
                        ? "bg-primary-600 text-white border-0"
                        : "border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 hover:border-neutral-300"
                    )}
                  >
                    {page}
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Próxima página */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-7 w-7 p-0 border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 hover:border-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-3 w-3" />
            <span className="sr-only">Próxima página</span>
          </Button>

          {/* Última página */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="h-7 w-7 p-0 border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 hover:border-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronsRight className="h-3 w-3" />
            <span className="sr-only">Última página</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
