import { cookies } from 'next/headers';
import { verifyAccessToken } from './auth-jwt';

/**
 * 🔐 Get authenticated user ID from cookies
 * Returns user ID if authenticated, null otherwise
 */
export async function getAuthUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  if (!token) return null;

  const payload = await verifyAccessToken(token);
  return payload?.userId || null;
}
