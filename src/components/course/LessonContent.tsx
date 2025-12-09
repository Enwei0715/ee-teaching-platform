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

    // Theme Styles Configuration
    const themeStyles = {
        default: {
            wrapper: 'bg-bg-primary',
            text: 'text-text-primary',
            prose: 'prose-invert',
            border: 'border-border-primary'
        },
        light: {
            wrapper: 'bg-white',
            text: 'text-slate-900',
            prose: 'prose-slate', // Not inverted
            border: 'border-slate-200'
        },
        sepia: {
            wrapper: 'bg-[#f4ecd8]',
            text: 'text-[#5b4636]',
            prose: 'prose-stone', // Warm tones
            border: 'border-[#d3cbb7]'
        },
        navy: {
            wrapper: 'bg-[#0f172a]',
            text: 'text-slate-200',
            prose: 'prose-invert prose-blue',
            border: 'border-blue-900/30'
        }
    };

    // Font Size Configuration
    const fontSizes = {
        small: 'prose-sm',
        medium: 'prose-base',
        large: 'prose-lg'
    };

    const currentTheme = themeStyles[appearance.theme];
    const currentFontSize = fontSizes[appearance.fontSize];

    // State for progress-aware quiz
    const [activeHeadingId, setActiveHeadingId] = useState<string>('');
    const [scrollProgress, setScrollProgress] = useState(0);

    // Navigation Hotkeys Listener
    useEffect(() => {
        const handleNext = () => {
            if (nextLesson) router.push(`/courses/${course.slug}/${nextLesson.id}`);
        };
        const handlePrev = () => {
            if (prevLesson) router.push(`/courses/${course.slug}/${prevLesson.id}`);
        };

        window.addEventListener('nav-next-lesson', handleNext);
        window.addEventListener('nav-prev-lesson', handlePrev);

        return () => {
            window.removeEventListener('nav-next-lesson', handleNext);
            window.removeEventListener('nav-prev-lesson', handlePrev);
        };
    }, [nextLesson, prevLesson, course.slug, router]);

    // Debug: Log active heading change
    useEffect(() => {
        console.log(`[LessonContent] Active Heading Changed: "${activeHeadingId}"`);
    }, [activeHeadingId]);

    // Context for real-time updates
    const { startLesson, enterReviewMode, markAsComplete } = useLessonProgress();

    // Scroll progress listener
    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / totalHeight) * 100;
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Time tracking for anti-cheating
    const startTimeRef = useRef(Date.now());

    // Intersection Observer for Completion (AI Quiz Section)
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    const timeSpent = (Date.now() - startTimeRef.current) / 1000;
                    // Dynamic time check: 50% of reading time, minimum 30 seconds
                    const requiredTime = Math.max(30, (readingTime * 60) / 2);

                    if (timeSpent < requiredTime) {
                        const remaining = Math.ceil(requiredTime - timeSpent);
                        toast.error(
                            isCompleted
                                ? `Review too short! Read for ${remaining}s more to earn Review XP.`
                                : `Don't rush! Read for ${remaining}s more to complete the lesson.`,
                            {
                                icon: <Clock size={18} className="text-red-500" />
                            }
                        );
                        return;
                    }

                    console.log("🎯 [LessonContent] Reached AI Quiz section! Triggering completion...");
                    markAsComplete().then((result: any) => {
                        // Check if XP was awarded
                        if (result?.gamification?.xpGained > 0) {
                            // Trigger Confetti
                            confetti({
                                particleCount: 100,
                                spread: 70,
                                origin: { y: 0.6 },
                                colors: ['#EAB308', '#A855F7', '#3B82F6'] // Yellow, Purple, Blue
                            });

                            // Check for Course Completion
                            if (result.gamification.courseCompleted) {
                                // Big Confetti for Course Completion
                                var duration = 3 * 1000;
                                var animationEnd = Date.now() + duration;
                                var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

                                var random = function (min: number, max: number) {
                                    return Math.random() * (max - min) + min;
                                };

                                var interval: any = setInterval(function () {
                                    var timeLeft = animationEnd - Date.now();

                                    if (timeLeft <= 0) {
                                        return clearInterval(interval);
                                    }

                                    var particleCount = 50 * (timeLeft / duration);
                                    confetti({ ...defaults, particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } });
                                    confetti({ ...defaults, particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } });
                                }, 250);

                                toast.success(
                                    <div className="flex flex-col gap-1">
                                        <span className="font-bold text-lg">🏆 Course Completed!</span>
                                        <span className="text-sm">You've mastered {course.title}!</span>
                                        <span className="text-xs opacity-80 font-bold text-yellow-300">+100 Bonus XP & Certificate Earned</span>
                                    </div>,
                                    { duration: 8000 }
                                );
                            } else if (result.gamification.xp?.levelUp) {
                                toast.success(
                                    <div className="flex flex-col gap-1">
                                        <span className="font-bold text-lg">🎉 Level Up!</span>
                                        <span className="text-sm">You reached Level {result.gamification.xp.newLevel}!</span>
                                        <span className="text-xs opacity-80">+{result.gamification.xpGained} XP</span>
                                    </div>,
                                    { duration: 5000 }
                                );
                            } else {
                                toast.success(
                                    <div className="flex flex-col gap-1">
                                        <span className="font-bold">Lesson Completed!</span>
                                        <span className="flex items-center gap-1 text-sm">
                                            <Zap size={14} className="text-yellow-500 fill-yellow-500" />
                                            You earned {result.gamification.xpGained} XP
                                        </span>
                                    </div>
                                );
                            }
                        } else if (result?.status === 'COMPLETED') {
                            toast.success('Lesson Completed!', {
                                icon: <Trophy size={18} className="text-yellow-500" />,
                            });
                        }
                    });
                }
            },
            { threshold: 0.1 }
        );

        const quizSection = document.getElementById('ai-quiz');
        if (quizSection) {
            observer.observe(quizSection);
        }

        return () => observer.disconnect();
    }, []);

    // If not mounted yet (SSR), render a safe default or loading state to prevent mismatch
    // But for a lesson page, we want SEO to be good, so we should default to 'default' theme which matches server render usually.
    // However, if we change classNames based on state that is only on client (localStorage), we might get hydration error.
    // We can suppress hydration warning or just accept the flicker. 'mounted' check helps avoiding mismatch but delays styling.
    // Better to default to 'default' theme and let it re-render. Since we use 'mounted' in hook, we can rely on that.

    return (
        <div className={`min-h-screen pb-20 relative transition-colors duration-500 ease-out ${currentTheme.wrapper} ${currentTheme.text}`}>
            {/* Show grid only if NOT in focus mode AND we are in a theme that supports it (e.g. default/navy)? 
                Or allow grid in all modes but styled differently? 
                For now, Focus Mode simply removes it. 
                Also, GridPattern is white/blue, might look bad on Light/Sepia.
                Let's only show GridPattern on 'default' and 'navy' themes AND when focusMode is false.
            */}
            {(!appearance.focusMode && (appearance.theme === 'default' || appearance.theme === 'navy')) && (
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
                                <div className="flex-shrink-0 pt-1">
                                    <LessonAppearanceControl
                                        appearance={appearance}
                                        onUpdate={updateAppearance}
                                    />
                                </div>
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
                        <article className={`prose max-w-none ${currentTheme.prose} ${currentFontSize}`}>
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
            <MobileLessonBar />
        </div>
    );
}
