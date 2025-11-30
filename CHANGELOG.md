# Project Changelog

## v4.4.4 - UI Polish (2025-11-30)
- **UI Enhancements**:
    - **Particle Background**: Optimized the homepage particle effect by increasing the particle density to 150 and setting a hard limit of 200 to balance aesthetics and performance.

## v4.4.3 - Database Cleanup & Critical Fixes (2025-11-30)
- **Database**:
    - **Schema Cleanup**: Removed the deprecated `completed` boolean column from the `UserProgress` table in favor of the `status` enum.
- **Bug Fixes**:
    - **Time Tracking**: Resolved the root cause of the `timeSpent` issue. `ResumeLearningTracker` was incorrectly receiving the Course UUID instead of the Slug, causing API calls to fail with 404. It now correctly uses the slug, ensuring progress and time are saved.

## v4.4.2 - Time Tracking Stability (2025-11-30)
- **Time Tracking**:
    - **UserId Fallback**: Fixed a bug where `ResumeLearningTracker` failed to initialize if `userId` wasn't passed as a prop. Implemented a fallback to retrieve `userId` directly from the user session, ensuring time tracking works reliably in all contexts.

## v4.4.1 - Time Tracking Fix (2025-11-30)
- **Time Tracking**:
    - **Frontend**: Updated `ResumeLearningTracker` to calculate and send precise time deltas (in seconds) to the API, ensuring accurate tracking of time spent on each lesson.
    - **Backend**: Modified the progress API to `increment` the `timeSpent` value in the database instead of overwriting it, preventing data loss during concurrent or frequent updates.
    - **Periodic Sync**: Implemented a 30-second heartbeat to save time spent even when the user is not scrolling.

## v4.4.0 - Perfected Lesson State & Real-Time Sync (2025-11-30)
- **Real-Time State Logic**:
    - **Instant Feedback**: Refactored `LessonProgressContext` to use optimistic state initialization, ensuring lesson status icons (Play/Check) update *instantly* on entry without waiting for API responses.
    - **Smart Auto-Start**: New lessons now automatically transition to `IN_PROGRESS` immediately upon visit, with background database synchronization.
    - **Review Mode**: Re-visiting completed lessons now correctly triggers `REVIEWING` mode, preserving the `COMPLETED` status in the database while updating the UI context.
    - **Persistence Fix**: Resolved a critical bug where the API implicitly reverted `COMPLETED` status to `REVIEWING`, ensuring completion status is now sticky and reliable.
- **Bug Fixes**:
    - **Course Sidebar**: Fixed status icon staleness by ensuring the sidebar consumes real-time context for the active lesson.
    - **Table of Contents**: Fixed syntax errors and removed redundant logic, delegating state management to the centralized Context.
    - **API Reliability**: Hardened the progress API to prioritize explicit client-side status updates over implicit server-side logic.

## v4.3.8 - Real-Time Sync & Quiz Polish (2025-11-30)
- **Real-Time State Sync**:
    - **Instant Updates**: Implemented `LessonProgressContext` to ensure the sidebar checkmark and AI Tutor "Review Mode" update immediately upon lesson completion without a page refresh.
    - **Context Provider**: Wrapped lesson pages with `LessonProgressProvider` for efficient client-side state management.
- **AI Quiz**:
    - **Scroll Fix**: Resolved scroll jumping issues in `AIQuizGenerator` by forcing the view to center on the quiz card during loading and generation states.
    - **Layout Stability**: Enforced minimum height on the quiz container to prevent layout collapse during state transitions.

## v4.3.7 - Regression Fixes (2025-11-30)
- **UI Fixes**:
    - **Lesson Date**: Fixed "Invalid Date" display by adding a safe check and fallback ("Recently updated") for lessons with missing timestamps.
    - **Edit Button**: Restored the missing "Edit Lesson" button in the lesson header (visible only in Edit Mode).
- **Interaction**:
    - **Hotkeys**: Fixed broken Left/Right arrow key navigation between lessons by re-implementing event listeners in `LessonContent`.

## v4.3.6 - Robust Quiz Scoping & ID Standardization (2025-11-30)
- **AI Quiz**:
    - **Fuzzy Matching**: Implemented robust "Fuzzy Matching" for section IDs. The system now ignores punctuation and special characters when comparing frontend and backend IDs, resolving the "Section 1 Loop" bug caused by minor format differences (e.g., "1.1" vs "1-1").
    - **Selection Strategy**: Updated the quiz selection algorithm to pick randomly from *any* section with a score >= 150, removing the restrictive "Top 30%" filter to ensure broader content coverage.
    - **Deep Logging**: Added detailed debug logs to the quiz API to trace ID mismatches in production.
- **Codebase**:
    - **Standardization**: Created `src/lib/content-utils.ts` as the single source of truth for ID generation across the app.
    - **Verification**: Added `scripts/verify-id-logic.ts` to automatically test ID generation rules.

## v4.3.5 - Quiz Logic Fixes & Cleanup (2025-11-30)
- **AI Quiz**:
    - **Spoiler Fix**: Implemented "Fail-Safe Slicing" to prevent questions about unread sections. If the user's location is unknown, it defaults to the first section.
    - **Standardized IDs**: Unified section ID generation between frontend and backend to ensure accurate progress tracking.
    - **Dynamic UI**: Quiz Tab now clearly indicates "Progress-Aware Quiz" (for active lessons) vs. "Full Lesson Review" (for completed lessons).
    - **Auto-Scroll Fix**: Resolved issue where generating a new quiz caused the page to scroll to the bottom.
    - **Layout Fix**: Fixed math symbol alignment in quiz options.
- **Project Cleanup**:
    - Removed redundant files (`LessonQuiz.tsx`, `Quiz.tsx`, `markdown-utils.ts`) and the unused `/assignments` route.

## v4.3.4 - AI Quiz & UI Stability (2025-11-30)
- **AI Quiz**:
    - **Prompt Fix**: Updated system prompt to strictly enforce LaTeX formatting rules, preventing plain text artifacts in math formulas.
- **UI/UX**:
    - **Visual Polish**: Fixed math formula alignment, added table borders, and implemented custom dark scrollbars globally.
    - **AI Tutor**: Resolved z-index layering issue where the footer obscured the chat window by moving the component to a React Portal.
    - **Layout**: Fixed background bleed-through in AI Tutor with a new backdrop overlay.

## v4.3.3 - Quiz UI/UX Polish (2025-11-30)
- **Quiz UI/UX**:
    - **Layout & Typography**: Fixed option button alignment, math formula rendering, and text baseline issues.
    - **QuizChat**: Optimized layout by removing width constraints and implementing auto-tab switching for "Ask AI Tutor".
    - **QuizCard**: Made width dynamic, fixed background transparency issues, and implemented auto-scroll to top on new questions.
    - **AI Tutor**: Fixed input box sizing, scrollbar styling, and z-index layering issues (footer occlusion).
    - **Visuals**: Enhanced "Focusing on..." badge contrast and localized text.

## v4.3.2 - AI Tutor & Sidebar Polish (2025-11-30)
- **AI Tutor**:
    - **UI Fixes**: Increased z-index to prevent footer occlusion and added bottom padding to ensure the last message is fully visible.
    - **Quiz Tab**: Removed unnecessary scrollbars and improved layout for better usability.
- **Mobile Navigation**:
    - **Sidebar Occlusion Fix**: Adjusted mobile sidebar positioning to slide out *below* the sticky navbar, ensuring navigation controls remain accessible.

## v4.3.1 - Mobile Layout & Global Polish (2025-11-30)
- **Global Layout**:
    - **Footer Cut-Off Fix**: Resolved global footer accessibility issue by enforcing `min-h-screen` on body and removing restrictive overflow settings.
    - **Sticky Navbar**: Switched Navbar from `fixed` to `sticky` for natural content flow and better mobile compatibility.
- **Mobile Experience**:
    - **Breadcrumbs**: Restored breadcrumb navigation on mobile devices with horizontal scrolling support.
    - **Content Occlusion**: Removed manual padding hacks (`pt-16`) in favor of native sticky positioning.

## v4.3.0 - Smart Quiz Algorithm & Mobile Polish (2025-11-30)
- **AI Quiz**:
    - **Smart Selection Algorithm**: Implemented a 4-phase pipeline (Parse -> Scope -> Score -> Select) to intelligently choose high-quality content for quizzes.
    - **Quality Scoring**: Sections are scored based on length, keywords, and blocklisted titles to avoid "fluff".
    - **Progress Awareness**: Quiz now strictly respects the user's current reading progress (via `limitToHeadingId`).
    - **Fallback Logic**: Robust fallback mechanisms ensure a quiz is always generated, even if no perfect section is found.
- **Mobile Experience**:
    - **Fixed Navbar Overlay**: Added `pt-16` to main layout and fixed Navbar positioning to prevent content from being hidden on mobile.
    - **AI Tutor Responsiveness**: Updated AI Tutor to use dynamic viewport units (`95vw`, `70dvh`) on mobile and optimal fixed sizes on desktop.
    - **Sidebar Trigger**: Fixed the floating sidebar button to be more accessible.
- **Dev**:
    - Added `test-algo` endpoint and script for verifying quiz logic.

## v4.2.2 - Quiz JSON Fix (2025-11-29)
- **AI Quiz**:
    - Fixed `exttt` typo by strictly forbidding `\texttt` in system prompts.
    - Enforced double-escaping for LaTeX backslashes in JSON output to prevent parsing errors.

## v4.2.1 - Quiz Stability & Visual Fixes (2025-11-29)
- **AI Quiz**:
    - Reverted quiz generation logic to stable version (v4.1.0 era) to resolve "400 Bad Request" errors.
    - Restored `gemini-2.5-flash` model usage with `json_object` response format.
- **UI**:
    - Fixed Lesson Page background to use `InteractiveGridPattern` (matching Course Page) instead of plain background.

## v4.2.0 - Smart Quiz & Mobile Navigation (2025-11-29)
**Current Release**
- **Navigation**:
    - **Mobile UX**: Replaced floating sidebar trigger with a flow-based "Sub-Navbar" for better accessibility.
    - **Breadcrumbs**: Fixed fake sidebar breadcrumbs to dynamically show `Courses > [Course Title]`.
    - Removed hardcoded category labels.
- **Architecture**:
    - **Server/Client Split**: Refactored `LessonPage` into Server Component and `LessonContent` Client Component for better performance and state management.
- **AI Quiz**:
    - **Progress Awareness**: Quiz now respects user's reading progress, generating questions only from read sections when "In Progress".
    - **Database Optimization**: Pre-calculating and storing `sectionsMetadata` on lesson save to speed up quiz generation.
    - **Smart Scoring**: Implemented heuristic scoring to select high-quality content sections (filtering noise, rewarding explanations).
    - **Randomization**: Enforced strict answer position randomization (A/B/C/D) to prevent predictability.
    - **Quality Control**: Added blocklist for low-value sections (Summary, Reference, etc.).

## v4.1.0 - UX Polish & Navigation Intelligence (2025-11-28)
- **Navigation**:
    - Integrated Breadcrumb navigation into the Course Sidebar (Desktop & Mobile).
    - Fixed Desktop Sidebar sticky positioning (flush with Navbar).
    - Fixed Mobile Sidebar Z-Index to correctly cover the Navbar.
- **Dashboard**:
    - Redesigned "Continue Learning" section with vertical stack and `ResumeCard` integration.
    - Implemented precise resume positioning using `lastElementId`.
    - Applied glassmorphism styling to dashboard empty states.
- **Logic**:
    - Implemented 4-state learning logic (`NOT_STARTED`, `IN_PROGRESS`, `REVIEWING`, `COMPLETED`).
    - Restricted "Resume Learning" floating card visibility to Home and Courses pages only.
    - Optimized Resume Learning save logic (removed debounce for instant feel).
- **AI Tutor**:
    - Added Tabbed Interface (Chat vs. Quiz).
    - Implemented Collapsible Sidebar "Focus Mode" for distraction-free learning.
    - Added Notion-style Table of Contents (TOC).
    - Restored "Ask AI" button integration.
- **Tech**:
    - Migrated `tsparticles` to v3.
    - Added `localStorage` persistence and keyboard shortcut (`Ctrl+B`) for sidebar state.

## v4.0.0 - MDX Stability & Visual Refinements (2025-11-27)
- **Core**:
    - Implemented `ErrorBoundary` to handle MDX rendering failures gracefully.
    - Added `ProgressBar` MDX component.
- **UI**:
    - Adjusted `InteractiveDotGrid` opacity and added it to Forum pages.
    - Updated text colors for better contrast in dark mode.
- **Fixes**:
    - Resolved lesson slug and content UI rebuild issues.
    - Fixed mobile typography and math overflow scrolling.
    - Prevented mobile layout blowout from KaTeX equations.

## v3.0.0 - Auth & Mobile Experience Overhaul (2025-11-26)
- **Auth**:
    - Complete overhaul of Sign-Up/Login flows.
    - Added Particle Backgrounds to auth pages.
    - Implemented OAuth onboarding flow.
- **Mobile**:
    - Major mobile layout fixes (AI Tutor border, Admin Editor scrollbars).
    - Refined mobile AI Tutor layout and aesthetics.
    - Disabled AI Tutor expansion on mobile for better usability.
- **UI**:
    - Implemented "Glass Heavy" design system across the application.
    - Refactored input logic for distinct Touch vs. Mouse experiences (Profile Card tilt).
    - Enhanced dashboard waves and footer buttons.
- **Fixes**:
    - Fixed blog creation failures (Admin & Public).
    - Resolved build errors (missing exports/imports).
    - Fixed footer refresh in admin panel.

## v2.0.0 - Interactive UI & AI Context (2025-11-26)
- **UI**:
    - Introduced `InteractiveGridPattern` and dynamic background effects.
    - Implemented mobile-first responsive design updates.
- **AI**:
    - Implemented text-selection based AI Tutor with lesson context awareness.
    - Refactored TextSelectionToolbar to use portal and improved event handling.
    - Updated toolbar positioning to use fixed coordinates for scroll support.
- **Fixes**:
    - Removed `onAskAI` prop to resolve server/client boundary errors.
    - Fixed AI Tutor context stability.

## v1.5.0 - Content Management System (2025-11-25)
- **Admin**:
    - Implemented comprehensive Admin CMS for Courses and Projects.
    - Redesigned Course Cards with Responsive Web Design (RWD).
    - Enhanced Course Editor and updated site logo.
- **Core**:
    - Refactored CourseSidebar to sync progress with the database.
    - Optimized SSG (Static Site Generation) and UserProgress tracking.
- **Fixes**:
    - Resolved hydration errors and broken SVG rendering.
    - Fixed client-side errors by rendering MDX descriptions on server.
    - Fixed Chat Interface layout (horizontal scroll disabled).
    - Fixed UI/UX issues: Mobile scroll, Navbar logo, Card underlines.

## v1.1.0 - Advanced Features & LaTeX Support (2025-11-24)
- **Auth**: Added GitHub and Google OAuth login support.
- **Quiz**:
    - Implemented AI Quiz system with DB-backed lesson content.
    - Added fallback logic for quiz generation.
    - Enhanced Quiz UI with larger inputs.
- **Math**:
    - Enabled LaTeX rendering support across MDX (Lessons, Blogs, Projects) using KaTeX.
    - Added LaTeX syntax preprocessing for MDX compatibility.
- **Forum**:
    - Enhanced Forum UI with Markdown support (remarkGfm).
    - Improved error recovery and fixed admin footer overlap.
- **Media**:
    - Added video URL support and reading time calculation.
    - Implemented YouTube URL verification.

## v1.0.0 - Initial Release & Database Migration (2025-11-23)
- **Core**:
    - Migrated content storage from file-system to PostgreSQL (via Prisma).
    - Established core data models (User, Course, Lesson, Progress).
- **Feature**:
    - Initial Home Page with real DB data.
    - Time Tracking API implementation.
- **Fixes**:
    - Resolved Prisma Vercel caching issues.
    - Fixed async page rendering bugs in dashboard and search.
    - Fixed build errors (missing components, tsconfig exclusions).
