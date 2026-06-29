"use client";

import { useState }                                               from "react";
import { AlarmClock, Hash, MapPin, UserRound }                        from "lucide-react";
import Image                                                       from "next/image";
import { cn } from "@/lib/utils/cn";
import InfoRow                 from "@/components/features/doctor-profile/info-row";
import MedicalCodeBadge        from "@/components/features/doctor-profile/medical-code-badge";
import PaymentDetailsTable     from "@/components/features/doctor-profile/payment-details-table";
import ActionButtons           from "@/components/features/doctor-profile/action-buttons";
import StarRating              from "@/components/features/doctor-profile/star-rating";
import BioSection              from "@/components/features/booking/bio-section";
import CancelAppointmentButton from "@/components/features/appointments/cancel-appointment-button";
import { DoctorData, ProfileMode } from "@/types/doctor";
import { NO_IMAGE } from "@/lib/utils/profile-card";
import { formatDoctorName } from "@/lib/utils/doctor-name";
import { Separator } from "@/components/ui/separator";

type AppointmentStatus = "active" | "expired" | "cancelled";

interface ProfileCardProps {
  mode:          ProfileMode;
  data?:         Partial<DoctorData>;
  cancelAction?: () => Promise<{ success?: boolean; error?: string }>;
  schedule?:     { date: string; times: string[] }[];
  isLoggedIn?:   boolean;
}

const STATUS_LABEL: Record<AppointmentStatus, string> = {
  active:    "فعال",
  expired:   "منقضی‌شده",
  cancelled: "لغو‌شده",
};

const STATUS_CLASS: Record<AppointmentStatus, string> = {
  active:    "bg-green-100 text-green-700",
  expired:   "bg-neutral-100 text-neutral-500",
  cancelled: "bg-red-100 text-red-500",
};

export default function ProfileCard({ mode, data = {}, cancelAction, schedule, isLoggedIn = false }: ProfileCardProps) {
  const doc = data; // 🩺 already Partial<DoctorData> via the default param — no cast needed

  // 📷 Real photo vs. the "/images/no-image.png" fallback (callers pass it pre-resolved)
  const hasPhoto = Boolean(doc.image) && doc.image !== NO_IMAGE;

  const [localStatus, setLocalStatus] = useState<AppointmentStatus | undefined>(
    doc.appointmentStatus
  );

  // 🖼️ Track the photo's decode so the card shimmers → fades in (no dead gray box while
  //    the remote image loads). Declared before the early return to keep hook order stable. ✨
  const [photoLoaded, setPhotoLoaded] = useState(false);

  const showDefaultInfo = ["default", "confirm", "search"].includes(mode);
  const showBio         = mode === "default";
  const showActions     = ["search", "profile"].includes(mode);
  const isAppointment   = mode === "appointment";

  // 📋 Appointment mode → a compact list-style card (small avatar + info + status), tidy
  //    from 320px up. Every other mode keeps the full image block below. ✨
  if (isAppointment) {
    return (
      <div className="relative overflow-hidden rounded-xl border border-neutral-100 bg-white">
        <div className="flex gap-3 p-3 sm:gap-4 sm:p-4">
          {/* 🖼️ Fixed-size avatar — never grows the row; object-cover keeps it neat */}
          <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-neutral-100 xs:size-20">
            <Image
              src={hasPhoto ? doc.image! : NO_IMAGE}
              alt={doc.name || ""}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>

          {/* 🩺 Info — flex-1 + min-w-0 so long names truncate instead of overflowing */}
          <div className="flex min-w-0 flex-1 flex-col gap-y-1.5">
            {/* name ↔ status: justify-between keeps the badge pinned to the start (RTL) */}
            <div className="flex items-start justify-between gap-2">
              <h2 className="min-w-0 truncate text-sm font-medium leading-snug text-black xs:text-base">
                {formatDoctorName(doc.name)}
              </h2>
              {localStatus && (
                <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-xs font-medium", STATUS_CLASS[localStatus])}>
                  {STATUS_LABEL[localStatus]}
                </span>
              )}
            </div>

            <span className="truncate text-xs font-medium text-neutral-950 xs:text-sm">
              {doc.specialty}
            </span>

            {/* 🧑‍⚕️ Booked-for-someone-else marker — only when it's NOT a self-booking. The
                 explicit bookedForSelf flag (not a name comparison) keeps this reliable. ✨ */}
            {doc.bookedForSelf === false && doc.patientName && (
              <span className="inline-flex w-fit items-center gap-1 rounded-md bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700">
                <UserRound className="size-3.5 shrink-0" />
                <span className="truncate">برای: {doc.patientName}</span>
              </span>
            )}

            {doc.nextAvailableSlot && (
              <span className="text-xs text-neutral-600 xs:text-sm">{doc.nextAvailableSlot}</span>
            )}

            {doc.trackingCode && (
              <span className="truncate font-mono text-xs text-neutral-400">
                کد پیگیری: {doc.trackingCode}
              </span>
            )}

            {/* 🗑️ Cancel — its own row (right-aligned in RTL), comfortable touch target */}
            {localStatus === "active" && cancelAction && (
              <div className="mt-1">
                <CancelAppointmentButton
                  cancelAction={cancelAction}
                  onCancelled={() => setLocalStatus("cancelled")}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={cn(
        "relative bg-white rounded-xl border border-neutral-100",
        // 🪟 default mode lets the bio's circular toggle straddle the card's bottom border
        mode === "default" ? "overflow-visible" : "overflow-hidden",
        mode === "profile" && "max-w-221 mx-auto"
      )}>
        <div className={cn("p-3", mode === "payment" ? "sm:p-4 lg:p-5" : "")}>
          <div className="flex flex-col min-[480px]:flex-row gap-3">

            {/* 🖼️ Doctor image — smart fit:
                • real photo → shown in FULL (object-contain), never cropped; a blurred copy
                  fills the frame so any aspect ratio looks intentional (no empty bars).
                • no photo  → the placeholder fills the frame cleanly (blurring it looks odd). */}
            <div className="w-full min-[480px]:w-35 sm:w-40 md:w-46.5 shrink-0">
              <div
                className={cn(
                  "relative w-full overflow-hidden bg-neutral-100",
                  "rounded-none min-[480px]:rounded-md",
                  "aspect-4/3 min-[480px]:aspect-186/153"
                )}
              >
                {/* 🦴 Shimmer behind the photo — fades out the instant the image decodes,
                     so confirm/payment never flash a gray box while the photo loads. */}
                <div
                  aria-hidden
                  className={cn(
                    "absolute inset-0 z-0 animate-pulse bg-neutral-200/70 transition-opacity duration-300",
                    photoLoaded && "opacity-0"
                  )}
                />
                {hasPhoto ? (
                  <>
                    {/* 🌫️ Backdrop: blurred + zoomed copy paints the empty sides */}
                    <Image
                      src={doc.image!}
                      alt=""
                      aria-hidden
                      fill
                      sizes="(max-width: 479px) 100vw, (max-width: 639px) 140px, (max-width: 767px) 160px, 186px"
                      className={cn(
                        "scale-125 object-cover blur-2xl brightness-95 transition-opacity duration-500",
                        photoLoaded ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {/* 🩺 Foreground: full doctor photo, contained → never cropped; fades in on load */}
                    <Image
                      src={doc.image!}
                      alt={doc.name || ""}
                      fill
                      priority
                      sizes="(max-width: 479px) 100vw, (max-width: 639px) 140px, (max-width: 767px) 160px, 186px"
                      // 🛟 Guard: if the image is already cached/complete before React wires
                      //    onLoad, flip the flag now so it can never get stuck transparent.
                      ref={(img) => { if (img?.complete) setPhotoLoaded(true); }}
                      onLoad={() => setPhotoLoaded(true)}
                      className={cn(
                        "relative z-1 object-contain transition-opacity duration-500",
                        photoLoaded ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </>
                ) : (
                  /* 🚫 No photo → placeholder fills the frame, no blur trickery */
                  <Image
                    src={NO_IMAGE}
                    alt={doc.name || ""}
                    fill
                    priority
                    sizes="(max-width: 479px) 100vw, (max-width: 639px) 140px, (max-width: 767px) 160px, 186px"
                    ref={(img) => { if (img?.complete) setPhotoLoaded(true); }}
                    onLoad={() => setPhotoLoaded(true)}
                    className={cn(
                      "object-cover transition-opacity duration-500",
                      photoLoaded ? "opacity-100" : "opacity-0"
                    )}
                  />
                )}
              </div>
            </div>

            {/* 🩺 Doctor info */}
            <div className="flex items-start justify-between grow px-1 min-[480px]:px-0 min-[480px]:pt-1">
              <div className="flex flex-col gap-y-2 sm:gap-y-3 min-w-0">

                <h1 className="text-black font-medium text-base sm:text-lg leading-snug truncate">
                  {formatDoctorName(doc.name)}
                </h1>

                <span className="text-neutral-950 text-xs sm:text-sm font-medium">
                  {doc.specialty}
                </span>

                {/* ⭐ Rating (appointment mode renders its own compact card above) */}
                <StarRating rating={doc.rating ?? 0} reviewsCount={doc.reviewsCount ?? 0} />
              </div>

              {/* 🪪 Medical code — desktop only */}
              <MedicalCodeBadge code={doc.medicalCode ?? "—"} className="hidden lg:flex shrink-0 mr-2" />
            </div>
          </div>

          {/* ─── Secondary Info Block ─────────────────────────────────── */}
          {(showDefaultInfo || mode === "payment" || mode === "profile") && (
            <div className="mt-3 px-1 min-[480px]:px-0">
              <MedicalCodeBadge code={doc.medicalCode ?? "—"} className="flex lg:hidden mb-2.5" />

              {mode === "payment" && <PaymentDetailsTable data={doc} />}

              {showDefaultInfo && (
                <div className="space-y-2">
                  <InfoRow icon={MapPin}      label="آدرس مطب:"             value={doc.address ?? "—"} />
                  <InfoRow icon={AlarmClock}  label="اولین نوبت در دسترس:"  value={doc.nextAvailableSlot ?? "نوبت خالی موجود نیست"} />
                </div>
              )}

              {mode === "profile" && (
                <div className="space-y-3 sm:space-y-4">
                  <InfoRow icon={MapPin}        label="آدرس مطب:"   value={doc.address ?? "—"} />
                  <InfoRow icon={AlarmClock}    label="تاریخ نوبت:" value={doc.nextAvailableSlot ?? "—"} />
                  <InfoRow icon={Hash}   label="کد پیگیری:"  value={doc.trackingCode ?? "—"} />
                </div>
              )}
            </div>
          )}
        </div>

        {showBio && (
          <>
            <Separator className="hidden md:block bg-neutral-100" />
            <BioSection bio={doc.bio ?? ""} title={formatDoctorName(doc.name)} className="hidden md:block" />
          </>
        )}

        {showActions && <ActionButtons mode={mode} doctorId={doc.doctorId ?? ""} schedule={schedule ?? []} isLoggedIn={isLoggedIn} />}
      </div>

      {showBio && (
        <BioSection bio={doc.bio ?? ""} title={formatDoctorName(doc.name)} className="mt-4 block md:hidden" />
      )}
    </>
  );
}
