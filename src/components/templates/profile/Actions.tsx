import { Clock, Edit, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

// 🎯 Props type for action buttons
interface ActionsProps {
  isEditing: boolean;
  isSaving: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onAppointments: () => void;
}

// 🎯 Action buttons component
const Actions = ({
  isEditing,
  isSaving,
  onEdit,
  onSave,
  onCancel,
  onAppointments,
}: ActionsProps) => (
  <div className="flex flex-wrap gap-3">
    {isEditing ? (
      <>
        {/* 💾 Save button */}
        <Button
          onClick={onSave}
          disabled={isSaving}
          className="flex-1 text-sm gap-2 cursor-pointer bg-primary-500 hover:bg-primary-600"
        >
          {isSaving ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Save size={18} />
          )}
          {isSaving ? "در حال ذخیره..." : "ذخیره تغییرات"}
        </Button>

        {/* ❌ Cancel button */}
        <Button
          variant="secondary"
          onClick={onCancel}
          disabled={isSaving}
          className="flex-1 text-sm gap-2 cursor-pointer"
        >
          انصراف
        </Button>
      </>
    ) : (
      <>
        {/* ✏️ Edit button */}
        <Button onClick={onEdit} className="flex-1 text-sm gap-2 bg-primary-500 hover:bg-primary-600 cursor-pointer">
          <Edit size={18} />
          ویرایش اطلاعات
        </Button>

        {/* 📅 Appointments button */}
        <Button
          variant="secondary"
          onClick={onAppointments}
          className="flex-1 text-sm gap-2 cursor-pointer"
        >
          <Clock size={18} />
          لیست نوبت‌ها
        </Button>
      </>
    )}
  </div>
);

export default Actions;
