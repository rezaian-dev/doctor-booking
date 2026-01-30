// 👤 Core user profile interface
export interface UserProfile {
  firstName: string;
  lastName: string;
  nationalCode?: string;
  birthDate?: string;
  gender?: 'male' | 'female' | '';
  city?: string;
  email?: string;
  phone: string;
  imageUrl?: string;
  password?: string;
}

// 🌐 API Response types
export interface UpdateProfileResponse {
  success: boolean;
  user: {
    firstName: string;
    lastName: string;
    email?: string;
    phone: string;
    nationalCode?: string;
    birthDate?: string;
    gender?: 'male' | 'female';
    city?: string;
    avatar?: string;
  };
  message?: string;
}

export interface UploadImageResponse {
  success: boolean;
  imageUrl: string;
  message?: string;
}
