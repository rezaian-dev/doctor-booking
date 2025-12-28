"use client";

import Actions from "@/components/templates/profile/Actions";
import Avatar from "@/components/templates/profile/Avatar";
import ProfileEdit from "@/components/templates/profile/ProfileEdit";
import ProfileView from "@/components/templates/profile/ProfileView";
import { profileSchema } from "@/lib/validations/profileSchema";
import { UserProfile } from "@/types/profileTypes";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

// 🎯 Extended UserProfile with image
interface UserProfileWithImage extends UserProfile {
  imageUrl?: string;
}

// 🎴 ProfileCard component props type
interface ProfileCardProps {
  initialProfile: UserProfileWithImage;
}

// 🎴 Main profile card component
const ProfileCard = ({ initialProfile }: ProfileCardProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfileWithImage>(initialProfile);

  // 🖼️ Pending image states (temporary until save)
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [pendingImagePreview, setPendingImagePreview] = useState<string | null>(
    null
  );
  const [imageChanged, setImageChanged] = useState(false);

  // 🔧 Mock API service
  const api = {
    // 💾 Update complete profile (including image URL)
    updateProfile: (data: UserProfileWithImage) =>
      new Promise<UserProfileWithImage>((resolve) =>
        setTimeout(() => {
          console.log("✅ Profile updated:", data);
          resolve(data);
        }, 1500)
      ),

    // 📤 Upload image to server and return URL
    uploadImage: (file: File) =>
      new Promise<string>((resolve) =>
        setTimeout(() => {
          const uploadedUrl = URL.createObjectURL(file);
          console.log("✅ Image uploaded:", uploadedUrl);
          resolve(uploadedUrl);
        }, 1000)
      ),

    // 🗑️ Delete image from server
    deleteImage: (imageUrl: string) =>
      new Promise<void>((resolve) =>
        setTimeout(() => {
          console.log("✅ Image deleted:", imageUrl);
          resolve();
        }, 800)
      ),
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserProfile>({
    defaultValues: profile,
    resolver: yupResolver(profileSchema),
    mode: "onChange",
  });

  // 📸 Handle image selection (preview only, no upload yet)
  const handleImageSelect = (file: File) => {
    setPendingImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setPendingImagePreview(previewUrl);
    setImageChanged(true);
    toast.success("تصویر انتخاب شد. برای آپلود، دکمه ذخیره را بزنید");
  };

  // 🗑️ Handle image removal
  const handleImageRemove = () => {
    setPendingImageFile(null);
    setPendingImagePreview("DELETED"); // ✨ Mark as deleted
    setImageChanged(true);
    toast.info("تصویر حذف شد. برای اعمال تغییرات، دکمه ذخیره را بزنید");
  };

  // 💾 Handle form submission with image upload
  const onSubmit = async (data: UserProfile) => {
    setIsSaving(true);

    try {
      let finalImageUrl = profile.imageUrl;

      // 📤 Handle image changes
      if (imageChanged) {
        if (pendingImageFile) {
          // Upload new image
          toast.loading("در حال آپلود تصویر...");
          finalImageUrl = await api.uploadImage(pendingImageFile);
          toast.dismiss();
          toast.success("تصویر با موفقیت آپلود شد ✓");
        } else {
          // Delete image if removed
          if (profile.imageUrl) {
            toast.loading("در حال حذف تصویر...");
            await api.deleteImage(profile.imageUrl);
            toast.dismiss();
            toast.success("تصویر با موفقیت حذف شد ✓");
          }
          finalImageUrl = undefined; // Remove image from profile
        }
      }

      // 💾 Prepare complete profile data with image
      const completeProfileData: UserProfileWithImage = {
        ...data,
        imageUrl: finalImageUrl,
      };

      // 🚀 Update profile with all data
      toast.loading("در حال ذخیره اطلاعات...");
      const updatedProfile = await api.updateProfile(completeProfileData);
      toast.dismiss();

      // ✅ Update states
      setProfile(updatedProfile);
      setPendingImageFile(null);
      setPendingImagePreview(null);
      setImageChanged(false);
      setIsEditing(false);

      toast.success("اطلاعات با موفقیت ذخیره شد ✓");

      // 📊 Log complete profile object
      console.log("📦 Complete Profile Object:", updatedProfile);
    } catch (error) {
      toast.error("خطا در ذخیره اطلاعات");
      console.error("❌ Save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // 🚀 Navigate to appointments page
  const handleAppointments = () => {
    router.push("/profile/appointments");
  };

  // ❌ Handle cancel with cleanup
  const handleCancel = () => {
    reset(profile);
    setIsEditing(false);

    // 🧹 Cleanup pending image changes
    if (pendingImagePreview && pendingImagePreview !== "DELETED") {
      URL.revokeObjectURL(pendingImagePreview);
    }
    setPendingImageFile(null);
    setPendingImagePreview(null);
    setImageChanged(false);

    toast.info("تغییرات لغو شد");
  };

  // 🖼️ Get current display image URL
  const getCurrentImageUrl = () => {
    // 🗑️ If marked as deleted, show default
    if (pendingImagePreview === "DELETED") {
      return "https://api.dicebear.com/7.x/avataaars/svg?seed=Default";
    }
    // 📸 If new image selected, show preview
    if (pendingImagePreview) return pendingImagePreview;
    // 💾 Otherwise show saved image or default
    if (profile.imageUrl) return profile.imageUrl;
    return "https://api.dicebear.com/7.x/avataaars/svg?seed=Default";
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3">
          <Avatar
            imageUrl={getCurrentImageUrl()}
            onImageSelect={handleImageSelect}
            onImageRemove={handleImageRemove}
            isEditing={isEditing}
            hasImage={
              !!(
                (pendingImagePreview && pendingImagePreview !== "DELETED") ||
                (profile.imageUrl && pendingImagePreview !== "DELETED")
              )
            }
          />
        </div>

        <div className="lg:w-2/3">
          {isEditing ? (
            <ProfileEdit register={register} errors={errors} />
          ) : (
            <ProfileView profile={profile} />
          )}
        </div>
      </div>

      <div className="pt-6 border-t">
        <Actions
          isEditing={isEditing}
          isSaving={isSaving}
          onEdit={() => {
            reset(profile);
            setIsEditing(true);
            toast.info("حالت ویرایش فعال شد");
          }}
          onSave={handleSubmit(onSubmit)}
          onCancel={handleCancel}
          onAppointments={handleAppointments}
        />
      </div>
    </div>
  );
};

export default ProfileCard;
