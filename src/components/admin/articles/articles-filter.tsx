// 🔍 Article search + status select — rendered inside <Suspense> (useSearchParams safe).
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminSearch } from "@/hooks/use-admin-search";
import { SearchInput } from "@/components/admin/shared/search-filter";

interface Props {
  search: string;
  status: string;
}

export default function ArticlesFilter({ search, status }: Props) {
  const { inputValue, handleSearchChange, clearSearch, pushParams } =
    useAdminSearch(search);

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="flex-1">
        <SearchInput
          value={inputValue}
          onChange={handleSearchChange}
          onClear={clearSearch}
          placeholder="جستجو در مقالات..."
        />
      </div>
      <Select
        defaultValue={status || "all"}
        onValueChange={(val) => pushParams({ status: val === "all" ? "" : val })}
      >
        <SelectTrigger className="h-10 w-full rounded-xl border-neutral-200 text-sm sm:w-44">
          <SelectValue placeholder="همه" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">همه</SelectItem>
          <SelectItem value="published">منتشر شده</SelectItem>
          <SelectItem value="draft">پیش‌نویس</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
