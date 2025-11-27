import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: { courseId: string } }
) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ completedLessonIds: [] });
    }

    try {
        // Resolve courseId slug to UUID
        const course = await prisma.course.findUnique({
            where: { slug: params.courseId },
            select: { id: true }
        });

        if (!course) {
            return NextResponse.json({ completedLessonIds: [] });
        }

        // Get all completed lessons for this user in this course
        const completedProgress = await prisma.userProgress.findMany({
            where: {
                userId: session.user.id,
                courseId: course.id,
                completed: true,
            },
            include: {
                lesson: {
                    select: { slug: true }
                }
            }
        });

        // Return lesson slugs (not UUIDs) for frontend compatibility
        const completedLessonIds = completedProgress.map(p => p.lesson.slug);

        return NextResponse.json({ completedLessonIds });
    } catch (error) {
        console.error("Error fetching course progress:", error);
        return NextResponse.json({ completedLessonIds: [] });
    }
}

export async function POST(
    request: Request,
    { params }: { params: { courseId: string } }
) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await request.json();
        const { lessonId, lastElementId, timeSpent, completed } = body;

        if (!lessonId) {
            return new NextResponse("Missing lessonId", { status: 400 });
        }

        // Resolve courseId slug to UUID
        const course = await prisma.course.findUnique({
            where: { slug: params.courseId },
            select: { id: true }
        });

        if (!course) {
            return new NextResponse("Course not found", { status: 404 });
        }

        // Resolve lessonId slug to UUID
        const lesson = await prisma.lesson.findUnique({
            where: {
                courseId_slug: {
                    courseId: course.id,
                    slug: lessonId
                }
            },
            select: { id: true }
        });

        if (!lesson) {
            return new NextResponse("Lesson not found", { status: 404 });
        }

        // Upsert progress
        const progress = await prisma.userProgress.upsert({
            where: {
                userId_courseId_lessonId: {
                    userId: session.user.id,
                    courseId: course.id,
                    lessonId: lesson.id
                }
            },
            update: {
                lastElementId: lastElementId || undefined,
                timeSpent: timeSpent || undefined,
                completed: completed || undefined,
            },
            create: {
                userId: session.user.id,
                courseId: course.id,
                lessonId: lesson.id,
                lastElementId: lastElementId || null,
                timeSpent: timeSpent || 0,
                completed: completed || false
            }
        });

        return NextResponse.json(progress);
    } catch (error) {
        console.error("Error updating course progress:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
