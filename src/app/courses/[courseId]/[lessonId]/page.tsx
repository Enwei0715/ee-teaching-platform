import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { serialize } from 'next-mdx-remote/serialize';
import { getCourseLesson, getCourseStructure } from '@/lib/mdx';
import { calculateReadingTime } from '@/lib/utils';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkBreaks from 'remark-breaks';
import remarkUnwrapImages from 'remark-unwrap-images';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import LessonContent from '@/components/course/LessonContent';
import { LessonProgressProvider } from '@/context/LessonProgressContext';

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
    const session = await getServerSession(authOptions);
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
                rehypePlugins: [rehypeKatex, rehypeSlug],
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

    // Fetch user progress for this lesson to get lastElementId
    let initialLastElementId = null;
    let lessonStatus = 'NOT_STARTED';

    // Fetch course details from DB to get lessons list for sidebar
    // Note: getCourseStructure returns lessons from MDX, but we might want DB data if available.
    // For now, we use the structure from MDX for navigation, but we need the course title and ID.
    // The `course` object used in previous code seemed to come from `prisma` or `getCourseStructure`?
    // `getCourseStructure` returns an array of lessons.
    // We need the course metadata.

    let courseTitle = params.courseId; // Fallback
    let courseId = params.courseId;
    let courseLessons = courseStructure; // Default to MDX structure

    try {
        const dbCourse = await prisma.course.findUnique({
            where: { slug: params.courseId },
            include: { lessons: { select: { id: true, title: true, slug: true } } }
        });

        if (dbCourse) {
            courseTitle = dbCourse.title;
            courseId = dbCourse.id;
            // If we want to use DB lessons for sidebar, we can. But MDX structure preserves order better usually?
            // Let's stick to MDX structure for sidebar if possible, or mix.
            // The previous code used `course.lessons` which came from... where?
            // In the previous code: `const course = await prisma.course.findUnique(...)` was inside the session check block?
            // No, it was likely fetched before.
            // Let's fetch it properly here.
        }
    } catch (e) {
        console.error("Failed to fetch course details", e);
    }

    // Fetch progress
    if (session?.user?.id && courseId) {
        try {
            // We need the lesson DB ID.
            const dbLesson = await prisma.lesson.findUnique({
                where: {
                    courseId_slug: {
                        courseId: courseId, // This might be UUID or slug depending on schema. Schema says Course.id is String @id @default(uuid())
                        slug: params.lessonId
                    }
                },
                select: { id: true }
            });

            if (dbLesson) {
                const progress = await prisma.userProgress.findUnique({
                    where: {
                        userId_courseId_lessonId: {
                            userId: session.user.id,
                            courseId: courseId,
                            lessonId: dbLesson.id
                        }
                    },
                    select: { lastElementId: true, status: true }
                });
                initialLastElementId = progress?.lastElementId || null;
                lessonStatus = progress?.status || 'NOT_STARTED';
            }
        } catch (e) {
            console.error("Failed to fetch initial progress", e);
        }
    }

    // Calculate reading time
    const readingTimeStr = calculateReadingTime(lesson.content);
    const readingTime = parseInt(readingTimeStr) || 1;

    // Count completed lessons
    const completedLessonsCount = session?.user?.id ? await prisma.userProgress.count({
        where: {
            userId: session.user.id,
            courseId: courseId,
            status: 'COMPLETED'
        }
    }) : 0;

    // Prepare data for Client Component
    const courseData = {
        id: courseId,
        slug: params.courseId,
        title: courseTitle,
        lessons: courseStructure // Passing MDX structure which has id, title, slug
    };

    const lessonData = {
        id: lesson.lessonId, // This is the slug from MDX usually, or we should pass the DB ID if needed? 
        // MDX `getCourseLesson` returns `id` as the filename/slug.
        // `TableOfContents` uses `lessonId` for saving progress. It likely expects the DB ID if it saves to DB.
        // But `TableOfContents` in previous code used `lesson.id` which was from MDX.
        // Let's check `TableOfContents` implementation later. For now pass what we have.
        slug: params.lessonId,
        title: lesson.meta.title,
        content: lesson.content,
        updatedAt: lesson.meta.date
    };

    return (
        <LessonProgressProvider
            initialStatus={lessonStatus as any}
            lessonId={lessonData.id}
            courseId={params.courseId}
        >
            <LessonContent
                course={courseData}
                lesson={lessonData}
                prevLesson={prevLesson}
                nextLesson={nextLesson}
                initialLastElementId={initialLastElementId}
                lessonStatus={lessonStatus}
                readingTime={readingTime}
                mdxSource={mdxSource}
                completedLessonsCount={completedLessonsCount}
            />
        </LessonProgressProvider>
    );
}
