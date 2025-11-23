import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

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
        const { filename, title } = await request.json();
        const courseSlug = params.slug;

        if (!filename || !title) {
            return new NextResponse("Missing filename or title", { status: 400 });
        }

        const course = await prisma.course.findUnique({
            where: { slug: courseSlug }
        });

        if (!course) {
            return new NextResponse("Course not found", { status: 404 });
        }

        // Sanitize filename to get slug
        const lessonSlug = filename.replace(/[^a-z0-9-]/gi, '-').toLowerCase().replace(/\.mdx$/, '');

        const existingLesson = await prisma.lesson.findFirst({
            where: {
                courseId: course.id,
                slug: lessonSlug
            }
        });

        if (existingLesson) {
            return new NextResponse("Lesson with this slug already exists", { status: 409 });
        }

        const content = `# ${title}\n\nStart writing your lesson content here...`;

        await prisma.lesson.create({
            data: {
                slug: lessonSlug,
                title: title,
                content: content,
                order: 99,
                courseId: course.id,
                published: true
            }
        });

        revalidatePath(`/admin/courses/${courseSlug}`);
        revalidatePath(`/courses/${courseSlug}`);

        return NextResponse.json({
            message: "Lesson created successfully",
            filename: `${lessonSlug}.mdx`
        });
    } catch (error) {
        console.error("Error creating lesson:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
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
        const { searchParams } = new URL(request.url);
        const filename = searchParams.get('filename');
        const courseSlug = params.slug;

        if (!filename) {
            return new NextResponse("Missing filename", { status: 400 });
        }

        const course = await prisma.course.findUnique({
            where: { slug: courseSlug }
        });

        if (!course) {
            return new NextResponse("Course not found", { status: 404 });
        }

        const lessonSlug = filename.replace(/\.mdx$/, '');

        const lesson = await prisma.lesson.findFirst({
            where: {
                courseId: course.id,
                slug: lessonSlug
            }
        });

        if (!lesson) {
            return new NextResponse("Lesson not found", { status: 404 });
        }

        await prisma.lesson.delete({
            where: { id: lesson.id }
        });

        revalidatePath(`/admin/courses/${courseSlug}`);
        revalidatePath(`/courses/${courseSlug}`);

        return NextResponse.json({ message: "Lesson deleted successfully" });
    } catch (error) {
        console.error("Error deleting lesson:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
