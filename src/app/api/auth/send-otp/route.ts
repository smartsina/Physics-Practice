import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { z } from 'zod';
import { sendSMS } from '@/app/lib/sms';
import crypto from 'crypto';

const phoneSchema = z.object({
  phone: z.string()
    .min(11, 'شماره موبایل باید ۱۱ رقم باشد')
    .max(11, 'شماره موبایل باید ۱۱ رقم باشد')
    .regex(/^09[0-9]{9}$/, 'شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد'),
});

// Generate a deterministic OTP based on phone number and timestamp
function generateOTP(phone: string): string {
  const timestamp = Math.floor(Date.now() / (5 * 60 * 1000)); // 5-minute window
  const data = `${phone}:${timestamp}`;
  const hash = crypto.createHash('sha256').update(data).digest('hex');
  return hash.slice(0, 6).padStart(6, '0');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received request body:', body); // Debug log

    // Validate request body
    const result = phoneSchema.safeParse(body);
    if (!result.success) {
      console.log('Validation errors:', result.error.errors); // Debug log
      return NextResponse.json(
        { 
          error: 'داده‌های ورودی نامعتبر است',
          details: result.error.errors 
        },
        { status: 400 }
      );
    }

    const { phone } = result.data;

    // Bypass OTP for admin phone number
    if (phone === '09170434697') {
      return NextResponse.json({
        success: true,
        message: 'ورود موفقیت‌آمیز',
        bypassOtp: true,
      });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'کاربر یافت نشد' },
        { status: 404 }
      );
    }

    // Generate deterministic OTP
    const otp = generateOTP(phone);

    // Store OTP in database
    await prisma.user.update({
      where: { phone },
      data: {
        otp,
        otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      },
    });

    // Send OTP via SMS
    await sendSMS(phone, `کد تایید شما: ${otp}`);

    return NextResponse.json({
      success: true,
      message: 'کد تایید ارسال شد',
    });
  } catch (error) {
    console.error('Error in send-otp route:', error); // Debug log
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'داده‌های ورودی نامعتبر است',
          details: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'خطا در ارسال کد تایید' },
      { status: 500 }
    );
  }
}