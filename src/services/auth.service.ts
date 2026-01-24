// services/auth.service.ts

/**
 * Authentication service for handling API calls
 * Contains all auth-related API logic
 */

export interface SignupData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export interface OtpData {
  otp: string;
}

export interface PhoneData {
  phone: string;
}

/**
 * Simulates sending OTP for signup
 */
export const sendSignupOtp = async (data: SignupData): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Simulate 90% success rate
  if (Math.random() > 0.1) {
    return;
  }
  throw new Error('Failed to send OTP');
};

/**
 * Simulates sending OTP for login
 */
export const sendLoginOtp = async (data: PhoneData): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  if (Math.random() > 0.1) {
    return;
  }
  throw new Error('Failed to send OTP');
};

/**
 * Simulates verifying OTP and completing signup
 */
export const verifySignupOtp = async (data: OtpData): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  if (Math.random() > 0.1) {
    return;
  }
  throw new Error('Invalid OTP');
};

/**
 * Simulates verifying OTP and completing login
 */
export const verifyLoginOtp = async (data: OtpData): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  if (Math.random() > 0.1) {
    return;
  }
  throw new Error('Invalid OTP');
};

/**
 * Simulates resending OTP
 */
export const resendOtp = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
};
