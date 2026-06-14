import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { doctorsApiKey } from '@/lib/utils/doctors-query'; // 🔗 Shared SWR key (SSR ↔ client parity)

const fetcher = (url: string) => fetch(url).then(r => r.json());

// 🩺 Typed shape of each doctor returned by GET /api/doctors
export interface DoctorSummary {
  _id:               string;
  name:              string;
  specialty:         string;
  city:              string;
  photo:             string;
  address:           string;
  medicalCode:       string;
  hasOnlineVisit:    boolean;
  hasInPersonVisit:  boolean;
  isAvailable:       boolean;
  schedule:          { date: string; times: string[] }[];
  nextAvailableSlot: string | null;
  reviewCount:       number;
  avgRating:         number;
}

// 📦 Full API response envelope
export interface DoctorsApiResponse {
  doctors:    DoctorSummary[];
  totalPages: number;
}

// 🔑 Client-side SWR fetch keyed off the URL search params. The list skeleton-loads on
//    first paint while the shell renders, then swaps smoothly via keepPreviousData. 🧠
export function useDoctors() {
  const sp = useSearchParams();

  // ✅ Typed with DoctorsApiResponse — eliminates all unknown[] downstream.
  //    Key built by the SAME helper the server uses → consistent params, no double-fetch.
  return useSWR<DoctorsApiResponse>(
    doctorsApiKey(sp),
    fetcher,
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    },
  );
}
