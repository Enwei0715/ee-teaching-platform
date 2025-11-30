import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    // If no user is logged in, silently return success without tracking
    if (!session || !session.user) {
        return NextResponse.json({ message: "No user to track" }, { status: 200 });
    }

    try {
        const { courseId, lessonId, seconds } = await request.json();

        if (!courseId || !lessonId || !seconds) {
            return new NextResponse("Missing fields", { status: 400 });
        }

        // Resolve courseId slug to UUID
        const course = await prisma.course.findUnique({
            where: { slug: courseId },
            select: { id: true }
        });

        if (!course) {
            console.warn(`Course not found for slug: ${courseId}`);
            return NextResponse.json({ success: false, error: "Course not found" }, { status: 404 });
        }

        // Resolve lessonId slug to UUID
        const lesson = await prisma.lesson.findFirst({
            where: {
                slug: lessonId,
                courseId: course.id
            },
            select: { id: true }
        });

        if (!lesson) {
            console.warn(`Lesson not found for slug: ${lessonId} in course: ${courseId}`);
            return NextResponse.json({ success: false, error: "Lesson not found" }, { status: 404 });
        }

        // Upsert user progress to update timeSpent using actual UUIDs
        await prisma.userProgress.upsert({
            where: {
                userId_courseId_lessonId: {
                    userId: session.user.id,
                    courseId: course.id,
                    lessonId: lesson.id,
                },
            },
            update: {
                timeSpent: { increment: seconds },
            },
            create: {
                userId: session.user.id,
                courseId: course.id,
                lessonId: lesson.id,
                status: 'IN_PROGRESS',
                timeSpent: seconds,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        // Handle "Foreign key constraint failed" (User not found)
        if (error.code === 'P2003') {
            console.warn("User not found during time tracking (stale session). Ignoring.");
            return NextResponse.json({ success: true, ignored: true });
        }

        console.error("Error tracking time:", error);
        return new NextResponse("Error tracking time", { status: 500 });
    }
}
