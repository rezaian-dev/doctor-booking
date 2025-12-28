"use client";
import { Trash2, Upload } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
import Button from "./Button";

// 📸 Avatar component props type
interface AvatarProps {
  imageUrl: string;
  onImageSelect: (file: File) => void;
  onImageRemove: () => void;
  isEditing: boolean;
  hasImage: boolean;
}

// 📸 Avatar upload component
const Avatar = ({
  imageUrl,
  onImageSelect,
  onImageRemove,
  isEditing,
  hasImage,
}: AvatarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // 📸 Image validation utility
 const validateImage = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 2 * 1024 * 1024;
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'فرمت تصویر باید JPG، PNG یا WEBP باشد' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'حجم تصویر نباید بیشتر از ۲ مگابایت باشد' };
  }

  return { valid: true };
};

  // 📂 Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImage(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    onImageSelect(file);

    // 🧹 Reset input to allow selecting the same file again
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* 🖼️ Image preview */}
      <div className="relative w-32 h-32 group">
        <div className="w-full h-full rounded-full overflow-hidden bg-linear-to-br from-purple-400 to-pink-400 p-1">
          <img
            src={imageUrl}
            alt="Profile"
            className="w-full h-full rounded-full bg-white object-cover"
          />
        </div>

        {/* 🎨 Overlay on hover (only in edit mode) */}
        {isEditing && (
          <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <Upload className="text-white" size={32} />
          </div>
        )}
      </div>

      {/* 🎛️ Action buttons (only in edit mode) */}
      {isEditing && (
        <div className="flex gap-2 w-full">
          {/* 📤 Upload button */}
          <Button
            variant="outline"
            onClick={() => inputRef.current?.click()}
            className="flex-1"
          >
            <Upload size={18} />
            آپلود تصویر
          </Button>

          {/* 🗑️ Delete button (only if image exists) */}
          {hasImage && (
            <Button
              variant="outline"
              onClick={onImageRemove}
              className="text-red-600 hover:bg-red-50 hover:border-red-300"
            >
              <Trash2 size={18} />
            </Button>
          )}
        </div>
      )}

      {/* 📁 Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* ℹ️ Info text (only in edit mode) */}
      {isEditing && (
        <p className="text-xs text-gray-500 text-center">
          JPG, PNG یا WEBP • حداکثر ۲ مگابایت
        </p>
      )}
    </div>
  );
};

export default Avatar;
