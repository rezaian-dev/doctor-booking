// 🖼️ Doctor photo upload section. Pure presentation — the parent form owns the
//    upload/remove state and handlers, so there is no duplicated logic here.
"use client";

import { useState } from "react";
import { Upload, LoaderCircle, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "./section";

export function DoctorPhotoSection({
  photo, uploading, fileRef, onUpload, onRemove,
}: {
  photo: string;
  uploading: boolean;
  fileRef: React.RefObject<HTMLInputElement | null>;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}) {
  const pick = () => fileRef.current?.click();

  // 🛟 Remember WHICH url failed (not a bare boolean) so a new/replaced photo gets a fresh
  //    load attempt — no useEffect reset, no cascading re-render. ✨
  const [brokenUrl, setBrokenUrl] = useState<string | null>(null);
  const broken = !!photo && brokenUrl === photo;

  const showImage = !!photo && !broken && !uploading;

  return (
    <Section title="تصویر دکتر" subtitle="عکس پروفایل پزشک" icon={User}>
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
        <div className="relative shrink-0">
          <Button
            type="button"
            variant="ghost"
            onClick={pick}
            aria-label={photo ? "تغییر تصویر دکتر" : "انتخاب تصویر دکتر"}
            aria-busy={uploading}
            className="group relative size-24 overflow-hidden rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50 p-0 hover:border-primary-400 hover:bg-neutral-50"
          >
            {uploading ? (
              <LoaderCircle size={22} className="animate-spin text-primary-500" />
            ) : showImage ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  key={photo}
                  src={photo}
                  alt="تصویر فعلی دکتر"
                  className="size-full object-cover"
                  onError={() => setBrokenUrl(photo)} // 🚫 mark THIS url broken → placeholder
                />
                <span className="absolute inset-0 flex items-center justify-center bg-neutral-900/0 transition-colors group-hover:bg-neutral-900/40">
                  <Upload size={18} className="text-white opacity-0 transition-opacity group-hover:opacity-100" />
                </span>
              </>
            ) : (
              // 📭 Placeholder — also covers a broken stored URL (still removable via the X)
              <Upload size={22} className="text-neutral-400 transition-colors group-hover:text-primary-500" />
            )}
          </Button>

          {/* ❌ Remove — visible whenever a URL is stored, even if it failed to load */}
          {photo && !uploading && (
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={onRemove}
              aria-label="حذف تصویر"
              className="absolute -left-2 -top-2 size-6 rounded-full border-neutral-200 bg-white p-0 text-neutral-500 shadow-sm hover:bg-danger-50 hover:text-danger-600"
            >
              <X size={13} />
            </Button>
          )}
        </div>

        <div className="space-y-2">
          <Button type="button" variant="subtle" size="sm" onClick={pick} disabled={uploading}>
            <Upload size={13} /> {photo ? "تغییر تصویر" : "انتخاب تصویر"}
          </Button>
          <p className="text-xs text-neutral-400">PNG یا JPG، حداکثر ۲ مگابایت</p>
          {broken && photo && (
            <p className="text-xs text-danger-600">تصویر بارگذاری نشد — می‌توانید جایگزین یا حذف کنید</p>
          )}
        </div>

        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onUpload} />
      </div>
    </Section>
  );
}
