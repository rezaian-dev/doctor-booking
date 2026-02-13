// 📱 Send OTP via SMS
export const sendOTP = async (phone: string, code: string): Promise<boolean> => {
  try {
    const res = await fetch('https://edge.ippanel.com/v1/api/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: process.env.SMS_API_KEY!,
      },
      body: JSON.stringify({
        sending_type: 'pattern',
        from_number: process.env.SMS_FROM_NUMBER,
        code: process.env.SMS_PATTERN_CODE,
        recipients: [phone],
        params: { code },
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
};
