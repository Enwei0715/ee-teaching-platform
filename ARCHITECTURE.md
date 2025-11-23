# EE Teaching Platform - Project Architecture

This document provides a comprehensive overview of the project structure for the Electronic Engineering Teaching Platform.

## Project Tree Structure

```
ee-teaching-platform/
├── .next/                          # Next.js build output (auto-generated)
├── node_modules/                   # Dependencies (auto-generated)
├── prisma/                         # Database schema and migrations
│   ├── schema.prisma              # Prisma database schema
│   └── migrations/                # Database migration files
│       ├── migration_lock.toml
│       ├── 20251121112008_init/
│       ├── 20251122130155_add_user_role/
│       ├── 20251122132855_add_user_progress/
│       └── 20251122134754_add_streak_and_time_fix/
├── public/                         # Static assets (images, fonts, etc.)
├── scripts/                        # Utility scripts
│   ├── check-forum-db.ts
│   ├── make-admin.ts
│   └── test-db.ts
├── src/                           # Source code
│   ├── app/                       # Next.js App Router pages and routes
│   │   ├── about/                 # About page
│   │   ├── admin/                 # Admin dashboard
│   │   │   ├── blog/             # Blog management
│   │   │   ├── components/       # Shared admin components
│   │   │   ├── courses/          # Course management
│   │   │   ├── forum/            # Forum management
│   │   │   ├── projects/         # Project management
│   │   │   ├── users/            # User management
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── ai-tutor/             # AI Tutor interface
│   │   ├── api/                   # API routes
│   │   │   ├── admin/            # Admin API endpoints
│   │   │   │   ├── blog/
│   │   │   │   ├── courses/
│   │   │   │   ├── projects/
│   │   │   │   └── users/
│   │   │   ├── auth/             # Authentication endpoints
│   │   │   ├── courses/          # Course-related endpoints
│   │   │   ├── engineer/         # Engineer blog endpoints
│   │   │   ├── forum/            # Forum endpoints
│   │   │   ├── llm/              # LLM/AI endpoints
│   │   │   ├── progress/         # User progress tracking
│   │   │   ├── register/         # User registration
│   │   │   ├── search/           # Search functionality
│   │   │   └── tracking/         # Time tracking
│   │   ├── auth/                 # Authentication pages
│   │   │   ├── register/
│   │   │   └── signin/
│   │   ├── blog/                 # Public blog pages
│   │   ├── courses/              # Course pages
│   │   │   └── [courseId]/       # Dynamic course pages
│   │   │       ├── assignments/
│   │   │       └── [lessonId]/   # Dynamic lesson pages
│   │   ├── dashboard/            # User dashboard
│   │   ├── engineer/             # Engineer blog creation
│   │   ├── forum/                # Forum pages
│   │   ├── projects/             # Project showcase pages
│   │   ├── globals.css           # Global styles
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Home page
│   ├── components/               # React components
│   │   ├── ai/                   # AI-related components
│   │   ├── assignment/           # Assignment components
│   │   ├── blog/                 # Blog components
│   │   ├── course/               # Course components
│   │   ├── courses/              # Course listing components
│   │   ├── forum/                # Forum components
│   │   ├── layout/               # Layout components (Navbar, Footer)
│   │   ├── mdx/                  # MDX rendering components
│   │   ├── providers/            # React context providers
│   │   ├── search/               # Search components
│   │   └── ui/                   # UI components
│   ├── content/                  # Content files (MDX)
│   │   ├── blog/                 # Blog posts
│   │   ├── courses/              # Course content
│   │   │   ├── circuit-theory/
│   │   │   ├── digital-logic/
│   │   │   ├── electronics/
│   │   │   ├── microcontrollers/
│   │   │   └── signals-systems/
│   │   └── projects/             # Project descriptions
│   ├── hooks/                    # Custom React hooks
│   ├── lib/                      # Utility libraries
│   │   ├── admin-auth.ts         # Admin authentication
│   │   ├── auth.ts               # NextAuth configuration
│   │   ├── llm-service.ts        # LLM service integration
│   │   ├── mdx.ts                # MDX processing
│   │   ├── prisma.ts             # Prisma client
│   │   ├── search.ts             # Search functionality
│   │   └── utils.ts              # Utility functions
│   └── middleware.ts             # Next.js middleware
├── .env                          # Environment variables
├── .env.local                    # Local environment variables
├── .eslintrc.json               # ESLint configuration
├── .gitignore                   # Git ignore rules
├── next.config.js               # Next.js configuration
├── package.json                 # Project dependencies
├── postcss.config.js            # PostCSS configuration
├── tailwind.config.ts           # Tailwind CSS configuration
└── tsconfig.json                # TypeScript configuration
```

## Key Architecture Components

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Lucide React icons
- **Content**: MDX for blog posts, courses, and projects

### Backend
- **API**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with credentials provider
- **AI Integration**: LLM service for AI tutor and quiz generation

### Content Management
- **Blog**: MDX files in `src/content/blog/`
- **Courses**: MDX files organized by course in `src/content/courses/`
- **Projects**: MDX files in `src/content/projects/`

### User Features
- **Authentication**: Sign up, sign in, role-based access (USER, ADMIN)
- **Progress Tracking**: Course completion, time tracking, streak counter
- **Forum**: Discussion posts and comments
- **AI Tutor**: Interactive AI-powered learning assistant
- **Search**: Content search functionality

### Admin Features
- **Dashboard**: Overview and management interface
- **Content Management**: CRUD operations for blog, courses, projects
- **User Management**: User administration
- **Forum Moderation**: Post and comment management

## Database Schema

The database schema is defined in `prisma/schema.prisma` and includes:
- **User**: User accounts with roles and progress tracking
- **Post**: Forum posts
- **Comment**: Forum comments
- **UserProgress**: Course and lesson completion tracking

## Deployment

- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Development**: `npm run dev`
