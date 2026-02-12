import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import getAuthenticatedUser from '@/lib/auth/auth-session';
import { checkDuplicatesForUpdate } from '@/lib/utils/check-duplicates-utils';

// 📄 GET /api/profile - Fetch user profile
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);

    if (!user) {
      console.warn('🔐 Unauthorized access attempt to GET /api/profile');
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Please login to access your profile' },
        { status: 401 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('❌ Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ✏️ PATCH /api/profile - Update user profile
export async function PATCH(req: NextRequest) {
  try {
    // 🔐 Authenticate user
    const user = await getAuthenticatedUser(req);

    if (!user) {
      console.warn('🔐 Unauthorized access attempt to PATCH /api/profile');
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Session expired. Please login again' },
        { status: 401 }
      );
    }

    console.log('✅ Authenticated user:', user._id);

    const body = await req.json();

    // 🔍 Check for duplicates (phone & email)
    const isPhoneChanged = body.phone && body.phone !== user.phone;
    const isEmailChanged = body.email && body.email !== user.email;

    if (isPhoneChanged || isEmailChanged) {
      console.log('🔍 Checking duplicates:', {
        phone: isPhoneChanged ? body.phone : 'unchanged',
        email: isEmailChanged ? body.email : 'unchanged'
      });

      const duplicateCheck = await checkDuplicatesForUpdate(
        user._id.toString(),
        isPhoneChanged ? body.phone : undefined,
        isEmailChanged ? body.email : undefined
      );

      if (duplicateCheck.exists) {
        console.warn('⚠️ Duplicate found:', duplicateCheck.field);
        return NextResponse.json(
          {
            error: duplicateCheck.message,
            field: duplicateCheck.field
          },
          { status: 409 }
        );
      }
    }

    // 📝 Build update object (exclude empty strings)
    const updates: Record<string, any> = {};
    const allowedFields = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'nationalCode',
      'birthDate',
      'gender',
      'city'
    ];

    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        updates[field] = body[field] === '' ? undefined : body[field];
      }
    });

    // 🔐 Hash password if provided
    if (body.password?.trim()) {
      console.log('🔐 Password update requested');
      updates.password = await hash(body.password, 10);
    }

    console.log('📝 Updating fields:', Object.keys(updates));

    // ✅ Apply updates
    Object.assign(user, updates);
    await user.save();

    console.log('✅ Profile updated successfully for user:', user._id);

    // 📦 Return updated profile
    return NextResponse.json({
      success: true,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        nationalCode: user.nationalCode,
        birthDate: user.birthDate,
        gender: user.gender,
        city: user.city,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    console.error('❌ Profile update error:', error);

    // 🚨 Handle MongoDB duplicate key error (fallback)
    if (error.code === 11000) {
      const field = error.keyPattern?.email ? 'email' : 'phone';
      const message = field === 'email'
        ? 'ایمیل قبلاً ثبت شده است'
        : 'شماره موبایل قبلاً ثبت شده است';

      console.warn('⚠️ MongoDB duplicate key:', field);

      return NextResponse.json(
        { error: message, field },
        { status: 409 }
      );
    }

    // 🚨 Handle validation errors
    if (error.name === 'ValidationError') {
      console.warn('⚠️ Validation error:', error.message);
      return NextResponse.json(
        { error: 'Invalid data provided' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
