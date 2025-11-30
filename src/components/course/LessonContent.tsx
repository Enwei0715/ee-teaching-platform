'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Clock, Calendar, Edit } from 'lucide-react';
import { useEditMode } from '@/context/EditModeContext';
import MDXContent from '@/components/mdx/MDXContent';
import CourseSidebar from '@/components/course/CourseSidebar';
import AITutor from '@/components/ai/AITutor';
import TextSelectionToolbar from '@/components/ai/TextSelectionToolbar';
import ResumeLearningTracker from '@/components/course/ResumeLearningTracker';
import TableOfContents from '@/components/course/TableOfContents';
import AIQuizGenerator from '@/components/assignment/AIQuizGenerator';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';

import InteractiveGridPattern from '@/components/ui/InteractiveGridPattern';

interface LessonContentProps {
    course: {
        id: string;
        slug: string;
        title: string;
        lessons: any[]; // Type this properly if possible
    };
    lesson: {
        id: string;
        slug: string;
        title: string;
        content: string;
        updatedAt: Date | string;
    };
    prevLesson: any; // Type this properly
    nextLesson: any; // Type this properly
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

    // State for progress-aware quiz
    const [activeHeadingId, setActiveHeadingId] = useState<string>('');
    const [scrollProgress, setScrollProgress] = useState(0);

    // Navigation Hotkeys Listener
    useEffect(() => {
        const handleNext = () => {
            if (nextLesson) router.push(`/courses/${course.slug}/${nextLesson.slug}`);
        };
        const handlePrev = () => {
            if (prevLesson) router.push(`/courses/${course.slug}/${prevLesson.slug}`);
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

    // MDX Components - can be extended here
    const mdxComponents = {};

    return (
        <div className="min-h-screen bg-bg-primary pb-20 relative">
            <InteractiveGridPattern />
            {/* Progress Bar */}
            <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-bg-tertiary">
                <div
                    className="h-full bg-accent-primary transition-all duration-300"
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>

            <div className="flex flex-col lg:flex-row min-h-screen relative">
                {/* Sidebar - Flush Left */}
                <CourseSidebar
                    courseId={course.slug}
                    lessons={course.lessons}
                    category="Electronics" // TODO: Fetch category dynamically
                    courseTitle={course.title}
                />

                {/* Main Content Wrapper */}
                <div className="flex-1 container mx-auto px-4 py-8 lg:py-12 flex flex-col lg:flex-row gap-8">
                    {/* Main Article */}
                    <main className="flex-1 min-w-0">
                        {/* Breadcrumbs (Visible on all devices) */}
                        <nav className="flex items-center text-sm text-text-secondary mb-6 overflow-x-auto whitespace-nowrap pb-2">
                            <Link href="/courses" className="hover:text-text-primary transition-colors">Courses</Link>
                            <ChevronRight size={16} className="mx-2" />
                            <Link href={`/courses/${course.slug}`} className="hover:text-text-primary transition-colors">
                                {course.title}
                            </Link>
                            <ChevronRight size={16} className="mx-2" />
                            <span className="text-text-primary font-medium truncate">{lesson.title}</span>
                        </nav>

                        <article className="prose prose-invert prose-lg max-w-none">
                            <div className="mb-8 border-b border-border-primary pb-8">
                                <h1 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4 tracking-tight">
                                    {lesson.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                                    <div className="flex items-center gap-1.5 bg-bg-tertiary px-3 py-1.5 rounded-full">
                                        <Clock size={16} className="text-accent-primary" />
                                        <span>{readingTime} min read</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-bg-tertiary px-3 py-1.5 rounded-full">
                                        <Calendar size={16} className="text-accent-primary" />
                                        <span>{lesson.updatedAt ? new Date(lesson.updatedAt).toLocaleDateString() : 'Recently updated'}</span>
                                    </div>
                                    {isEditMode && (
                                        <Link href={`/admin/courses/${course.id}/lessons/${lesson.id}`}>
                                            <button className="glass-ghost px-3 py-1 rounded-lg border border-white/20 text-sm flex items-center gap-2 hover:bg-white/10 transition-colors">
                                                <Edit size={14} /> Edit Lesson
                                            </button>
                                        </Link>
                                    )}
                                </div>
                            </div>

                            {/* MDX Content */}
                            <div id="lesson-content" className="relative">
                                <MDXContent
                                    source={mdxSource}

                                    courseId={course.slug}
                                    lessonId={lesson.slug}
                                />
                                <TextSelectionToolbar

                                />
                            </div>
                        </article>

                        <hr className="border-border-primary my-12" />

                        {/* Restored Quiz Section */}
                        <section id="ai-quiz" className="mb-20">
                            <AIQuizGenerator
                                courseId={course.slug}
                                lessonId={lesson.slug}
                                topic={lesson.title}
                                context={lesson.content}
                            />
                        </section>

                        {/* Navigation Buttons */}
                        <div className="mt-12 flex justify-between items-center pt-8 border-t border-border-primary">
                            {prevLesson ? (
                                <Link
                                    href={`/courses/${course.slug}/${prevLesson.slug}`}
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
                                    href={`/courses/${course.slug}/${nextLesson.slug}`}
                                    className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors text-right group"
                                >
                                    <div>
                                        <div className="text-xs text-text-secondary/60 uppercase tracking-wider">Next</div>
                                        <div className="font-medium">{nextLesson.title}</div>
                                    </div>
                                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            ) : (
                                <div />
                            )}
                        </div>
                    </main>

                    {/* Table of Contents */}
                    <TableOfContents
                        courseId={course.slug}
                        lessonId={lesson.id}
                        initialLastElementId={initialLastElementId}
                        onActiveHeadingChange={setActiveHeadingId}
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
                lessonStatus={lessonStatus}
            />

            {/* Resume Learning Tracker */}
            <ResumeLearningTracker
                courseId={course.id}
                lessonId={lesson.id}
                lessonTitle={lesson.title}

            />
        </div>
    );
}
