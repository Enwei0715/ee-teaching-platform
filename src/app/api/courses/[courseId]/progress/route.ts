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

        // Get all progress for this user in this course
        const userProgress = await prisma.userProgress.findMany({
            where: {
                userId: session.user.id,
                courseId: course.id,
            },
            include: {
                lesson: {
                    select: { slug: true }
                }
            }
        });

        // Create a map of lessonSlug -> status
        const progressMap: Record<string, string> = {};
        userProgress.forEach(p => {
            progressMap[p.lesson.slug] = p.status;
        });

        return NextResponse.json({
            progressMap,
            // Keep legacy field for backward compatibility if needed, or remove if safe
            completedLessonIds: userProgress.filter(p => p.status === 'COMPLETED').map(p => p.lesson.slug)
        });
    } catch (error) {
        console.error("Error fetching course progress:", error);
        return NextResponse.json({ progressMap: {}, completedLessonIds: [] });
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
        const { lessonId, lastElementId, timeSpent, completed, status } = body;

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

        // Check existing progress
        const existingProgress = await prisma.userProgress.findUnique({
            where: {
                userId_courseId_lessonId: {
                    userId: session.user.id,
                    courseId: course.id,
                    lessonId: lesson.id
                }
            }
        });

        let newStatus = existingProgress?.status || 'IN_PROGRESS';

        // Logic: Calculate new status
        if (status) {
            // Explicit status update from client (Priority)
            newStatus = status;
        } else if (completed) {
            newStatus = 'COMPLETED';
        } else if (!existingProgress) {
            newStatus = 'IN_PROGRESS';
        }

        let progress;
        if (existingProgress) {
            progress = await prisma.userProgress.update({
                where: { id: existingProgress.id },
                data: {
                    lastElementId: lastElementId || undefined,
                    timeSpent: timeSpent || undefined,
                    completed: completed || undefined, // Keep legacy boolean for now
                    status: newStatus
                }
            });
        } else {
            progress = await prisma.userProgress.create({
                data: {
                    userId: session.user.id,
                    courseId: course.id,
                    lessonId: lesson.id,
                    lastElementId: lastElementId || null,
                    timeSpent: timeSpent || 0,
                    completed: completed || false,
                    status: newStatus
                }
            });
        }

        return NextResponse.json(progress);
    } catch (error) {
        console.error("Error updating course progress:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
