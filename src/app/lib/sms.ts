interface SMSProvider {
  sendSMS(phone: string, message: string): Promise<boolean>;
}

class KavenegarProvider implements SMSProvider {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.KAVENEGAR_API_KEY || '';
    this.baseUrl = 'https://api.kavenegar.com/v1';
  }

  async sendSMS(phone: string, message: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${this.apiKey}/sms/send.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            receptor: phone,
            message,
          }),
        }
      );

      const data = await response.json();
      return data.status === 200;
    } catch (error) {
      console.error('Error sending SMS:', error);
      return false;
    }
  }
}

class MockProvider implements SMSProvider {
  async sendSMS(phone: string, message: string): Promise<boolean> {
    console.log('Mock SMS sent to:', phone);
    console.log('Message:', message);
    return true;
  }
}

// Use mock provider in development, Kavenegar in production
const provider: SMSProvider = process.env.NODE_ENV === 'production'
  ? new KavenegarProvider()
  : new MockProvider();

export async function sendSMS(phone: string, message: string): Promise<boolean> {
  return provider.sendSMS(phone, message);
}