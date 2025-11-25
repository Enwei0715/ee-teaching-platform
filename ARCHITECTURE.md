# Project Architecture

```
.
├── prisma
│   ├── dev.db
│   └── schema.prisma
├── public
│   ├── images
│   │   └── projects
│   │       └── half-wave-rectifier.jpg
│   ├── icon_without_text.png
│   └── icon.png
├── scripts
│   ├── check-blog-post.ts
│   ├── check-forum-db.ts
│   ├── cleanup-orphaned-progress.js
│   ├── fix-slug.js
│   ├── make-admin.ts
│   ├── rename-course-slug.ts
│   ├── reorder-lessons.ts
│   ├── test-db.ts
│   └── verify-db.js
├── src
│   ├── app
│   │   ├── about
│   │   │   └── page.tsx
│   │   ├── actions
│   │   ├── admin
│   │   │   ├── blog
│   │   │   │   ├── [slug]
│   │   │   │   │   ├── loading.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── components
│   │   │   │   └── DeleteButton.tsx
│   │   │   ├── content
│   │   │   │   ├── loading.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── courses
│   │   │   │   ├── [slug]
│   │   │   │   │   ├── loading.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── new
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── CourseListTable.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── forum
│   │   │   │   ├── [id]
│   │   │   │   │   ├── actions.ts
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── CreatePostModal.tsx
│   │   │   │   ├── DeleteForumPostButton.tsx
│   │   │   │   ├── ForumHeader.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── projects
│   │   │   │   ├── [slug]
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   └── ProjectListTable.tsx
│   │   │   ├── users
│   │   │   │   ├── DeleteUserButton.tsx
│   │   │   │   ├── EditUserModal.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── ai-tutor
│   │   │   └── page.tsx
│   │   ├── api
│   │   │   ├── admin
│   │   │   │   ├── blog
│   │   │   │   │   ├── [id]
│   │   │   │   │   ├── [slug]
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── route.ts
│   │   │   │   ├── courses
│   │   │   │   │   ├── [slug]
│   │   │   │   │   │   ├── lessons
│   │   │   │   │   │   │   └── route.ts
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── route.ts
│   │   │   │   ├── footer-links
│   │   │   │   │   └── route.ts
│   │   │   │   ├── projects
│   │   │   │   │   ├── [slug]
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── route.ts
│   │   │   │   ├── site-settings
│   │   │   │   │   └── route.ts
│   │   │   │   └── users
│   │   │   │       └── [id]
│   │   │   │           └── route.ts
│   │   │   ├── auth
│   │   │   │   └── [...nextauth]
│   │   │   │       └── route.ts
│   │   │   ├── blog
│   │   │   │   └── route.ts
│   │   │   ├── courses
│   │   │   │   └── [courseId]
│   │   │   │       ├── lessons
│   │   │   │       │   └── [lessonId]
│   │   │   │       │       └── complete
│   │   │   │       │           └── route.ts
│   │   │   │       ├── progress
│   │   │   │       │   └── route.ts
│   │   │   │       └── route.ts
│   │   │   ├── engineer
│   │   │   │   └── blog
│   │   │   │       ├── [slug]
│   │   │   │       │   └── route.ts
│   │   │   │       └── route.ts
│   │   │   ├── forum
│   │   │   │   └── posts
│   │   │   │       ├── [postId]
│   │   │   │       │   ├── comments
│   │   │   │       │   │   └── route.ts
│   │   │   │       │   └── route.ts
│   │   │   │       └── route.ts
│   │   │   ├── llm
│   │   │   │   ├── chat
│   │   │   │   │   └── route.ts
│   │   │   │   └── quiz
│   │   │   │       └── route.ts
│   │   │   ├── progress
│   │   │   │   └── route.ts
│   │   │   ├── projects
│   │   │   │   └── route.ts
│   │   │   ├── register
│   │   │   │   └── route.ts
│   │   │   ├── search
│   │   │   │   └── route.ts
│   │   │   ├── site-content
│   │   │   │   └── route.ts
│   │   │   ├── site-settings
│   │   │   │   └── route.ts
│   │   │   ├── tracking
│   │   │   │   └── time
│   │   │   │       └── route.ts
│   │   │   └── upload
│   │   │       └── route.ts
│   │   ├── auth
│   │   │   ├── register
│   │   │   │   └── page.tsx
│   │   │   └── signin
│   │   │       └── page.tsx
│   │   ├── blog
│   │   │   ├── [slug]
│   │   │   │   ├── loading.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   └── post.module.css
│   │   │   ├── new
│   │   │   │   └── page.tsx
│   │   │   ├── blog.module.css
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── courses
│   │   │   ├── [courseId]
│   │   │   │   ├── [lessonId]
│   │   │   │   │   ├── loading.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── assignments
│   │   │   │   │   ├── [assignmentId]
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── loading.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── courses.module.css
│   │   │   ├── layout.tsx
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── dashboard
│   │   │   └── page.tsx
│   │   ├── engineer
│   │   │   └── blog
│   │   │       ├── [slug]
│   │   │       │   ├── loading.tsx
│   │   │       │   └── page.tsx
│   │   │       ├── new
│   │   │       │   ├── loading.tsx
│   │   │       │   └── page.tsx
│   │   │       └── loading.tsx
│   │   ├── forum
│   │   │   ├── [postId]
│   │   │   │   ├── loading.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── projects
│   │   │   ├── [slug]
│   │   │   │   ├── loading.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── test-quiz
│   │   ├── globals.css
│   │   ├── icon_without_text.png
│   │   ├── icon.png
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components
│   │   ├── admin
│   │   │   ├── EditModeControls.tsx
│   │   │   └── ForumPostEditor.tsx
│   │   ├── ai
│   │   │   └── AITutor.tsx
│   │   ├── assignment
│   │   │   ├── AIQuizGenerator.tsx
│   │   │   ├── ChatInterface.tsx
│   │   │   ├── QuizCard.tsx
│   │   │   ├── QuizChat.tsx
│   │   │   └── VerificationPanel.tsx
│   │   ├── blog
│   │   │   ├── BlogAdminControls.tsx
│   │   │   ├── BlogCard.module.css
│   │   │   ├── BlogCard.tsx
│   │   │   ├── BlogEditor.tsx
│   │   │   └── DeletePostButton.tsx
│   │   ├── course
│   │   │   ├── CourseSidebar.tsx
│   │   │   ├── LessonEditButton.tsx
│   │   │   ├── LessonNavigation.tsx
│   │   │   ├── LessonQuiz.tsx
│   │   │   ├── Quiz.tsx
│   │   │   └── TimeTracker.tsx
│   │   ├── courses
│   │   │   ├── CourseCard.tsx
│   │   │   ├── CourseProgress.tsx
│   │   │   ├── CurriculumHeader.tsx
│   │   │   ├── LessonNavigationListener.tsx
│   │   │   └── YouTubePlayer.tsx
│   │   ├── forum
│   │   │   ├── CreatePostForm.tsx
│   │   │   ├── ForumList.tsx
│   │   │   └── PostDetail.tsx
│   │   ├── layout
│   │   │   ├── Footer.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── ShortcutsModal.tsx
│   │   ├── mdx
│   │   │   ├── Callout.tsx
│   │   │   ├── LessonImage.tsx
│   │   │   ├── mdx-components.tsx
│   │   │   └── MDXContent.tsx
│   │   ├── providers
│   │   │   └── AuthProvider.tsx
│   │   ├── search
│   │   │   └── SearchCommand.tsx
│   │   └── ui
│   │       ├── skeletons
│   │       │   ├── index.tsx
│   │       │   ├── SkeletonCardGrid.tsx
│   │       │   ├── SkeletonDashboard.tsx
│   │       │   ├── SkeletonDetail.tsx
│   │       │   ├── SkeletonForm.tsx
│   │       │   ├── SkeletonList.tsx
│   │       │   ├── SkeletonPlayer.tsx
│   │       │   └── SkeletonTable.tsx
│   │       ├── EditableImage.tsx
│   │       ├── EditableText.tsx
│   │       ├── FeaturedCourses.tsx
│   │       ├── Hero.tsx
│   │       ├── MarkdownRenderer.tsx
│   │       ├── MDXEditor.tsx
│   │       ├── ParticleBackground.tsx
│   │       ├── TagInput.tsx
│   │       └── TextMask.tsx
│   ├── context
│   │   ├── EditModeContext.tsx
│   │   └── HotkeysProvider.tsx
│   ├── hooks
│   │   └── useProgress.ts
│   ├── lib
│   │   ├── admin-auth.ts
│   │   ├── auth.ts
│   │   ├── llm-service.ts
│   │   ├── mdx.ts
│   │   ├── prisma.ts
│   │   ├── search.ts
│   │   └── utils.ts
│   ├── types
│   │   └── vanta.d.ts
│   └── middleware.ts
├── ARCHITECTURE.md
├── check_progress.js
├── check_users.js
├── cleanup_progress.js
├── DEPLOY.md
├── dev.db
├── find_broken_image.js
├── find_slugs.js
├── implementation_plan.md
├── LATEX_GUIDE.md
├── next-env.d.ts
├── next.config.js
├── package.json
├── postcss.config.js
├── SITE_STRUCTURE.md
├── tailwind.config.js
├── task.md
├── test-gemini.js
└── tsconfig.tsbuildinfo
```