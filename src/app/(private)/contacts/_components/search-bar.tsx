"use client";

import { Input } from "@/components/input";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect, useState } from "react";

interface SearchBarProps {
  onSearch: (search: string) => void;
  placeholder?: string;
  className?: string;
  initialValue?: string;
}

export function SearchBar({
  onSearch,
  placeholder = "Buscar pacientes...",
  className,
  initialValue = "",
}: SearchBarProps) {
  const [searchValue, setSearchValue] = useState(initialValue);
  const debouncedSearchValue = useDebounce(searchValue, 500);

  useEffect(() => {
    onSearch(debouncedSearchValue);
  }, [debouncedSearchValue, onSearch]);

  // Sincronizar com valor inicial quando mudar
  useEffect(() => {
    setSearchValue(initialValue);
  }, [initialValue]);

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
      <Input
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}
