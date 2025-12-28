import Button from "@/components/templates/profile/Button";
import { Clock, Edit, Loader2, Save, X } from "lucide-react";

// 🎯 Action buttons
const Actions = ({ isEditing, isSaving, onEdit, onSave, onCancel, onAppointments }: any) => (
  <div className="flex gap-3">
    {isEditing ? (
      <>
        <Button onClick={onSave} disabled={isSaving} className="flex-1">
          {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          {isSaving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
        </Button>
        <Button variant="secondary" onClick={onCancel} disabled={isSaving} className="flex-1">
          <X size={18} />
          انصراف
        </Button>
      </>
    ) : (
      <>
        <Button onClick={onEdit} className="flex-1">
          <Edit size={18} />
          ویرایش اطلاعات
        </Button>
        <Button variant="secondary" onClick={onAppointments} className="flex-1">
          <Clock size={18} />
          لیست نوبت‌ها
        </Button>
      </>
    )}
  </div>
);

export default Actions;
