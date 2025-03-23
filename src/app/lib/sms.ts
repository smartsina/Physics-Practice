interface MeliPayamakResponse {
  Value: string;
  RetStatus: number;
  StrRetStatus: string;
}

export async function sendSMS(phone: string, message: string): Promise<boolean> {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Mock SMS] To: ${phone}, Message: ${message}`);
    return true;
  }

  try {
    const username = process.env.MELIPAYAMAK_USERNAME;
    const password = process.env.MELIPAYAMAK_PASSWORD;
    const from = process.env.MELIPAYAMAK_NUMBER;

    if (!username || !password || !from) {
      console.error('MeliPayamak credentials not configured');
      return false;
    }

    const response = await fetch('https://api.payamak-panel.com/post/Send.asmx/SendSimpleSMS2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        username,
        password,
        to: phone,
        from,
        text: message,
        isflash: 'false'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: MeliPayamakResponse = await response.json();
    
    // RetStatus 1 means success
    return data.RetStatus === 1;
  } catch (error) {
    console.error('SMS sending failed:', error);
    return false;
  }
}