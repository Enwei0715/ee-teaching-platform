import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Clock, BarChart, PlayCircle, BookOpen, CheckCircle } from 'lucide-react';
import { getCourseStructure, getCourseBySlug, getAllCourses } from '@/lib/mdx';
import { calculateCourseTotalDuration, calculateReadingTime } from '@/lib/utils';
import { notFound } from 'next/navigation';
import CourseProgress from '@/components/courses/CourseProgress';
import CurriculumHeader from '@/components/courses/CurriculumHeader';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkBreaks from 'remark-breaks';
import rehypeKatex from 'rehype-katex';
import InteractiveDotGrid from '@/components/ui/InteractiveDotGrid';

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

export async function generateStaticParams() {
    const courses = await getAllCourses();
    return courses.map((course) => ({
        courseId: course.slug,
    }));
}

export default async function CoursePage({ params }: Props) {
    const course = await getCourseBySlug(params.courseId);
    if (!course) notFound();

    const lessons = await getCourseStructure(params.courseId);

    // Render descriptions on the server
    const lessonsWithDescription = lessons.map((lesson) => {
        let descriptionNode = null;
        if (lesson.description) {
            // Preprocess LaTeX syntax similar to LessonPage
            const processedContent = lesson.description
                .replace(/\\\(/g, '$')
                .replace(/\\\)/g, '$')
                .replace(/\\\[/g, '$$\n')
                .replace(/\\\]/g, '\n$$');

            descriptionNode = (
                <MDXRemote
                    source={processedContent}
                    components={{
                        p: (props: any) => <p className="text-xs text-text-secondary m-0" {...props} />,
                        a: (props: any) => <a className="text-accent-primary hover:underline" {...props} />,
                        code: (props: any) => <code className="bg-bg-tertiary px-1 rounded text-xs font-mono" {...props} />,
                    }}
                    options={{
                        mdxOptions: {
                            remarkPlugins: [
                                remarkGfm,
                                remarkBreaks,
                                [remarkMath, { singleDollarTextMath: true }]
                            ],
                            rehypePlugins: [rehypeKatex],
                        },
                    }}
                />
            );
        }
        return {
            ...lesson,
            descriptionNode
        };
    });

    const firstLessonId = lessons.length > 0 ? lessons[0].id : null;
    const totalDuration = calculateCourseTotalDuration(lessons);

    return (
        <div className="min-h-screen relative overflow-hidden">
            <InteractiveDotGrid />
            {/* Hero Section */}
            <header className="relative py-12 px-4 md:py-20 md:px-6 bg-gradient-to-br from-gray-900 via-[#0f172a] to-gray-900 border-b border-border-primary overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-[0.08] pointer-events-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10 L50 10 L50 50 L90 50 L90 90' stroke='%23ffffff' stroke-width='1' fill='none'/%3E%3Cpath d='M30 30 L70 30 L70 70' stroke='%23ffffff' stroke-width='1' fill='none'/%3E%3Ccircle cx='50' cy='50' r='2' fill='%23ffffff'/%3E%3C/svg%3E")`, backgroundSize: '150px 150px' }}>
                </div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <Link href="/courses" className="inline-flex items-center text-text-secondary hover:text-accent-primary transition-colors mb-8 text-sm font-medium group">
                        <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Courses
                    </Link>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6 leading-tight tracking-tight">{course.title}</h1>

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

            <div className="max-w-7xl mx-auto px-4 py-8 md:px-6 md:py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    <CurriculumHeader courseSlug={params.courseId} />

                    <div className="bg-bg-secondary border border-border-primary rounded-xl overflow-hidden shadow-sm">
                        <CourseProgress courseId={params.courseId} lessons={lessonsWithDescription} />
                    </div>
                </div>

                {/* Sidebar */}
                <aside className="lg:col-span-1 space-y-8">
                    <div className="glass-panel shadow-xl rounded-xl p-6">
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
