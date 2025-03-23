import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/app/lib/prisma';
import { sendSMS } from '@/app/lib/sms';
import { createHash } from 'crypto';

const phoneSchema = z.object({
  phoneNumber: z.string()
    .min(11, 'شماره تلفن باید ۱۱ رقم باشد')
    .max(11, 'شماره تلفن باید ۱۱ رقم باشد')
    .regex(/^09\d{9}$/, 'شماره تلفن باید با ۰۹ شروع شود'),
});

// Generate a deterministic OTP based on phone number and timestamp
function generateOTP(phoneNumber: string): string {
  const timestamp = Math.floor(Date.now() / (5 * 60 * 1000)); // 5-minute window
  const data = `${phoneNumber}:${timestamp}:${process.env.NEXTAUTH_SECRET}`;
  const hash = createHash('sha256').update(data).digest('hex');
  return hash.slice(0, 6).replace(/[^0-9]/g, '1');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phoneNumber } = phoneSchema.parse(body);

    // Generate OTP
    const otp = generateOTP(phoneNumber);

    // Save OTP and phone number in database
    await prisma.verificationToken.create({
      data: {
        identifier: phoneNumber,
        token: otp,
        expires: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      },
    });

    // Send OTP via SMS
    const message = `کد تایید شما: ${otp}\nفیزیک کنکور`;
    const sent = await sendSMS(phoneNumber, message);

    if (!sent) {
      return NextResponse.json(
        { message: 'خطا در ارسال پیامک' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'کد تایید ارسال شد' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Error in send-otp:', error);
    return NextResponse.json(
      { message: 'خطای سرور' },
      { status: 500 }
    );
  }
}