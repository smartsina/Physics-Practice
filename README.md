# Physics Practice Platform

A comprehensive web application for practicing physics questions for the Konkur exam in Iran. Built with Next.js, TypeScript, and PostgreSQL.

## Features

- 📱 User authentication via mobile numbers and OTP
- 💳 Payment gateway integration
- 📚 Various question practice modes
- 🧠 Smart review system
- 📊 Progress tracking
- 🏆 Competition features
- 🤖 AI-powered question difficulty adjustment
- 📵 Offline functionality

## Tech Stack

- **Frontend**: React.js with Next.js 14
- **Backend**: Node.js with Next.js API routes
- **Database**: PostgreSQL with Prisma ORM
- **UI Components**: Tremor, Tailwind CSS
- **Authentication**: Custom JWT-based auth with OTP
- **Type Safety**: TypeScript
- **Form Validation**: Zod

## Local Development

### Prerequisites

- Node.js (v18 or later)
- PostgreSQL (v14 or later)
- Git

### Setup

1. Clone the repository:
```bash
git clone https://github.com/smartsina/Physics-Practice.git
cd Physics-Practice
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Initialize database:
```bash
npx prisma migrate dev
npx prisma db seed
```

5. Start the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

### Admin Access

Default admin credentials:
- Phone: 09170434697
- Password: admin123

## Features

### User Features
- Practice physics questions
- Track progress
- Review mistakes
- Watch educational videos
- Participate in competitions

### Admin Features
- Manage users
- Add/edit questions
- Upload educational videos
- Monitor user progress
- Generate reports

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.