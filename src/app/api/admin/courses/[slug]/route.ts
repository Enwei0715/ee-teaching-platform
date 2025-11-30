import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ContentAnalyzer } from "@/lib/contentAnalyzer";

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session || !session.user || session.user.role !== 'ADMIN') {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const courseId = params.slug;

        // Check if course exists
        const course = await prisma.course.findUnique({
            where: { slug: courseId }
        });

        if (!course) {
            return new NextResponse("Course not found", { status: 404 });
        }

        // If query param 'file' is present, return that lesson's content
        const url = new URL(request.url);
        const file = url.searchParams.get('file');

        if (file) {
            // file is expected to be the lesson slug (e.g. '1-intro.mdx' or just '1-intro')
            const lessonSlug = file.replace(/\.mdx$/, '');

            const lesson = await prisma.lesson.findFirst({
                where: {
                    courseId: course.id,
                    slug: lessonSlug
                }
            });

            if (lesson) {
                const meta = {
                    title: lesson.title,
                    description: lesson.description,
                    order: lesson.order,
                    slug: lesson.slug,
                };
                return NextResponse.json({ content: lesson.content, meta });
            }
            return new NextResponse("Lesson not found", { status: 404 });
        }

        // List all lessons
        const lessons = await prisma.lesson.findMany({
            where: { courseId: course.id },
            select: { slug: true, order: true },
            orderBy: { order: 'asc' }
        });

        // Return files as array of objects
        const files = lessons.map(l => ({
            filename: `${l.slug}.mdx`,
            order: l.order
        }));

        return NextResponse.json({
            files,
            course: {
                title: course.title,
                slug: course.slug,
                description: course.description,
                level: course.level,
                image: course.image
            }
        });

    } catch (error) {
        console.error("Error fetching course:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function POST(
    request: Request,
    { params }: { params: { slug: string } }
) {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session || !session.user || session.user.role !== 'ADMIN') {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { file, content, meta } = await request.json();
        const courseSlug = params.slug;

        const course = await prisma.course.findUnique({
            where: { slug: courseSlug }
        });

        if (!course) {
            return new NextResponse("Course not found", { status: 404 });
        }

        const lessonSlug = file.replace(/\.mdx$/, '');

        // Check if lesson exists
        const existingLesson = await prisma.lesson.findFirst({
            where: {
                courseId: course.id,
                slug: lessonSlug
            }
        });

        // Calculate sections metadata for smart quizzing
        const sectionsMetadata = ContentAnalyzer.analyze(content);

        if (existingLesson) {
            await prisma.lesson.update({
                where: { id: existingLesson.id },
                data: {
                    title: meta.title,
                    description: meta.description,
                    content: content,
                    order: meta.order || existingLesson.order,
                    slug: meta.slug || existingLesson.slug,

                }
            });

            // Reset completion status for all users who have completed this lesson
            await prisma.userProgress.updateMany({
                where: {
                    lessonId: existingLesson.id,
                    status: 'COMPLETED'
                },
                data: {
                    status: 'IN_PROGRESS'
                }
            });
        } else {
            // Create new lesson
            await prisma.lesson.create({
                data: {
                    slug: lessonSlug,
                    title: meta.title,
                    description: meta.description,
                    content: content,
                    order: meta.order || 999,
                    courseId: course.id,
                    published: true,

                }
            });
        }

        revalidatePath('/admin/courses');
        revalidatePath('/courses');

        return NextResponse.json({ message: "Saved successfully" });
    } catch (error) {
        console.error("Error saving course lesson:", error);
        return NextResponse.json({ message: "Error saving course lesson" }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { slug: string } }
) {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session || !session.user || session.user.role !== 'ADMIN') {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const updates = await request.json();
        const courseSlug = params.slug;

        const course = await prisma.course.findUnique({
            where: { slug: courseSlug }
        });

        if (!course) {
            return NextResponse.json({ message: "Course not found" }, { status: 404 });
        }

        // Check if slug is being updated and if it's unique
        if (updates.slug && updates.slug !== courseSlug) {
            const existingCourse = await prisma.course.findUnique({
                where: { slug: updates.slug }
            });

            if (existingCourse) {
                return NextResponse.json({ message: "Slug already exists" }, { status: 409 });
            }
        }

        await prisma.course.update({
            where: { slug: courseSlug },
            data: {
                title: updates.title,
                description: updates.description,
                level: updates.level,
                slug: updates.slug, // Allow slug update
                image: updates.image,
            }
        });

        revalidatePath('/admin/courses');
        revalidatePath('/courses');
        revalidatePath(`/courses/${courseSlug}`);

        return NextResponse.json(updates);
    } catch (error) {
        console.error("Error updating course:", error);
        return NextResponse.json({ message: "Error updating course" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { slug: string } }
) {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session || !session.user || session.user.role !== 'ADMIN') {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const slug = params.slug;

        await prisma.course.delete({
            where: { slug }
        });

        revalidatePath('/admin/courses');
        revalidatePath('/courses');

        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error) {
        console.error("Error deleting course:", error);
        return NextResponse.json({ message: "Error deleting course" }, { status: 500 });
    }
}
