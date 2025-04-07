
# SensAI - AI Career Coach

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Neon DB](https://img.shields.io/badge/Neon%20DB-53DDAB?style=for-the-badge&logo=postgresql&logoColor=black)](https://neon.tech/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Shadcn UI](https://img.shields.io/badge/Shadcn_UI-000000?style=for-the-badge&logo=shadcn-ui&logoColor=white)](https://ui.shadcn.com/)
[![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.dev/)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini-8E44AD?style=for-the-badge&logo=google-gemini&logoColor=white)](https://gemini.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
<!-- Add other relevant badges: Build Status, Deployed URL -->
<!-- e.g., [![Vercel Deployment](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](YOUR_DEPLOYMENT_URL) -->

**SensAI** is a modern, AI-powered career coaching platform designed to provide personalized guidance and support. Built with Next.js, Neon DB, Tailwind CSS, Prisma, Clerk, and Shadcn UI, it aims to help users navigate their career paths effectively through AI-driven insights using Google Gemini.

## Table of Contents

- [Project Description](#project-description)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Environment Setup](#environment-setup)
- [Running Locally](#running-locally)
- [Production Deployment](#production-deployment)
- [Security Best Practices](#security-best-practices)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Acknowledgements](#acknowledgements)

## Project Description

SensAI is an AI-driven career coaching application designed to empower users in their professional journey. By leveraging the capabilities of AI (specifically Google Gemini), SensAI offers tailored advice, skill assessments, resume feedback, interview preparation, and career path recommendations.

The application utilizes a modern web stack:
*   **Frontend:** Next.js (React Framework)
*   **Database:** Neon DB (Serverless PostgreSQL)
*   **Styling:** Tailwind CSS & Shadcn UI (Component Library)
*   **ORM:** Prisma
*   **Authentication:** Clerk
*   **AI Integration:** Google Gemini API

SensAI aims to provide an intuitive, accessible, and effective platform for career development for individuals at all stages of their careers.

## Features

> *   **Personalized Career Advice:** Get AI-generated recommendations based on your profile, skills, and goals.
> *   **Skill Assessment:** Identify strengths and areas for improvement through interactive prompts.
> *   **Resume Feedback:** Upload your resume for AI-driven analysis and actionable suggestions.
> *   **Interview Preparation:** Practice common interview questions tailored to specific roles and receive feedback.
> *   **Career Path Exploration:** Discover potential career paths aligned with your interests and profile data.
> *   **User Authentication:** Secure sign-up and login powered by Clerk.
> *   **Responsive Design:** Accessible on various devices using Tailwind CSS and Shadcn UI.
> *   *(Add/Remove features specific to your implementation)*

## Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/)
*   **Database:** [Neon DB](https://neon.tech/) (Serverless PostgreSQL)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
*   **ORM:** [Prisma](https://www.prisma.io/)
*   **Authentication:** [Clerk](https://clerk.dev/)
*   **AI Model:** [Google Gemini](https://gemini.google.com/)
*   **Deployment:** [Vercel](https://vercel.com) / [Netlify](https://www.netlify.com) (or specify your choice)

## Environment Setup

To get SensAI running locally, you need to set up your environment variables.

1.  **Clone the repository:**
    bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    3.  **Set up environment variables:**
    Copy the example environment file:
    dotenv
        > # .env
        > DATABASE_URL="postgres://user:password@host:port/database?sslmode=require"
        >     *   **Clerk Authentication Keys:** Create an application on [Clerk](https://clerk.dev). Find your **Publishable Key** and **Secret Key** in the Clerk dashboard under API Keys.
        > dotenv
        > # .env
        > GEMINI_API_KEY="your_gemini_api_key"
        > 4.  **Apply Database Migrations:**
    Run the Prisma migrations to set up your database schema.
    bash
    npx prisma db seed
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Production Deployment

Follow these steps to deploy SensAI to production (example using Vercel):

1.  **Set up Vercel:**
    *   Create an account on [Vercel](https://vercel.com).
    *   Connect your Git repository (GitHub, GitLab, Bitbucket) where the SensAI code resides.
    *   Import the project into Vercel.

2.  **Configure Project Settings:**
    *   **Framework Preset:** Vercel should automatically detect Next.js.
    *   **Build Command:** `npm run build` (usually default).
    *   **Output Directory:** `.next` (usually default).
    *   **Install Command:** Ensure `npm install` or your package manager's equivalent is used. If using Prisma, ensure the build command includes migration generation: `prisma generate && next build` or adjust Vercel's build settings accordingly.

3.  **Add Environment Variables:**
    *   In your Vercel project settings, navigate to "Settings" -> "Environment Variables".
    *   Add the same variables defined in your `.env` file (`DATABASE_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `GEMINI_API_KEY`, `NEXT_PUBLIC_CLERK_SIGN_IN_URL`, etc.). Ensure you select the "Production" environment (and optionally "Preview").
    *   **Crucially, mark `CLERK_SECRET_KEY`, `DATABASE_URL`, and `GEMINI_API_KEY` as "Secret"**. The `NEXT_PUBLIC_` variables should NOT be marked as Secret.

4.  **Deploy:**
    *   Trigger a deployment manually or push to your main branch (if automatic deployments are configured via Git integration). Vercel will build and deploy your application.

5.  **CORS and Security Headers (Optional but Recommended):**
    *   For enhanced security, configure CORS and add security headers using Next.js Middleware (`middleware.ts`). Clerk handles much of the auth flow, but explicit headers add layers of defense.

typescript
    // middleware.ts
    import { authMiddleware } from "@clerk/nextjs/server";
    import { NextResponse } from 'next/server';
    import type { NextRequest } from 'next/server';

    // This example protects all routes including api/trpc routes
    // Please edit this to allow other routes to be public as needed.
    // See https://clerk.com/docs/references/nextjs/auth-middleware
    // for more information about configuring your Middleware
    export default authMiddleware({
      // Routes that can be accessed while signed out
      publicRoutes: ['/', '/sign-in', '/sign-up', '/api/public-route'], // Add any public routes here
      // Routes that can always be accessed, and have
      // no authentication information
      // ignoredRoutes: ['/no-auth-in-this-route'],
      afterAuth(auth, req) {
          const url = req.nextUrl.clone();

          // Handle redirects for users who are not authenticated
          // trying to access protected routes
          if (!auth.userId && !auth.isPublicRoute) {
              url.pathname = '/sign-in'; // Redirect to sign-in page
              return NextResponse.redirect(url);
          }

          // If the user is signed in and trying to access a public route like /sign-in,
          // redirect them to the dashboard or home page
          if (auth.userId && (req.nextUrl.pathname === '/sign-in' || req.nextUrl.pathname === '/sign-up')) {
            url.pathname = '/dashboard'; // Redirect to dashboard
            return NextResponse.redirect(url);
          }

          // Add Security Headers using NextResponse
          const response = NextResponse.next();

          // Add Security Headers (Example - Customize as needed)
          response.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' *.clerk.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: *.clerk.com; font-src 'self'; connect-src 'self' *.clerk.com api.example.com; frame-src *.clerk.com;"); // Adjust CSP based on your needs and third-party scripts/styles
          response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
          response.headers.set('X-Content-Type-Options', 'nosniff');
          response.headers.set('X-Frame-Options', 'DENY'); // Use SAMEORIGIN if framing is needed for specific Clerk components
          response.headers.set('X-XSS-Protection', '1; mode=block');
          response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

          return response;
      }
    });

    export const config = {
      matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
    };
        > **Important:** Customize the `publicRoutes`, redirect logic, and especially the `Content-Security-Policy` according to your specific application structure, domain(s), and any third-party integrations. Test thoroughly after implementing security headers.

## Security Best Practices

Ensuring the security of SensAI is crucial. Adhere to these practices:

### API Key / Credential Storage

*   **Environment Variables:** **Never** hardcode API keys (Gemini, Clerk Secret Key) or database credentials (`DATABASE_URL`) directly in your source code. Always use environment variables (`.env` for local development, platform's secrets management like Vercel Environment Variables for production).
*   **.gitignore:** Ensure your `.env` file is listed in `.gitignore` to prevent accidentally committing secrets to version control.
*   **Separate Keys:** Use distinct API keys and database credentials for development, preview/staging, and production environments.
*   **Regular Rotation:** Implement a policy for periodically rotating sensitive keys and credentials, especially in production.

### Database Security (Neon DB & Prisma)

*   **Principle of Least Privilege:** Connect to your Neon database using a role with the minimum permissions required by the application. Avoid using the superuser/owner role for the application connection string in production. Create specific database roles with restricted `GRANT` statements for `SELECT`, `INSERT`, `UPDATE`, `DELETE` on necessary tables/views.
*   **Connection Security:** Ensure your Neon DB connection string uses SSL (`sslmode=require`). Neon enforces this by default.
*   **SQL Injection Prevention:** Prisma, as an ORM, provides strong protection against SQL injection by using parameterized queries automatically for its standard query methods. Avoid using raw SQL queries (`$queryRaw`, `$executeRaw`) with untrusted user input unless absolutely necessary. If you must use raw queries, always ensure proper parameterization using Prisma's tagged templates or `$queryRawUnsafe`/`$executeRawUnsafe` with extreme caution and thorough input sanitization/validation.

### Authentication & Authorization (Clerk)

*   **Leverage Clerk Features:** Utilize Clerk's built-in security features for session management, password policies (complexity, expiry), and enable MFA (Multi-Factor Authentication) for users.
*   **Protect API Routes & Server Actions:** Secure your Next.js API routes and Server Components/Actions by checking authentication status and user identity using Clerk's server-side helpers (`auth()`, `currentUser()`). The `authMiddleware` shown in the Deployment section provides a base level of protection.

typescript
    // Example in an API Route or Server Action
    import { auth } from "@clerk/nextjs/server";
    import { NextResponse } from "next/server";

    export async function POST(request: Request) { // Or define a Server Action
      const { userId } = auth();

      if (!userId) {
        return new NextResponse('Unauthorized', { status: 401 });
      }

      // Proceed with logic for authenticated users...
      // const data = await request.json();
      // Access user-specific data, e.g., using userId
      // ...

      return NextResponse.json({ message: "Success", userId });
    }
    *   **Validate All Inputs:** Sanitize and validate **all** data received from users (form submissions, API request bodies, URL parameters) on the **server-side** before processing or storing it. Use robust schema validation libraries like `zod` or `yup`.
*   **File Upload Validation:** If your application handles file uploads (e.g., resumes):
    *   **Type Validation:** Check the file's MIME type on the server-side using libraries like `file-type`, don't rely solely on the `Content-Type` header or file extension provided by the client. Define an allowlist of acceptable MIME types.
    *   **Size Limits:** Enforce strict file size limits both on the client-side (for UX) and server-side (for security/resource control).
    *   **Sanitize Filenames:** Remove or replace characters that could be problematic or used for path traversal (`/`, `..`, `\`, etc.). Generate safe, unique filenames for storage (e.g., using UUIDs).
    *   **Secure Storage:** Store uploaded files in a dedicated, non-web-accessible location (e.g., a cloud storage bucket like AWS S3, Google Cloud Storage) rather than directly on the web server's filesystem. Use signed URLs for temporary access if needed.
    *   **Content Scanning:** Consider integrating a virus/malware scanning service for uploaded files, especially if files can be shared between users.

### Other Security Considerations

*   **Rate Limiting:** Implement rate limiting on sensitive API endpoints (login attempts, sign-up, resource-intensive AI requests) to prevent brute-force attacks, denial-of-service, and API abuse. Services like [Upstash Rate Limit](https://upstash.com/docs/ratelimit/overview) integrate well with Vercel Edge Functions/Middleware.
*   **Dependencies:** Keep all dependencies (npm packages, Next.js, Prisma, etc.) up-to-date by regularly running audits (`npm audit`, `yarn audit`, `pnpm audit`) and applying patches for known vulnerabilities. Use tools like Dependabot (GitHub) to automate dependency updates.
*   **Security Headers:** Implement comprehensive security headers (CSP, HSTS, X-Frame-Options, etc.) via `middleware.ts` or Next.js configuration (see Deployment section example). These headers instruct the browser on how to handle your site's content securely.

## Usage

> Explain how users interact with the deployed application.
>
> 1.  Visit the deployed application URL: `[Your Deployed App URL]`
> 2.  Sign up for a new account or log in using the Clerk-powered interface.
> 3.  Upon successful login, you will be redirected to the dashboard (`/dashboard` or your configured route).
> 4.  Navigate through the dashboard sections:
>     *   **Profile:** Update your personal details, skills, and career goals.
>     *   **Career Coach:** Interact with the AI to get personalized advice based on your profile.
>     *   **Resume Review:** Upload your resume (PDF, DOCX) for AI analysis and feedback.
>     *   **Interview Prep:** Select a job role and practice common interview questions.
>     *   **Explore Paths:** Discover potential career trajectories suggested by the AI.
> 5.  Log out securely when finished.
> *   *(Adjust these steps based on your actual application flow and features)*

## Contributing

> We welcome contributions! If you'd like to contribute, please follow these steps:
>
> 1.  **Fork the repository** on GitHub.
> 2.  **Clone your fork** locally: `git clone https://github.com/your-username/sensai.git`
> 3.  **Create a new branch** for your feature or bug fix: `git checkout -b feature/your-feature-name` or `bugfix/issue-description`.
> 4.  **Make your changes**, adhering to the project's coding style and conventions.
> 5.  **Test your changes** thoroughly. Add tests if applicable.
> 6.  **Commit your changes** with clear, descriptive commit messages: `git commit -m 'feat: Add resume upload validation'` or `fix: Correct navigation bug on mobile`. (Consider Conventional Commits).
> 7.  **Push your branch** to your fork: `git push origin feature/your-feature-name`.
> 8.  **Open a Pull Request (PR)** from your branch to the `main` branch of the original repository. Provide a detailed description of your changes in the PR.
>
> Please ensure your code adheres to the project's coding standards and includes tests where applicable. Wait for code review and address any feedback.

## License

text
> MIT License
>
> Copyright (c) [Year] [Your Name/Organization Name]
>
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all
> copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
> SOFTWARE.
> ## Contact

> Provide ways for users or potential contributors to get in touch:
>
> *   **Project Lead:** [Your Name] - [your.email@example.com] (Optional)
> *   **GitHub Issues:** For bug reports and feature requests - [Link to Your Project's GitHub Issues Page]
> *   **Other:** (e.g., Project Discord server link, Twitter handle)

## Acknowledgements

> Give credit to key libraries, frameworks, or resources that were particularly helpful.
>
> *   [Next.js Documentation](https://nextjs.org/docs)
> *   [Clerk Documentation](https://clerk.com/docs)
> *   [Prisma Documentation](https://www.prisma.io/docs/)
> *   [Tailwind CSS Documentation](https://tailwindcss.com/docs)
> *   [Shadcn UI](https://ui.shadcn.com/)
> *   [Neon DB Documentation](https://neon.tech/docs)
> *   [Google AI / Gemini Documentation](https://ai.google.dev/docs)
> *   *Add any other acknowledgements, e.g., specific tutorials, articles, or inspirations.*
