# Deployment Guide

This project is a Next.js application that can be easily deployed to Vercel or any other hosting provider that supports Next.js.

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- A GitHub account (for Vercel deployment)

## Environment Variables

Copy `.env.example` to `.env.local` and update the values:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SITE_URL`: The URL where your site will be hosted (e.g., `https://your-project.vercel.app`).

## Deploying to Vercel (Recommended)

1.  Push your code to a GitHub repository.
2.  Go to [Vercel](https://vercel.com) and sign in.
3.  Click **Add New > Project**.
4.  Import your GitHub repository.
5.  Vercel will automatically detect the Next.js framework.
6.  In the **Environment Variables** section, add the variables from your `.env.local` file.
7.  Click **Deploy**.

## Building Locally

To build the application locally for production:

```bash
npm run build
npm start
```

## Static Export (Optional)

If you want to deploy as a static site (e.g., to GitHub Pages), update `next.config.js`:

```javascript
const nextConfig = {
  output: 'export',
  // ...
}
```

Then run `npm run build`. The static files will be in the `out` directory.
