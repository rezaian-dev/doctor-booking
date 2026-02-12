import { cookies } from 'next/headers';
import { verifyAccessToken } from './auth-jwt';
import { connectDB } from '@/lib/db/db-connect';
import { User as UserModel } from '@/lib/db/models/user.model';
import { User } from '@/types/user.types';


// 🔐 Get authenticated user from server-side
export async function getServerUser(): Promise<User | null> {
  try {
    // 🍪 Extract access token
    const token = (await cookies()).get('accessToken')?.value;
    if (!token) return null;

    // ✅ Verify JWT payload
    const payload = await verifyAccessToken(token);
    if (!payload?.userId) return null;

    // 🗄️ Fetch user from database
    await connectDB();
    const user = await UserModel.findById(payload.userId)
      .select('firstName lastName avatar')
      .lean<User>();

    if (!user) return null;

    // 📦 Return sanitized user data
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
    };
  } catch {
    return null;
  }
}
