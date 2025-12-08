# Deployment Guide - EE Master Teaching Platform

This guide provides streamlined instructions to deploy the EE Master Teaching Platform directly to Vercel with Neon PostgreSQL database.

## Prerequisites

- A GitHub account
- A Vercel account
- A Neon account

---

## Phase 1: Fork the GitHub Repository

### 1. Fork the Repository

- Go to [ee-teaching-platform](https://github.com/Enwei0715/ee-teaching-platform)
- Click **Fork** to create your own copy
- Keep the repository name as `ee-teaching-platform`

---

## Phase 2: Deploy to Vercel (Before Database Setup)

### 1. Import Project to Vercel

- Log in to [Vercel](https://vercel.com/)
- Click **Add New** → **Project**
- Select your forked GitHub repository `ee-teaching-platform`
- Click **Import**

### 2. Configure Project Settings

- **Framework**: Next.js (auto-detected)
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

### 3. Deploy (Expected to Fail - Normal)

Click **Deploy**. The deployment will fail without DATABASE_URL - this is expected and normal.

---

## Phase 3: Database Setup on Neon

### 1. Create a Project on Neon Console

- Log in to [Neon Console](https://console.neon.tech/)
- Click **New Project**
- **Project Name**: `ee-teaching-platform`
- **Database Name**: `ee_master`
- **Region**: Select closest to your users (Singapore, US East, Europe, etc.)
- Click **Create Project**

### 2. Get Connection String

- Once created, view **Connection Details** panel
- Select **Prisma** from the dropdown
- Copy the connection string:

```
postgresql://user:password@ep-xyz.region.neon.tech/ee_master?sslmode=require
```

---

## Phase 4: Configure Environment Variables in Vercel

### 1. Go to Vercel Project Settings

- In Vercel dashboard, select your `ee-teaching-platform` project
- Go to **Settings** → **Environment Variables**

### 2. Add Required Variables

| Key | Value |
|-----|-------|
| `DATABASE_URL` | PostgreSQL connection string from Neon |
| `NEXTAUTH_SECRET` | Generate: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://your-project-name.vercel.app` |
| `GOOGLE_CLIENT_ID` | From [Google Cloud Console](https://console.cloud.google.com/) |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console |
| `GITHUB_ID` | From [GitHub OAuth settings](https://github.com/settings/developers) |
| `GITHUB_SECRET` | From GitHub OAuth settings |

### 3. Redeploy Vercel

After adding all environment variables:
- Go to **Deployments** tab
- Click the three-dot menu on the latest deployment
- Select **Redeploy**

Now it should deploy successfully.

---

## Phase 5: Post-Deployment Configuration

### 1. Verify Deployment

Visit your Vercel URL and confirm:
- ✅ Home page loads with Particle Background animation
- ✅ Navigation menu works (Courses, Blog, Projects, Forum)
- ✅ Search functionality (Cmd K or Ctrl K)

### 2. Update OAuth Redirect URIs

**Google OAuth:**
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Add authorized redirect URI:
```
https://your-project-name.vercel.app/api/auth/callback/google
```

**GitHub OAuth:**
- Go to [GitHub Settings → Developer applications](https://github.com/settings/developers)
- Add authorization callback URL:
```
https://your-project-name.vercel.app/api/auth/callback/github
```

### 3. Configure Custom Domain (Optional)

- In Vercel dashboard: **Settings** → **Domains**
- Add your custom domain and follow DNS instructions
- Update `NEXTAUTH_URL` environment variable to your custom domain

---

## Troubleshooting

### Database Connection Errors

- Verify `DATABASE_URL` includes `?sslmode=require`
- Check Neon Dashboard for active connections
- Check Vercel deployment logs

### Build Failures

- Check Vercel build logs in **Deployments** tab
- Ensure all required environment variables are set

### Authentication Issues

- Verify OAuth redirect URIs match your Vercel domain exactly
- Confirm `NEXTAUTH_URL` matches your domain
- Check `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_ID`, `GITHUB_SECRET`

---