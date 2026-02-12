import { User } from "@/lib/db/models/user.model";

// 🔍 Check for duplicate phone/email
export const checkDuplicates = async (
  phone: string,
  email?: string
): Promise<{ exists: boolean; message?: string }> => {
  const [phoneExists, emailExists] = await Promise.all([
    User.findOne({ phone }),
    email?.trim() ? User.findOne({ email: email.trim() }) : null,
  ]);

  if (phoneExists) {
    return { exists: true, message: "شماره موبایل قبلاً ثبت شده است" };
  }

  if (emailExists) {
    return { exists: true, message: "ایمیل قبلاً ثبت شده است" };
  }

  return { exists: false };
};
