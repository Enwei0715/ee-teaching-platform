import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Clock, BarChart, PlayCircle, BookOpen, CheckCircle } from 'lucide-react';
import { getCourseStructure, getCourseBySlug } from '@/lib/mdx';
import { calculateCourseTotalDuration, calculateReadingTime } from '@/lib/utils';
import { notFound } from 'next/navigation';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface Props {
    params: { courseId: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const course = await getCourseBySlug(params.courseId);
    if (!course) return { title: 'Course Not Found | EE Master' };
    return {
        title: `${course.title} | EE Master`,
        description: course.description,
    };
}

export default async function CoursePage({ params }: Props) {
    const course = await getCourseBySlug(params.courseId);
    if (!course) notFound();

    const lessons = await getCourseStructure(params.courseId);
    const firstLessonId = lessons.length > 0 ? lessons[0].id : null;
    const totalDuration = calculateCourseTotalDuration(lessons);

    const session = await getServerSession(authOptions);
    let completedLessons: string[] = [];

    if (session?.user?.id) {
        const dbCourse = await prisma.course.findUnique({
            where: { slug: params.courseId }
        });

        if (dbCourse) {
            const progress = await prisma.userProgress.findMany({
                where: {
                    userId: session.user.id,
                    courseId: dbCourse.id,
                    completed: true,
                },
                select: { lessonId: true },
            });
            completedLessons = progress.map((p: { lessonId: string }) => p.lessonId);
        }
    }

    return (
        <div className="min-h-screen bg-bg-primary">
            {/* Hero Section */}
            <header className="relative py-20 px-6 bg-bg-secondary border-b border-border-primary overflow-hidden">
                <div className="absolute inset-0 bg-accent-primary/5 pointer-events-none" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <Link href="/courses" className="inline-flex items-center text-text-secondary hover:text-accent-primary transition-colors mb-8 text-sm font-medium group">
                        <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Courses
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-6 leading-tight tracking-tight">{course.title}</h1>

                    <div className="flex flex-wrap items-center gap-6 text-sm text-text-secondary mb-10">
                        <span className="flex items-center gap-2 bg-bg-tertiary px-3 py-1.5 rounded-full border border-border-primary">
                            <BarChart size={16} className="text-accent-primary" />
                            {course.level}
                        </span>
                        <span className="flex items-center gap-2 bg-bg-tertiary px-3 py-1.5 rounded-full border border-border-primary">
                            <Clock size={16} className="text-accent-primary" />
                            {totalDuration}
                        </span>
                        <span className="flex items-center gap-2 bg-bg-tertiary px-3 py-1.5 rounded-full border border-border-primary">
                            <BookOpen size={16} className="text-accent-primary" />
                            {lessons.length} Lessons
                        </span>
                    </div>

                    {firstLessonId && (
                        <div className="relative z-20">
                            <Link
                                href={`/courses/${params.courseId}/${firstLessonId}`}
                                className="inline-flex items-center gap-3 bg-accent-primary hover:bg-accent-primary/90 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-accent-primary/25"
                            >
                                <PlayCircle size={24} />
                                Start Learning
                            </Link>
                        </div>
                    )}
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-3">
                        <BookOpen className="text-accent-primary" />
                        Course Curriculum
                    </h2>

                    <div className="bg-bg-secondary border border-border-primary rounded-xl overflow-hidden shadow-sm">
                        {lessons.length > 0 ? (
                            <div className="divide-y divide-border-primary">
                                {lessons.map((lesson, index) => (
                                    <Link
                                        key={lesson.id}
                                        href={`/courses/${params.courseId}/${lesson.id}`}
                                        className="flex items-center gap-4 p-5 hover:bg-bg-tertiary transition-colors group"
                                    >
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-bg-tertiary border border-border-primary group-hover:border-accent-primary/50 group-hover:bg-accent-primary/10 transition-colors shrink-0">
                                            {completedLessons.includes(lesson.id) ? (
                                                <CheckCircle size={20} className="text-accent-success" />
                                            ) : (
                                                <span className="font-mono text-sm text-text-secondary group-hover:text-accent-primary font-medium">
                                                    {String(index + 1).padStart(2, '0')}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-text-primary font-medium group-hover:text-accent-primary transition-colors truncate">
                                                {lesson.title}
                                            </h3>
                                            <p className="text-xs text-text-secondary mt-1">{calculateReadingTime(lesson.content)}</p>
                                        </div>

                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity text-accent-primary">
                                            <PlayCircle size={20} />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-text-secondary">
                                No lessons available yet.
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <aside className="lg:col-span-1 space-y-8">
                    <div className="bg-bg-secondary border border-border-primary rounded-xl p-6">
                        <h3 className="text-lg font-bold text-text-primary mb-4">Course Features</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-text-secondary">
                                <CheckCircle size={20} className="text-accent-success shrink-0 mt-0.5" />
                                <span>Comprehensive curriculum covering all basics</span>
                            </li>
                            <li className="flex items-start gap-3 text-text-secondary">
                                <CheckCircle size={20} className="text-accent-success shrink-0 mt-0.5" />
                                <span>Hands-on circuit examples and diagrams</span>
                            </li>
                            <li className="flex items-start gap-3 text-text-secondary">
                                <CheckCircle size={20} className="text-accent-success shrink-0 mt-0.5" />
                                <span>Self-paced learning with lifetime access</span>
                            </li>
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
}
