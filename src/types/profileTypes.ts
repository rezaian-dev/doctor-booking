// 🎯 User profile type definition (base fields)
export interface UserProfile {
  firstName: string;
  lastName: string;
  nationalCode: string;
  birthDate: string;
  gender: string;
  city: string;
  email: string;
  mobile: string;
  imageUrl?: string; // ✨ Added: Optional image URL
}

// 📊 API request/response types
export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  nationalCode: string;
  birthDate: string;
  gender: string;
  city: string;
  email: string;
  mobile: string;
  imageUrl?: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  data: UserProfile;
  message?: string;
}

// ✅ Precise type for ProfileField
export type ProfileField = {
  name: keyof UserProfile; // 🔑 This is the key fix - ensures name is a valid key of UserProfile
  label: string;
  placeholder: string;
  direction: 'ltr' | 'rtl';
  type?: string;
  icon?: React.ReactNode;
  maxLength?: number;
};

// 📤 Image upload types
export interface UploadImageRequest {
  file: File;
}

export interface UploadImageResponse {
  success: boolean;
  imageUrl: string;
  message?: string;
}

// 🗑️ Image delete types
export interface DeleteImageRequest {
  imageUrl: string;
}

export interface DeleteImageResponse {
  success: boolean;
  message?: string;
}
