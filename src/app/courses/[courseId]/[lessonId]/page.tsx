import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { serialize } from 'next-mdx-remote/serialize';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { getCourseLesson, getCourseStructure } from '@/lib/mdx';
import MDXContent from '@/components/mdx/MDXContent';
import CourseSidebar from '@/components/course/CourseSidebar';
import AIQuizGenerator from '@/components/assignment/AIQuizGenerator';
import AITutor from '@/components/ai/AITutor';
import TimeTracker from '@/components/course/TimeTracker';
import LessonNavigation from '@/components/course/LessonNavigation';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';


interface Props {
    params: {
        courseId: string;
        lessonId: string;
    };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        const lesson = await getCourseLesson(params.courseId, params.lessonId);
        if (!lesson) {
            return {
                title: 'Lesson Not Found | EE Master',
            };
        }
        return {
            title: `${lesson.meta.title} | EE Master`,
        };
    } catch (e) {
        return {
            title: 'Lesson Not Found | EE Master',
        };
    }
}

export default async function LessonPage({ params }: Props) {
    let lesson;
    try {
        lesson = await getCourseLesson(params.courseId, params.lessonId);
    } catch (e) {
        notFound();
    }

    if (!lesson) {
        notFound();
    }

    const mdxSource = await serialize(lesson.content, {
        mdxOptions: {
            remarkPlugins: [remarkGfm, remarkMath],
            rehypePlugins: [rehypeKatex],
        },
    });
    const courseStructure = await getCourseStructure(params.courseId);

    const currentIndex = courseStructure.findIndex(l => l.id === params.lessonId);
    const prevLesson = currentIndex > 0 ? courseStructure[currentIndex - 1] : null;
    const nextLesson = currentIndex < courseStructure.length - 1 ? courseStructure[currentIndex + 1] : null;

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-bg-primary">
            {/* Mobile Sidebar Toggle could go here */}

            <CourseSidebar courseId={params.courseId} lessons={courseStructure} />

            <main className="flex-1 min-w-0">
                <TimeTracker courseId={params.courseId} lessonId={params.lessonId} />
                <div className="max-w-4xl mx-auto px-6 py-12">
                    <div className="mb-8 pb-8 border-b border-border-primary">
                        <nav className="flex items-center gap-2 text-sm text-text-secondary mb-6">
                            <Link href="/courses" className="hover:text-accent-primary transition-colors">Courses</Link>
                            <ChevronRight size={14} />
                            <Link href={`/courses/${params.courseId}`} className="hover:text-accent-primary transition-colors line-clamp-1">
                                {params.courseId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                            </Link>
                            <ChevronRight size={14} />
                            <span className="text-text-primary font-medium line-clamp-1">{lesson.meta.title}</span>
                        </nav>

                        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">{lesson.meta.title}</h1>
                        <div className="flex items-center gap-4 text-sm text-text-secondary">
                            <span>Module {Math.floor(currentIndex / 5) + 1}</span>
                            <span>•</span>
                            <span>15 min read</span>
                        </div>
                    </div>

                    {lesson.meta.videoUrl && (
                        <div className="mb-8 aspect-video rounded-xl overflow-hidden shadow-lg">
                            <iframe
                                src={`https://www.youtube.com/embed/${lesson.meta.videoUrl.split('v=')[1]?.split('&')[0] || lesson.meta.videoUrl.split('/').pop()}`}
                                title={lesson.meta.title}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    )}

                    <div className="prose prose-invert prose-blue max-w-none mb-16">
                        <MDXContent
                            source={mdxSource}
                            courseId={params.courseId}
                            lessonId={params.lessonId}
                        />
                    </div>

                    <AIQuizGenerator
                        courseId={params.courseId}
                        lessonId={params.lessonId}
                        topic={lesson.meta.title}
                        context={lesson.content.substring(0, 1000)}
                    />

                    <LessonNavigation
                        courseId={params.courseId}
                        currentLessonId={params.lessonId}
                        prevLesson={prevLesson}
                        nextLesson={nextLesson}
                    />
                </div>
            </main>
            <AITutor />
        </div>
    );
}
