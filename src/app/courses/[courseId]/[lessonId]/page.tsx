import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { serialize } from 'next-mdx-remote/serialize';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { getCourseLesson, getCourseStructure } from '@/lib/mdx';
import { calculateReadingTime } from '@/lib/utils';
import MDXContent from '@/components/mdx/MDXContent';
import CourseSidebar from '@/components/course/CourseSidebar';
import AIQuizGenerator from '@/components/assignment/AIQuizGenerator';
import AITutor from '@/components/ai/AITutor';
import TimeTracker from '@/components/course/TimeTracker';
import LessonNavigation from '@/components/course/LessonNavigation';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkBreaks from 'remark-breaks';
import remarkUnwrapImages from 'remark-unwrap-images';
import rehypeKatex from 'rehype-katex';
import YouTubePlayer from '@/components/courses/YouTubePlayer';
import LessonNavigationListener from '@/components/courses/LessonNavigationListener';
import LessonEditButton from '@/components/course/LessonEditButton';
import TextSelectionToolbar from '@/components/ai/TextSelectionToolbar';
import InteractiveGridPattern from '@/components/ui/InteractiveGridPattern';


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

    // Defensive: Wrap MDX serialization in try-catch with smart recovery
    let mdxSource;
    let serializationError = false;
    let autoFormatted = false;

    try {
        mdxSource = await serialize(lesson.content, {
            mdxOptions: {
                remarkPlugins: [
                    remarkGfm,
                    remarkBreaks,
                    remarkUnwrapImages,
                    [remarkMath, { singleDollarTextMath: true }]
                ],
                rehypePlugins: [rehypeKatex],
            },
        });
    } catch (error) {
        console.error('❌ MDX Serialization Failed (Attempt 1 - Standard):', error);
        console.error('Error serializing MDX content for lesson:', params.lessonId, error);
        serializationError = true;

        // Retry 1: Try without math plugins (might have LaTeX syntax issues)
        try {
            console.log('Retry 1: Attempting serialization without math plugins...');
            mdxSource = await serialize(lesson.content, {
                mdxOptions: {
                    remarkPlugins: [remarkGfm],
                },
            });
            console.log('Retry 1: Success - rendered without math support');
            serializationError = false;
        } catch (retryError1) {
            console.error('❌ MDX Serialization Failed (Attempt 2 - No Math):', retryError1);
            console.error('Retry 1 failed:', retryError1);

            // Retry 2: Try with just basic GFM, escaping potential problematic characters
            try {
                console.log('Retry 2: Attempting with escaped content...');
                const escapedContent = lesson.content
                    .replace(/\\\(/g, '\\\\(')
                    .replace(/\\\)/g, '\\\\)')
                    .replace(/\\\[/g, '\\\\[')
                    .replace(/\\\]/g, '\\\\]');

                mdxSource = await serialize(escapedContent, {
                    mdxOptions: {
                        remarkPlugins: [remarkGfm],
                    },
                });
                console.log('Retry 2: Success - rendered with escaped content');
                serializationError = false;
            } catch (retryError2) {
                console.error('❌ MDX Serialization Failed (Attempt 3 - Escaped):', retryError2);
                console.error('Retry 2 failed:', retryError2);

                // Final fallback: Wrap in code block
                try {
                    console.warn('⚠️ Triggering Final Fallback: Wrapping content in Code Block.');
                    console.log('Final fallback: Wrapping in code block...');
                    // Calculate N+1 backticks to safely wrap content
                    const maxBackticks = (lesson.content.match(/`+/g) || [])
                        .reduce((max, match) => Math.max(max, match.length), 0);
                    const fence = '`'.repeat(Math.max(3, maxBackticks + 1));

                    // Inject error message
                    const errorMessage = retryError2 instanceof Error ? retryError2.message : String(retryError2);

                    const debugContent = `
> 🛑 **MDX RENDER ERROR DETECTED**
> **Reason:** ${errorMessage}

${fence}text
${lesson.content}
${fence}
`;

                    mdxSource = await serialize(debugContent, {
                        mdxOptions: {
                            remarkPlugins: [remarkGfm],
                        },
                        parseFrontmatter: false
                    });
                    autoFormatted = true;
                    serializationError = false;
                } catch (finalError) {
                    console.error('All retry attempts failed:', finalError);
                    // Absolute last resort
                    mdxSource = await serialize('> **⚠️ 格式錯誤：** 無法正確渲染內容。\n\n```text\n' + lesson.content.substring(0, 500) + '\n...\n```');
                    serializationError = false;
                }
            }
        }
    }

    const courseStructure = await getCourseStructure(params.courseId);

    const currentIndex = courseStructure.findIndex(l => l.id === params.lessonId);
    const prevLesson = currentIndex > 0 ? courseStructure[currentIndex - 1] : null;
    const nextLesson = currentIndex < courseStructure.length - 1 ? courseStructure[currentIndex + 1] : null;

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-gray-950 relative">
            <InteractiveGridPattern />

            <CourseSidebar courseId={params.courseId} lessons={courseStructure} />

            <main className="flex-1 min-w-0">
                <TimeTracker courseId={params.courseId} lessonId={params.lessonId} />
                <div className="max-w-4xl mx-auto px-4 lg:px-6 py-8 lg:py-12">
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

                        <div className="flex items-start justify-between gap-4 mb-4">
                            <h1 className="text-3xl md:text-4xl font-bold text-text-primary flex-1">{lesson.meta.title}</h1>
                            <LessonEditButton courseSlug={params.courseId} lessonSlug={params.lessonId} />
                        </div>
                        <div className="flex items-center gap-4 text-sm text-text-secondary">
                            <span>Module {Math.floor(currentIndex / 5) + 1}</span>
                            <span>•</span>
                            <span>{calculateReadingTime(lesson.content)}</span>
                        </div>
                    </div>



                    <div className="prose prose-invert prose-blue max-w-none mb-16" id="lesson-content">
                        <TextSelectionToolbar />
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
                    <LessonNavigationListener
                        courseId={params.courseId}
                        nextLessonId={nextLesson?.id}
                        prevLessonId={prevLesson?.id}
                    />
                </div>
            </main>
            <AITutor
                lessonTitle={lesson.meta.title}
                lessonContent={lesson.content}
                lessonContext={{
                    courseTitle: params.courseId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
                    lessonTitle: lesson.meta.title,
                    content: lesson.content.replace(/<[^>]*>/g, '').replace(/\n{3,}/g, '\n\n') // Strip HTML tags and reduce excessive newlines
                }}
            />
        </div>
    );
}
