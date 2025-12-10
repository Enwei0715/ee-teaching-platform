'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Clock, Calendar, Edit, Zap, Trophy, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { useEditMode } from '@/context/EditModeContext';
import MDXContent from '@/components/mdx/MDXContent';
import CourseSidebar from '@/components/course/CourseSidebar';
import AITutor from '@/components/ai/AITutor';
import TextSelectionToolbar from '@/components/ai/TextSelectionToolbar';
import ResumeLearningTracker from '@/components/course/ResumeLearningTracker';
import TableOfContents from '@/components/course/TableOfContents';
import AIQuizGenerator from '@/components/assignment/AIQuizGenerator';
import MobileLessonBar from '@/components/course/MobileLessonBar';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { useLessonAppearance } from '@/hooks/useLessonAppearance';
import LessonAppearanceControl from '@/components/course/LessonAppearanceControl';
import { useLessonProgress } from '@/context/LessonProgressContext';
import { calculatePotentialXP } from '@/lib/xp';
import { themeStyles, fontSizes } from '@/lib/theme-config';

import InteractiveGridPattern from '@/components/ui/InteractiveGridPattern';

interface LessonContentProps {
    course: {
        id: string;
        slug: string;
        title: string;
        lessons: any[];
    };
    lesson: {
        id: string;
        slug: string;
        title: string;
        content: string;
        updatedAt: Date | string;
    };
    prevLesson: any;
    nextLesson: any;
    initialLastElementId: string | null;
    lessonStatus: string;
    readingTime: number;
    mdxSource: MDXRemoteSerializeResult;
    completedLessonsCount: number;
}

export default function LessonContent({
    course,
    lesson,
    prevLesson,
    nextLesson,
    initialLastElementId,
    lessonStatus,
    readingTime,
    mdxSource,
    completedLessonsCount
}: LessonContentProps) {
    const router = useRouter();
    const { isEditMode } = useEditMode();
    const { appearance, updateAppearance, mounted } = useLessonAppearance();

    const isCompleted = lessonStatus === 'COMPLETED' || lessonStatus === 'REVIEWING';
    const baseXP = calculatePotentialXP(lesson.content.length);
    const potentialXP = isCompleted ? Math.max(1, Math.round(baseXP / 10)) : baseXP;

    // Use shared config from imports
    const currentTheme = themeStyles[appearance.theme];
    const currentFontSize = fontSizes[appearance.fontSize];

    const handleMobileFontUpdate = (updates: { fontSize: any }) => updateAppearance(updates);



    // State for progress-aware quiz
    const [activeHeadingId, setActiveHeadingId] = useState<string>('');
    const [scrollProgress, setScrollProgress] = useState(0);

    const { markAsComplete } = useLessonProgress();

    // State to track if we've already triggered completion to avoid double-firing
    const [hasTriggeredCompletion, setHasTriggeredCompletion] = useState(false);
    // Track start time for reading speed check
    const startTimeRef = useRef<number>(Date.now());
    const lastWarningTimeRef = useRef<number>(0);

    // Navigation Hotkeys Listener
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            if (e.key === 'ArrowLeft' && prevLesson) {
                router.push(`/courses/${course.slug}/${prevLesson.id}`);
            } else if (e.key === 'ArrowRight' && nextLesson) {
                router.push(`/courses/${course.slug}/${nextLesson.id}`);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [prevLesson, nextLesson, router, course.slug]);

    // Scroll & Completion Logic
    // We hoist this function so it can be triggered by BOTH scroll and IntersectionObserver
    const handleCompletionCheck = () => {
        // Allow completion if strictly IN_PROGRESS (first time) OR REVIEWING (review session)
        // If status is 'COMPLETED' (just viewing), we might not want to re-trigger, unless they started a review.
        // The user implied "Review" gets 50% time.
        const canTrigger = !hasTriggeredCompletion && (lessonStatus === 'IN_PROGRESS' || lessonStatus === 'REVIEWING');

        if (!canTrigger) return;

        const timeSpent = (Date.now() - startTimeRef.current) / 1000;

        // User Logic:
        // - "Complete state" (In Progress -> Complete): 100% of reading time.
        // - "Review": 50% of reading time.
        // - Reading Time is in minutes, convert to seconds.
        const requiredPercentage = lessonStatus === 'REVIEWING' ? 0.5 : 1.0;
        // Ensure a sanity minimum (e.g. 10s) just in case readingTime is 0 or missing
        const minTimeSeconds = Math.max(10, (readingTime || 1) * 60 * requiredPercentage);

        if (timeSpent < minTimeSeconds) {
            // Only warn once every 5 seconds to avoid spamming
            const now = Date.now();
            if (now - lastWarningTimeRef.current > 5000) {
                lastWarningTimeRef.current = now;
                toast.warning("Deep reading required!", {
                    description: `Please spend at least ${Math.ceil(minTimeSeconds)}s reading ` +
                        (lessonStatus === 'REVIEWING' ? "(50% of est. time)" : "(100% of est. time)")
                });
            }
        } else {
            setHasTriggeredCompletion(true);
            markAsComplete('scroll');
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
            toast.success(lessonStatus === 'REVIEWING' ? "Review Completed!" : "Lesson Completed!", {
                description: `You earned +${potentialXP} XP`
            });
        }
    };

    // Intersection Observer for Quiz Section (The requested "Slide to QuizCard" trigger)
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasTriggeredCompletion) {
                    console.log("Quiz section reached - triggering completion check");
                    handleCompletionCheck();
                }
            },
            { threshold: 0.1 } // Trigger as soon as 10% of quiz is visible
        );

        const quizElement = document.getElementById('ai-quiz');
        if (quizElement) {
            observer.observe(quizElement);
        }

        return () => observer.disconnect();
    }, [hasTriggeredCompletion, isCompleted, readingTime, markAsComplete, potentialXP, lessonStatus]); // Add dependencies used in handleCompletionCheck

    // Scroll Progress Logic
    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (totalHeight <= 0) return;

            const currentProgress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
            setScrollProgress(currentProgress);

            // Fallback: Trigger completion when reaching the very bottom (in case Observer fails)
            const scrollBottom = window.scrollY + window.innerHeight;
            const isAtBottom = scrollBottom >= document.documentElement.scrollHeight - 50;

            if (isAtBottom && !isCompleted && !hasTriggeredCompletion) {
                handleCompletionCheck();
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        // Initial check
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [isCompleted, hasTriggeredCompletion, readingTime, markAsComplete, potentialXP, lessonStatus]);

    // If not mounted yet (SSR), render a safe default or loading state to prevent mismatch
    // But for a lesson page, we want SEO to be good, so we should default to 'default' theme which matches server render usually.
    // However, if we change classNames based on state that is only on client (localStorage), we might get hydration error.
    // We can suppress hydration warning or just accept the flicker. 'mounted' check helps avoiding mismatch but delays styling.
    // Better to default to 'default' theme and let it re-render. Since we use 'mounted' in hook, we can rely on that.

    return (
        <div className={`min-h-screen pb-20 relative transition-colors duration-500 ease-out ${currentTheme.wrapper} ${currentTheme.text}`}>
            {/* Show grid if showEffects is TRUE (works on all dark themes now) */}
            {appearance.showEffects && (
                <InteractiveGridPattern />
            )}

            {/* Progress Bar */}
            <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-bg-tertiary">
                <div
                    className="h-full bg-accent-primary transition-all duration-300"
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>

            <div className="flex flex-col lg:flex-row min-h-screen relative">
                {/* Sidebar - Flush Left */}
                {/* Hide sidebar in specific focus modes? Maybe just leave it closing-able. */}
                <CourseSidebar
                    courseId={course.slug}
                    lessons={course.lessons}
                    category="Electronics"
                    courseTitle={course.title}
                    hideMobileTrigger={true}
                />

                {/* Main Content Wrapper */}
                <div className="flex-1 container mx-auto px-4 py-8 lg:py-12 flex flex-col lg:flex-row gap-8">
                    {/* Main Article */}
                    <main className="flex-1 min-w-0 transition-opacity duration-300">
                        {/* Breadcrumbs */}
                        <nav className={`flex items-center text-sm mb-6 overflow-x-auto whitespace-nowrap pb-2 ${appearance.theme === 'default' ? 'text-text-secondary' : 'opacity-70'}`}>
                            <Link href="/courses" className="hover:opacity-100 transition-opacity">Courses</Link>
                            <ChevronRight size={16} className="mx-2" />
                            <Link href={`/courses/${course.slug}`} className="hover:opacity-100 transition-opacity">
                                {course.title}
                            </Link>
                            <ChevronRight size={16} className="mx-2" />
                            <span className="font-medium truncate opacity-100">{lesson.title}</span>
                        </nav>

                        {/* HEADER with Appearance Control */}
                        <div className={`mb-8 border-b pb-8 ${currentTheme.border}`}>
                            <div className="flex justify-between items-start gap-4">
                                <h1 className={`text-3xl lg:text-4xl font-bold mb-4 tracking-tight ${currentTheme.text}`}>
                                    {lesson.title}
                                </h1>

                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-sm opacity-80">
                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${appearance.theme === 'default' ? 'bg-bg-tertiary' : 'bg-black/5'}`}>
                                    <Clock size={16} className="text-accent-primary" />
                                    <span>{readingTime} min read</span>
                                </div>
                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${appearance.theme === 'default' ? 'bg-bg-tertiary' : 'bg-black/5'}`}>
                                    <Calendar size={16} className="text-accent-primary" />
                                    <span>{lesson.updatedAt ? new Date(lesson.updatedAt).toLocaleDateString() : 'Recently updated'}</span>
                                </div>
                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${isCompleted
                                    ? 'bg-blue-500/10 border-blue-500/20 text-blue-500'
                                    : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-600'
                                    }`}>
                                    <Zap size={16} className={isCompleted ? "text-blue-500" : "text-yellow-500"} />
                                    <span className="font-medium">+{potentialXP} XP</span>
                                </div>
                                {isEditMode && (
                                    <Link href={`/admin/courses/${course.slug}?file=${lesson.slug}.mdx`}>
                                        <button className="glass-ghost px-3 py-1 rounded-lg border border-white/20 text-sm flex items-center gap-2 hover:bg-white/10 transition-colors">
                                            <Edit size={14} /> Edit Lesson
                                        </button>
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* MDX Content - Wrapped in dynamic prose classes */}
                        {/* We use explicit inline style for font-size to ensure it works regardless of Tailwind conflicts */}
                        <article
                            className={`prose max-w-none ${currentTheme.prose} ${currentFontSize.class}`}
                            style={{ fontSize: currentFontSize.cssValue }}
                        >
                            <div id="lesson-content" className="relative">
                                {/* MDXContent might need to know about theme if it has custom internal styles, 
                                    but usually prose handles markdown well. */}
                                <MDXContent
                                    source={mdxSource}
                                    courseId={course.slug}
                                    lessonId={lesson.slug}
                                />
                                <TextSelectionToolbar />
                            </div>
                        </article>

                        <hr className={`my-12 ${currentTheme.border}`} />

                        {/* Quiz Section */}
                        <section id="ai-quiz" className="mb-20">
                            <AIQuizGenerator
                                courseId={course.slug}
                                lessonId={lesson.slug}
                                topic={lesson.title}
                                context={lesson.content}
                            />
                        </section>

                        {/* Navigation Buttons */}
                        <div className={`mt-12 flex justify-between items-center pt-8 border-t ${currentTheme.border}`}>
                            {prevLesson ? (
                                <Link
                                    href={`/courses/${course.slug}/${prevLesson.id}`}
                                    className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors group"
                                >
                                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                                    <div>
                                        <div className="text-xs text-text-secondary/60 uppercase tracking-wider">Previous</div>
                                        <div className="font-medium">{prevLesson.title}</div>
                                    </div>
                                </Link>
                            ) : (
                                <div />
                            )}

                            {nextLesson ? (
                                <Link
                                    href={`/courses/${course.slug}/${nextLesson.id}`}
                                    className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors text-right group"
                                >
                                    <div className="text-right">
                                        <div className="text-xs text-text-secondary/60 uppercase tracking-wider">Next</div>
                                        <div className="font-medium">{nextLesson.title}</div>
                                        <div className="text-xs text-yellow-500 font-medium mt-1">
                                            +{calculatePotentialXP(nextLesson.content?.length || 0)} XP
                                        </div>
                                    </div>
                                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            ) : (
                                <Link
                                    href={`/courses/${course.slug}`}
                                    className="flex items-center gap-2 bg-accent-primary hover:bg-accent-primary/90 text-white px-6 py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-accent-primary/25 group"
                                >
                                    <div className="text-right">
                                        <div className="text-xs text-white/80 uppercase tracking-wider">{isCompleted ? 'Done' : 'Finish'}</div>
                                        <div className="font-bold">{isCompleted ? 'Return to Course' : 'Complete Course'}</div>
                                        {/* Bonus XP text removed as per request since it triggers automatically */}
                                    </div>
                                    <CheckCircle size={20} />
                                </Link>
                            )}
                        </div>
                    </main>

                    {/* Table of Contents */}
                    <TableOfContents
                        courseId={course.slug}
                        lessonId={lesson.id}
                        initialLastElementId={initialLastElementId}
                        onActiveHeadingChange={setActiveHeadingId}
                        hideMobileTrigger={true}
                    />
                </div>
            </div>

            {/* AI Tutor */}
            <AITutor
                lessonTitle={lesson.title}
                lessonContent={lesson.content}
                lessonContext={{
                    courseTitle: course.title,
                    lessonTitle: lesson.title,
                    content: lesson.content
                }}
                activeHeadingId={activeHeadingId}
                courseSlug={course.slug}
                lessonSlug={lesson.slug}
                hideTrigger={true}
            />

            {/* Resume Learning Tracker */}
            <ResumeLearningTracker
                courseId={course.slug}
                lessonId={lesson.id}
                lessonTitle={lesson.title}
            />

            {/* Mobile Bottom Action Bar */}
            <MobileLessonBar onUpdateAppearance={handleMobileFontUpdate} currentFontSize={appearance.fontSize} />

            <LessonAppearanceControl
                appearance={appearance}
                onUpdate={updateAppearance}
            />
        </div>
    );
}
