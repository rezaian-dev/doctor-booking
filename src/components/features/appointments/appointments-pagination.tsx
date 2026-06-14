"use client";

import Pagination from "@/components/shared/pagination";

interface Props {
  currentPage: number;
  totalPages: number;
}

// 📄 Reuse shared pagination UI
export default function AppointmentsPagination({ currentPage, totalPages }: Props) {
  void currentPage; // preserved API shape

  return <Pagination totalPages={totalPages} className="mt-8" />;
}
