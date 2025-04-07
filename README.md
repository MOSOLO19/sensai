# SensAI - AI Career Coach

A modern AI-powered career coaching platform built with Next.js, Neon DB, Tailwind, Prisma, and Shadcn UI.

## Environment Setup

1. Clone the repository
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Update the `.env` file with your credentials:
   - Get a PostgreSQL database URL from [Neon](https://neon.tech)
   - Set up [Clerk](https://clerk.dev) and add authentication keys
   - Get [Google AI API key](https://makersuite.google.com/app/apikey) for Gemini

⚠️ Security Notes:
- Never commit `.env` files to version control
- Use different API keys for development and production
- Rotate production keys periodically
- Use environment-specific variables in deployment platforms

## Production Deployment

1. Set up your deployment platform (Vercel/Netlify)
2. Add environment variables in the platform's settings
3. Enable production environment protection
4. Set up proper CORS and security headers
5. Enable SSL/TLS encryption

## Development

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run development server
npm run dev
```

## Security Best Practices

- All API keys are stored securely in environment variables
- Database credentials are never exposed in client-side code
- Authentication is handled by Clerk's secure system
- All API routes are protected with proper authentication checks
- Database queries are protected against SQL injection via Prisma
- File uploads (if any) are properly validated and sanitized

### Environment Setup

Create a `.env` file with the following variables:

```
DATABASE_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

GEMINI_API_KEY=
``` 