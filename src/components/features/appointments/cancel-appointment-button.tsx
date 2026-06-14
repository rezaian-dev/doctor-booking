'use client';

import { useState, useTransition } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { revalidateDoctorsClient } from '@/lib/utils/revalidate-doctors-client';

interface CancelAppointmentButtonProps {
  // ✅ Server action passed as prop
  cancelAction: () => Promise<{ success?: boolean; error?: string }>;
  // 🗑️ Called on success to remove from list optimistically
  onCancelled: () => void;
}

export default function CancelAppointmentButton({
  cancelAction,
  onCancelled,
}: CancelAppointmentButtonProps) {
  const [open, setOpen]       = useState(false);
  const [pending, startTransition] = useTransition();

  const handleConfirm = () => {
    startTransition(async () => {
      const result = await cancelAction();
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success('نوبت با موفقیت لغو شد');
        setOpen(false);
        // 🔄 The freed slot is back in the doctor's schedule — bust the SWR /doctors cache
        //    so the listing shows renewed availability instantly (server caches already busted). ✨
        void revalidateDoctorsClient();
        // ✅ Remove from UI immediately after success
        onCancelled();
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {/* 🗑️ Trigger button */}
      <AlertDialogTrigger asChild>
        <button className="
          text-xs font-medium px-3 py-1.5 rounded-lg border border-red-200
          text-red-500 bg-red-50 hover:bg-red-100 hover:border-red-300
          transition-all duration-200 cursor-pointer
        ">
          لغو نوبت
        </button>
      </AlertDialogTrigger>

      {/* 💬 Confirm dialog */}
      <AlertDialogContent className="max-w-sm text-right" dir="rtl">
        <AlertDialogHeader className="text-right">
          <AlertDialogTitle className="text-neutral-900">
            لغو نوبت
          </AlertDialogTitle>
          <AlertDialogDescription className="text-neutral-500 text-sm leading-relaxed">
            آیا از لغو این نوبت مطمئن هستید؟ پس از لغو، این نوبت قابل بازگشت نیست.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex-row-reverse gap-2 sm:gap-2">
          {/* ✅ Confirm cancel */}
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={pending}
            className="
              flex-1 h-10 rounded-xl bg-red-500 hover:bg-red-600
              text-white text-sm font-medium
              disabled:opacity-60 disabled:cursor-not-allowed
              transition-colors duration-200
            "
          >
            {pending ? (
              <span className="flex items-center justify-center gap-x-2">
                <span className="size-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                در حال لغو...
              </span>
            ) : (
              'بله، لغو شود'
            )}
          </AlertDialogAction>

          {/* ❌ Cancel dialog */}
          <AlertDialogCancel className="
            flex-1 h-10 rounded-xl border border-neutral-200
            text-neutral-700 text-sm font-medium
            hover:bg-neutral-50 transition-colors duration-200
          ">
            انصراف
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
