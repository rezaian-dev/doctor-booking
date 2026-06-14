import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

// 💀 Profile loading skeleton — a 1:1 structural mirror of <ProfileCard> in view mode.
//    Reuses the same Card primitives and field rhythm so the real form swaps in with
//    zero layout shift. ✨

// 🎯 Control heights in form order: 6 text inputs (h-9) → gender select + datepicker (h-10)
const INPUT_H = ['h-9', 'h-9', 'h-9', 'h-9', 'h-9', 'h-9', 'h-10', 'h-10'] as const;
// 🏷️ Label widths loosely mirror the real Persian labels (نام … تاریخ تولد) for a natural look
const LABEL_W = ['w-12', 'w-24', 'w-16', 'w-24', 'w-16', 'w-12', 'w-16', 'w-20'] as const;

const ProfileSkeleton = () => (
  <Card className="shadow-lg">
    {/* 🧭 Header — same px-6 / pt-8 rhythm as <ProfileHeader> (title right, action left) */}
    <CardHeader className="space-y-4">
      <div className="flex flex-col pt-8 sm:flex-row justify-between items-start sm:items-center gap-3">
        <Skeleton className="h-5 w-36" /> {/* 📌 "پروفایل کاربری" title (text-xl) */}
        <Skeleton className="h-10 w-28 rounded-md" /> {/* ✏️ edit button (h-10 default) */}
      </div>
    </CardHeader>

    {/* 🧾 Content — matches <CardContent className="p-6 md:p-8"> + form space-y-6 */}
    <CardContent className="p-6 md:p-8">
      <div className="space-y-6">
        {/* 🖼️ Avatar — 128px circle, centered (matches <AvatarUpload>) */}
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-32 w-32 rounded-full" />
        </div>

        {/* 📋 2-column field grid — each field reserves label + control + h-5 message row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INPUT_H.map((h, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className={`h-3.5 ${LABEL_W[i]}`} /> {/* 🏷️ label (right-aligned in RTL) */}
              <Skeleton className={`${h} w-full rounded-md`} /> {/* 🔲 input / select / datepicker */}
              <div className="h-5" aria-hidden /> {/* ↕️ reserve the always-present FieldMsg height */}
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

export default ProfileSkeleton;
