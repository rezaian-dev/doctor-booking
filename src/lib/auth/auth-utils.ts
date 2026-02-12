import { NextResponse } from "next/server";

// 🕐 Format wait time to Persian text
export const formatWaitTime = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds} ثانیه`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (remainingSeconds === 0) {
    return `${minutes} دقیقه`;
  }

  return `${minutes} دقیقه و ${remainingSeconds} ثانیه`;
};

// 🔧 Response helpers
export const err = (msg: string, status: number = 400) =>
  NextResponse.json({ error: msg }, { status });

export const success = (data: object, status: number = 200) =>
  NextResponse.json({ success: true, ...data }, { status });
