# EE Master - Website Route Map

## 🌍 Public Routes (Need Skeletons for SEO/UX)
- `/` (Home) - [Static + Particle Effect]
- `/about` (About Us) - [Static Content]
- `/courses` (Course List) - **[Needs Grid Skeleton]**
    - `/courses/[courseId]` (Course Detail) - **[Needs Detail Skeleton]**
        - `/courses/[courseId]/[lessonId]` (Lesson Player) - **[Needs Player Skeleton]**
        - `/courses/[courseId]/assignments` (Assignment List) - **[Needs List Skeleton]**
            - `/courses/[courseId]/assignments/[assignmentId]` (Assignment Detail) - **[Needs Detail Skeleton]**
- `/projects` (Project List) - **[Needs Grid Skeleton]**
    - `/projects/[slug]` (Project Detail) - **[Needs Detail Skeleton]**
- `/blog` (Blog List) - **[Needs List Skeleton]** (Already implemented)
    - `/blog/new` (Create Post) - [Needs Editor Skeleton]
    - `/blog/[slug]` (Blog Post) - **[Needs Article Skeleton]**
- `/forum` (Forum List) - **[Needs List Skeleton]** (Already implemented)
    - `/forum/[postId]` (Thread Detail) - **[Needs Thread Skeleton]**

## 🔐 Auth Routes
- `/auth/signin` (Sign In) - [Static Form]
- `/auth/register` (Register) - [Static Form]

## 🛠️ Engineer Dashboard
- `/engineer/blog` (Manage Blog) - **[Needs Table Skeleton]**
    - `/engineer/blog/new` (Create Post) - [Needs Editor Skeleton]
    - `/engineer/blog/[slug]` (Edit Post) - [Needs Editor Skeleton]

## 🛡️ Admin Dashboard (Private)
- `/admin` (Main Dashboard) - **[Needs Stats & Activity Skeleton]**
- `/admin/courses` (Manage Courses) - **[Needs Table Skeleton]**
    - `/admin/courses/new` (Create Course) - [Needs Form Skeleton]
    - `/admin/courses/[slug]` (Edit Course) - **[Needs Form Skeleton]**
- `/admin/blog` (Manage Blog) - **[Needs Table Skeleton]**
    - `/admin/blog/[slug]` (Edit Post) - **[Needs Editor Skeleton]**
- `/admin/forum` (Manage Forum) - **[Needs Table Skeleton]**
    - `/admin/forum/[id]` (Moderate Thread) - **[Needs Thread Skeleton]**
- `/admin/projects` (Manage Projects) - **[Needs Table Skeleton]**
    - `/admin/projects/[slug]` (Edit Project) - **[Needs Form Skeleton]**
- `/admin/users` (User Management) - **[Needs Table Skeleton]**
- `/admin/content` (Site Content) - **[Needs Form Skeleton]**
- `/admin/components` (Component Library) - [Static]

## 🧪 Dev/Test Routes
- `/test-quiz` (Quiz Tester) - [Dev Only]
