// 🔍 Admin search, two layers: <SearchInput> (controlled presentational input) and
//    <SearchFilter> (self-contained, URL-synced search box for simple list pages).
"use client";

import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminSearch } from "@/hooks/use-admin-search";

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  placeholder: string;
}

export function SearchInput({ value, onChange, onClear, placeholder }: SearchInputProps) {
  return (
    <div className="relative w-full">
      {/* 🔎 Leading icon (RTL → right side) */}
      <Search
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
      />
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pr-10 pl-9 text-sm transition-all focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-100"
      />
      {/* ✖️ Clear (only when there is text) */}
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onClear}
          aria-label="پاک کردن جستجو"
          className="absolute left-1 top-1/2 size-7 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
        >
          <X size={14} />
        </Button>
      )}
    </div>
  );
}

// 🧩 Drop-in URL-synced search — render inside <Suspense> (useSearchParams safe).
export function SearchFilter({ search, placeholder }: { search: string; placeholder: string }) {
  const { inputValue, handleSearchChange, clearSearch } = useAdminSearch(search);

  return (
    <SearchInput
      value={inputValue}
      onChange={handleSearchChange}
      onClear={clearSearch}
      placeholder={placeholder}
    />
  );
}
