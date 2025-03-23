// This is a mock SMS service for development
// Replace with actual SMS service implementation in production

export async function sendSMS(phone: string, message: string): Promise<boolean> {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Mock SMS] To: ${phone}, Message: ${message}`);
    return true;
  }

  try {
    // TODO: Implement actual SMS service
    // Example:
    // const response = await fetch('SMS_API_URL', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${process.env.SMS_API_KEY}`
    //   },
    //   body: JSON.stringify({ phone, message })
    // });
    // return response.ok;
    
    return true;
  } catch (error) {
    console.error('SMS sending failed:', error);
    return false;
  }
}