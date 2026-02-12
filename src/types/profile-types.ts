// 👤 Core user profile interface
export interface UserProfile {
  firstName: string;
  lastName: string;
  nationalCode?: string;      // 🪪 Optional Iranian national ID
  birthDate?: string;         // 📅 Jalali date string (e.g., "1370-05-15")
  gender?: 'male' | 'female' | ''; // ♿️ Empty string = not specified
  city?: string;              // 🏙️ User's current city
  email?: string;             // ✉️ Optional contact email
  phone: string;              // 📱 Required mobile number (e.g., "09123456789")
  imageUrl?: string;          // 🖼️ Profile image URL (CDN-hosted)
  password?: string;          // 🔑 Only used during registration/update
}

// 🌐 API Response types

// ✅ Profile update response payload
export interface UpdateProfileResponse {
  success: boolean;
  user: {
    firstName: string;
    lastName: string;
    email?: string;
    phone: string;
    nationalCode?: string;
    birthDate?: string;       // 📅 Jalali date string (e.g., "1370-05-15")
    gender?: 'male' | 'female'; // ⚠️ Never returns empty string in response
    city?: string;
    avatar?: string;          // 🔄 Mirrors `imageUrl` under standard key
  };
  message?: string;           // 💬 Optional success/error detail
}

// 📤 Image upload response
export interface UploadImageResponse {
  success: boolean;
  imageUrl: string;           // 🔗 Publicly accessible CDN URL
  message?: string;           // 💬 e.g., "Image uploaded successfully"
}
