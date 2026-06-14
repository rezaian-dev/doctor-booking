'use client';

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

// 📸 Avatar upload component
export function AvatarUpload({ firstName, isEditMode, previewUrl, onImageSelect, onImageRemove }: AvatarUploadProps) {
  // 📁 Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('لطفاً یک فایل تصویری انتخاب کنید');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('حجم فایل باید کمتر از ۵MB باشد');
      return;
    }

    onImageSelect(file);
  };

  // 🗑️ Handle image removal
  const handleRemoveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onImageRemove();
  };

  // 🔤 Get user initials
  const getInitials = () => {
    const first = firstName?.[0] || '';
    return first.toUpperCase() || '؟';
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Label
          htmlFor="avatar-upload"
          className={`relative block ${isEditMode ? 'cursor-pointer group' : 'cursor-default'}`}
        >
          <Avatar className="w-32 h-32 border-4 border-neutral-200 transition-all group-hover:border-primary-400">
            {previewUrl && <AvatarImage src={previewUrl} alt="Profile" />}
            <AvatarFallback className="text-2xl bg-primary-100 text-primary-700">
              {getInitials()}
            </AvatarFallback>
          </Avatar>

          {/* ➕ Add icon */}
          {isEditMode && !previewUrl && (
            <div className="absolute -bottom-1 -right-1 bg-primary-500 text-white rounded-full p-2 shadow-lg group-hover:bg-primary-600 transition-colors">
              <Plus className="w-4 h-4" />
            </div>
          )}

          {/* 🗑️ Remove icon */}
          {isEditMode && previewUrl && (
            <Button
              type="button"
              onClick={handleRemoveClick}
              className="absolute -bottom-1 -right-1 bg-danger-500 text-white rounded-full p-2 shadow-lg hover:bg-danger-600 transition-all"
              title="حذف تصویر"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </Label>

        {/* 📁 Hidden file input */}
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
