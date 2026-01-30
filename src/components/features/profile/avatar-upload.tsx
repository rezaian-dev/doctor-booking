import { Plus, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

type AvatarUploadProps = {
  firstName: string;
  isEditMode: boolean;
  previewUrl: string;
  onImageSelect: (file: File) => void;
  onImageRemove: () => void;
};

export function AvatarUpload({
  firstName,
  isEditMode,
  previewUrl,
  onImageSelect,
  onImageRemove,
}: AvatarUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('لطفاً یک فایل تصویری انتخاب کنید');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('حجم فایل باید کمتر از ۵ مگابایت باشد');
      return;
    }

    onImageSelect(file);
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onImageRemove();
  };

  // ✅ REALTIME: این تابع هر بار که firstName تغییر کنه، دوباره اجرا میشه
  const getInitials = () => {
    const first = firstName?.[0] || '';
    return first.toUpperCase() || '؟';
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {/* Avatar with click to upload using Label */}
        <Label
          htmlFor="avatar-upload"
          className={`relative block ${isEditMode ? 'cursor-pointer group' : 'cursor-default'}`}
        >
          <Avatar className="w-32 h-32 border-4 border-gray-200 transition-all group-hover:border-primary-400">
            {previewUrl && <AvatarImage src={previewUrl} alt="Profile" />}
            {/* ✅ REALTIME: AvatarFallback همیشه getInitials() رو صدا میزنه */}
            <AvatarFallback className="text-2xl bg-primary-100 text-primary-700">
              {getInitials()}
            </AvatarFallback>
          </Avatar>

          {/* Plus icon indicator (bottom-right) */}
          {isEditMode && !previewUrl && (
            <div className="absolute -bottom-1 -right-1 bg-primary-500 text-white rounded-full p-2 shadow-lg group-hover:bg-primary-600 transition-colors">
              <Plus className="w-4 h-4" />
            </div>
          )}

          {/* Trash icon indicator (bottom-right when image exists) */}
          {isEditMode && previewUrl && (
            <Button
              type="button"
              onClick={handleRemoveClick}
              className="absolute -bottom-1 -right-1 bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600 transition-all duration-200"
              title="حذف تصویر"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </Label>

        {/* Hidden file input */}
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={!isEditMode}
        />
      </div>
    </div>
  );
}
