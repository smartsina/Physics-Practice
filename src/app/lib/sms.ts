interface SMSResponse {
  status: number;
  message: string;
}

export async function sendSMS(phone: string, message: string): Promise<boolean> {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Mock SMS] To: ${phone}, Message: ${message}`);
    return true;
  }

  try {
    const apiKey = process.env.SMS_API_KEY;

    if (!apiKey) {
      console.error('SMS API key not configured');
      return false;
    }

    const response = await fetch('https://api.payamak-panel.com/post/send.asmx/SendByApikey', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        apikey: apiKey,
        to: phone,
        text: message,
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SMSResponse = await response.json();
    
    // Log response for debugging
    console.log('SMS API Response:', data);
    
    // Check if the message was sent successfully
    return data.status === 1 || data.status === 200;
  } catch (error) {
    console.error('SMS sending failed:', error);
    return false;
  }
}