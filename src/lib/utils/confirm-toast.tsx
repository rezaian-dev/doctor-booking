import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface ConfirmToastOptions {
  title: string;
  description?: string;
  confirmLabel: string;
  confirmVariant?: "destructive" | "default" | "warning";
  onConfirm: () => Promise<void>;
}

/**
 * 🪟 confirmToast — reusable inline confirm dialog via Sonner
 * Replaces duplicated toast.custom() patterns in EntityActions (doctors/articles)
 */
export function confirmToast({
  title,
  description,
  confirmLabel,
  confirmVariant = "destructive",
  onConfirm,
}: ConfirmToastOptions) {
  toast.custom(
    (id) => (
      <div dir="rtl" className="bg-white rounded-2xl shadow-lg border border-neutral-200 p-5 flex flex-col gap-4 w-75">
        <p className="font-medium text-neutral-900 text-sm">{title}</p>
        {description && <p className="text-xs text-neutral-500">{description}</p>}
        <div className="flex gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={() => toast.dismiss(id)}>
            انصراف
          </Button>
          <Button
            size="sm"
            variant={confirmVariant}
            onClick={() => { toast.dismiss(id); void onConfirm(); }}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    ),
    { duration: 10000 }
  );
}
