// 🩺 Thin wrapper around the shared `searchDoctors` service (single source of
//    truth). The SSR page calls the same service directly for fallbackData. 🔗
import { NextRequest, NextResponse } from "next/server";
import { searchDoctors } from "@/lib/services/doctor-search";

export async function GET(req: NextRequest) {
  const data = await searchDoctors(req.nextUrl.searchParams);
  return NextResponse.json(data);
}
