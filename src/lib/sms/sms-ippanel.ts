/**
 * 📲 Sends an OTP SMS via IPPanel using a predefined template.
 * @param phone - Recipient's phone number (e.g., "989123456789")
 * @param code - The one-time password to deliver
 * @returns true if the SMS was accepted by the provider; false otherwise
 */
export const sendOTP = async (phone: string, code: string): Promise<boolean> => {
  try {
    const res = await fetch("https://edge.ippanel.com/v1/api/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.SMS_API_KEY!,
      },
      body: JSON.stringify({
        sending_type: "pattern",
        from_number: process.env.SMS_FROM_NUMBER,
        code: process.env.SMS_PATTERN_CODE,
        recipients: [phone],
        params: { code },
      }),
    });

    return res.ok;
  } catch {
    // 🛑 Log error in real apps (e.g., Sentry, console)
    return false;
  }
};
