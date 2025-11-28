# Deployment Guide (Vercel + Neon)

This guide provides step-by-step instructions to deploy the EE Teaching Platform using **Vercel** (for the frontend/API) and **Neon** (for the Serverless PostgreSQL database).

## Prerequisites
- A [GitHub](https://github.com/) account.
- A [Vercel](https://vercel.com/) account.
- A [Neon](https://neon.tech/) account.
- The project code pushed to a GitHub repository.

---

## Phase 1: Database Setup (Neon)

1.  **Create a Project**:
    - Log in to the [Neon Console](https://console.neon.tech/).
    - Click **"New Project"**.
    - Name your project (e.g., `ee-teaching-platform`).
    - Choose a region closest to your users (e.g., `Singapore` or `US East`).
    - Click **"Create Project"**.

2.  **Get Connection String**:
    - Once created, you will see a **Connection Details** panel.
    - Select **"Prisma"** from the dropdown menu (if available) or just copy the generic Postgres URL.
    - It usually looks like: `postgres://user:password@ep-xyz.region.neon.tech/neondb?sslmode=require`
    - **Copy this string**. You will need it for both your local environment and Vercel.

---

## Phase 2: Local Configuration (Optional but Recommended)

Before deploying, ensure your schema is synced.

1.  **Update `.env`**:
    - In your local project root, create or edit `.env`.
    - Set `DATABASE_URL` to the Neon connection string you copied.
    ```env
    DATABASE_URL="postgres://user:password@ep-xyz.region.neon.tech/neondb?sslmode=require"
    ```

2.  **Push Schema**:
    - Run the following command to create tables in your new Neon database:
    ```bash
    npx prisma db push
    ```
    - (Optional) Seed the database if you have a seed script:
    ```bash
    npx prisma db seed
    ```

---

## Phase 3: Vercel Deployment

1.  **Import Project**:
    - Log in to [Vercel](https://vercel.com/).
    - Click **"Add New..."** > **"Project"**.
    - Select your GitHub repository (`ee-teaching-platform`).
    - Click **"Import"**.

2.  **Configure Project**:
    - **Framework Preset**: Vercel should automatically detect **Next.js**.
    - **Root Directory**: Leave as `./` (unless your app is in a subfolder).
    - **Build Command**: `next build` (Default).
    - **Output Directory**: `.next` (Default).

3.  **Environment Variables**:
    - Expand the **"Environment Variables"** section.
    - Add the following variables (copy from your local `.env`):

    | Key | Value | Description |
    | :--- | :--- | :--- |
    | `DATABASE_URL` | `postgres://...` | Your Neon connection string. |
    | `NEXTAUTH_SECRET` | `(Generate a random string)` | Run `openssl rand -base64 32` to generate. |
    | `NEXTAUTH_URL` | `https://your-project.vercel.app` | Your production URL (you can update this after deployment). |
    | `GOOGLE_CLIENT_ID` | `...` | (If using Google Auth) |
    | `GOOGLE_CLIENT_SECRET` | `...` | (If using Google Auth) |
    | `GITHUB_ID` | `...` | (If using GitHub Auth) |
    | `GITHUB_SECRET` | `...` | (If using GitHub Auth) |
    | `OPENAI_API_KEY` | `sk-...` | (If using AI features) |

4.  **Deploy**:
    - Click **"Deploy"**.
    - Vercel will build your application. This may take a minute or two.
    - Once finished, you will see a "Congratulations!" screen.

---

## Phase 4: Post-Deployment

1.  **Verify URL**:
    - Visit your new Vercel URL (e.g., `https://ee-teaching-platform.vercel.app`).
    - Ensure the home page loads.

2.  **Update OAuth Callbacks** (Important):
    - If you are using Google or GitHub login, go to their respective developer consoles.
    - Update the **Authorized redirect URIs** to match your new Vercel domain:
        - `https://your-project.vercel.app/api/auth/callback/google`
        - `https://your-project.vercel.app/api/auth/callback/github`

3.  **Update `NEXTAUTH_URL`**:
    - If you didn't know your URL before deploying, go to Vercel Project Settings > Environment Variables.
    - Update `NEXTAUTH_URL` to your actual Vercel domain.
    - Go to the **Deployments** tab and **Redeploy** the latest commit for changes to take effect.

---

## Troubleshooting

- **Database Connection Errors**:
    - Ensure `DATABASE_URL` in Vercel matches your Neon connection string exactly.
    - Ensure `?sslmode=require` is at the end of the connection string.

- **Build Failures**:
    - Check the "Build Logs" in Vercel.
    - Common issue: TypeScript errors. Run `npm run build` locally to catch them before pushing.
    - Common issue: Missing Environment Variables. Double-check your Vercel env vars.

- **404 on API Routes**:
    - Ensure your file structure is correct (`src/app/api/...`).
    - Check Vercel logs for server-side errors.
