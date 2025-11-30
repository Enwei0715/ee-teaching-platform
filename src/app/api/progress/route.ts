import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { courseId, lessonId, completed, timeSpent } = await request.json();

        if (!courseId || !lessonId) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const progress = await prisma.userProgress.upsert({
            where: {
                userId_courseId_lessonId: {
                    userId: session.user.id,
                    courseId,
                    lessonId,
                },
            },
            update: {
                status: completed ? 'COMPLETED' : undefined,
                timeSpent: { increment: timeSpent || 0 },
            },
            create: {
                userId: session.user.id,
                courseId,
                lessonId,
                status: completed ? 'COMPLETED' : 'IN_PROGRESS',
                timeSpent: timeSpent || 0,
            },
        });

        return NextResponse.json(progress);
    } catch (error: any) {
        // Handle "Foreign key constraint failed" (User not found)
        if (error.code === 'P2003') {
            console.warn("User not found during progress update (stale session). Ignoring.");
            return NextResponse.json({ success: true, ignored: true });
        }

        console.error("Error updating progress:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const progress = await prisma.userProgress.findMany({
            where: {
                userId: session.user.id,
            },
        });

        // Transform to the format expected by the frontend
        const formattedProgress = {
            courses: progress.reduce((acc, curr) => {
                if (!acc[curr.courseId]) {
                    acc[curr.courseId] = {
                        courseId: curr.courseId,
                        completedLessons: [],
                        lastAccessedAt: curr.updatedAt.toISOString(),
                    };
                }

                if (curr.status === 'COMPLETED') {
                    acc[curr.courseId].completedLessons.push(curr.lessonId);
                }

                return acc;
            }, {} as Record<string, any>)
        };

        return NextResponse.json(formattedProgress);
    } catch (error) {
        console.error("Error fetching progress:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
