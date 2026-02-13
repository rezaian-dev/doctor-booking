'use server';

import { cookies } from 'next/headers';
import { verifyAccessToken } from './auth-jwt';
import { User } from '@/lib/db/models/user.model';
import { connectDB } from '@/lib/db/connection';

// 🔐 Get authenticated user (SSR)
export async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;
  if (!token) return null;

  const payload = await verifyAccessToken(token);
  if (!payload) return null;

  await connectDB();
  const user = await User.findById(payload.userId).select('-password').lean();
  if (!user) return null;

  // 🔄 Serialize MongoDB ObjectId to string
  return {
    _id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    createdAt: user.createdAt?.toISOString(),
    updatedAt: user.updatedAt?.toISOString(),
  };
}

// 📄 Get user document (API routes)
export async function getAuthUserDoc(token: string) {
  if (!token) return null;

  const payload = await verifyAccessToken(token);
  if (!payload) return null;

  await connectDB();
  return await User.findById(payload.userId).select('-password');
}
