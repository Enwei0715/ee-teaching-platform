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
