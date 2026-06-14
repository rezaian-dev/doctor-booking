// 🔍 User search + role toggle — rendered inside <Suspense> (useSearchParams safe).
"use client";

import { useAdminSearch } from "@/hooks/use-admin-search";
import { SearchInput } from "@/components/admin/shared/search-filter";
import { Button } from "@/components/ui/button";

const ROLE_OPTIONS = [
  { value: "", label: "همه" },
  { value: "user", label: "کاربر" },
  { value: "admin", label: "ادمین" },
] as const;

interface Props {
  search: string;
  role?: string;
}

export default function UsersFilter({ search, role = "" }: Props) {
  const { inputValue, handleSearchChange, clearSearch, pushParams } =
    useAdminSearch(search);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="min-w-50 max-w-md flex-1">
        <SearchInput
          value={inputValue}
          onChange={handleSearchChange}
          onClear={clearSearch}
          placeholder="جستجو بر اساس نام، تلفن یا ایمیل..."
        />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {ROLE_OPTIONS.map((opt) => (
          <Button
            key={opt.value}
            type="button"
            variant={role === opt.value ? "default" : "outline"}
            size="sm"
            onClick={() => pushParams({ role: opt.value })}
          >
            {opt.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
